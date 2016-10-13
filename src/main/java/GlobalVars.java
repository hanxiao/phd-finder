import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ForkJoinPool;

/**
 * Created by han on 11/17/15.
 */
class GlobalVars {
    static ForkJoinPool forkJoinPool = new ForkJoinPool(20);
    static Map<Integer, OpenPosition> allPositions = new ConcurrentHashMap<>();
    static boolean isUpdated = false;
    static MSTranslator msTranslator;
    private static SimpleDateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy hh:mm:ss");

    static long convertStr2Long(String timestamp) throws ParseException {
        return dateFormat.parse(timestamp).getTime();
    }

    private static String[] junkImageUrl = new String[] {
            "default",
            "rcom-default",
            "udn_baby",
            "logo",
            "l2009",
            "2015-06-18",
            "MDJ-FB",
            "moneyudn",
            "c372022486173e3",
            "Rq5b-fxnqrny6785575"
    };

    static boolean isValidImageUrl(String url) {
        String url1 = url.trim().toLowerCase();
        for (String s : junkImageUrl) {
            if (url1.contains(s)) return false;
        }
        return true;
    }

}
