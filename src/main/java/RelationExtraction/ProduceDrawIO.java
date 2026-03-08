/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package RelationExtraction;


import java.io.*;
import java.nio.file.*;
import java.util.*;
import java.util.regex.*;
import java.util.stream.Collectors;

/**
 * NtToDrawIoHierarchical
 *
 * Usage: javac NtToDrawIoHierarchical.java java NtToDrawIoHierarchical input.nt
 * output.drawio
 *
 * - Parses a simple N-Triples file (URI subjects/predicates/URI-or-literal
 * objects). - Builds a graph, picks a root (node with highest out-degree),
 * performs BFS to compute levels. - Assigns coordinates per level and siblings
 * to create a simple hierarchical layout. - Rewrites CIDOC-CRM URIs
 * (http://www.cidoc-crm.org/cidoc-crm/...) to crm:... in labels. - Outputs a
 * draw.io xmfile you can import to diagrams.net.
 *
 * Limitations: - Minimal NT parsing (sufficient for typical <...> "literal"
 * lines). Not a full RDF parser. - No blank node or datatype/language-tag
 * handling beyond simple literals.
 */
public class ProduceDrawIO {

    static final String CRM_BASE = "http://www.cidoc-crm.org/cidoc-crm/";

    static class Node {

        String uriOrLiteral;
        boolean isLiteral;
        String id;
        String label;
        int level = -1;
        double x, y;

        List<String> types = new ArrayList<>();

        Node(String uriOrLiteral, boolean isLiteral) {
            this.uriOrLiteral = uriOrLiteral;
            this.isLiteral = isLiteral;
            this.id = "n" + UUID.randomUUID().toString().replace("-", "").substring(0, 8);
            this.label = compactLabel(uriOrLiteral, isLiteral);
        }

        // helper to get label + types
        String getLabelWithTypes() {
            if (types.isEmpty()) {
                return label;
            }
            return label + "\n(" + types.stream().collect(Collectors.joining("\n"))+")";
        }
    }

    static class Edge {

        String id;
        Node source;
        Node target;
        String label;

        Edge(Node s, Node t, String label) {
            this.id = "e" + UUID.randomUUID().toString().replace("-", "").substring(0, 8);
            this.source = s;
            this.target = t;
            this.label = label;
        }
    }

    
    // ----- Utilities & helpers -----
    static class Triple {

        String s, p, o;
        boolean oIsLiteral;

        Triple(String s, String p, String o, boolean isLit) {
            this.s = s;
            this.p = p;
            this.o = o;
            this.oIsLiteral = isLit;
        }
    }

    // very small N-Triples parser: <s> <p> <o> .  or <s> <p> "literal" .
    static List<Triple> parseNTriples(String text) {
        List<Triple> out = new ArrayList<>();
        Pattern literalPattern = Pattern.compile("^(<[^>]*>)\\s+(<[^>]*>)\\s+(\".*\")\\s*\\.\\s*$");
        Pattern triplePattern = Pattern.compile("^(<[^>]*>)\\s+(<[^>]*>)\\s+(<[^>]*>)\\s*\\.\\s*$");
        for (String rawLine : text.split("\\r?\\n")) {
            String line = rawLine.trim();
            if (line.isEmpty() || line.startsWith("#")) {
                continue;
            }
            Matcher mLit = literalPattern.matcher(line);
            Matcher mTrip = triplePattern.matcher(line);
            if (mLit.find()) {
                String s = mLit.group(1);
                String p = mLit.group(2);
                String o = mLit.group(3);
                out.add(new Triple(unangle(s), unquote(p), unquote(o), true));
            } else if (mTrip.find()) {
                String s = mTrip.group(1);
                String p = mTrip.group(2);
                String o = mTrip.group(3);
                out.add(new Triple(unangle(s), unangle(p), unangle(o), false));
            } else {
                // fallback: try loose split (best-effort)
                String lineNoDot = line.endsWith(".") ? line.substring(0, line.length() - 1).trim() : line;
                String[] parts = lineNoDot.split("\\s+", 3);
                if (parts.length >= 3) {
                    String s = trimAnglesOrQuotes(parts[0]);
                    String p = trimAnglesOrQuotes(parts[1]);
                    String oRaw = parts[2].trim();
                    boolean isLit = oRaw.startsWith("\"");
                    String o = isLit ? trimQuotes(oRaw) : trimAnglesOrQuotes(oRaw);
                    out.add(new Triple(s, p, o, isLit));
                } else {
                    // skip unparseable
                }
            }
        }
        return out;
    }

    static String unangle(String x) {
        return x.replaceAll("^<|>$", "");
    }

    static String unquote(String x) {
        return x.replaceAll("^\"|\"$", "");
    }

    static String trimQuotes(String s) {
        if (s == null) {
            return null;
        }
        if (s.startsWith("\"") && s.endsWith("\"") && s.length() >= 2) {
            return s.substring(1, s.length() - 1);
        }
        return s;
    }

