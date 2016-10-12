package com.sree.textbytes.readabilityBUNDLE;

import com.sree.textbytes.network.HtmlFetcher;

import java.net.URL;
import java.net.URLConnection;
import java.util.Scanner;


public class SampleUsage {
	public static void main(String[] args) throws Exception {
		Article article = new Article();
		ContentExtractor ce = new ContentExtractor();
		HtmlFetcher htmlFetcher = new HtmlFetcher();
		String html = htmlFetcher.getHtml("http://www.voachinese.com/content/us-economy-20150924/2977541.html", 0);
		String content = null;
		URLConnection connection = null;
		try {
			connection =  new URL("http://www.voachinese.com/content/us-economy-20150924/2977541.html").openConnection();
			Scanner scanner = new Scanner(connection.getInputStream(), "gbk");
			scanner.useDelimiter("\\Z");
			content = scanner.next();
		} catch ( Exception ex ) {
			ex.printStackTrace();
		}
		if (content.contains("<meta charset=\"gbk\"/>")) {
			try {
				connection =  new URL("http://www.voachinese.com/content/us-economy-20150924/2977541.html").openConnection();
				Scanner scanner = new Scanner(connection.getInputStream(), "gbk");
				scanner.useDelimiter("\\Z");
				content = scanner.next();
			} catch ( Exception ex ) {
				ex.printStackTrace();
			}
		}
		
		System.out.println("Html : "+content);
//		article = ce.extractContent(html, "ReadabilitySnack");
//
//
//
//		System.out.println("Content : "+article.getCleanedArticleText());
		
		
	}

}
