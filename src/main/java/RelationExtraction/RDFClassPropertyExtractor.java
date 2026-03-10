/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package RelationExtraction;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.util.*;

import org.apache.jena.rdf.model.Model;
import org.apache.jena.rdf.model.ModelFactory;
import org.apache.jena.rdf.model.Property;
import org.apache.jena.rdf.model.RDFNode;
import org.apache.jena.rdf.model.Statement;
import org.apache.jena.rdf.model.StmtIterator;

import org.apache.jena.query.Query;
import org.apache.jena.query.QueryFactory;
import org.apache.jena.query.QueryExecution;
import org.apache.jena.query.QueryExecutionFactory;
import org.apache.jena.query.ResultSet;
import org.apache.jena.query.QuerySolution;

public class RDFClassPropertyExtractor {

    static String triples = "";

    public static String getCandidateProperties(String filePath) throws Exception {

        // --- Step 1: Load the RDF file ---
        Model model = ModelFactory.createDefaultModel();
        model.read(filePath, "N-TRIPLE");

        // --- Step 2: Extract classes from rdf:type usage ---
        Set<String> classes = new HashSet<>();
        Property rdfType = model.createProperty("http://www.w3.org/1999/02/22-rdf-syntax-ns#type");

        StmtIterator iter = model.listStatements(null, rdfType, (RDFNode) null);
        while (iter.hasNext()) {
            Statement stmt = iter.nextStatement();
            classes.add(stmt.getObject().toString());
        }
        classes.add("http://www.w3.org/2000/01/rdf-schema#Literal");

        System.out.println("Found " + classes.size() + " classes.");

        // --- Step 3: Setup SPARQL endpoint ---
        String endpointURL = "http://93.115.20.167:8890/sparql";

        // --- Step 4: Query properties for each class ---
        Set<String[]> allProperties = new HashSet<>();

        for (String cls : classes) {
            System.out.println("\nQuerying properties for class: " + cls);

            for (String cls2 : classes) {
                String queryString = String.format(
                        "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> "
                        + "SELECT DISTINCT (?dom as ?fdom) ?property (?rng as ?frng) "
                        + "WHERE { "
                        + "?property rdfs:domain ?dom . "
                        + "?property rdfs:range ?rng . "
                        + "<%s> rdfs:subClassOf* ?dom . "
                        + "<%s> rdfs:subClassOf* ?rng . "
                        + "FILTER (!regex(str(?property), \"i_\")) }",
                        cls, cls2, cls, cls2
                );
                //System.out.println(queryString);
                Query query = QueryFactory.create(queryString);
                try (QueryExecution qexec = QueryExecutionFactory.sparqlService(endpointURL, query)) {
                    ResultSet results = qexec.execSelect();
                    while (results.hasNext()) {
                        QuerySolution sol = results.nextSolution();
                        String dom = sol.get("fdom").toString();
                        String prop = sol.get("property").toString();
                        String rng = sol.get("frng").toString();
                        allProperties.add(new String[]{dom, prop, rng});
                    }
                } catch (Exception e) {
                    System.err.println("Query failed for: " + cls + " → " + cls2);
                }
            }
        }

        // --- Step 5: Group properties by domain and range ---
        Map<String, Map<String, Set<String>>> propGroups = new HashMap<>();

        for (String[] triple : allProperties) {
            String dom = triple[0];
            String prop = triple[1];
            String rng = triple[2];

            //if (classes.contains(dom) && classes.contains(rng)) {
            propGroups.putIfAbsent(prop, new HashMap<>());
            propGroups.get(prop).putIfAbsent("domains", new HashSet<>());
            propGroups.get(prop).putIfAbsent("ranges", new HashSet<>());
            propGroups.get(prop).get("domains").add(dom.replace("http://www.cidoc-crm.org/cidoc-crm/", ""));
            propGroups.get(prop).get("ranges").add(rng.replace("http://www.cidoc-crm.org/cidoc-crm/", "").replace("http://www.w3.org/2000/01/rdf-schema#", ""));
            // }
        }

        // --- Step 6: Print final grouped properties ---
        System.out.println("\nProperties grouped with domains and ranges:");
        String result = "";
        HashMap<String, String> domRngs = new HashMap<String, String>();
        for (String prop : propGroups.keySet()) {
            String propClean = prop.replace("http://www.cidoc-crm.org/cidoc-crm/", "");
            Set<String> domains = propGroups.get(prop).get("domains");
            Set<String> ranges = propGroups.get(prop).get("ranges");

            result += "\n " + propClean;
            result += "\n Dmn: " + domains;
            result += "\n Rng: " + ranges;
        }
        // System.out.println(result);
        return result;
    }
    public static String getconvertedTriples(String fileName) throws IOException {
        StringBuilder content = new StringBuilder();

        try (BufferedReader reader = new BufferedReader(new FileReader(fileName))) {
            String line;
            while ((line = reader.readLine()) != null) {
                content.append(line).append("\n");
            }
        }

        return content.toString();
    }

}