    static String trimAnglesOrQuotes(String x) {
        if (x.startsWith("<") && x.endsWith(">")) {
            return unangle(x);
        }
        if (x.startsWith("\"") && x.endsWith("\"")) {
            return unquote(x);
        }
        return x;
    }

    static String compactLabel(String uriOrLiteral, boolean isLiteral) {
        if (isLiteral) {
            return uriOrLiteral;
        }
        // if crm base -> crm:fragment
        if (uriOrLiteral.startsWith(CRM_BASE)) {
            return "crm:" + uriOrLiteral.substring(CRM_BASE.length());
        }
        // otherwise use last path segment or full if short
        if (uriOrLiteral.contains("#")) {
            return uriOrLiteral.substring(uriOrLiteral.lastIndexOf('#') + 1);
        }
        String trimmed = uriOrLiteral.replaceAll("/+$", "");
        int idx = trimmed.lastIndexOf('/');
        if (idx >= 0 && idx + 1 < trimmed.length()) {
            return trimmed.substring(idx + 1);
        }
        return uriOrLiteral;
    }

    static String compactPredicateLabel(String predUri) {
        if (predUri.startsWith(CRM_BASE)) {
            return "crm:" + predUri.substring(CRM_BASE.length());
        }
        // short predicate for readability
        if (predUri.contains("#")) {
            return predUri.substring(predUri.lastIndexOf('#') + 1);
        }
        String t = predUri.replaceAll("/+$", "");
        int idx = t.lastIndexOf('/');
        if (idx >= 0 && idx + 1 < t.length()) {
            return t.substring(idx + 1);
        }
        return predUri;
    }

    // Assign BFS levels starting from root, following outgoing edges (source->target).
    static void BreadthFirstAssignLevels(Node root, Map<String, Node> nodes, List<Edge> edges) {
        // build adjacency map keyed by node.uriOrLiteral
        Map<String, List<Node>> adj = new HashMap<>();
        for (Edge e : edges) {
            adj.computeIfAbsent(e.source.uriOrLiteral, k -> new ArrayList<>()).add(e.target);
        }
        Queue<Node> q = new ArrayDeque<>();
        root.level = 0;
        q.add(root);
        Set<String> visited = new HashSet<>();
        visited.add(root.uriOrLiteral);
        while (!q.isEmpty()) {
            Node n = q.poll();
            List<Node> children = adj.getOrDefault(n.uriOrLiteral, Collections.emptyList());
            for (Node c : children) {
                if (!visited.contains(c.uriOrLiteral)) {
                    c.level = n.level + 1;
                    visited.add(c.uriOrLiteral);
                    q.add(c);
                }
            }
        }
        // any unvisited nodes: assign them to next levels (isolated components)
        for (Node node : nodes.values()) {
            if (node.level == -1) {
                node.level = 0;
            }
        }
    }

    // assign coordinates per level: nodes in each level arranged horizontally
    static void assignCoordinates(Map<String, Node> nodesMap) {
        Random rand = new Random(42); // for reproducibility
        int spacing = 50; // minimum spacing between nodes

        // Group nodes by level (BFS levels)
        Map<Integer, List<Node>> perLevel = new TreeMap<>();
        for (Node n : nodesMap.values()) {
            perLevel.computeIfAbsent(n.level, k -> new ArrayList<>()).add(n);
        }

        int startY = 40;
        for (Map.Entry<Integer, List<Node>> entry : perLevel.entrySet()) {
            int level = entry.getKey();
            List<Node> list = entry.getValue();

            // Shuffle order slightly for “organic” look
            Collections.shuffle(list, rand);

            // Place nodes horizontally with spacing + small random offset
            int x = 40;
            for (Node n : list) {
                n.x = x + rand.nextInt(spacing); // small random shift
                n.y = startY + level * (spacing * 2) + rand.nextInt(spacing);
                x += spacing * 4; // space for next node
            }
        }
    }

