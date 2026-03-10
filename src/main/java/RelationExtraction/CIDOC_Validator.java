/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package RelationExtraction;

/**
 *
 * @author smara
 */
import org.apache.jena.query.*;
import org.apache.jena.rdf.model.*;
import java.util.*;

public class CIDOC_Validator {

    private static final Map<String, List<String>> superclasses = new HashMap<>();

    private static int correct = 0;
    private static int correctDomainOnly = 0;
    private static int correctRangeOnly = 0;
    private static int bothErrors = 0;
    private static int tCount = 0;

    private static final String CIDOC_ENDPOINT = "http://93.115.20.167:8890/sparql";
    private static final List<String> tripleAnnotations = new ArrayList<>();

    private static void resetState() {
        correct = 0;
        correctDomainOnly = 0;
        correctRangeOnly = 0;
        bothErrors = 0;
        tCount = 0;
        tripleAnnotations.clear();
        superclasses.clear();
    }

    // ------------------------------------------------------------
    // 1. LOAD SUPERCLASSES (Python equivalent)
    // ------------------------------------------------------------
    public static void loadSuperClasses() {

        String queryStr = "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>SELECT DISTINCT ?x ?y FROM <http://localhost:8890/CIDOC-Ont> WHERE {{ SELECT ?x WHERE { ?x rdf:type rdfs:Class }}?x rdfs:subClassOf* ?y .}";

        Query query = QueryFactory.create(queryStr);

        try (QueryExecution qexec = QueryExecutionFactory.sparqlService(CIDOC_ENDPOINT, query)) {

            ResultSet rs = qexec.execSelect();

            while (rs.hasNext()) {
                QuerySolution sol = rs.next();

                String xUri = sol.get("x").toString();
                String yUri = sol.get("y").toString();

                String x = extractLocalName(xUri);
                String y = extractLocalName(yUri);

                if (!x.equals(y)) {
                    superclasses.computeIfAbsent(x, k -> new ArrayList<>()).add(y);
                }
            }

        } catch (Exception e) {
            System.err.println("Error loading superclasses: " + e.getMessage());
        }

        System.out.println("Loaded " + superclasses.size() + " superclass lists.");
    }

    private static String extractLocalName(String uri) {
        return uri.contains("#")
                ? uri.substring(uri.lastIndexOf("#") + 1)
                : uri.substring(uri.lastIndexOf("/") + 1);
    }

    // ------------------------------------------------------------
    // 2. LOAD ENTITY TYPES
    // ------------------------------------------------------------
    public static Map<String, String> loadEntities(String ntFile) {
        Map<String, String> entities = new HashMap<>();
        Model model = ModelFactory.createDefaultModel();

        try {
            model.read(ntFile, "NT");
        } catch (Exception e) {
            System.err.println("Parsing error: " + e.getMessage());
        }

        Property rdfType = model.getProperty("http://www.w3.org/1999/02/22-rdf-syntax-ns#type");

        StmtIterator it = model.listStatements(null, rdfType, (RDFNode) null);
        while (it.hasNext()) {
            Statement stmt = it.next();
            entities.put(stmt.getSubject().toString(), stmt.getObject().toString());
        }

        return entities;
    }

