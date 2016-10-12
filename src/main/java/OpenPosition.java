import com.rometools.rome.feed.synd.SyndEntry;
import com.sree.textbytes.readabilityBUNDLE.Article;
import com.sree.textbytes.readabilityBUNDLE.ContentExtractor;
import org.apache.commons.lang.builder.EqualsBuilder;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;

/**
 * Created by hxiao on 2016/10/12.
 */
class OpenPosition {
    private static transient final Logger LOG = LoggerFactory.getLogger(OpenPosition.class);

    int positionId, instituteId;
    String institute;
    String title;
    String pageURL;
    String logoURL;
    long publishTime;
    long fetchTime;
    String source;
    String mainContent;

    OpenPosition(String source, SyndEntry sf) {
        this.source = source;
        this.title = sf.getTitle();
        this.institute = sf.getDescription().getValue();
        this.instituteId = Math.abs(this.institute.hashCode());
        this.positionId = this.hashCode();

        if (!GlobalVars.allPositions.contains(this)) {
            this.pageURL = sf.getLink();
            this.publishTime = sf.getPublishedDate().getTime();
            try {
                this.logoURL = sf.getEnclosures().get(0).getUrl();
            } catch (Exception ex) {
                LOG.warn("empty image for {}", sf.getLink());
                this.logoURL = null;
            }
            fetchContent(this.pageURL);
            this.fetchTime = System.currentTimeMillis();
            GlobalVars.allPositions.add(this);
            GlobalVars.isUpdated = true;
            LOG.info("[{}] new position {}: {} !", source, institute, title);
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
