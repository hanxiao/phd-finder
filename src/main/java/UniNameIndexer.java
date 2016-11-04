import org.apache.lucene.analysis.standard.StandardAnalyzer;
import org.apache.lucene.document.Document;
import org.apache.lucene.document.Field;
import org.apache.lucene.document.StringField;
import org.apache.lucene.document.TextField;
import org.apache.lucene.index.DirectoryReader;
import org.apache.lucene.index.IndexReader;
import org.apache.lucene.index.IndexWriter;
import org.apache.lucene.index.IndexWriterConfig;
import org.apache.lucene.queryparser.classic.ParseException;
import org.apache.lucene.queryparser.classic.QueryParser;
import org.apache.lucene.search.IndexSearcher;
import org.apache.lucene.search.Query;
import org.apache.lucene.search.ScoreDoc;
import org.apache.lucene.search.TopDocs;
import org.apache.lucene.store.Directory;
import org.apache.lucene.store.RAMDirectory;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;

/**
 * Created by han on 10/29/16.
 */
public class UniNameIndexer {

    private StandardAnalyzer analyzer = new StandardAnalyzer();
    private Directory index = new RAMDirectory();
    private IndexWriterConfig config = new IndexWriterConfig(analyzer);

    UniNameIndexer() {
        try {
            this.index();
        } catch (Exception ex) {
            ex.printStackTrace();
        }
    }

    public static void main(final String[] args) throws IOException {
        UniNameIndexer searcher = new UniNameIndexer();
        try {
            System.out.println(searcher.search("Hochschule München (HM)"));
        } catch (Exception ex) {
            ex.printStackTrace();
        }
    }



    String search(String querystr) throws IOException, ParseException {
        querystr = querystr.replaceAll("\\(.*\\)", "");
        Query q = new QueryParser("dename", analyzer).parse("\""+ QueryParser.escape( querystr )+ "\"");
        int hitsPerPage = 1;
        IndexReader reader = DirectoryReader.open(index);
        IndexSearcher searcher = new IndexSearcher(reader);
        TopDocs docs = searcher.search(q, hitsPerPage);
        ScoreDoc[] hits = docs.scoreDocs;
        if (hits.length > 0) {
            return searcher.doc(hits[0].doc).get("zhname");
        }
        return "";
    }

    private void index() throws IOException {
        IndexWriter w = new IndexWriter(index, config);
        String csvFile = "database/uni-name-de-zh.csv";
        String line = "";
        String cvsSplitBy = ",";
        try (BufferedReader br = new BufferedReader(new FileReader(csvFile))) {

            while ((line = br.readLine()) != null) {

                // use comma as separator
                String[] uni = line.split(cvsSplitBy);
                if (uni.length == 4) {
                    addDoc(w, uni[1], uni[2]);
                }
            }

        } catch (IOException e) {
            e.printStackTrace();
        }
        w.close();
    }

    private static void addDoc(IndexWriter w, String title, String isbn) throws IOException {
        Document doc = new Document();
        doc.add(new StringField("zhname", title, Field.Store.YES));
        doc.add(new TextField("dename", isbn, Field.Store.YES));
        w.addDocument(doc);
    }
}
