# RDLAnnotationTool

This project was developed and is intended to run in **NetBeans IDE 12.1** using **Java JDK 11**.

## Development Environment

- **IDE:** NetBeans 12.1
- **Java Version:** JDK 11
- **Server:** Apache Tomcat / TomEE
- **Default local URL:** `http://localhost:8080/`

## Project Type

This is a **Java web application** based on:

- **Java Servlets**
- **HTML / CSS / JavaScript**
- **Maven** project structure

## Servlet / Backend Information

The backend logic is implemented using **Java Servlets**.  
Servlets are responsible for handling requests from the frontend, processing entity and relation extraction workflows, and returning the corresponding results.

The project includes servlet-based functionality for:

The backend of the application is implemented using Java Servlets.  
The following servlets are used in the project:

- `ChatGPTAPI.java`
- `ConvertJSONtoRDFTriples.java`
- `DeepSeekAPI.java`
- `DownloadEntitiesNTServlet.java`
- `EntitiesTable.java`
- `GeminiAPI.java`
- `ProduceDrawIOServlet.java`
- `ValidateTriples.java`
- `readPrompt.java`
- `readRelationPrompt.java`

## Main Technologies Used

- **Java JDK 11**
- **NetBeans 12.1**
- **Apache Tomcat / TomEE**
- **Maven**
- **Servlets**
- **HTML**
- **CSS**
- **JavaScript**

## How to Run

1. Open the project in **NetBeans 12.1**.
2. Ensure that **JDK 11** is selected as the active Java platform.
3. Make sure the project is configured to run on **Apache Tomcat / TomEE**.
4. Clean and build the project.
5. Run the project through NetBeans.
6. Open it in the browser through the local server URL, typically:

   `http://localhost:8080/`

## Notes

- The project is recommended to run in **NetBeans 12.1** for best compatibility.
- **JDK 11** should be used as the active Java version.
- The application relies on a servlet-based backend, so it should be deployed on a compatible Java web server such as **Tomcat** or **TomEE**.