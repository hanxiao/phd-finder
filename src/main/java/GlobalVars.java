import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.HashMap;
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

    static Map<String, String> cnPatch = new HashMap<String, String>() {{
        put("初中教授", "青年教授");
        put("基础家庭打扮", "Klee家庭基金");
        put("供奉 Klasing", "Delius Klasing");
        put("邮政 Doc", "博士后");
        put("学术人员与能力对促进", "研究员");
        put("那个博士后的职位", "博士后职位");
        put("卡尔斯鲁厄技术 （工具包）", "卡尔斯鲁厄理工大学 (KIT)");
        put("技术大学", "工业大学");
        put("技术大学多特蒙德", "多特蒙德工业大学");
        put("工业大学多特蒙德", "多特蒙德工业大学");
        put("学术人员", "研究员");
        put("作为学术的员工", "研究员");
    }};

}
