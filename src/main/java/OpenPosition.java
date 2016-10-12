import com.rometools.rome.feed.synd.SyndEntry;
import com.sree.textbytes.readabilityBUNDLE.Article;
import com.sree.textbytes.readabilityBUNDLE.ContentExtractor;
import org.apache.commons.lang.builder.EqualsBuilder;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.swing.*;
import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;

/**
 * Created by hxiao on 2016/10/12.
 */
class OpenPosition {
    private static transient final Logger LOG = LoggerFactory.getLogger(OpenPosition.class);

    int id;
    String institute;
    String title;
    String pageURL;
    String logoURL, imageUrl;
    long publishTime;
    long fetchTime;
    String source;
    String mainContent;

    OpenPosition(String source, SyndEntry sf) {
        this.source = source;
        this.title = sf.getTitle();
        this.institute = sf.getDescription().getValue();
        this.pageURL = sf.getLink();
        this.publishTime = sf.getPublishedDate().getTime();
        try {
            this.logoURL = sf.getEnclosures().get(0).getUrl();
        } catch (Exception ex) {
            LOG.warn("empty image for {}", sf.getLink());
            this.logoURL = null;
        }
        this.id = this.hashCode();
        fetchContent(this.pageURL);
        this.fetchTime = System.currentTimeMillis();
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

                    if (article.getTopImage() != null) {
                        imageUrl = article.getTopImage().getImageSrc();

                        if (imageUrl != null) {
                            if (!imageUrl.startsWith("http") && GlobalConfiguration.isValidImageUrl(imageUrl)) {

                                fetchDoc.getElementsByTag("img")
                                        .stream()
                                        .map(p -> p.absUrl("src"))
                                        .filter(p -> p.contains(imageUrl))
                                        .distinct()
                                        .findFirst().ifPresent(p -> {
                                    LOG.info("Image {} is completed to {}", imageUrl, p);
                                    imageUrl = p;
                                });

                                if (!imageUrl.startsWith("http")) {
                                    LOG.warn("unclear image url: {}", imageUrl);
                                }
                            } else {
                                imageUrl = (GlobalConfiguration.isValidImageUrl(imageUrl)
                                        && imageUrl.trim().length() > 0) ?
                                        this.imageUrl : null;
                            }
                        }
                    }
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
