/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package servlets;

import EntityRecognition.EntityRecognition;
import EntityRecognition.JSON_Converter;
import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 *
 * @author smara
 */
public class GeminiAPI extends HttpServlet {

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
            out.println("<title>Servlet GeminiAPI</title>");
            out.println("</head>");
            out.println("<body>");
            out.println("<h1>Servlet GeminiAPI at " + request.getContextPath() + "</h1>");
            out.println("</body>");
            out.println("</html>");
        }
    }

    private static String cleanJsonArrayText(String raw) {
        if (raw == null) {
            return null;
        }
        String t = raw.trim();

        t = t.replace("```json", "").replace("```", "").trim();

        t = t.replaceFirst("(?i)^json\\s*", "").trim();

        int start = t.indexOf('[');
        int end = t.lastIndexOf(']');
        if (start >= 0 && end > start) {
            t = t.substring(start, end + 1).trim();
        }
        return t;
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
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json;charset=UTF-8");
        response.setCharacterEncoding("UTF-8");

        try {
            JSON_Converter jc = new JSON_Converter();
            String data = jc.getJSONFromAjax(request.getReader());
            com.google.gson.JsonObject jsonObj = new com.google.gson.Gson().fromJson(data, com.google.gson.JsonObject.class);

            String question = jsonObj.get("question").getAsString();
            String filenamePrompt = jsonObj.get("prompt").getAsString();

            EntityRecognition er = new EntityRecognition();
            String currentPrompt = er.loadPrompt(filenamePrompt, question);
            String answer = er.runGemini(currentPrompt);

            if (answer.startsWith("error:")) {
                response.setStatus(400);
                com.google.gson.JsonObject errorObj = new com.google.gson.JsonObject();
                errorObj.addProperty("error", answer);
                response.getWriter().write(new com.google.gson.Gson().toJson(errorObj));
                return;
            }

            answer = cleanJsonArrayText(answer);

            com.google.gson.JsonObject obj = new com.google.gson.JsonObject();
            obj.addProperty("message", answer);

            response.setStatus(200);
            response.getWriter().write(new com.google.gson.Gson().toJson(obj));

        } catch (Exception ex) {
            response.setStatus(500);
            com.google.gson.JsonObject exceptionObj = new com.google.gson.JsonObject();
            exceptionObj.addProperty("error", ex.getMessage());
            response.getWriter().write(new com.google.gson.Gson().toJson(exceptionObj));
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
