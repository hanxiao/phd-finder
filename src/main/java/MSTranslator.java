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

    private void doAuth() {
        Translate.setClientId("phd-finder");
        Translate.setClientSecret("scBucjkN5FtVMVj4ET2WcjgBsi8FECJyDg/omVJJR1Q=");
    }

    void setCachedTranslates(Map<String, String> cT) {
        cachedTranslates.putAll(cT);
    }

    String getTranslate(String sent, Language lang) {
        sent = sent.replace("(m/w)","").replace("(f/m)","").trim();
        String skey = lang.toString() + sent;
        if (cachedTranslates.containsKey(skey)) {
            return cachedTranslates.get(skey);
        } else {
            try {
                String translatedText = Translate.execute(sent, Language.AUTO_DETECT, lang);
                cachedTranslates.put(skey, translatedText);
                return translatedText;
            } catch (Exception e) {
                e.printStackTrace();
                return sent;
            }
        }
    }
}
