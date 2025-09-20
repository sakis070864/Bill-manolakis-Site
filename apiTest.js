const { GoogleGenerativeAI } = require("@google/generative-ai");

// Replace this with your actual API key for this test
const GEMINI_API_KEY = "AIzaSyB04QIrVA4yHWG29ItUU7t0eP-5aQThsDw";

async function runTest() {
    console.log("--- Starting API Connectivity Test ---");

    if (!GEMINI_API_KEY || GEMINI_API_KEY === "YOUR_API_KEY_HERE") {
        console.error("Error: Please replace 'YOUR_API_KEY_HERE' with your actual API key.");
        return;
    }

    try {
        const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        console.log("Client and model initialized. Attempting to generate content...");
        const result = await model.generateContent("Hello, world!");
        const response = await result.response;
        const text = response.text();

        console.log("--- Test successful! ---");
        console.log("Response from Gemini:", text);
        console.log("Your API key is working correctly.");
    } catch (error) {
        console.error("--- Test failed! ---");
        console.error("An error occurred while calling the Gemini API.");
        console.error("Error details:", error.message);
        console.error("Possible reasons:");
        console.error("- The API key is invalid.");
        console.error("- The API key is restricted and does not have access to the Gemini API.");
        console.error("- There is a network issue or firewall blocking the connection.");
    }
}

runTest();
