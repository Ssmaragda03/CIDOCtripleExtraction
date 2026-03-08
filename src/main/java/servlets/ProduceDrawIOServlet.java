/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package servlets;

import EntityRecognition.JSON_Converter;
import RelationExtraction.ProduceDrawIO;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import java.io.IOException;
import java.io.PrintWriter;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;


/**
 *
 * @author smara
 */
public class ProduceDrawIOServlet extends HttpServlet {

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
            out.println("<title>Servlet ProduceDrawIOServlet</title>");
            out.println("</head>");
            out.println("<body>");
            out.println("<h1>Servlet ProduceDrawIOServlet at " + request.getContextPath() + "</h1>");
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


    private static final Gson GSON = new Gson();

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        response.setCharacterEncoding("UTF-8");
        response.setContentType("application/json; charset=UTF-8");

        String nt;

        try {
            JSON_Converter jc = new JSON_Converter();
            String data = jc.getJSONFromAjax(request.getReader());
            JsonObject json = GSON.fromJson(data, JsonObject.class);

            if (json == null || !json.has("triples")) {
                sendJsonError(response, 400, "Missing field 'triples' (N-Triples string).");
                return;
            }

            nt = json.get("triples").getAsString();
            if (nt == null || nt.trim().isEmpty()) {
                sendJsonError(response, 400, "Empty 'triples'.");
                return;
            }

        } catch (Exception e) {
            sendJsonError(response, 400, "Invalid JSON.");
            return;
        }

        Path tmpDir = Files.createTempDirectory("drawio_nt_");
        Path ntFile = tmpDir.resolve("input.nt");
        Files.write(ntFile, nt.getBytes(StandardCharsets.UTF_8));

        try {

            ProduceDrawIO tool = new ProduceDrawIO();
            tool.produceDrawFile(ntFile.toString());

            Path produced = Paths.get("triples.drawio");
            if (!Files.exists(produced)) {
                sendJsonError(response, 500, "Drawio file was not produced (triples.drawio not found).");
                return;
            }

            String webRoot = getServletContext().getRealPath("/");
            Path genDir = Paths.get(webRoot, "generated");
            Files.createDirectories(genDir);

            String fileName = "triples_" + System.currentTimeMillis() + ".drawio";
            Path target = genDir.resolve(fileName);

            Files.move(produced, target, StandardCopyOption.REPLACE_EXISTING);

            JsonObject out = new JsonObject();
            out.addProperty("ok", true);
            out.addProperty("file", "generated/" + fileName);
            out.addProperty("absolutePath", target.toAbsolutePath().toString());

            response.setStatus(200);
            response.getWriter().write(GSON.toJson(out));

        } catch (Exception e) {
            sendJsonError(response, 500, "Failed to generate drawio: " + e.getMessage());
        } finally {
            // cleanup temp
            try {
                Files.deleteIfExists(ntFile);
            } catch (Exception ignore) {
            }
            try {
                Files.deleteIfExists(tmpDir);
            } catch (Exception ignore) {
            }
        }
    }

    private static void sendJsonError(HttpServletResponse resp, int status, String msg) throws IOException {
        resp.setCharacterEncoding("UTF-8");
        resp.setContentType("application/json; charset=UTF-8");
        resp.setStatus(status);

        JsonObject o = new JsonObject();
        o.addProperty("ok", false);
        o.addProperty("error", msg);

        resp.getWriter().write(GSON.toJson(o));
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
