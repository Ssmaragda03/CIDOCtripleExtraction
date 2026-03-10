/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package RelationExtraction;

import java.util.Map;

/**
 *
 * @author micha
 */

public class ConvertJSONtoTriples {

    private static final String RDF_TYPE = "http://www.w3.org/1999/02/22-rdf-syntax-ns#type";
    private static final String RDFS_LABEL = "http://www.w3.org/2000/01/rdf-schema#label";

    public String convertToTriples(String jsonArray, Map<String, String> prefixes) {
        if (jsonArray == null) {
            return "";
        }

        String json = jsonArray.trim();
        if (json.startsWith("[")) {
            json = json.substring(1);
        }
        if (json.endsWith("]")) {
            json = json.substring(0, json.length() - 1);
        }

        String[] objects = json.split("\\},\\s*\\{");
        StringBuilder triples = new StringBuilder();

        for (String obj : objects) {
            String uri = extractValue(obj, "\"uri\"");
            String label = extractValue(obj, "\"label\"");
            String type = extractValue(obj, "\"type\"");

            String expandedUri = expandPrefixedUri(uri, prefixes);

            if (expandedUri != null && type != null) {
                triples.append("<")
                        .append(expandedUri)
                        .append("> <")
                        .append(RDF_TYPE)
                        .append("> <http://www.cidoc-crm.org/cidoc-crm/")
                        .append(type)
                        .append("> .\n");
            }

            if (expandedUri != null && label != null) {
                triples.append("<")
                        .append(expandedUri)
                        .append("> <")
                        .append(RDFS_LABEL)
                        .append("> \"")
                        .append(escapeLiteral(normalizeLiteral(label, prefixes)))
                        .append("\" .\n");
            }
        }

        return triples.toString();
    }

    private String expandPrefixedUri(String value, Map<String, String> prefixes) {
        if (value == null || value.trim().isEmpty()) {
            return value;
        }

        value = value.trim();

        if (value.startsWith("http://") || value.startsWith("https://")) {
            return value;
        }

        if (value.startsWith("<") && value.endsWith(">")) {
            return value.substring(1, value.length() - 1);
        }

        int colonIndex = value.indexOf(':');
        if (colonIndex <= 0) {
            return value;
        }

        String prefix = value.substring(0, colonIndex);
        String localPart = value.substring(colonIndex + 1);

        if (prefixes == null || !prefixes.containsKey(prefix)) {
            return value;
        }

        return prefixes.get(prefix) + localPart;
    }

    public static String extractValue(String obj, String key) {
        int idx = obj.indexOf(key);
        if (idx == -1) return null;
        int start = obj.indexOf(":", idx) + 1;
        int firstQuote = obj.indexOf("\"", start);
        int secondQuote = obj.indexOf("\"", firstQuote + 1);
        return obj.substring(firstQuote + 1, secondQuote);
    }

    private static String escapeLiteral(String text) {
        return text.replace("\\", "\\\\").replace("\"", "\\\"");
    }

    private String normalizeLiteral(String text, Map<String, String> prefixes) {
        if (text == null) {
            return null;
        }

        text = text.trim();

        int colonIndex = text.indexOf(':');
        if (colonIndex <= 0) {
            return text;
        }

        String possiblePrefix = text.substring(0, colonIndex).trim();

        if (prefixes != null && prefixes.containsKey(possiblePrefix)) {
            return text;
        }

        return text.replace(":", "");
    }
}