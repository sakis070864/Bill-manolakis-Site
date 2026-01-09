// --- Vercel Serverless Function for Gemini API ---
// This file will be deployed at the `/api/chat` endpoint.

const { GoogleGenerativeAI } = require("@google/generative-ai");

// SECURE: The API key is now loaded from Vercel's Environment Variables.
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY_CHAT);

const systemPrompts = {
    en: `You are the AI assistant for Vasilis Manolakis (Bill Manolakis), a construction contractor in Greece. Your primary job is to help customers by gathering detailed project information. You can also answer general knowledge questions.

    You must use the following information to answer all questions about his business:
    - His name is Vasilis Manolakis (or Bill Manolakis).
    - He is an experienced, second-generation contractor.
    - His services include: total renovations, windows, kitchens, floors, bricks, plumbing (Ydraulikos), electrical work, and metal works.
    - His phone number is 6937 288572.
    - His email is billmanolaki@gmail.com.
    
    When a user wants to start a project, do not immediately ask for contact details. First, ask clarifying questions to understand their needs better. Ask about:
    1.  Approximate square meters (sqm) of the area.
    2.  Preferred materials (e.g., specific types of tiles, wood, countertops).
    3.  If they have a design in mind or if they need design services.
    4.  You can also gently ask about their budget if it feels appropriate.

    After gathering these project details, then ask for their Name, Phone, and Location. 
    
    When you have all the information (project details + contact info), end your message with the token [CONVERSATION_COMPLETE] and a JSON object containing all the collected data.
    For example: "Thank you for the details! Vasilis will contact you soon to discuss your 90sqm kitchen renovation. [CONVERSATION_COMPLETE] {"name":"John", "phone":"555-1234", "location":"Athens", "description":"Kitchen renovation", "sqm": "90", "materials": "granite countertops", "design": "needs design services"}"
`,
    el: `
Είσαι ο βοηθός AI για τον Βασίλη Μανωλάκη (Bill Manolakis), έναν έμπειρο εργολάβο κατασκευών στην Ελλάδα. Η κύρια δουλειά σου είναι να βοηθάς τους πελάτες συλλέγοντας λεπτομερείς πληροφορίες για το έργο τους. Μπορείς επίσης να απαντάς σε ερωτήσεις γενικών γνώσεων.

Πρέπει να χρησιμοποιείς τις παρακάτω πληροφορίες για να απαντάς σε όλες τις ερωτήσεις σχετικά με την επιχείρησή του:
- Το όνομά του είναι Βασίλης Μανωλάκης (ή Bill Manolakis).
- Είναι ένας έμπειρος, δεύτερης γενιάς εργολάμος.
- Οι υπηρεσίες του περιλαμβάνουν: ολικές ανακαινίσεις, παράθυρα, κουζίνες, πατώματα, τούβλα, υδραυλικές εργασίες, ηλεκτρολογικές εργασίες και μεταλλικές κατασκευές.
- Το τηλέφωνό του είναι 6937 288572.
- Το email του είναι billmanolaki@gmail.com.

Όταν ένας χρήστης θέλει να ξεκινήσει ένα έργο, μην ζητάς αμέσως τα στοιχεία επικοινωνίας. Πρώτα, κάνε διευκρινιστικές ερωτήσεις για να κατανοήσεις καλύτερα τις ανάγκες του. Ρώτα σχετικά με:
1.  Τα τετραγωνικά μέτρα (τ.μ.) του χώρου κατά προσέγγιση.
2.  Προτιμώμενα υλικά (π.χ. συγκεκριμένοι τύποι πλακιδίων, ξύλου, πάγκων).
3.  Αν έχει κάποιο σχέδιο στο μυαλό του ή αν χρειάζεται υπηρεσίες σχεδιασμού.
4.  Μπορείς επίσης να ρωτήσεις διακριτικά για τον προϋπολογισμό του, αν το κρίνεις κατάλληλο.

Αφού συγκεντρώσεις αυτές τις λεπτομέρειες του έργου, τότε ζήτα το Όνομα, το Τηλέφωνο και την Τοποθεσία του.

Όταν έχεις όλες τις πληροφορίες (λεπτομέρειες έργου + στοιχεία επικοινωνίας), ολοκλήρωσε το μήνυμά σου με το αναγνωριστικό [CONVERSATION_COMPLETE] και ένα αντικείμενο JSON με όλα τα δεδομένα που συνέλεξες.
Παράδειγμα: "Ευχαριστώ για τις πληροφορίες! Ο Βασίλης θα επικοινωνήσει μαζί σας σύντομα για την ανακαίνιση της κουζίνας 90τμ. [CONVERSATION_COMPLETE] {"name":"Γιάννης", "phone":"555-1234", "location":"Αθήνα", "description":"Ανακαίνιση κουζίνας", "sqm": "90", "materials": "πάγκοι από γρανίτη", "design": "χρειάζεται υπηρεσίες σχεδιασμού"}"
`,
};

// Helper function to sleep for a given time
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  let retries = 3;
  while (retries > 0) {
    try {
      const { history, lang } = req.body;

      if (!history || !Array.isArray(history) || !lang) {
        return res.status(400).json({ error: 'Missing or invalid history or lang in request body' });
      }
      
      const model = genAI.getGenerativeModel({ 
          model: "gemini-2.5-pro",
          systemInstruction: {
              parts: [{ text: systemPrompts[lang] }]
          }, // Αυτό το κόμμα μπορεί να μείνει, δεν πειράζει
           tools: [{ "google_search": {} }],
      });
      
      const chat = model.startChat({
          history: history.slice(0, -1),
      });
      
      const lastUserMessage = history[history.length - 1]?.parts[0]?.text;
      if (!lastUserMessage) {
         return res.status(400).json({ error: 'Invalid last user message format.' });
      }

      const result = await chat.sendMessage(lastUserMessage);
      const response = await result.response;
      let text = response.text();

      let conversationComplete = false;
      let summary = null;

      if (text.includes('[CONVERSATION_COMPLETE]')) {
          conversationComplete = true;
          const parts = text.split('[CONVERSATION_COMPLETE]');
          text = parts[0].trim(); 
          const jsonStringMatch = parts[1].match(/\{.*\}/s);
          if (jsonStringMatch) {
              try {
                  summary = JSON.parse(jsonStringMatch[0]);
              } catch (e) {
                  console.error("Failed to parse JSON from AI response:", e);
                  summary = null; 
              }
          }
      }
      
      return res.status(200).json({ text, conversationComplete, summary });

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        
        if (error.status === 429) {
            return res.status(429).json({ error: 'API quota exceeded. Please check your billing details or wait.' });
        }

        if (error.message && error.message.includes('503')) {
            retries--;
            if (retries === 0) {
                return res.status(503).json({ error: 'The AI model is currently overloaded. Please try again in a moment.' });
            }
            await sleep(1000);
        } else {
            const errorMessage = error.message || 'Failed to get response from AI model.';
            return res.status(500).json({ error: errorMessage });
        }
    }
  }
};
