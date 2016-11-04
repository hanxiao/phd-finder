import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Created by han on 11/17/15.
 */
class GlobalVars {
    static transient Map<Integer, OpenPosition> allPositions = new ConcurrentHashMap<>();
    static transient boolean isUpdated = false;
    static int numUpdate = 0;
    static Set<String> updateUniName = new HashSet<>();
    static transient MSTranslator msTranslator;
    private static transient UniNameIndexer searcher = new UniNameIndexer();
    private static transient SimpleDateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy hh:mm:ss");

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
        put("土伊尔默瑙","伊尔梅瑙理工大学");
        put("大学莫扎特萨尔茨堡", "奥地利萨尔茨堡大学");
        put("余隆德国 Technik 与位，des 亦者 （HTW 萨尔）", "萨尔兰工程和经济应用技术大学");
        put("管理，经济学与视域 GmbH 余隆费森尤斯","欧福应用技术大学-经管与媒体");
    }};

    static String getZhName(String uni_de) {
        try {
            return searcher.search(uni_de);
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return "";
    }
}
