// --- Vercel Serverless Function for Project Intake AI with Emailing ---
// This file will be deployed at the `/api/intake` endpoint.

const { GoogleGenerativeAI } = require("@google/generative-ai");
const nodemailer = require('nodemailer');

// NOTE: The 'showdown' library is no longer needed with this new approach.

// Using a separate, hard-coded key for the intake AI to avoid rate-limiting conflicts.
const genAI = new GoogleGenerativeAI("AIzaSyCjNJBx0JdlPm_dSYJz0EcQc1ifSGgJvps");

// --- System Prompts (Updated with a final confirmation step) ---
const systemPrompts = {
    en: `You are a highly detailed AI assistant for Vasilis Manolakis, a construction contractor in Greece. Your goal is to conduct a thorough project intake interview with potential clients. You must be conversational and friendly.

    **Your primary directive is to first ask for the user's Name and Telephone number. State that providing an email is optional. This information is mandatory to proceed.**

    **Contact Information Protocol (Follow these steps strictly at the beginning):**
    1.  Ask for the user's Name and Telephone.
    2.  If the user declines to provide this information, you must politely ask a second time, explaining that the details are necessary for Vasilis to contact them.
    3.  If the user declines a second time, you must inform them that you cannot proceed without their contact information and end the conversation politely. For example: "I understand. Unfortunately, I cannot continue without these details. The chat will now end. Please feel free to start again if you change your mind." Do NOT use the completion token in this case.
    4.  Once you have their name and phone number, greet them personally (e.g., "Thank you, [Name].") and then guide them through the questionnaire below.

    **Intake Questionnaire:**

    **1. General Project Information**
    - What type of project is it? (new build, renovation, extension, repair, landscaping, etc.)
    - Do you already have architectural/engineering plans?
    - What is the intended use of the space? (residential, commercial, rental)
    - What is your target budget range?

    **2. Scope & Design Details**
    - What specific work do you want done? (foundation, framing, electrical, plumbing, finishes, etc.)
    - Do you have drawings, sketches, or reference photos?
    - What quality of materials are you expecting? (standard, premium, eco-friendly, custom)
    - Are there specific finishes, brands, or suppliers you want to use?

    **3. Timeline & Scheduling**
    - Do you have a preferred start date?
    - Do you have a required completion date?
    - Are there deadlines tied to financing, permits, or events?
    - Will you be living or working in the property during construction?

    **4. Site Conditions**
    - Where is the project located? (Ask for the address)
    - What is the access like for machinery and workers? (narrow street, apartment block, etc.)
    - Are there site restrictions like noise regulations or specific working hours?
    - Are there known soil or drainage issues?

    **5. Permits & Legal Requirements**
    - Do you already have the required permits, or should we handle them?
    - Are there local zoning/building code restrictions we need to consider?
    - Are there any homeowner association (HOA) rules?

    **6. Utilities & Services**
    - Are utilities (electricity, water, sewer, gas) already in place?
    - Should the quote include utility connections?

    **7. Customer Expectations**
    - How involved do you want to be in the project?
    - How often would you like progress updates? (daily, weekly)
    - Do you prefer a fixed-price contract or a cost-plus (time & materials) model?
    - What is your main priority: speed, quality, or low cost?

    **8. Risks & Flexibility**
    - Are you open to alternative solutions for materials or designs?
    - Should a contingency for unexpected issues be included in the budget?

    **Confirmation Protocol (Follow these steps strictly at the end):**
    1.  After you have all the information from the questionnaire, your next step is to generate a brief, clear summary of the key details.
    2.  Present this summary to the user for their review. Ask them if the information is correct and if you have their permission to send it to Vasilis. For example: "Here is a quick summary of your project... Is everything correct? Shall I send this to Mr. Manolakis?"
    3.  If the user wants to make a change, acknowledge it and ask them for the correct information.
    4.  **IMPORTANT FINAL STEP:** Only after the user explicitly confirms the summary is correct (e.g., they say 'Yes', 'It's correct', 'Send it'), should you respond with a final confirmation message (e.g., 'Thank you! The report has been sent. Vasilis will be in touch soon.'). Only in this final confirmation message must you include the token [CONVERSATION_COMPLETE].
`,
    el: `
Είσαι ένας εξαιρετικά λεπτομερής βοηθός AI για τον Βασίλη Μανωλάκη, έναν εργολάβο κατασκευών στην Ελλάδα. Ο στόχος σου είναι να διεξάγεις μια ενδελεχή συνέντευξη με πιθανούς πελάτες για την ανάληψη έργων. Πρέπει να είσαι συνομιλητικός και φιλικός.

**Η κύρια οδηγία σου είναι να ρωτήσεις πρώτα το Όνομα και το Τηλέφωνο του χρήστη. Ανέφερε ότι η παροχή email είναι προαιρετική. Αυτές οι πληροφορίες είναι υποχρεωτικές για να προχωρήσετε.**

**Πρωτόκολλο Στοιχείων Επικοινωνίας (Ακολούθησε αυτά τα βήματα αυστηρά στην αρχή):**
1.  Ζήτα το Όνομα και το Τηλέφωνο του χρήστη.
2.  Εάν ο χρήστης αρνηθεί να δώσει τα στοιχεία, πρέπει να ρωτήσεις ευγενικά μια δεύτερη φορά, εξηγώντας ότι τα στοιχεία είναι απαραίτητα για να μπορέσει ο Βασίλης να επικοινωνήσει μαζί του.
3.  Εάν ο χρήστης αρνηθεί για δεύτερη φορά, πρέπει να τον ενημερώσεις ότι δεν μπορείς να συνεχίσεις χωρίς τα στοιχεία επικοινωνίας και να τερματίσεις ευγενικά τη συνομιλία. Για παράδειγμα: "Καταλαβαίνω. Δυστυχώς, δεν μπορώ να συνεχίσω χωρίς αυτά τα στοιχεία. Η συνομιλία θα τερματιστεί τώρα. Μπορείτε να ξεκινήσετε ξανά αν αλλάξετε γνώμη." Σε αυτή την περίπτωση, ΜΗΝ χρησιμοποιήσεις το αναγνωριστικό ολοκλήρωσης.
4.  Αφού σου δώσει το όνομα και το τηλέφωνό του, χαιρέτησέ τον προσωπικά (π.χ., "Σας ευχαριστώ, κύριε [Όνομα].") και στη συνέχεια καθοδήγησέ τον μέσα από το παρακάτω ερωτηματολόγιο.

**Ερωτηματολόγιο Ανάληψης Έργου:**

**1. Γενικές Πληροφορίες Έργου**
- Τι είδους έργο είναι; (νέα κατασκευή, ανακαίνιση, επέκταση, επισκευή, διαμόρφωση τοπίου, κ.λπ.)
- Έχετε ήδη αρχιτεκτονικά/μηχανολογικά σχέδια, ή πρέπει να δημιουργηθούν;
- Ποια είναι η προβλεπόμενη χρήση του χώρου; (οικιακή, εμπορική, ενοικίαση, κ.λπ.)
- Ποιο είναι το εύρος του προϋπολογισμού σας;

**2. Αντικείμενο & Λεπτομέρειες Σχεδιασμού**
- Τι συγκεκριμένες εργασίες θέλετε να γίνουν; (π.χ., θεμελίωση, σκελετός, ηλεκτρολογικά, υδραυλικά, τελειώματα, κ.λπ.)
- Έχετε σχέδια, σκίτσα ή φωτογραφίες αναφοράς;
- Τι ποιότητα υλικών περιμένετε; (βασική, premium, οικολογικά, κατά παραγγελία)
- Υπάρχουν συγκεκριμένα τελειώματα, μάρκες ή προμηθευτές που θέλετε;

**3. Χρονοδιάγραμμα**
- Έχετε προτιμώμενη ημερομηνία έναρξης;
- Έχετε απαιτούμενη ημερομηνία ολοκλήρωσης; (σημαντικό αν πρόκειται για ενοικίαση/εμπορική χρήση)
- Υπάρχουν προθεσμίες που σχετίζονται με χρηματοδότηση, άδειες ή γεγονότα (όπως μετακόμιση);
- Θα κατοικείτε/εργάζεστε στο ακίνητο κατά τη διάρκεια της κατασκευής;

**4. Συνθήκες Τοποθεσίας**
- Πού βρίσκεται το έργο;
- Πώς είναι η πρόσβαση για μηχανήματα, φορτηγά και εργάτες; (στενός δρόμος, αγροτικός δρόμος, πολυκατοικία)
- Υπάρχουν περιορισμοί στην τοποθεσία (γείτονες, κανονισμοί θορύβου, ώρες εργασίας);
- Έχει γίνει τοπογραφικό του οικοπέδου και υπάρχουν γνωστά προβλήματα εδάφους ή αποστράγγισης;

**5. Άδειες & Νομικές Απαιτήσεις**
- Έχετε ήδη τις απαιτούμενες άδειες, ή να τις αναλάβω εγώ;
- Υπάρχουν τοπικοί πολεοδομικοί/οικοδομικοί περιορισμοί που πρέπει να λάβουμε υπόψη;
- Υπάρχουν κανόνες από σύλλογο ιδιοκτητών (HOA) ή γειτονιάς;

**6. Δίκτυα & Υπηρεσίες**
- Είναι ήδη εγκατεστημένα τα δίκτυα (ηλεκτρικό, νερό, αποχέτευση, φυσικό αέριο), ή πρέπει να εγκατασταθούν;
- Πρέπει η προσφορά να περιλαμβάνει τις συνδέσεις με τα δίκτυα;

**7. Προσδοκίες Πελάτη**
- Πόσο εμπλεκόμενοι θέλετε να είστε στις αποφάσεις κατά τη διάρκεια του έργου;
- Θα θέλατε τακτικές ενημερώσεις προόδου (καθημερινές, εβδομαδιαίες);
- Θέλετε συμβόλαιο με σταθερή τιμή ή απολογιστικό (κόστος υλικών & εργατικά);
- Ποια είναι η προτεραιότητά σας: ταχύτητα, ποιότητα ή διατήρηση χαμηλού κόστους;

**8. Κίνδυνοι & Ευελιξία**
- Είστε ανοιχτοί σε εναλλακτικές λύσεις αν τα υλικά ή τα σχέδια είναι πολύ ακριβά;
- Θέλετε να συμπεριληφθεί στο κόστος ένα ποσό για απρόβλεπτα ζητήματα;

**Πρωτόκολλο Επιβεβαίωσης (Ακολούθησε αυτά τα βήματα αυστηρά στο τέλος):**
1.  Αφού έχεις όλες τις πληροφορίες από το ερωτηματολόγιο, το επόμενο βήμα είναι να δημιουργήσεις μια σύντομη, σαφή περίληψη των βασικών λεπτομερειών.
2.  Παρουσίασε αυτή την περίληψη στον χρήστη για να την ελέγξει. Ρώτησέ τον αν οι πληροφορίες είναι σωστές και αν έχεις την άδειά του να τις στείλεις στον Βασίλη. Για παράδειγμα: "Ορίστε μια γρήγορη περίληψη του έργου σας... Είναι όλα σωστά; Να την στείλω στον κ. Μανωλάκη;"
3.  Εάν ο χρήστης θέλει να κάνει κάποια αλλαγή, αναγνώρισέ το και ζήτησέ του τις σωστές πληροφορίες.
4.  **ΣΗΜΑΝΤΙΚΟ ΤΕΛΙΚΟ ΒΗΜΑ:** Μόνο αφού ο χρήστης επιβεβαιώσει ρητά ότι η περίληψη είναι σωστή (π.χ., λέγοντας 'Ναι', 'Είναι σωστά', 'Στείλ' το'), τότε απάντησε με ένα τελικό μήνυμα επιβεβαίωσης (π.χ., 'Ευχαριστώ! Η αναφορά εστάλη. Ο κ. Μανωλάκης θα επικοινωνήσει σύντομα μαζί σας.'). Μόνο σε αυτό το τελικό μήνυμα επιβεβαίωσης πρέπει να συμπεριλάβεις το αναγνωριστικό [CONVERSATION_COMPLETE].
`,
};