    static String buildDrawIoXml(List<Node> nodes, List<Edge> edges, String diagramName, boolean colorNodes) {
        StringBuilder sb = new StringBuilder();
        sb.append("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n");
        sb.append("<mxfile host=\"app.diagrams.net\">\n");
        sb.append("  <diagram name=\"" + escapeXml(diagramName) + "\">\n");
        sb.append("    <mxGraphModel dx=\"1000\" dy=\"600\" grid=\"1\" gridSize=\"10\" guides=\"1\" tooltips=\"1\" connect=\"1\" arrows=\"1\" fold=\"1\" page=\"1\" pageScale=\"1\" math=\"0\" shadow=\"0\">\n");
        sb.append("      <root>\n");
        sb.append("        <mxCell id=\"0\"/>\n");
        sb.append("        <mxCell id=\"1\" parent=\"0\"/>\n");

        // nodes
        // nodes
        for (Node n : nodes) {
            String style;
            if(n.label.startsWith("crm:E")){
                continue;
            }
            if (n.isLiteral) {
                style = "shape=ellipse;rounded=1;whiteSpace=wrap;html=1;fillColor=#ffe6cc;strokeColor=#c17a00;";
            } else if (n.label.startsWith("crm:E") || n.label.startsWith("crm:P")) {
                // CRM class or property
                style = "shape=rectangle;rounded=1;whiteSpace=wrap;html=1;fillColor=#d5e8d4;strokeColor=#82b366;";
            } else {
                // general URI entity
                style = "shape=rectangle;rounded=1;whiteSpace=wrap;html=1;fillColor=#dae8fc;strokeColor=#6c8ebf;";
            }
            int w = Math.max(120, Math.min(400, 7 * Math.max(6, n.label.length())));
            int h = 50;
            sb.append("        <mxCell id=\"" + n.id + "\" value=\"" + escapeXml(n.getLabelWithTypes()) + "\" style=\"" + style + "\" parent=\"1\" vertex=\"1\">\n");
            //sb.append("        <mxCell id=\"" + n.id + "\" value=\"" + escapeXml(n.label) + "\" style=\"" + style + "\" parent=\"1\" vertex=\"1\">\n");
            sb.append("          <mxGeometry x=\"" + (int) n.x + "\" y=\"" + (int) n.y + "\" width=\"" + w + "\" height=\"" + h + "\" as=\"geometry\"/>\n");
            sb.append("        </mxCell>\n");
        }

        // edges
        for (Edge e : edges) {
           
            String estyle = "edgeStyle=orthogonalEdgeStyle;rounded=0;html=1;endArrow=classic;";
            sb.append("        <mxCell id=\"" + e.id + "\" value=\"" + escapeXml(e.label.replace(">", "")) + "\" style=\"" + estyle + "\" parent=\"1\" edge=\"1\" source=\"" + e.source.id + "\" target=\"" + e.target.id + "\">\n");
            sb.append("          <mxGeometry relative=\"1\" as=\"geometry\"/>\n");
            sb.append("        </mxCell>\n");
        }

        sb.append("      </root>\n");
        sb.append("    </mxGraphModel>\n");
        sb.append("  </diagram>\n");
        sb.append("</mxfile>\n");
        return sb.toString();
    }

    static String escapeXml(String s) {
        if (s == null) {
            return "";
        }
        return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace("\"", "&quot;");
    }
    
   public void produceDrawFile(String file) throws IOException{

        Path in = Paths.get(file);
        Path out = Paths.get("triples.drawio");

        String nt = new String(Files.readAllBytes(in), "UTF-8");
        List<Triple> triples = parseNTriples(nt);

        // Build nodes and adjacency
        Map<String, Node> nodes = new LinkedHashMap<>();
        List<Edge> edges = new ArrayList<>();
        Map<String, Integer> outDegree = new HashMap<>();

        for (Triple t : triples) {
            Node s = nodes.computeIfAbsent(t.s, k -> new Node(k, false));
            Node o;
            if (t.oIsLiteral) {
                String litKey = "lit::" + t.o;
                o = nodes.computeIfAbsent(litKey, k -> new Node(t.o, true));
            } else {
                o = nodes.computeIfAbsent(t.o, k -> new Node(k, false));
            }

            String predLabel = compactPredicateLabel(t.p);
            edges.add(new Edge(s, o, predLabel));
            outDegree.put(s.uriOrLiteral, outDegree.getOrDefault(s.uriOrLiteral, 0) + 1);

            // If predicate is rdf:type, store the type in the subject node
            if (t.p.equals("http://www.w3.org/1999/02/22-rdf-syntax-ns#type")) {
                s.types.add(compactLabel(t.o, false));
                
                 //continue;
            }
        }

        // Choose root: resource with highest out-degree; fallback: first subject
        String rootKey = null;
        Optional<Map.Entry<String, Integer>> maxOut = outDegree.entrySet().stream()
                .max(Comparator.comparingInt(Map.Entry::getValue));
        if (maxOut.isPresent()) {
            rootKey = maxOut.get().getKey();
        } else if (!triples.isEmpty()) {
            rootKey = triples.get(0).s;
        }
        if (rootKey == null) {
            System.err.println("No triples found.");
            System.exit(2);
        }
        Node root = nodes.get(rootKey);

        // BFS to set levels
        BreadthFirstAssignLevels(root, nodes, edges);

        // Compute positions per level
        assignCoordinates(nodes);

        // Build draw.io xml
        String xml = buildDrawIoXml(new ArrayList<>(nodes.values()), edges, "CIDOC CRM Hierarchical", /*coloring*/ true);

        Files.write(out, xml.getBytes("UTF-8"));
        System.out.println("Wrote draw.io file to: " + out.toAbsolutePath());
    }

}
