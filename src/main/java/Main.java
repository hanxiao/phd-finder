import com.rometools.rome.feed.synd.SyndFeed;
import com.rometools.rome.io.SyndFeedInput;
import com.rometools.rome.io.XmlReader;
import org.kohsuke.args4j.CmdLineException;
import org.kohsuke.args4j.CmdLineParser;
import org.kohsuke.args4j.Option;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.io.IOException;
import java.net.URL;
import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.Set;

/**
 * Created by han on 8/16/15.
 */
public class Main {

    private static transient final Logger LOG = LoggerFactory.getLogger(Main.class);

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

        runner.run();
    }


    private void run() {
        SyndFeedInput input = new SyndFeedInput();
        Set<OpenPosition> allPositions = new HashSet<>();
        try {
            String urlPattern = "https://www.academics.de/wissenschaft/promotionsstellen_37163.html?format=rss_2.0";
            URL feedUrl = new URL(urlPattern);
            SyndFeed feed = input.build(new XmlReader(feedUrl));
            feed.getEntries().parallelStream().map(p ->
                    new OpenPosition(urlPattern, p))
                    .filter(p-> p!=null)
                    .forEach(p -> {
                        allPositions.add(p);
                        LOG.info("new position {}: {} !", p.institute, p.title);
                    });
            JsonIO.downloadLogos(allPositions);
            JsonIO.writeAll(allPositions);
            JsonIO.writeAllSegments(allPositions);
        } catch (Exception ex) {
            ex.printStackTrace();
        }
    }
}
