import com.memetix.mst.language.Language;
import com.rometools.rome.feed.synd.SyndEntry;
import com.sree.textbytes.readabilityBUNDLE.Article;
import com.sree.textbytes.readabilityBUNDLE.ContentExtractor;
import org.apache.commons.lang.builder.EqualsBuilder;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

/**
 * Created by hxiao on 2016/10/12.
 */
class OpenPosition {
    private static transient final Logger LOG = LoggerFactory.getLogger(OpenPosition.class);

    int positionId, instituteId;
    String institute;
    String title;
    transient String pageURL;
    transient String logoURL;
    long publishTime;
    long fetchTime;
    String source;
    String mainContent;

    String mainContent_zh;
    String title_zh;
    String institute_zh;
    String mainContent_en;
    String title_en;
    String institute_en;

    String summary;

    boolean isFav = false;
    boolean isPushed = false;
    boolean hasLogo = false;

    Set<String> tags;

    OpenPosition(String source, SyndEntry sf) {
        this.source = source;
        title = sf.getTitle();
        institute = sf.getDescription().getValue();
        instituteId = Math.abs(institute.hashCode());
        positionId = this.hashCode();
        System.out.print(".");

        if (positionId == 578374952) return;

        if (!GlobalVars.allPositions.containsKey(positionId)) {
            pageURL = sf.getLink();
            publishTime = sf.getPublishedDate().getTime();
            try {
                logoURL = sf.getEnclosures().get(0).getUrl();
            } catch (Exception ex) {
                LOG.warn("empty image for {}", sf.getLink());
                logoURL = null;
            }
            fetchContent(this.pageURL);
            tags = new HashSet<>();
            tags.add(source);
            fetchTime = System.currentTimeMillis();

            // do the translation
            title_zh = GlobalVars.msTranslator.getTranslate(title, Language.CHINESE_SIMPLIFIED);
            institute_zh = GlobalVars.msTranslator.getTranslate(institute, Language.CHINESE_SIMPLIFIED);
            //mainContent_zh = GlobalVars.msTranslator.getTranslate(mainContent, Language.CHINESE_SIMPLIFIED);

            title_en = GlobalVars.msTranslator.getTranslate(title, Language.ENGLISH);
            institute_en = GlobalVars.msTranslator.getTranslate(institute, Language.ENGLISH);
            //mainContent_en = GlobalVars.msTranslator.getTranslate(mainContent, Language.ENGLISH);


            GlobalVars.allPositions.put(positionId, this);
            GlobalVars.isUpdated = true;
            LOG.info("[{}] create position {}: {} !", source, institute, title);
        } else {
            if (!GlobalVars.allPositions.get(positionId).tags.contains(source)) {
                GlobalVars.allPositions.get(positionId).tags.add(source);
                GlobalVars.allPositions.get(positionId).fetchTime = System.currentTimeMillis();
                GlobalVars.isUpdated = true;
                LOG.info("[{}] update position {}: {} !", source, institute, title);
            }
        }

        // do some translate patching
        patchTranslateCN(positionId);

    }

    private void patchTranslateCN(int positionId) {
        String title_zh = GlobalVars.allPositions.get(positionId).title_zh;
        String ins_zh = GlobalVars.allPositions.get(positionId).institute_zh;
        for (HashMap.Entry<String, String> val : GlobalVars.cnPatch.entrySet()) {
            title_zh = title_zh.replace(val.getKey(), val.getValue());
            ins_zh = ins_zh.replace(val.getKey(), val.getValue());
        }
        if (!Objects.equals(GlobalVars.allPositions.get(positionId).title_zh, title_zh) ||
                !Objects.equals(GlobalVars.allPositions.get(positionId).institute_zh, ins_zh)) {
            GlobalVars.allPositions.get(positionId).title_zh = title_zh;
            GlobalVars.allPositions.get(positionId).institute_zh = ins_zh;
            GlobalVars.isUpdated = true;
        }
        String ins_de = GlobalVars.allPositions.get(positionId).institute;
        String off_zh = GlobalVars.getZhName(ins_de);
        if (off_zh.length() > 0 && !off_zh.equals(GlobalVars.allPositions.get(positionId).institute_zh)) {
            GlobalVars.allPositions.get(positionId).institute_zh = off_zh;
            GlobalVars.isUpdated = true;
        }
    }

    int getIdByGroup() {
        return Math.abs(this.positionId % 50);
    }

    private void fetchContent(String sourceLink) {
        Document fetchDoc = null;
        try {
            fetchDoc = Jsoup.connect(sourceLink)
                    .ignoreContentType(true)
                    .userAgent("Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:25.0) Gecko/20100101 Firefox/25.0")
                    .referrer("http://www.google.com")
                    .timeout(12000)
                    .followRedirects(true)
                    .get();
        } catch (IOException ex) {
            LOG.info("Connection timeout on {}", sourceLink);
        }

        if (fetchDoc != null) {
            String html = fetchDoc.html();
            if (!html.trim().equals("")) {
                ContentExtractor ce = new ContentExtractor();
                Article article = ce.extractContent(html, "ReadabilitySnack");

                if (article != null) {
                    this.mainContent = article.getCleanedArticleText();
                    this.summary = article.getMetaDescription();
                }
            }
        }
    }


    @Override
    public int hashCode() {
        return Math.abs((this.title + this.institute).hashCode());
    }


    @Override
    public boolean equals(Object obj) {
        if (!(obj instanceof OpenPosition))
            return false;
        if (obj == this)
            return true;

        OpenPosition rhs = (OpenPosition) obj;
        return new EqualsBuilder().
                append(hashCode(), rhs.hashCode()).
                isEquals();
    }


}
