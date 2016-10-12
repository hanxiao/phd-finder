package utils;

import java.net.HttpURLConnection;
import java.net.URL;

/**
 * Created by hxiao on 15/11/17.
 */
public class URLChecker {

    public static boolean isValidate(String urlStr) {
        try {
            final URL url = new URL(urlStr);
            HttpURLConnection huc = (HttpURLConnection) url.openConnection();
            huc.setRequestMethod("HEAD");
            int responseCode = huc.getResponseCode();

            if (responseCode == 200) {
                System.out.println("GOOD");
                return true;
            } else {
                System.out.println("BAD");
                return false;
            }
        } catch (Exception ex) {
            return false;
        }
    }
}
