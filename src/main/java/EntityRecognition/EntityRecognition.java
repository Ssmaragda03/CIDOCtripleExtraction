/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package EntityRecognition;

/**
 *
 * @author smara
 */
/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
import java.io.BufferedReader;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.stream.Collectors;
//import javax.ws.rs.client.Client;
import org.codehaus.jettison.json.JSONArray;
import org.codehaus.jettison.json.JSONObject;
import com.google.genai.Client;
import com.google.genai.types.GenerateContentResponse;

/**
 *
 * @author micha
 */
public class EntityRecognition {

    // load prompt from file
    public String loadPrompt(String promptName, String userInput) throws IOException {
        InputStream in = getClass().getClassLoader().getResourceAsStream("prompts/" + promptName + ".txt");

        if (in == null) {
            throw new FileNotFoundException("Prompt not found: " + promptName);
        }

        String prompt = new BufferedReader(new InputStreamReader(in))
                .lines().collect(Collectors.joining("\n"));

        // Replace placeholder {TEXT} with actual user input
        return prompt.replace("{TEXT}", JSONObject.quote(userInput));
    }

    //LLM
    public String deepseek(String text, String model) throws Exception {
        String url2 = "https://api.deepseek.com/chat/completions";
        HttpURLConnection con = (HttpURLConnection) new URL(url2).openConnection();
        con.setRequestMethod("POST");
        con.setRequestProperty("Content-Type", "application/json");

        String fkey = ""; //add your key;

        con.setRequestProperty("Authorization", "Bearer " + fkey);

        JSONObject data = new JSONObject();
        data.put("model", model);
        data.put("temperature", 0.5);
        data.put("max_tokens", 2000);

        JSONArray messages = new JSONArray();
        JSONObject message = new JSONObject();
        message.put("role", "user");
        message.put("content", text);
        messages.put(message);
        data.put("messages", messages);

        String body = data.toString().replace("\"[", "[").replace("]\"", "]").replace("'", "\"").replace("MyText", text);
        System.out.println("query=" + body);
        con.setDoOutput(true);
        con.getOutputStream().write(body.toString().getBytes());

        int responseCode = con.getResponseCode();
        if (responseCode == HttpURLConnection.HTTP_OK) {

            String output = new BufferedReader(new InputStreamReader(con.getInputStream())).lines()
                    .reduce((a, b) -> a + b).get();

            return new JSONObject(output).getJSONArray("choices").getJSONObject(0).getJSONObject("message").getString("content").replace("```", "").replace("sparql", "");
        } else {   //possible token exceedance

            System.out.println("Error: " + responseCode);
            InputStream errorStream = con.getErrorStream();
            if (errorStream != null) {
                String errorOutput = new BufferedReader(new InputStreamReader(errorStream)).lines()
                        .reduce((a, b) -> a + b).orElse("");
                System.out.println("Error details: " + errorOutput);
                return "Failed: " + new JSONObject(errorOutput).getJSONObject("error").getString("message");
            }
        }
        return "Failed to fetch an answer from Chat-GPT";
    }

    private String url = "https://api.openai.com/v1/chat/completions";
    String key_35 = ""; //add your key;
    String keymini = ""; //add your key;
    String key4 = ""; //add your key;

    /**
     * Calls gpt turbo version without caring about conversation history
     * @param text
     * @param model
     * @return
     * @throws java.lang.Exception
     */
    public String chatGPT_TURBO(String text, String model) throws Exception {
        HttpURLConnection con = (HttpURLConnection) new URL(url).openConnection();
        con.setRequestMethod("POST");
        con.setRequestProperty("Content-Type", "application/json");

        String fkey = key_35;
        if (model.contains("mini")) {
            fkey = keymini;
        } else if (model.contains("4")) {
            fkey = key4;
        }

        con.setRequestProperty("Authorization", "Bearer " + fkey);

        JSONObject data = new JSONObject();
        data.put("model", model);
        data.put("temperature", 0.5);
        data.put("max_tokens", 2000);

        JSONArray messages = new JSONArray();
        JSONObject message = new JSONObject();
        message.put("role", "user");
        message.put("content", text);
        messages.put(message);
        data.put("messages", messages);

        String body = data.toString();

        // Debug print
        System.out.println("REQUEST BODY:\n" + body);

        con.setDoOutput(true);
        con.getOutputStream().write(body.getBytes("UTF-8"));

        int responseCode = con.getResponseCode();
        if (responseCode == HttpURLConnection.HTTP_OK) {
            String output = new BufferedReader(new InputStreamReader(con.getInputStream()))
                    .lines().reduce((a, b) -> a + b).get();

            return new JSONObject(output)
                    .getJSONArray("choices")
                    .getJSONObject(0)
                    .getJSONObject("message")
                    .getString("content")
                    .replace("```", "")
                    .replace("sparql", "");
        } else {
            System.out.println("Error: " + responseCode);
            InputStream errorStream = con.getErrorStream();
            if (errorStream != null) {
                String errorOutput = new BufferedReader(new InputStreamReader(errorStream))
                        .lines().reduce((a, b) -> a + b).orElse("");
                System.out.println("Error details: " + errorOutput);
                return "Failed: " + errorOutput;
            }
        }

        return "Failed to fetch an answer from ChatGPT";
    }

    public String runGemini(String currentPrompt) {
        String key = ""; //add your key
        Client client = Client.builder().apiKey(key).build();

        GenerateContentResponse response
                = client.models.generateContent(
                        "gemini-2.5-flash",
                        currentPrompt,
                        null);
        System.out.println(response.text());
        return response.text();
    }

}
