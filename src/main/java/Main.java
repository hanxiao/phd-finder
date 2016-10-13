import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
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

import java.io.FileNotFoundException;
import java.io.IOException;
import java.net.URL;
import java.util.Collection;

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

            runner.update(urlPrefix + "life_sciences_stellenangebote_und_jobs_37330" + urlSuffix, "lifescience");
            runner.update(urlPrefix + "stellenangebote_und_jobs_biologie_37265" + urlSuffix, "biologie");
            runner.update(urlPrefix + "chemie_stellenangebote_und_jobs_47169" + urlSuffix, "chemie");
            runner.update(urlPrefix + "stellenangebote_und_jobs_physik_47181" + urlSuffix, "physic");
            runner.update(urlPrefix + "medizin_stellenangebote_und_jobs_47479" + urlSuffix, "medizin");
            runner.update(urlPrefix + "psychologie_stellenangebote_und_jobs_47215" + urlSuffix, "psychologie");
            runner.update(urlPrefix + "mathematik_stellenangebote_und_jobs_47282" + urlSuffix, "mathematik");
            runner.update(urlPrefix + "stellenangebote_und_jobs_informatik_47280" + urlSuffix, "informatik");
            runner.update(urlPrefix + "stellenangebote_und_jobs_ingenieurwissenschaften_37331" + urlSuffix, "engineer");
            runner.update(urlPrefix + "stellenangebote_und_jobs_wirtschaftswissenschaften_47289" + urlSuffix, "economics");
            runner.update(urlPrefix + "politikwissenschaften_stellenangebote_und_jobs_47227" + urlSuffix, "politic");
            runner.update(urlPrefix + "geisteswissenschaften_stellenangebote_und_jobs_52513" + urlSuffix, "geisteswissen");
            runner.update(urlPrefix + "stellenangebote_und_jobs_soziologie_47217" + urlSuffix, "soziologie");
            runner.update(urlPrefix + "stellenangebote_und_jobs_kulturwissenschaften_47291" + urlSuffix, "kulturwissen");
        } catch (Exception ex) {
            ex.printStackTrace();
        }
    }

    private void loadAll() {
        try {
            JsonIO.loadTranslator();
            JsonIO.loadHistory();
        } catch (FileNotFoundException ex) {
            // init the translator
            GlobalVars.msTranslator = new MSTranslator();
            LOG.error("Empty history --> building database from scratch!");
        }
    }

    private void saveAll() {
        if (GlobalVars.isUpdated) {
            JsonIO.downloadLogos(GlobalVars.allPositions.values());
            JsonIO.writeAll(GlobalVars.allPositions.values());
            JsonIO.writeAllSegments(GlobalVars.allPositions.values());
            JsonIO.writeTranslator();
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
