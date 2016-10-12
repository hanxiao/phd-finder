import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;
import com.rometools.rome.feed.synd.SyndFeed;
import com.rometools.rome.io.SyndFeedInput;
import com.rometools.rome.io.XmlReader;
import org.kohsuke.args4j.CmdLineException;
import org.kohsuke.args4j.CmdLineParser;
import org.kohsuke.args4j.Option;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import utils.CollectionAdapter;

import java.io.File;
import java.io.IOException;
import java.lang.reflect.Type;
import java.net.URL;
import java.util.Collection;
import java.util.List;
import java.util.Scanner;

/**
 * Created by han on 8/16/15.
 */
public class Main {

    private static transient final Logger LOG = LoggerFactory.getLogger(Main.class);
    private static Gson gson = new GsonBuilder()
            .registerTypeHierarchyAdapter(Collection.class, new CollectionAdapter()).create();

    @Option(name = "--help", usage = "Print this help message")
    private boolean help = false;

    private static void printHelp(final CmdLineParser parser) {
        System.out.print("java -jar phdfinder.jar");
        parser.printSingleLineUsage(System.out);
        System.out.println();
        parser.printUsage(System.out);
    }

    public static void main(final String[] args) throws IOException {
        Main runner = new Main();

        CmdLineParser parser = new CmdLineParser(runner);
        try {
            parser.parseArgument(args);
        } catch (CmdLineException e) {
            if (runner.help) {
                printHelp(parser);
            }

            // handling of wrong arguments
            System.err.println(e.getMessage());
            parser.printUsage(System.err);
            return;
        }

        if (runner.help) {
            printHelp(parser);
            return;
        }

        try {
            runner.update("https://www.academics.de/wissenschaft/promotionsstellen_37163.html?format=rss_2.0");
        } catch (Exception ex) {
            ex.printStackTrace();
        }
    }


    private void update(String rssUrl) throws Exception {
        SyndFeedInput input = new SyndFeedInput();

        try {
            String content = new Scanner(new File("database/uncompressed/all.json")).useDelimiter("\\Z").next();
            Type setType = new TypeToken<List<OpenPosition>>() {
            }.getType();
            GlobalVars.allPositions.addAll(gson.fromJson(content, setType));
        } catch (IOException ex) {
            LOG.error("Error while reading database!");
        }

        URL feedUrl = new URL(rssUrl);
        SyndFeed feed = input.build(new XmlReader(feedUrl));
        feed.getEntries().parallelStream().forEach(p -> new OpenPosition(rssUrl, p));

        if (GlobalVars.isUpdated) {
            JsonIO.downloadLogos(GlobalVars.allPositions);
            JsonIO.writeAll(GlobalVars.allPositions);
            JsonIO.writeAllSegments(GlobalVars.allPositions);
        } else {
            LOG.info("No new position is found!");
        }
    }
}