    // ------------------------------------------------------------
    // 3. VALIDATE SINGLE FILE (replaces Python validate_triples)
    // ------------------------------------------------------------
    public static void validateFile(String ntFile) {

        Map<String, String> ents1 = loadEntities(ntFile);
        Model model = ModelFactory.createDefaultModel();
        model.read(ntFile, "NT");

        StmtIterator it = model.listStatements();

        while (it.hasNext()) {
            Statement stmt = it.next();

            String s = stmt.getSubject().toString();
            String p = stmt.getPredicate().toString();
            String o = stmt.getObject().toString();

            // Replace namespace
            p = p.replace("http://www.ics.forth.gr/resource/", "http://www.cidoc-crm.org/cidoc-crm/");

            if (!p.contains("cidoc-crm")) {
                continue;
            }

            String domain = null;
            String range = null;

            // SPARQL query for domain & range
            String queryStr = ""
                    + "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> "
                    + "SELECT ?domain ?range WHERE { "
                    + "OPTIONAL {<" + p + "> rdfs:domain ?domain . }"
                    + "OPTIONAL {<" + p + "> rdfs:range ?range . }"
                    + "}";

            try (QueryExecution qexec = QueryExecutionFactory.sparqlService(CIDOC_ENDPOINT, queryStr)) {

                ResultSet rs = qexec.execSelect();
                while (rs.hasNext()) {
                    QuerySolution sol = rs.next();
                    if (sol.contains("domain")) {
                        domain = sol.get("domain").toString();
                    }
                    if (sol.contains("range")) {
                        range = sol.get("range").toString();
                    }
                }

                if (domain == null && range == null) {
                    String json = String.format(
                            "{\n"
                            + "  \"subject\": \"%s\",\n"
                            + "  \"predicate\": \"%s\",\n"
                            + "  \"object\": \"%s\",\n"
                            + "  \"domain_correct\": false,\n"
                            + "  \"range_correct\": false,\n"
                            + "  \"valid\": false,\n"
                            + "  \"errors\": [\"property_not_found\"]\n"
                            + "}",
                            escapeJson(s),
                            escapeJson(p),
                            escapeJson(o)
                    );

                    tripleAnnotations.add(json);
                    bothErrors++;
                    tCount++;

                    System.err.println("❌ Property not found: " + p);
                    continue;
                }

                if (!ents1.containsKey(s) || (o.startsWith("http") && !ents1.containsKey(o))) {
                    System.err.println("❌ Entity missing: " + s);
                    continue;
                }

                int cd = 0;
                int cr = 0;

                // DOMAIN CHECK
                String sType = ents1.get(s).replace("http://www.cidoc-crm.org/cidoc-crm/", "");
                List<String> sSuper = superclasses.get(sType);
                if (sSuper == null) {
                    sSuper = Collections.emptyList();
                }


                if (ents1.get(s).equals(domain)
                        || sSuper.contains(extractLocalName(domain))) {
                    cd = 1;
                }

                // RANGE CHECK
                if (!o.startsWith("http") && !"Literal".equals(extractLocalName(range))) {
                    // range error
                } else {
                    if ("Literal".equals(extractLocalName(range)) && !o.startsWith("http")) {
                        cr = 1;
                    } else {
                        String oType = ents1.get(o).replace("http://www.cidoc-crm.org/cidoc-crm/", "");
                        List<String> oSuper = superclasses.get(oType);
                        if (oSuper == null) {
                            oSuper = Collections.emptyList();
                        }


                        if (ents1.get(o).equals(range)
                                || oSuper.contains(extractLocalName(range))) {
                            cr = 1;
                        }
                    }
                }
                String json = String.format(
                        "{\n"
                        + "  \"subject\": \"%s\",\n"
                        + "  \"predicate\": \"%s\",\n"
                        + "  \"object\": \"%s\",\n"
                        + "  \"domain_correct\": %b,\n"
                        + "  \"range_correct\": %b,\n"
                        + "  \"valid\": %b,\n"
                        + "  \"errors\": [%s]\n"
                        + "}",
                        escapeJson(s),
                        escapeJson(p),
                        escapeJson(o),
                        cd == 1,
                        cr == 1,
                        (cd == 1 && cr == 1),
                        buildErrorArray(cd, cr)
                );

                if (cd == 1 && cr == 1) {
                    correct++;
                } else if (cd == 1) {
                    correctDomainOnly++;
                } else if (cr == 1) {
                    correctRangeOnly++;
                } else {
                    bothErrors++;
                }
                tripleAnnotations.add(json);

                tCount++;

            } catch (Exception e) {
                System.err.println("⚠️ SPARQL error: " + e.getMessage());
            }
        }
    }

    private static String escapeJson(String s) {
        return s.replace("\\", "\\\\")
                .replace("\"", "\\\"");
    }

    private static String buildErrorArray(int cd, int cr) {
        List<String> errors = new ArrayList<>();

        if (cd == 0) {
            errors.add("\"domain_error\"");
        }
        if (cr == 0) {
            errors.add("\"range_error\"");
        }

        return String.join(", ", errors);
    }

    public void validateConsistency(String file) {
        loadSuperClasses();

        validateFile(file);

        System.out.println("\n=== Validation Summary ===");
        System.out.println("Total triples checked     : " + tCount);
        System.out.println("Correct triples           : " + correct);
        System.out.println("Correct domain only       : " + correctDomainOnly);
        System.out.println("Correct range only        : " + correctRangeOnly);
        System.out.println("Both domain & range errors: " + bothErrors);

        System.out.println("\n=== Triple Annotations (JSON) ===");
        System.out.println("[");
        for (int i = 0; i < tripleAnnotations.size(); i++) {
            System.out.print(tripleAnnotations.get(i));
            if (i < tripleAnnotations.size() - 1) {
                System.out.print(",");
            }
            System.out.println();
        }
        System.out.println("]");
    }

    public String validateConsistencyToJson(String file) {
        resetState();
        loadSuperClasses();
        validateFile(file);

        String summary = String.format(
                "{\"total\":%d,\"correct\":%d,\"domain_only\":%d,\"range_only\":%d,\"both_errors\":%d}",
                tCount, correct, correctDomainOnly, correctRangeOnly, bothErrors
        );

        String annotations = "[" + String.join(",", tripleAnnotations) + "]";

        return "{"
                + "\"summary\":" + summary + ","
                + "\"annotations\":" + annotations
                + "}";
    }


}
