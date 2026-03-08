/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package servlets;

import EntityRecognition.EntityRecognition;
import EntityRecognition.JSON_Converter;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
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
public class DeepSeekAPI extends HttpServlet {

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
            out.println("<title>Servlet DeepSeekAPI</title>");
            out.println("</head>");
            out.println("<body>");
            out.println("<h1>Servlet DeepSeekAPI at " + request.getContextPath() + "</h1>");
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
        JSON_Converter jc = new JSON_Converter(); // A new JSON Converter
        String data = jc.getJSONFromAjax(request.getReader());
        JsonObject jsonObj = new Gson().fromJson(data, JsonObject.class); // A new Json Object
        String question = jsonObj.get("question").getAsString();
        String model = jsonObj.get("model").getAsString();
        String filenamePrompt = jsonObj.get("prompt").getAsString();

        EntityRecognition deepseekRecognition = new EntityRecognition();
        String prompt = deepseekRecognition.loadPrompt(filenamePrompt, question);
        String currentPrompt = prompt;

        String answer = null;
        try {
            answer = deepseekRecognition.deepseek(currentPrompt, model);
        } catch (Exception ex) {
            Logger.getLogger(DeepSeekAPI.class.getName()).log(Level.SEVERE, null, ex);
        }

        if (answer == null || answer.isEmpty()) {
            response.setStatus(500);
            response.getWriter().println("Failed to retrieve a response from ChatGPT.");
            return;
        }

        JsonObject obj = new JsonObject();
        obj.addProperty("message", answer);

        response.setContentType("application/json;charset=UTF-8");
        response.getWriter().write(new Gson().toJson(obj));

        System.out.println(answer);
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
