import java.util.Arrays;

/**
 * Created by han on 11/25/15.
 */
public class Device {
    private String deviceId;
    private String deviceOS = "ios";
    private String timezone = "+0";
    private String[] favTopic;
    private String sysLang = "zh-cn";
    private long timestamp = 0;
    private String enablePush = "";

    public long getTimestamp() {
        return timestamp;
    }

    String getDeviceID() {
        return deviceId;
    }



    boolean isAppleDevice() {
        return deviceOS.equals("ios") && deviceId.length() == 64;
    }

    boolean isAndroidDevice() {
        return deviceOS.equals("android") && deviceId.length() == 152;
    }

    boolean isTimeToPush() {
        return true;
    }


    @Override
    public String toString() {
        return String.format("%s\t%b\t%s\t%s",
                deviceId.substring(0, Math.min(deviceId.length(), 5)),
                enablePush,
                Arrays.toString(favTopic),
                sysLang
        );
    }


}
