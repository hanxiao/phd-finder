import com.memetix.mst.language.Language;
import com.memetix.mst.translate.Translate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Created by han on 10/13/16.
 */
class MSTranslator {
    private static transient final Logger LOG = LoggerFactory.getLogger(OpenPosition.class);
    private boolean isAvailable = true;

    private Map<String, String> cachedTranslates = new ConcurrentHashMap<>();

    MSTranslator() {
        doAuth();
    }

    private void doAuth() {
        Translate.setClientId("phd-gmail-account");
        Translate.setClientSecret("LJPP1Nc+GPd60MvdHujdXFKnYHo0yd+lrIT6VYfcpUU=");

        try {
            String translatedText = Translate.execute("laptop is good", Language.AUTO_DETECT, Language
                    .CHINESE_SIMPLIFIED);
            System.out.println(translatedText);
        } catch (Exception ex) {
            ex.printStackTrace();
        }
//        Translate.setClientId("phd-finder");
//        Translate.setClientSecret("scBucjkN5FtVMVj4ET2WcjgBsi8FECJyDg/omVJJR1Q=");
//        try {
//            LOG.warn("First translate API cridential failed!");
//            String translatedText = Translate.execute("Bonjour le monde", Language.AUTO_DETECT, Language.ENGLISH);
//            if (!translatedText.equalsIgnoreCase("Hello world")) {
//                Translate.setClientId("phd-trans");
//                Translate.setClientSecret("fhasBUfHIsNMStTTlFHMdH1RgsWekcSiX+qcp+9GjoU=");
//                translatedText = Translate.execute("Bonjour le monde", Language.AUTO_DETECT, Language.ENGLISH);
//                if (!translatedText.equalsIgnoreCase("Hello world")) {
//                    LOG.warn("Second translate API cridential failed!");
//                    LOG.error("No translate will be available");
//                    isAvailable = false;
//                }
//            }
//        } catch (Exception ex) {
//            ex.printStackTrace();
//        }
    }

    Map<String, String> getCachedTranslates() {
        return cachedTranslates;
    }

    void setCachedTranslates(Map<String, String> cT) {
        cachedTranslates.putAll(cT);
    }

    String getTranslate(String sent, Language lang) {
        sent = sent.replace("(m/w)","").replace("(f/m)","").trim();
        String skey = lang.toString() + '@' + sent;
        if (cachedTranslates.containsKey(skey)) {
            return cachedTranslates.get(skey);
        } else if (isAvailable) {
            try {
                String translatedText = Translate.execute(sent, Language.AUTO_DETECT, lang);
                cachedTranslates.put(skey, translatedText);
                return translatedText;
            } catch (Exception e) {
                e.printStackTrace();
                return sent;
            }
        } else {
            return sent;
        }
    }
}
