/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package RelationExtraction;

import java.util.regex.Pattern;

/**
 *
 * @author micha
 */
public class RelationExtraction {

    public String createPropertiesPrompt(String text, String entitiesFile, String method) throws Exception {
        String prompt = "";
        String triples = RDFClassPropertyExtractor.getconvertedTriples(entitiesFile);
        System.out.println(triples);
        if (method.equals("zero")) {
            prompt = "For the text: " + text + "\n\nThese are the entities their class and label:\n"
                    + triples + "\n\n Please by using CIDOC-CRM properties, please "
                    + "produce all the  relationships (including inferred ones) and then the triples of the text in .nt triples format by using the same URIs for the entities (no need to produce the rdf:type and rdfs:label again). I strictly want only the triples in .nt format";
        }        else if (method.equals("predictions")) {
            String properties = RDFClassPropertyExtractor.getCandidateProperties(entitiesFile);

            prompt = "For the text: " + text + " These are the entities their class and label:\n"
                    + triples + "\n\nThese are the candidate properties (and their domain,range) for these entities\n"
                    + properties + "\n\nPlease produce  all the  relationships  (including inferred ones from the text) and then the triples of the text  between the entities in .nt triples format by using the same URIs for the entities (no need to produce the rdf:type and rdfs:label again, also please i want only the triples and no further explanation) I strictly want only the triples in .nt forma";

        } else if (method.equals("properties")) {
            prompt = "For the text: " + text + "\n\nThese are the entities their class and label:\n"
                    + triples + "\n"
                    + Resources.promptPropertiesOnly.replace("\\n", "\n") + "\nPlease produce  all the  relationships  (including inferred ones from the text) and then the triples of the text  between the entities in .nt triples format by using the same URIs for the entities (no need to produce the rdf:type and rdfs:label again, also please i want only the triples and no further explanation) I strictly want only the triples in .nt forma";

        }

        return prompt;
    }

    public String relationExtractionOverText(String text, String file, String model, String method) {
        LLMs llms = new LLMs();
        try {

            String propertiesPrompt = createPropertiesPrompt(text, file, method);
            String getTriples = RDFClassPropertyExtractor.triples;
            propertiesPrompt = propertiesPrompt
                    .replace("\\", "\\\\")
                    .replace("\"", "\\\"")
                    .replace("\n", "\\n")
                    .replace("\r", "\\r")
                    .replace("\t", "\\t");

            if (model.equals("deepseek-chat")) {
                getTriples += llms.deepseek(propertiesPrompt, "");

            }
            if (model.equals("gpt-4o-2024-08-06")) {
                getTriples += llms.chatGPT_TURBO(propertiesPrompt, "gpt-4o-2024-08-06");
            }
            if (model.equals("gpt-4o-mini")) {
                getTriples += llms.chatGPT_TURBO(propertiesPrompt, "gpt-4o-mini");
            }
            if (model.equals("gemini-2.5-flash")) {
                getTriples += llms.runGemini(propertiesPrompt);
            }


            String ntOnly = extractNtOnly(getTriples);

            String relationsOnly = extractRelationsOnly(ntOnly);

            System.out.println("REL NTriples:\n" + relationsOnly);
            return relationsOnly;
        } catch (Exception e) {
            e.printStackTrace();
            return "";
        }
    }

    private static final Pattern NT_LINE = Pattern.compile(
            "^\\s*<[^>]+>\\s+<[^>]+>\\s+(?:<[^>]+>|\"(?:\\\\.|[^\"])*\")\\s*\\.\\s*$"
    );

    private static String extractNtOnly(String text) {
        StringBuilder sb = new StringBuilder();
        for (String line : text.split("\\R")) {
            line = line.trim();
            if (NT_LINE.matcher(line).matches()) {
                line = line.replaceAll("\\s*\\.\\s*\\.$", " .");
                sb.append(line).append("\n");
            }
        }
        return sb.toString();
    }

    private static boolean isRelationPredicate(String predicate) {
        return predicate.startsWith("http://www.cidoc-crm.org/cidoc-crm/")
                && predicate.matches(".*/P\\d+_.+");
    }

    private static String extractRelationsOnly(String ntText) {
        StringBuilder sb = new StringBuilder();
        for (String line : ntText.split("\\R")) {
            String l = line.trim();
            if (l.isEmpty()) {
                continue;
            }

            if (l.contains("http://www.w3.org/1999/02/22-rdf-syntax-ns#type")) {
                continue;
            }
            if (l.contains("http://www.w3.org/2000/01/rdf-schema#label")) {
                continue;
            }

            int s1 = l.indexOf('>');
            if (s1 < 0) {
                continue;
            }
            int pStart = l.indexOf('<', s1 + 1);
            int pEnd = l.indexOf('>', pStart + 1);
            if (pStart < 0 || pEnd < 0) {
                continue;
            }

            String predicate = l.substring(pStart + 1, pEnd);
            if (isRelationPredicate(predicate)) {
                sb.append(l).append("\n");
            }
        }
        return sb.toString();
    }


}
