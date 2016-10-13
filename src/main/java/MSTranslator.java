import com.memetix.mst.language.Language;
import com.memetix.mst.translate.Translate;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Created by han on 10/13/16.
 */
public class MSTranslator {
    private Map<String, String> cachedTranslates;

    public MSTranslator() {
        this.cachedTranslates = new ConcurrentHashMap<>();
        Translate.setClientId("phd-finder");
        Translate.setClientSecret("scBucjkN5FtVMVj4ET2WcjgBsi8FECJyDg/omVJJR1Q=");
    }

    public String getTranslate(String sent) {
        if (cachedTranslates.containsKey(sent.trim())) {
            return cachedTranslates.get(sent.trim());
        } else {
            try {
                String translatedText = Translate.execute(sent.trim(), Language.AUTO_DETECT, Language.CHINESE_SIMPLIFIED);
                cachedTranslates.put(sent.trim(), translatedText);
                return translatedText;
            } catch (Exception e) {
                e.printStackTrace();
                return sent;
            }
        }
    }
}
