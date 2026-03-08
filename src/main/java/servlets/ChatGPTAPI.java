/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package servlets;

import EntityRecognition.EntityRecognition;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import EntityRecognition.JSON_Converter;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 *
 * @author smara
 */
//@WebServlet("/ChatGPTAPI")
public class ChatGPTAPI extends HttpServlet {

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
            out.println("<title>Servlet ChatGPTAPI</title>");
            out.println("</head>");
            out.println("<body>");
            out.println("<h1>Servlet ChatGPTAPI at " + request.getContextPath() + "</h1>");
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

    private static String cleanJsonArrayText(String raw) {
        if (raw == null) {
            return null;
        }

        String t = raw.trim();

        // remove markdown fences
        t = t.replace("```json", "").replace("```", "").trim();

        // remove leading "json" line (case-insensitive)
        t = t.replaceFirst("(?i)^json\\s*", "").trim();

        // keep only the JSON array part if extra text exists
        int start = t.indexOf('[');
        int end = t.lastIndexOf(']');
        if (start >= 0 && end > start) {
            t = t.substring(start, end + 1).trim();
        }

        return t;
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
        try {
            JSON_Converter jc = new JSON_Converter(); // A new JSON Converter
            String data = jc.getJSONFromAjax(request.getReader());
            JsonObject jsonObj = new Gson().fromJson(data, JsonObject.class); // A new Json Object
            String question = jsonObj.get("question").getAsString();
            String model = jsonObj.get("model").getAsString();
            String filenamePrompt = jsonObj.get("prompt").getAsString();


            EntityRecognition chatgptRecognition = new EntityRecognition();
            String prompt = chatgptRecognition.loadPrompt(filenamePrompt, question);
            System.out.println(prompt);
            String currentPrompt = prompt;

            String answer = chatgptRecognition.chatGPT_TURBO(currentPrompt, model);

            if (answer == null || answer.isEmpty()) {
                response.setStatus(500);
                response.getWriter().println("Failed to retrieve a response from ChatGPT.");
                return;
            }

            answer = cleanJsonArrayText(answer);

            JsonObject obj = new JsonObject();
            obj.addProperty("message", answer);

            response.setContentType("application/json;charset=UTF-8");
            response.getWriter().write(new Gson().toJson(obj));

            System.out.println(answer);
            response.setStatus(200);
        } catch (Exception ex) {
            Logger.getLogger(ChatGPTAPI.class.getName()).log(Level.SEVERE, null, ex);
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