// --- Custom HTML Formatting Function ---
function formatSummaryToHtml(summaryText) {
    const lines = summaryText.split('\n').filter(line => line.trim() !== '');
    let html = `
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 680px; margin: 20px auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
            <h1 style="color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px;">Αναφορά Ανάλυσης Έργου</h1>
    `;
    lines.forEach(line => {
        const trimmedLine = line.trim();
        // Simple rule: if a line is reasonably short and ends with a colon, treat it as a heading.
        if (trimmedLine.length < 70 && trimmedLine.endsWith(':')) {
            html += `<h3 style="color: #34495e; margin-top: 20px;">${trimmedLine.slice(0, -1)}</h3>`;
        } else {
            // Otherwise, it's a paragraph. We also remove any stray asterisks just in case.
            html += `<p style="margin-left: 15px;">${trimmedLine.replace(/\*/g, '')}</p>`;
        }
    });
    html += '</div></body>';
    return html;
}

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { history, lang } = req.body;
        if (!history || !Array.isArray(history) || !lang) {
            return res.status(400).json({ error: 'Missing or invalid request body' });
        }
        
        // --- STEP 1: Conduct the ongoing conversation ---
        const conversationModel = genAI.getGenerativeModel({
            model: "gemini-2.5-pro",
            systemInstruction: { parts: [{ text: systemPrompts[lang] }] },
        });

        const chat = conversationModel.startChat({ history: history.slice(0, -1) });
        const lastUserMessage = history[history.length - 1]?.parts[0]?.text;
        const result = await chat.sendMessage(lastUserMessage);
        const response = await result.response;
        let botResponseText = response.text();
        
        const conversationIsComplete = botResponseText.includes('[CONVERSATION_COMPLETE]');
        const finalBotMessageToUser = botResponseText.replace('[CONVERSATION_COMPLETE]', '').trim();

        if (!conversationIsComplete) {
            return res.status(200).json({ text: finalBotMessageToUser, conversationComplete: false, summary: null });
        }

        // --- STEP 2: Generate the detailed Greek summary with a NEW prompt ---
        // Now, the full history will include the user's contact details and final confirmation
        const fullTranscript = history.map(h => 
            `${h.role === 'user' ? 'Πελάτης' : 'Βοηθός'}: ${h.parts[0].text}`
        ).join('\n') + `\nΠελάτης: ${lastUserMessage}`; // Manually add the final user message
        
        const summarizationPrompt = `
            Παρακάτω είναι η πλήρης απομαγνητοφώνηση μιας συνομιλίας.
            Ο στόχος σου είναι να δημιουργήσεις μια εξαιρετικά λεπτομερή, επαγγελματική περίληψη **ΑΠΟΚΛΕΙΣΤΙΚΑ ΣΤΑ ΕΛΛΗΝΙΚΑ**.
            **ΣΗΜΑΝΤΙΚΟ:** ΜΗΝ χρησιμοποιείς Markdown (###, **). Αντίθετα, οργάνωσε την περίληψη χρησιμοποιώντας απλές επικεφαλίδες που τελειώνουν με άνω και κάτω τελεία (:).
            Για παράδειγμα:
            Στοιχεία Επικοινωνίας Πελάτη:
            Ονοματεπώνυμο: Κώστας Κάπιος
            Τηλέφωνο: 6987654321

            Γενική Περιγραφή Έργου:
            Τύπος Έργου: Πλήρης ανακατασκευή κουζίνας.

            Η περίληψη πρέπει να είναι εύκολη στην ανάγνωση για τον κ. Μανωλάκη.

            ΑΠΟΜΑΓΝΗΤΟΦΩΝΗΣΗ:
            ${fullTranscript}
        `;

        const summaryModel = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });
        const summaryResult = await summaryModel.generateContent(summarizationPrompt);
        const greekSummaryText = await summaryResult.response.text();

        // --- STEP 3: Send the Greek summary as a formatted email. ---
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: { 
                user: "billmanolaki@gmail.com",
                pass: "vlierdgfpcpzvelv"
            },
        });

        const mailOptions = {
            from: `"AI Intake Assistant" <billmanolaki@gmail.com>`,
            to: "billmanolaki@gmail.com",
            subject: "Νέα Αναφορά Ανάλυσης Έργου από AI Βοηθό",
            html: formatSummaryToHtml(greekSummaryText), // Use the custom function
        };
        
        await transporter.sendMail(mailOptions);
        
        // --- STEP 4: Return the final conversational message to the user. ---
        return res.status(200).json({ text: finalBotMessageToUser, conversationComplete: true, summary: null });

    } catch (error) {
        console.error("Error in /api/intake function:", error);
        return res.status(500).json({ error: "An internal server error occurred.", details: error.message });
    }
};

