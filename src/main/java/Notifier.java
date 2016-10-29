import com.google.android.gcm.server.Message;
import com.google.android.gcm.server.Result;
import com.google.android.gcm.server.Sender;
import com.google.gson.*;
import com.notnoop.apns.APNS;
import com.notnoop.apns.ApnsService;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.util.EntityUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import utils.CollectionAdapter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

/**
 * Created by hxiao on 15/11/4.
 */
public class Notifier {
    private static transient final Logger LOG = LoggerFactory.getLogger(Notifier.class);

    private static Gson gson = new GsonBuilder()
            .registerTypeHierarchyAdapter(Collection.class, new CollectionAdapter()).create();


    private static void send2Android(Stream<Device> deviceStream,
                                     String title,
                                     String text, int numUpdate) {
        Message message =  new Message.Builder()
                .addData("message", text)
                .addData("title", title)
                .build();

        Sender sender = new Sender("AIzaSyAoU0dWnHcWk9gIPvb4qo1ec7LxEPg7m8k");

        deviceStream.filter(Device::isAndroidDevice)
                .forEach(p -> {
                    try {
                        Result result = sender.send(message, p.getDeviceID(), 3);
                        LOG.info(p.toString());
                    } catch (Exception error) {
                        LOG.error("Unable to push to Android devices");
                        error.printStackTrace();
                    }
                });
    }


    private static void send2IOS(Stream<Device> deviceStream,
                                 String title,
                                 String text, int numUpdate) {

        String iosPayload = APNS.newPayload()
                .badge(numUpdate)
                .alertBody(text)
                .alertTitle(title)
                .shrinkBody("查看详情")
                .build();

        ApnsService service =
                APNS.newService()
                        .withCert("certificate/prod.p12", "xh0531")
                        .withProductionDestination()
                        .build();

        deviceStream
                .filter(Device::isAppleDevice)
                .forEach(p-> {
                    service.push(p.getDeviceID(), iosPayload);
                    LOG.info(p.toString());
                });
    }

    private static JsonArray parseGoogleJson(String json) {
        JsonArray jsonArray = new JsonArray();
        JsonParser jsonParser = new JsonParser();
        JsonElement jsonElement = jsonParser.parse(json);

        JsonArray array = ((JsonObject) jsonElement).get("feed").getAsJsonObject().get("entry").getAsJsonArray();

        for (int i = 0; i < array.size(); i++){
            JsonObject rowObj = new JsonObject();
            rowObj.addProperty("timestamp", array.get(i)
                    .getAsJsonObject()
                    .get("title")
                    .getAsJsonObject()
                    .get("$t").getAsString());
            String [] rowCols = array.get(i)
                    .getAsJsonObject()
                    .get("content")
                    .getAsJsonObject()
                    .get("$t").getAsString().split(",");
            for (String rowCol : rowCols) {
                String[] keyVal = rowCol.split(": ");
                rowObj.addProperty(keyVal[0].trim(), keyVal[1].trim());
            }
            jsonArray.add(rowObj);
        }

        return jsonArray;
    }


    private static List<Device> getDeviceList() {
        String deviceServerNodeJS = "http://zdd-push.ojins.com:8080/getallusers";
        HttpGet postDeviceId2 = new HttpGet(deviceServerNodeJS);
        HttpClient httpClient  = new DefaultHttpClient();
        List<Device> deviceIdList = new ArrayList<>();

        try {
            //From nodejs Server
            HttpResponse response = httpClient.execute(postDeviceId2);
            String json = EntityUtils.toString(response.getEntity());
            JsonParser jsonParser = new JsonParser();
            JsonElement jsonElement = jsonParser.parse(json);
            Device[] devicesAWS = gson.fromJson(jsonElement, Device[].class);

            deviceIdList.addAll(Arrays.stream(devicesAWS)
                    .collect(Collectors.toList()));
        } catch (IOException ex) {
            ex.printStackTrace();
            LOG.error("Unable to fetch all users");
        }
        return deviceIdList;
    }

    public static void main(final String[] args) throws IOException {
        List<Device> devices = getDeviceList();
        send2IOS(devices.stream().distinct(), "又有新教职啦", "新发布了来自慕尼黑工业大学等的12个职位， 快来看看吧！", 1);
//        send2Android(devices.stream()
//                        .filter(Device::isAndroidDevice)
//                        .collect(Collectors.toList()),
//                "测试", "测试两下，看到麻烦微信我", 5);
    }

}
