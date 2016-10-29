import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.select.Elements;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import utils.CollectionAdapter;

import java.io.File;
import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Collection;
import java.util.List;
import java.util.TimeZone;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

/**
 * Created by hxiao on 2016/10/24.
 */
public class EmbassyExtractor {
    private static transient final Logger LOG = LoggerFactory.getLogger(EmbassyExtractor.class);
    private static Gson gson = new GsonBuilder()
            .registerTypeHierarchyAdapter(Collection.class, new CollectionAdapter()).create();

    private static long parseDate(String text)
            throws ParseException
    {
        SimpleDateFormat dateFormat = new SimpleDateFormat("(yyyy-MM-dd)");
        dateFormat.setTimeZone(TimeZone.getTimeZone("UTC"));
        return dateFormat.parse(text).getTime();
    }

    private static class EmbassyNews {
        String title;
        String mainContent = "";
        long timestamp;
        String url;
        boolean isNew = false;

        private transient final String regex = "\\((\\d{4}-\\d{1,2}-\\d{1,2})\\)";
        private transient final Pattern pattern = Pattern.compile(regex);

        EmbassyNews(String title, String url) {
            this.title = title;
            this.isNew = title.contains("new");
            this.title = this.title.replace("new", "");
            Matcher m = pattern.matcher(this.title);
            m.find();
            String tmp = m.group(0);
            this.title = this.title.replace(tmp, "").trim();
            this.url = "http://www.de-moe.edu.cn/" + url;
            try {
                this.timestamp = parseDate(tmp);
            } catch (Exception ex) {
                this.timestamp = 0;
            }


            Document fetchDoc = null;
            try {
                fetchDoc = Jsoup.connect(this.url)
                        .ignoreContentType(true)
                        .userAgent("Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:25.0) Gecko/20100101 Firefox/25.0")
                        .referrer("http://www.google.com")
                        .timeout(12000)
                        .followRedirects(true)
                        .get();

                this.mainContent = fetchDoc.select(".font14").select("tr").last().text().trim();
            } catch (IOException ex) {
                LOG.info("Connection timeout on {}", this.url);
            }

            LOG.info("succesfully fetched the news!");
        }

        long getTimestamp() {
            return timestamp;
        }
    }

    public static void getNews() throws IOException {
        Document doc = Jsoup.connect("http://www.de-moe.edu.cn/article_list.php?sortid=12016")
                .ignoreContentType(true)
                .userAgent("Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:25.0) Gecko/20100101 Firefox/25.0")
                .referrer("http://www.google.com")
                .timeout(12000)
                .followRedirects(true)
                .get();
        Elements newsHeadlines = doc.select("li");

        List<EmbassyNews> allNews = newsHeadlines
                .parallelStream()
                .map(el -> new EmbassyNews(el.text(), el.select("a").first().attr("href")))
                .sorted((e1, e2) -> -Long.compare(e1.getTimestamp(), e2.getTimestamp()))
                .collect(Collectors.toList());

        String jsonOutput = gson.toJson(allNews);
        JsonIO.writeToFile(new File("database/embassynews.json"), jsonOutput);

    }
}
