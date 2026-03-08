/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package servlets;

import EntityRecognition.JSON_Converter;
import RelationExtraction.CIDOC_Validator;
import java.io.IOException;
import java.io.PrintWriter;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;

/**
 *
 * @author smara
 */
public class ValidateTriples extends HttpServlet {

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
            out.println("<title>Servlet ValidateTriples</title>");
            out.println("</head>");
            out.println("<body>");
            out.println("<h1>Servlet ValidateTriples at " + request.getContextPath() + "</h1>");
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

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        response.setCharacterEncoding("UTF-8");
        response.setContentType("application/json;charset=UTF-8");

        Gson gson = new Gson();

        try {
            JSON_Converter jc = new JSON_Converter();
            String data = jc.getJSONFromAjax(request.getReader());
            JsonObject jsonObj = gson.fromJson(data, JsonObject.class);

            String ntTriples = jsonObj.get("triples").getAsString();

            String realBase = getServletContext().getRealPath("/WEB-INF/data");
            Path dir = (realBase != null)
                    ? Paths.get(realBase)
                    : Paths.get(System.getProperty("java.io.tmpdir"), "RDLAnnotationTool", "data");
            Files.createDirectories(dir);

            Path triplesFile = dir.resolve("triples.nt");

            Files.write(triplesFile,
                    ntTriples.getBytes(StandardCharsets.UTF_8),
                    StandardOpenOption.CREATE,
                    StandardOpenOption.TRUNCATE_EXISTING);

            CIDOC_Validator validator = new CIDOC_Validator();
            String validationJson = validator.validateConsistencyToJson(triplesFile.toString());

            JsonObject out = new JsonObject();
            out.addProperty("file", triplesFile.toString());
            out.add("result", gson.fromJson(validationJson, JsonElement.class));

            response.setStatus(200);
            response.getWriter().write(gson.toJson(out));

        } catch (Exception ex) {
            ex.printStackTrace();
            response.setStatus(500);
            JsonObject err = new JsonObject();
            err.addProperty("error", "Validation failed: " + ex.getMessage());
            response.getWriter().write(gson.toJson(err));
        }
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
