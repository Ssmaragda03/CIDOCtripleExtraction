/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 *
 */
package servlets;

import EntityRecognition.JSON_Converter;
import RelationExtraction.ConvertJSONtoTriples;
import RelationExtraction.RelationExtraction;
import RelationExtraction.Resources;
import static RelationExtraction.Resources.displayPrefixesAll;
import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import java.io.IOException;
import java.io.PrintWriter;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 *
 * @author smara
 */
public class ConvertJSONtoRDFTriples extends HttpServlet {

    /**
     * Processes requests for both HTTP <code>GET</code> and <code>POST</code>
     * methods.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("text/html;charset=UTF-8");
        try (PrintWriter out = response.getWriter()) {
            /* TODO output your page here. You may use following sample code. */
            out.println("<!DOCTYPE html>");
            out.println("<html>");
            out.println("<head>");
            out.println("<title>Servlet ConvertJSONtoRDFTriples</title>");
            out.println("</head>");
            out.println("<body>");
            out.println("<h1>Servlet ConvertJSONtoRDFTriples at " + request.getContextPath() + "</h1>");
            out.println("</body>");
            out.println("</html>");
        }
    }

    // <editor-fold defaultstate="collapsed" desc="HttpServlet methods. Click on the + sign on the left to edit the code.">
    /**
     * Handles the HTTP <code>GET</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        processRequest(request, response);
    }

    /**
     * Handles the HTTP <code>POST</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        JSON_Converter jc = new JSON_Converter();
        String data = jc.getJSONFromAjax(request.getReader());
        JsonObject jsonObj = new Gson().fromJson(data, JsonObject.class);
        String question = jsonObj.get("text").getAsString();
        String model = jsonObj.get("model").getAsString();
        String prompt = jsonObj.get("prompt").getAsString();
        String entitiesJson = jsonObj.get("entities").toString();
        JsonObject prefixesObj = jsonObj.getAsJsonObject("prefixes");
        Map<String, String> prefixes = new HashMap<>();
        if (prefixesObj != null) {
            for (Map.Entry<String, JsonElement> entry : prefixesObj.entrySet()) {
                prefixes.put(entry.getKey(), entry.getValue().getAsString());
            }
        }
        String EntitiesTriple = new ConvertJSONtoTriples().convertToTriples(entitiesJson, prefixes);

        String realBase = getServletContext().getRealPath("/WEB-INF/data");
        Path dir = (realBase != null)
                ? Paths.get(realBase)
                : Paths.get(System.getProperty("java.io.tmpdir"), "RDLAnnotationTool", "data");

        Files.createDirectories(dir);

        Path entitiesFilePath = dir.resolve("entities.nt");
        Files.writeString(
                entitiesFilePath,
                EntitiesTriple,
                java.nio.charset.StandardCharsets.UTF_8,
                java.nio.file.StandardOpenOption.CREATE,
                java.nio.file.StandardOpenOption.TRUNCATE_EXISTING
        );

        String relTriples = new RelationExtraction().relationExtractionOverText(question, entitiesFilePath.toString(), model, prompt);

        String allTriples = EntitiesTriple + "\n" + relTriples;
        Resources.writeToFile(entitiesFilePath.toString(), allTriples);

        Map<String, String> nsToPrefix = new HashMap<>();
        for (Map.Entry<String, String> e : prefixes.entrySet()) {
            nsToPrefix.put(e.getValue(), e.getKey() + ":");
        }

        String allTriplesUI = displayPrefixesAll(allTriples, nsToPrefix);

        int lockedCount = 0;
        for (String line : EntitiesTriple.split("\\R")) {
            String t = line.trim();
            if (!t.isEmpty()) {
                lockedCount++;
            }
        }
        System.out.println(allTriplesUI);

        JsonObject out = new JsonObject();
        out.addProperty("triples", allTriplesUI);
        out.addProperty("lockedCount", lockedCount);

        response.setCharacterEncoding("UTF-8");
        response.setContentType("application/json;charset=UTF-8");
        response.getWriter().write(new Gson().toJson(out));
        response.setStatus(200);
    }

    /**
     * Returns a short description of the servlet.
     *
     * @return a String containing servlet description
     */
    @Override
    public String getServletInfo() {
        return "Short description";
    }// </editor-fold>

}
