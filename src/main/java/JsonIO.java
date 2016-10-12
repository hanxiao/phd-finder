import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.rometools.utils.Strings;
import org.imgscalr.Scalr;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import utils.CollectionAdapter;
import utils.LZString;

import javax.imageio.ImageIO;
import javax.swing.*;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.PrintWriter;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.*;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;
import java.util.function.Function;
import java.util.function.Predicate;
import java.util.stream.Collectors;
import java.util.stream.Stream;

/**
 * Created by han on 9/25/15.
 */
class JsonIO {
    private static transient final Logger LOG = LoggerFactory.getLogger(JsonIO.class);
    private static Gson gson = new GsonBuilder()
            .registerTypeHierarchyAdapter(Collection.class, new CollectionAdapter()).create();


    private static void writeLastNDays(String fn, Stream<OpenPosition> tmpStoriesUnique, int lastNDays) {
        Calendar cal = Calendar.getInstance();
        cal.add(Calendar.DATE, -lastNDays);
        long weekBefore = cal.getTime().getTime();
        List<OpenPosition> kDaysPositions = tmpStoriesUnique
                .filter(Objects::nonNull)
                .filter(p -> p.publishTime > weekBefore)
                .sorted((e1, e2) -> Long.compare(e2.publishTime, e1.publishTime))
                .collect(Collectors.toList());

        String jsonOutput = gson.toJson(kDaysPositions);

        writeToFile(new File("database/uncompressed/" + fn), jsonOutput);

        LOG.info("Compressing...");
        String jsonCompressed = LZString.compressToEncodedURIComponent(jsonOutput);

        writeToFile(new File("database/compressed/" + fn + ".lz"), jsonCompressed);

    }

    static void writeAll(Collection<OpenPosition> tmpStoriesUnique) {
        writeLastNDays("all.json", tmpStoriesUnique.stream(), 300);
    }

    static void writeAllSegments(Collection<OpenPosition> tmpStoriesUnique) {
        Map<Integer, List<OpenPosition>> storyGroup =
                tmpStoriesUnique.stream().collect(Collectors.groupingBy(OpenPosition::getIdByGroup));


        for (Map.Entry<Integer, List<OpenPosition>> entry : storyGroup.entrySet()) {
            writeLastNDays("segment-" + entry.getKey().toString() + ".json",
                    entry.getValue().stream(), 99);
        }
    }


    private static void writeToFile(File outFile, String jsonOutput) {
        try {
            PrintWriter writer = new PrintWriter(new FileOutputStream(outFile, false));
            writer.println(jsonOutput);
            writer.flush();
            writer.close();
        } catch (IOException ex) {
            LOG.error("Could not save Database {}", outFile, ex);
        }
    }


    static void downloadLogos(Collection<OpenPosition> tmpStoriesUnique) {

        tmpStoriesUnique.stream()
                .filter(distinctByKey(p -> p.instituteId))
                .filter(p -> Objects.nonNull(p.logoURL)
                        && !Strings.isEmpty(p.logoURL))
                .parallel()
                .forEach(p -> {
                    try {
                        File thumbFile = new File(String.format("database/logo/%d.png", p.instituteId));
                        if (!thumbFile.exists()) {
                            URL url = new URL(p.logoURL);
                            ImageIcon icon = new ImageIcon(url);
                            BufferedImage image = new BufferedImage(
                                    icon.getIconWidth(),
                                    icon.getIconHeight(),
                                    BufferedImage.TYPE_INT_ARGB);

                            Graphics g = image.createGraphics();
                            icon.paintIcon(null, g, 0, 0);
                            g.dispose();

                            BufferedImage thumbnail =
                                    Scalr.resize(image, Scalr.Method.SPEED, Scalr.Mode.FIT_TO_HEIGHT,
                                            64, 64, Scalr.OP_ANTIALIAS);
                            ImageIO.write(thumbnail, "png", thumbFile);
                            LOG.info("write thumbnail {}...", thumbFile.getName());
                        }
                    } catch (MalformedURLException ex) {
                        LOG.error("URL is not incorrect format");
                        ex.printStackTrace();
                    } catch (IOException ex) {
                        LOG.error("Can not write image file to disk");
                        ex.printStackTrace();
                    }
                });
    }

    private static <T> Predicate<T> distinctByKey(Function<? super T, ?> keyExtractor) {
        Map<Object,Boolean> seen = new ConcurrentHashMap<>();
        return t -> seen.putIfAbsent(keyExtractor.apply(t), Boolean.TRUE) == null;
    }
}
