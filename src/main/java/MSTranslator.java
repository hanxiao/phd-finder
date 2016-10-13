import com.memetix.mst.language.Language;
import com.memetix.mst.translate.Translate;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Created by han on 10/13/16.
 */
class MSTranslator {
    private Map<String, String> cachedTranslates = new ConcurrentHashMap<>();

    MSTranslator() {
        doAuth();
    }

    void doAuth() {
        Translate.setClientId("phd-finder");
        Translate.setClientSecret("scBucjkN5FtVMVj4ET2WcjgBsi8FECJyDg/omVJJR1Q=");
    }

    void setCachedTranslates(Map<String, String> cT) {
        cachedTranslates.putAll(cT);
    }

    String getTranslate(String sent) {
        sent = sent.replace("(m/w)","").trim();
        if (cachedTranslates.containsKey(sent)) {
            return cachedTranslates.get(sent);
        } else {
            try {
                String translatedText = Translate.execute(sent, Language.AUTO_DETECT, Language.CHINESE_SIMPLIFIED);
                cachedTranslates.put(sent, translatedText);
                return translatedText;
            } catch (Exception e) {
                e.printStackTrace();
                return sent;
            }
        }
    }
}
