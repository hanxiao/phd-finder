import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;
import com.memetix.mst.language.Language;
import com.memetix.mst.translate.Translate;
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
import java.util.function.Function;
import java.util.stream.Collectors;

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
            Translate.setClientId("phd-finder");
            Translate.setClientSecret("scBucjkN5FtVMVj4ET2WcjgBsi8FECJyDg/omVJJR1Q=");

            String translatedText = Translate.execute("Bonjour le monde", Language.AUTO_DETECT, Language.CHINESE_SIMPLIFIED);

            System.out.println(translatedText);
        } catch (Exception ex) {
            ex.printStackTrace();
        }



        runner.loadAll();
        runner.updateAll(runner);
        runner.saveAll();
    }

    private void updateAll(Main runner) {
        String urlPrefix = "https://www.academics.de/wissenschaft/";
        String urlSuffix = ".html?format=rss_2.0";
        try {
            runner.update(urlPrefix + "promotionsstellen_37163" + urlSuffix, "phd");
            runner.update(urlPrefix + "wissenschaftlicher_mitarbeiter_37189" + urlSuffix, "wimi");
            runner.update(urlPrefix + "postdoc_37207" + urlSuffix, "postdoc");
            runner.update(urlPrefix + "professur_37187" + urlSuffix, "prof");
            runner.update(urlPrefix + "juniorprofessur_37188" + urlSuffix, "juniorprof");
            runner.update(urlPrefix + "studien-_und_abschlussarbeiten_56193" + urlSuffix, "mthesis");
            runner.update(urlPrefix + "praktikum_56194" + urlSuffix, "practical");
            runner.update(urlPrefix + "studentische_hilfskraft_jobs_56195" + urlSuffix, "hiwi");
            runner.update(urlPrefix + "stipendien_47347" + urlSuffix, "scholarship");
        } catch (Exception ex) {
            ex.printStackTrace();
        }
    }

    private void loadAll() {
        try {
            String content = new Scanner(new File("database/uncompressed/all.json")).useDelimiter("\\Z").next();
            Type setType = new TypeToken<List<OpenPosition>>() {}.getType();
            List<OpenPosition> prevHistory = gson.fromJson(content, setType);
            GlobalVars.allPositions.putAll(prevHistory.stream().collect(Collectors.toMap(OpenPosition::hashCode,
                    Function.identity())));
        } catch (IOException ex) {
            LOG.error("Error while reading database!");
        }
    }

    private void saveAll() {
        if (GlobalVars.isUpdated) {
            JsonIO.downloadLogos(GlobalVars.allPositions.values());
            JsonIO.writeAll(GlobalVars.allPositions.values());
            JsonIO.writeAllSegments(GlobalVars.allPositions.values());
        } else {
            LOG.info("No new position is found!");
        }
    }

    private void update(String rssUrl, String sourceName) throws Exception {
        SyndFeedInput input = new SyndFeedInput();
        URL feedUrl = new URL(rssUrl);
        SyndFeed feed = input.build(new XmlReader(feedUrl));
        feed.getEntries().parallelStream().forEach(p -> new OpenPosition(sourceName, p));
    }
}
