import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';

// --- API Endpoints ---
const CHAT_API_URL = `${window.location.origin}/api/chat`;
const INTAKE_API_URL = `${window.location.origin}/api/intake`;
const EMAIL_API_URL = `${window.location.origin}/api/send-email`;

// --- Data: All Portfolio Images (for filtering by category) ---
const portfolioImages = [
    // --- Bathrooms (24 images) ---
    { category: 'bathrooms', src: '/images/bathrooms/IMG-7145a19ce47a8bb189c0dfcf9ed883e6-V.jpg' },
    { category: 'bathrooms', src: '/images/bathrooms/IMG-87562f5134ac36ee7c0d85d727874ced-V.jpg' },
    { category: 'bathrooms', src: '/images/bathrooms/IMG-4551403b85239f65bc7eb26fa5a2ec6a-V.jpg' },
    { category: 'bathrooms', src: '/images/bathrooms/IMG-737688142af2d9e6bce7e412942c79b5-V.jpg' },
    { category: 'bathrooms', src: '/images/bathrooms/IMG-ae63f6d069fd9d367b70d2d3767ee48d-V.jpg' },
    { category: 'bathrooms', src: '/images/bathrooms/IMG-bf59562e1a7599517a624613790e4eac-V.jpg' },
    { category: 'bathrooms', src: '/images/bathrooms/IMG-c3c7a3fd1623ff660f6e36d30ce0b8a1-V.jpg' },
    { category: 'bathrooms', src: '/images/bathrooms/IMG-c8f73a85178ac99ca6e78885fa77593c-V.jpg' },
    { category: 'bathrooms', src: '/images/bathrooms/IMG-c9fec20edc2d3994125b11e9706861ef-V.jpg' },
    { category: 'bathrooms', src: '/images/bathrooms/IMG-c706d98213cd323ff122a033af0eb367-V.jpg' },
    { category: 'bathrooms', src: '/images/bathrooms/IMG-cb2237fda6c450492a99e6fddb02841c-V.jpg' },
    { category: 'bathrooms', src: '/images/bathrooms/IMG-d5cca89bea51c17d47bd7557140f8b6f-V.jpg' },
    { category: 'bathrooms', src: '/images/bathrooms/IMG-d14bd2ec30ff6548cef0ad57fb1476b0-V.jpg' },
    { category: 'bathrooms', src: '/images/bathrooms/IMG-d81b294fdad96c4be48abf863c391c5e-V.jpg' },
    { category: 'bathrooms', src: '/images/bathrooms/IMG-d5974660c1c273e3aef3ed85940bef68-V.jpg' },
    { category: 'bathrooms', src: '/images/bathrooms/IMG-ded251a1cade5776562b356444a8524b-V.jpg' },
    { category: 'bathrooms', src: '/images/bathrooms/IMG-ed64669b46d7bf7351f82958fc1c275b-V.jpg' },
    { category: 'bathrooms', src: '/images/bathrooms/IMG-ef878a1b3c8695c45df0f4e5d0271e2d-V.jpg' },
    { category: 'bathrooms', src: '/images/bathrooms/IMG-f9a3041a993063fe60794398f775d792-V.jpg' },
    { category: 'bathrooms', src: '/images/bathrooms/IMG-f76aff8ea3905ad171c2c3b55b3d53ff-V.jpg' },
    { category: 'bathrooms', src: '/images/bathrooms/IMG-fdb8ff1b849a98ba59f46add31adbe96-V.jpg' },
    { category: 'bathrooms', src: '/images/bathrooms/IMG-ffae963dd5ba96b115f1f6de0866dcff-V.jpg' },
    { category: 'bedrooms', src: '/images/bedrooms/IMG-75143dd907bf58b503eb925df0c16711-V.jpg' },
    { category: 'bedrooms', src: '/images/bedrooms/IMG-abf711c64912a90ba9c97b8526d3d986-V.jpg' },
    { category: 'bedrooms', src: '/images/bedrooms/IMG-b55c9e034ad8981cbaa4c0d8f7dca831-V.jpg' },
    { category: 'bedrooms', src: '/images/bedrooms/IMG-c357bb64dc09ed967a844ee7028df10e-V.jpg' },
    { category: 'bedrooms', src: '/images/bedrooms/IMG-c5909fda6c0b03f5042a47914a8018b5-V.jpg' },
    { category: 'bedrooms', src: '/images/bedrooms/IMG-d07ee126ef37cab57604d61a8d061474-V.jpg' },
    { category: 'bedrooms', src: '/images/bedrooms/IMG-d751f2152360ac880bb114dc3dbd78c1-V.jpg' },
    { category: 'bedrooms', src: '/images/bedrooms/IMG-e398ccba3f72f6b9fa1b7747e62e1e7e-V.jpg' },
    { category: 'bedrooms', src: '/images/bedrooms/IMG-f6651c70b8001261508fd16dff0ffca8-V.jpg' },
    { category: 'entrance', src: '/images/entrance/IMG-b193d7c887fd7db14447846bf49d32f5-V.jpg' },
    { category: 'entrance', src: '/images/entrance/IMG-d78ff619a3942cd9ce86e690f1e52376-V.jpg' },
    { category: 'entrance', src: '/images/entrance/IMG-d270c53a64932d63e350a079add2f396-V.jpg' },
    { category: 'floors', src: '/images/floors/IMG-7735e9f2d00f7c7f4e20095f52f1247c-V.jpg' },
    { category: 'floors', src: '/images/floors/IMG-27820feb1cda83edd550bd7b3d61525c-V.jpg' },
    { category: 'floors', src: '/images/floors/IMG-039515f18d505f32931a434a5fc8e91d-V.jpg' },
    { category: 'floors', src: '/images/floors/IMG-48623f659146cc52a82dc9e2fb3e149e-V.jpg' },
    { category: 'floors', src: '/images/floors/IMG-548381a248238112a21b9e94bca30836-V.jpg' },
    { category: 'floors', src: '/images/floors/IMG-852027fcc9300e1eb2a7315da4619e99-V.jpg' },
    { category: 'floors', src: '/images/floors/IMG-32085845d0da0a07abb8202d4c8c468f-V.jpg' },
    { category: 'floors', src: '/images/floors/IMG-63166584748f7c4145f8eacd5fe5f7f6-V.jpg' },
    { category: 'floors', src: '/images/floors/IMG-f0ebdfbb063b78ecfc0fa8b1d1e6eb81-V.jpg' },
    { category: 'floors', src: '/images/floors/IMG-f9b6ce83446ff6672325203f464621d0-V.jpg' },
    { category: 'floors', src: '/images/floors/IMG-f051a1ddf037fb41db21fa894d4acbc3-V.jpg' },
    { category: 'kitchens', src: '/images/kitchens/IMG-a20cb49403528a55cf9b781cee765f7e-V.jpg' },
    { category: 'kitchens', src: '/images/kitchens/IMG-b1bcdee0944f580de591f5386d6a024d-V.jpg' },
    { category: 'kitchens', src: '/images/kitchens/IMG-b3ac9d045000ca63f15f446b922f031c-V.jpg' },
    { category: 'kitchens', src: '/images/kitchens/IMG-b4cb908b4d72b9544e13b6b99eba5b7a-V.jpg' },
    { category: 'kitchens', src: '/images/kitchens/IMG-b130cafd414202194f034d3b456662e6-V.jpg' },
    { category: 'kitchens', src: '/images/kitchens/IMG-c354c4331a0294adfdbece5276b17de4-V.jpg' },
    { category: 'kitchens', src: '/images/kitchens/IMG-d12f9ed81a18a1206a57002cccf92c1b-V.jpg' },
    { category: 'kitchens', src: '/images/kitchens/IMG-e78266d02198e27638bc61e7024bb391-V.jpg' },
    { category: 'kitchens', src: '/images/kitchens/IMG-f2c85ef52c8801f0b9104857b83b7216-V.jpg' },
    { category: 'kitchens', src: '/images/kitchens/IMG-fcb4b95a43a7aaf05595735c52355554-V.jpg' },
    { category: 'living rooms', src: '/images/living rooms/IMG-48623f659146cc52a82dc9e2fb3e149e-V.jpg' },
    { category: 'living rooms', src: '/images/living rooms/IMG-0766843bfd81809836554c7921b645b4-V.jpg' },
    { category: 'living rooms', src: '/images/living rooms/IMG-20583251f61ea0b6b27da765370800bc-V.jpg' },
    { category: 'living rooms', src: '/images/living rooms/IMG-32085845d0da0a07abb8202d4c8c468f-V.jpg' },
    { category: 'living rooms', src: '/images/living rooms/IMG-63166584748f7c4145f8eacd5fe5f7f6-V.jpg' },
    { category: 'living rooms', src: '/images/living rooms/IMG-bddff51f750d84506b5c3aa4b377022c-V.jpg' },
    { category: 'living rooms', src: '/images/living rooms/IMG-dc0f8984debe61ae01cf93d56f906511-V.jpg' },
    { category: 'living rooms', src: '/images/living rooms/IMG-e048a7a2eb81b431efe6f2872daa8177-V.jpg' },
    { category: 'living rooms', src: '/images/living rooms/IMG-e60b23d589e5702069b6c9d3bc2ba605-V.jpg' },
    { category: 'living rooms', src: '/images/living rooms/IMG-e14748f804fce5eeef7c0d644ab452b5-V.jpg' },
    { category: 'living rooms', src: '/images/living rooms/IMG-f0ebdfbb063b78ecfc0fa8b1d1e6eb81-V.jpg' },
];

// --- Data: Featured Images for the "All" view ---
const featuredImages = [
    { category: 'all', src: '/images/All/IMG-7735e9f2d00f7c7f4e20095f52f1247c-V.jpg' },
    { category: 'all', src: '/images/All/IMG-c3c7a3fd1623ff660f6e36d30ce0b8a1-V.jpg' },
    { category: 'all', src: '/images/All/IMG-c354c4331a0294adfdbece5276b17de4-V.jpg' },
    { category: 'all', src: '/images/All/IMG-d78ff619a3942cd9ce86e690f1e52376-V.jpg' },
    { category: 'all', src: '/images/All/IMG-d751f2152360ac880bb114dc3dbd78c1-V.jpg' },
    { category: 'all', src: '/images/All/IMG-e14748f804fce5eeef7c0d644ab452b5-V.jpg' },
];

// --- Data: Translations ---
const translations = {
    el: {
        meta_title: "Ολικές Ανακαινίσεις | Βασίλης Μανωλάκης",
        header_name: "ΒΑΣΙΛΗΣ ΜΑΝΩΛΑΚΗΣ",
        nav_services: "Υπηρεσίες",
        nav_portfolio: "Έργα",
        nav_contact: "Επικοινωνία",
        hero_title: "ΟΛΙΚΕΣ ΑΝΑΚΑΙΝΙΣΕΙΣ<br>ΥΨΗΛΩΝ ΠΡΟΔΙΑΓΡΑΦΩΝ",
        hero_subtitle: "Δύο γενιές εμπειρίας από το 1959, με πάθος για την τελειότητα.",
        hero_description: "Ως δεύτερη γενιά στον κατασκευαστικό κλάδο από το 1959, η επιχείρησή μας αναλαμβάνει την πλήρη ανακαίνιση του οικιακού ή επαγγελματικού σας χώρου, μετατρέποντας το όραμά σας σε μία εντυπωσιακή πραγματικότητα.",
        hero_cta: "Περιγράψτε το Έργο σας",
        services_title: "ΠΑΡΕΧΟΥΜΕ ΕΝΑ ΟΛΟΚΛΗΡΩΜΕΝΟ ΠΑΚΕΤΟ ΥΠΗΡΕΣΙΩΝ",
        services_subtitle: "Αναλαμβάνουμε το σύνολο των εργασιών που απαιτεί μία σύγχρονη και ποιοτική ανακαίνιση, προσφέροντάς σας μία ολοκληρωμένη λύση χωρίς άγχος και καθυστερήσεις.",
        service1_title: "Δομικές Εργασίες", service1_desc: "Σοβατίσματα & Τσιμεντοκονίες",
        service2_title: "Δάπεδα & Επενδύσεις", service2_desc: "Τοποθέτηση παντός τύπου πλακιδίων",
        service3_title: "Ξυλουργικές Εργασίες", service3_desc: "Εξειδικευμένες κατασκευές, ντουλάπες, πόρτες",
        service4_title: "Ανακαίνιση Κουζίνας", service4_desc: "Σχεδιασμός και πλήρης κατασκευή",
        service5_title: "Ανακαίνιση Μπάνιου", service5_desc: "Ολική αναμόρφωση με σύγχρονα υλικά",
        service6_title: "Κουφώματα", service6_desc: "Ενεργειακά κουφώματα Αλουμινίου",
        service7_title: "Ηλεκτρολογικές Εγκαταστάσεις", service7_desc: "Πλήρης και ασφαλής εγκατάσταση",
        service8_title: "Υδραυλικές Εγκαταστάσεις", service8_desc: "Αξιόπιστες και σύγχρονες λύσεις",
        portfolio_title: "Η ΚΑΛΥΤΕΡΗ ΑΠΟΔΕΙΞΗ ΕΙΝΑΙ Η ΔΟΥΛΕΙΑ ΜΑΣ",
        portfolio_subtitle: "Η αισθητική και η ποιότητα που μας διακρίνουν αποτυπώνονται σε κάθε έργο που παραδίδουμε. Δείτε ένα μικρό δείγμα της δουλειάς μας, που αναδεικνύει την προσοχή στη λεπτομέρεια.",
        portfolio_cat_all: "Όλα",
        portfolio_cat_bathrooms: "Μπάνια",
        portfolio_cat_bedrooms: "Υπνοδωμάτια",
        portfolio_cat_kitchens: "Κουζίνες",
        portfolio_cat_living_rooms: "Σαλόνια",
        portfolio_cat_floors: "Δάπεδα",
        portfolio_cat_entrance: "Είσοδοι",
        contact_title: "Επικοινωνήστε Μαζί Μου",
        contact_subtitle: "Συμπληρώστε την παρακάτω φόρμα ή μιλήστε απευθείας με τον AI βοηθό μου για άμεση αξιολόγηση του έργου σας.",
        footer_text: "Βασίλης Μανωλάκης. Τηλ:693 728 8572 - MAIL:billmanolaki@gmail.com.",
        chat_title: "AI Βοηθός Ανακαινίσεων",
        intake_title: "AI Ανάλυση Έργου",
        chat_initial_greeting: "Γεια σας! Είμαι ο AI βοηθός του Βασίλη. Πώς μπορώ να βοηθήσω με το έργο σας σήμερα;",
        intake_initial_greeting: "Γεια σας! Είμαι ο εξειδικευμένος βοηθός του Βασίλη για την ανάλυση νέων έργων. Για να σας δώσω την καλύτερη δυνατή βοήθεια, θα σας κάνω μερικές ερωτήσεις. Αρχικά, μπορείτε να μου περιγράψτε το έργο που έχετε στο μυαλό σας;",
        address: "Αναγνωσταρα 5, 17341, Άγιος Δημήτριος, Αθήνα",
        form_name: "Όνομα",
        form_email: "Email",
        form_message: "Μήνυμα",
        form_slide_to_send: "Σύρετε για Αποστολή",
        form_sending: "Αποστολή...",
        form_success: "Το μήνυμά σας εστάλη με επιτυχία!",
        form_error: "Κάτι πήγε στραβά. Προσπαθήστε ξανά.",
        form_validation_error: "Παρακαλώ συμπληρώστε όλα τα πεδία.",
        cookie_text: "Αυτός ο ιστότοπος χρησιμοποιεί cookies για τη βελτίωση της εμπειρίας σας.",
        cookie_got_it: "Κατάλαβα!",
        call_us: "Καλέστε μας",
        welcome_title: "Καλώς ήρθατε!",
        welcome_intro: "Είμαι ο Βασίλης Μανωλάκης. Αφήστε με να σας δείξω πώς να χρησιμοποιήσετε τα εργαλεία AI για να ξεκινήσετε το έργο σας.",
        welcome_intake_title: "Για Λεπτομερή Ανάλυση Έργου",
        welcome_intake_desc: "Κάντε κλικ σε αυτό το κουμπί για να ξεκινήσετε μια λεπτομερή συνομιλία με τον βοηθό μου. Θα σας καθοδηγήσει μέσα από μια σειρά ερωτήσεων για να κατανοήσει πλήρως τις ανάγκες σας.",
        welcome_chat_title: "Για Γρήγορες Ερωτήσεις",
        welcome_chat_desc: "Χρησιμοποιήστε αυτόν τον βοηθό κάτω δεξιά για οποιαδήποτε γρήγορη ερώτηση έχετε σχετικά με τις υπηρεσίες μου ή για γενικές πληροφορίες.",
        welcome_close_button: "Ξεκινήστε"
    },
    en: {
        meta_title: "Total Renovations | Vasilis Manolakis",
        header_name: "VASILIS MANOLAKIS",
        nav_services: "Services",
        nav_portfolio: "Work",
        nav_contact: "Contact",
        hero_title: "HIGH-SPECIFICATION<br>TOTAL RENOVATIONS",
        hero_subtitle: "Two generations of experience since 1959, driven by a passion for perfection.",
        hero_description: "As the second generation in the construction business since 1959, our company undertakes the complete renovation of your residential or commercial space, turning your vision into an impressive reality.",
        hero_cta: "Describe Your Project",
        services_title: "WE PROVIDE A COMPLETE PACKAGE OF SERVICES",
        services_subtitle: "We handle all the tasks required for a modern, high-quality renovation, offering you a complete solution without stress or delays.",
        service1_title: "Structural Works", service1_desc: "Plastering & Cement Screeds",
        service2_title: "Flooring & Tiling", service2_desc: "Installation of all types of tiles",
        service3_title: "Carpentry", service3_desc: "Custom constructions, closets, doors",
        service4_title: "Kitchen Renovation", service4_desc: "Design and complete construction",
        service5_title: "Bathroom Renovation", service5_desc: "Total transformation with modern materials",
        service6_title: "Window & Door Frames", service6_desc: "Energy-efficient aluminum frames",
        service7_title: "Electrical Installations", service7_desc: "Complete and safe installation",
        service8_title: "Plumbing Installations", service8_desc: "Reliable and modern solutions",
        portfolio_title: "OUR WORK IS THE BEST PROOF",
        portfolio_subtitle: "The aesthetic and quality that define us are reflected in every project we deliver. See a small sample of our work, highlighting our attention to detail.",
        portfolio_cat_all: "All",
        portfolio_cat_bathrooms: "Bathrooms",
        portfolio_cat_bedrooms: "Bedrooms",
        portfolio_cat_kitchens: "Kitchens",
        portfolio_cat_living_rooms: "Living Rooms",
        portfolio_cat_floors: "Floors",
        portfolio_cat_entrance: "Entrances",
        contact_title: "Get In Touch",
        contact_subtitle: "Fill out the form below, or talk directly with my AI assistant for an immediate project intake.",
        footer_text: "Vasilis Manolakis. mobil:0030 693 728 8572 - MAIL:billmanolaki@gmail.com.",
        chat_title: "AI Renovation Assistant",
        intake_title: "AI Project Intake",
        chat_initial_greeting: "Hello! I'm Vasilis's AI assistant. How can I help with your project today?",
        intake_initial_greeting: "Hello! I am Vasilis's specialist assistant for new project analysis. To provide the best possible help, I'll ask you a few questions. First, can you describe the project you have in mind?",
        address: "Anagnostara 5, 17341, Agios Dimitrios, Athens",
        form_name: "Name",
        form_email: "Email",
        form_message: "Message",
        form_slide_to_send: "Slide to Send",
        form_sending: "Sending...",
        form_success: "Your message was sent successfully!",
        form_error: "Something went wrong. Please try again.",
        form_validation_error: "Please fill in all fields.",
        cookie_text: "This site uses cookies to enhance your experience.",
        cookie_got_it: "Got it!",
        call_us: "Call Us",
        welcome_title: "Welcome!",
        welcome_intro: "I'm Vasilis Manolakis. Let me quickly show you how to use the AI tools to get your project started.",
        welcome_intake_title: "For Detailed Project Intake",
        welcome_intake_desc: "Click this button to start a detailed conversation with my specialist assistant. It will guide you through a series of questions to fully understand your project needs.",
        welcome_chat_title: "For Quick Questions",
        welcome_chat_desc: "Use the floating assistant in the bottom-right for any quick questions you have about my services or for general inquiries.",
        welcome_close_button: "Get Started"
    }
};

// --- Component: CSS Styles ---
const GlobalStyles = () => (
    <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;800&display=swap');
        
        :root {
            --primary-accent: #3b82f6;
            --primary-accent-dark: #2563eb;
            --subtitle-color: #2dd4bf;
            --bg-dark: #0f172a;
            --bg-card: #1e293b;
            --text-light: #f1f5f9;
            --text-muted: #94a3b8;
            --border-color: #334155;
            --success: #22c55e;
            --error: #ef4444;
            --lightning-glow: #fde047;
        }

        #root { width: 100%; }
        html { scroll-behavior: smooth; }
        body { margin: 0; font-family: 'Inter', sans-serif; background-color: var(--bg-dark); color: var(--text-light); -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
        .container { max-width: 1100px; margin: 0 auto; padding: 0 1.5rem; }
        .header { background-color: var(--bg-dark); border-bottom: 1px solid var(--border-color); position: sticky; top: 0; z-index: 40; }
        .nav { display: flex; justify-content: space-between; align-items: center; height: 100px; transition: height 0.3s ease; }
        .header.scrolled .nav { height: 70px; }
        .header.scrolled { box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .nav-brand { font-size: 1.5rem; font-weight: 800; color: var(--text-light); text-decoration: none; }
        .nav-links { display: flex; align-items: center; gap: 2rem; }
        .nav-links a { color: var(--text-muted); text-decoration: none; transition: color 0.2s; font-weight: 500; position: relative; padding: 5px 0; }
        .nav-links a::after { content: ''; position: absolute; bottom: 0; left: 50%; transform: translateX(-50%); width: 0; height: 2px; background-color: var(--primary-accent); transition: width 0.3s ease-in-out; }
        .nav-links a:hover { color: var(--text-light); }
        .nav-links a:hover::after { width: 100%; }
        .lang-switcher { display: flex; align-items: center; gap: 0.5rem; padding-left: 2rem; border-left: 1px solid var(--border-color); }
        .flag-button { background: none; border: 2px solid transparent; border-radius: 4px; padding: 0; cursor: pointer; transition: all 0.2s; opacity: 0.7; line-height: 0; }
        .flag-button:hover { opacity: 1; transform: scale(1.1); }
        .flag-button.active { opacity: 1; border-color: var(--primary-accent); }
        .flag-icon { width: 32px; height: 24px; border-radius: 2px; display: block; }
        .hamburger-menu { display: none; cursor: pointer; background: none; border: none; padding: 0; }
        main { background-color: var(--bg-dark); }
        .section { padding: 5rem 0; }
        .section-title { font-size: 2.5rem; font-weight: 800; text-align: center; margin-bottom: 1rem; color: var(--text-light); }
        .section-subtitle { font-size: 1.125rem; color: var(--text-muted); max-width: 700px; text-align: center; margin: 0 auto 3rem auto; }
        .hero { padding: 2rem 0; }
        .hero-content { display: flex; align-items: center; justify-content: space-between; gap: 4rem; min-height: calc(100vh - 101px); }
        .hero-text { flex: 1; max-width: 600px; }
        .hero-text .subtitle { color: var(--subtitle-color); font-weight: 700; margin-bottom: 1rem; font-size: 1.1rem; }
        .hero-text h1 { font-size: 3.5rem; font-weight: 800; line-height: 1.1; margin:0; color: var(--text-light); }
        .hero-text .description { font-size: 1.125rem; color: var(--text-muted); max-width: 500px; margin: 1.5rem 0 2rem; }
        .hero-image img { width: 320px; height: 320px; border-radius: 50%; object-fit: cover; border: 4px solid var(--border-color); }
        .cta-button { padding: 1rem 2rem; background-color: var(--primary-accent); color: var(--text-light); font-weight: 700; border-radius: 0.5rem; border: none; cursor: pointer; transition: all 0.2s; }
        .cta-button:hover { background-color: var(--primary-accent-dark); transform: translateY(-2px); }
        .services-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; }
        .service-card { background-color: var(--bg-card); padding: 1px; border-radius: 0.85rem; text-align: center; transition: all 0.3s; position: relative; overflow: hidden; z-index: 1; }
        .service-card::before { content: ''; position: absolute; top: -50%; left: -50%; width: 200%; height: 200%; background: conic-gradient(transparent, var(--lightning-glow), transparent 30%); animation: rotate 4s linear infinite; opacity: 0.6; }
        .service-card:hover { transform: translateY(-5px); }
        .service-card-content { background-color: var(--bg-card); padding: 1.5rem; border-radius: 0.75rem; position: relative; z-index: 2; }
        .service-card h3 { font-size: 1.125rem; font-weight: 700; margin: 0 0 0.5rem; color: var(--text-light); }
        .service-card p { color: var(--text-muted); margin: 0; font-size: 0.9rem; }
        .portfolio-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }
        .portfolio-grid img { width: 100%; height: 250px; object-fit: cover; border-radius: 0.5rem; border: 1px solid var(--border-color); }
        .portfolio-filters { display: flex; justify-content: center; gap: 1rem; margin-bottom: 2.5rem; flex-wrap: wrap; }
        .filter-button { background-color: var(--bg-card); color: var(--text-muted); border: 1px solid var(--border-color); padding: 0.5rem 1rem; border-radius: 999px; cursor: pointer; transition: all 0.2s ease; font-weight: 500; }
        .filter-button:hover { background-color: var(--border-color); color: var(--text-light); }
        .filter-button.active { background-color: var(--primary-accent); color: var(--text-light); border-color: var(--primary-accent); }
        .portfolio-grid-item { opacity: 0; transform: scale(0.9); animation: fadeIn 0.5s forwards; }
        @keyframes fadeIn { to { opacity: 1; transform: scale(1); } }
        .contact-form-container { max-width: 600px; margin: 0 auto; }
        .contact-form { display: flex; flex-direction: column; gap: 1rem; text-align: left; }
        .form-group { display: flex; flex-direction: column; }
        .form-group label { margin-bottom: 0.5rem; font-weight: 500; color: var(--text-muted); }
        .form-group input, .form-group textarea { background-color: var(--bg-card); border: 1px solid var(--border-color); color: var(--text-light); border-radius: 0.5rem; padding: 0.75rem; font-family: 'Inter', sans-serif; font-size: 1rem; }
        .form-group input:focus, .form-group textarea:focus { outline: none; border-color: var(--primary-accent); }
        .form-status { margin-top: 1rem; padding: 0.75rem; border-radius: 0.5rem; text-align: center; }
        .form-status.success { background-color: var(--success); color: var(--text-light); }
        .form-status.error { background-color: var(--error); color: var(--text-light); }
        .slider-submit-container { width: 100%; margin-top: 1rem; }
        .slider-track { width: 100%; height: 50px; background-color: var(--bg-card); border-radius: 25px; position: relative; overflow: hidden; border: 1px solid var(--border-color); user-select: none; }
        .slider-track.disabled { cursor: not-allowed; opacity: 0.6; }
        .slider-progress { position: absolute; left: 0; top: 0; height: 100%; background-color: var(--subtitle-color); border-radius: 25px; opacity: 0.5; }
        .slider-thumb { width: 46px; height: 46px; background-color: var(--subtitle-color); border-radius: 50%; position: absolute; left: 2px; top: 2px; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 5px rgba(0,0,0,0.2); z-index: 2; }
        .slider-text { position: absolute; left: 0; right: 0; top: 50%; transform: translateY(-50%); text-align: center; color: var(--text-muted); font-weight: 500; z-index: 1; transition: opacity 0.2s; }
        .footer { background-color: var(--bg-dark); color: var(--text-muted); padding: 2rem 0; text-align: center; border-top: 1px solid var(--border-color); }
        .footer p { margin: 0 0 1rem 0; }
        .footer-address { display: flex; justify-content: center; align-items: center; gap: 0.5rem; margin-top: 0.5rem; }
        .chatbot-container { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(15, 23, 42, 0.7); z-index: 1010; display: flex; align-items: center; justify-content: center; opacity: 1; transition: opacity 0.3s ease-in-out; padding: 1rem; }
        .chatbot-container.hidden { opacity: 0; pointer-events: none; }
        .chatbot-window { background-color: var(--bg-card); border-radius: 0.75rem; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1); width: 100%; max-width: 420px; height: 100%; max-height: 85vh; display: flex; flex-direction: column; border: 1px solid var(--border-color); transform: scale(0.95); transition: transform 0.3s ease-in-out; }
        .chatbot-container:not(.hidden) .chatbot-window { transform: scale(1); }
        .chatbot-header { background-color: var(--primary-accent); color: var(--text-light); padding: 1rem; border-top-left-radius: 0.75rem; border-top-right-radius: 0.75rem; display: flex; justify-content: space-between; align-items: center; flex-shrink: 0; }
        .chatbot-header h3 { margin: 0; font-size: 1.125rem; }
        .close-chat-btn { background: none; border: none; color: var(--text-light); cursor: pointer; padding: 0.25rem; }
        .chat-messages { flex-grow: 1; padding: 1rem; overflow-y: auto; display: flex; flex-direction: column; gap: 0.5rem; }
        .chat-bubble { max-width: 80%; padding: 10px 15px; border-radius: 20px; opacity: 0; transform: translateY(20px); animation: popIn 0.3s forwards; }
        @keyframes popIn { to { opacity: 1; transform: translateY(0); } }
        .chat-bubble.bot { background-color: var(--border-color); color: var(--text-light); align-self: flex-start; border-bottom-left-radius: 5px; }
        .chat-bubble.user { background-color: var(--primary-accent); color: var(--text-light); align-self: flex-end; border-bottom-right-radius: 5px; }
        .chat-bubble.typing { font-style: italic; color: var(--text-muted); }
        .chat-input-area { padding: 1rem; border-top: 1px solid var(--border-color); flex-shrink: 0; }
        .chat-form { display: flex; gap: 0.5rem; }
        .chat-input { flex-grow: 1; background-color: var(--border-color); border: 1px solid #4b5563; color: var(--text-light); border-radius: 0.5rem; padding: 0.75rem; }
        .chat-submit-btn { background-color: var(--primary-accent); color: var(--text-light); border-radius: 0.5rem; padding: 0 1rem; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; }
        .cookie-bar { position: fixed; bottom: -100px; left: 0; right: 0; background-color: var(--bg-card); color: var(--text-muted); padding: 1rem; display: flex; justify-content: center; align-items: center; gap: 1rem; z-index: 1001; box-shadow: 0 -5px 15px rgba(0,0,0,0.1); transition: bottom 0.5s ease-in-out; }
        .cookie-bar.visible { bottom: 0; }
        .cookie-button { background-color: var(--primary-accent); color: var(--text-light); border: none; padding: 0.5rem 1rem; border-radius: 0.5rem; cursor: pointer; }
        .chatbot-trigger { position: fixed; bottom: 20px; right: 20px; width: 120px; height: 120px; cursor: pointer; z-index: 1000; animation: hop 1.5s ease-in-out infinite; transition: opacity 0.3s, transform 0.3s; }
        .chatbot-trigger.hidden { opacity: 0; transform: scale(0.5); pointer-events: none; }
        .chatbot-trigger:hover { animation-play-state: paused; transform: scale(1.1); }
        .chatbot-trigger img { width: 100%; height: 100%; }
        .call-button {
            position: fixed;
            bottom: 20px;
            left: 20px;
            background-color: var(--success);
            color: var(--text-light);
            width: 60px;
            height: 60px;
            border-radius: 50%;
            border: none;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            cursor: pointer;
            z-index: 1000;
            transition: all 0.3s ease;
        }
        .call-button:hover {
            transform: scale(1.1);
            background-color: #28a745;
        }
        .call-button.hidden {
            opacity: 0;
            transform: scale(0.5);
            pointer-events: none;
        }
        @keyframes hop { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
        @keyframes rotate { 100% { transform: rotate(1turn); } }
        @media (max-width: 992px) {
            .hero-content { flex-direction: column-reverse; text-align: center; gap: 2rem; min-height: auto; padding: 4rem 0; }
            .hero-text { max-width: 100%; } .hero-text .description { margin: 1.5rem auto 2rem; }
            .hero-image img { width: 250px; height: 250px; }
            .services-grid { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 768px) {
            .nav { height: 80px !important; }
            .nav-links { position: fixed; top: 81px; right: -100%; width: 100%; height: calc(100vh - 81px); background-color: var(--bg-dark); flex-direction: column; justify-content: center; gap: 2rem; transition: right 0.3s ease-in-out; }
            .nav-links.open { right: 0; }
            .hamburger-menu { display: block; } .portfolio-grid { grid-template-columns: 1fr; }
            .chatbot-window { max-height: 90vh; }
            .cookie-bar { flex-direction: column; text-align: center; }
            .chatbot-trigger { width: 90px; height: 90px; }
            .call-button { width: 50px; height: 50px; }
        }
    `}</style>
);

// --- Component: Header ---
const Header = ({ lang, setLang, isScrolled }) => {
    const getText = (key) => translations[lang][key];
    const [isMenuOpen, setMenuOpen] = useState(false);

    return (
        <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
            <div className="container">
                <nav className="nav">
                    <a href="#root" className="nav-brand">{getText('header_name')}</a>
                    <div className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
                        <a href="#services" onClick={() => setMenuOpen(false)}>{getText('nav_services')}</a>
                        <a href="#portfolio" onClick={() => setMenuOpen(false)}>{getText('nav_portfolio')}</a>
                        <a href="#contact" onClick={() => setMenuOpen(false)}>{getText('nav_contact')}</a>
                    </div>
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        <div className="lang-switcher">
                            <button aria-label="Switch to Greek" onClick={() => setLang('el')} className={`flag-button ${lang === 'el' ? 'active' : ''}`}>
                                <img src="https://flagcdn.com/w40/gr.png" alt="Greek Flag" className="flag-icon" />
                            </button>
                            <button aria-label="Switch to English" onClick={() => setLang('en')} className={`flag-button ${lang === 'en' ? 'active' : ''}`}>
                                <img src="https://flagcdn.com/w40/gb.png" alt="British Flag" className="flag-icon" />
                            </button>
                        </div>
                        <button className="hamburger-menu" aria-label="Toggle mobile menu" onClick={() => setMenuOpen(!isMenuOpen)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                {isMenuOpen ? <path d="M18 6L6 18M6 6l12 12" /> : <path d="M3 12h18M3 6h18M3 18h18" />}
                            </svg>
                        </button>
                    </div>
                </nav>
            </div>
        </header>
    );
};

// --- Component: Hero ---
const Hero = ({ lang, onStartChat }) => {
    const getText = (key) => translations[lang][key];
    
    return (
        <section id="hero" className="hero container">
            <div className="hero-content">
                <div className="hero-text">
                    <p className="subtitle">{getText('hero_subtitle')}</p>
                    <h1 dangerouslySetInnerHTML={{ __html: getText('hero_title') }} />
                    <p className="description">{getText('hero_description')}</p>
                    <button className="cta-button" onClick={onStartChat}>{getText('hero_cta')}</button>
                </div>
                <div className="hero-image">
                    <img src="/images/vasilis-profile.png" alt="Vasilis Manolakis" />
                </div>
            </div>
        </section>
    );
};

// --- Component: Services ---
const Services = ({ lang }) => {
    const getText = (key) => translations[lang][key];
    const serviceKeys = ['service1', 'service2', 'service3', 'service4', 'service5', 'service6', 'service7', 'service8'];
    
    return (
        <section id="services" className="section container">
            <h2 className="section-title">{getText('services_title')}</h2>
            <p className="section-subtitle">{getText('services_subtitle')}</p>
            <div className="services-grid">
                {serviceKeys.map(key => (
                    <div key={key} className="service-card">
                        <div className="service-card-content">
                            <h3>{getText(`${key}_title`)}</h3>
                            <p>{getText(`${key}_desc`)}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

// --- Component: Portfolio ---
const Portfolio = ({ lang }) => {
    const getText = (key) => translations[lang][key];
    const [activeCategory, setActiveCategory] = useState('all');

    const categories = ['all', 'bathrooms', 'bedrooms', 'kitchens', 'living rooms', 'floors', 'entrance'];

    const displayedImages = useMemo(() => {
        if (activeCategory === 'all') {
            return featuredImages;
        }
        return portfolioImages.filter(image => image.category === activeCategory);
    }, [activeCategory]);

    return (
        <section id="portfolio" className="section container">
            <h2 className="section-title">{getText('portfolio_title')}</h2>
            <p className="section-subtitle">{getText('portfolio_subtitle')}</p>
            
            <div className="portfolio-filters">
                {categories.map(category => (
                    <button 
                        key={category}
                        onClick={() => setActiveCategory(category)}
                        className={`filter-button ${activeCategory === category ? 'active' : ''}`}
                    >
                        {getText(`portfolio_cat_${category.replace(' ', '_')}`)}
                    </button>
                ))}
            </div>

            <div className="portfolio-grid">
                {displayedImages.map((image, index) => (
                    <div key={`${image.src}-${index}`} className="portfolio-grid-item" style={{ animationDelay: `${index * 50}ms` }}>
                         <img src={image.src} alt={`${getText(`portfolio_cat_${image.category.replace(' ', '_')}`)} project ${index + 1}`} />
                    </div>
                ))}
            </div>
        </section>
    );
};


// --- Component: Slide to Send ---
const SlideToSend = ({ onSend, lang, isSubmitting, onInvalidAttempt }) => {
    const getText = (key) => translations[lang][key];
    const [sliderPosition, setSliderPosition] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const sliderRef = useRef(null);

    const handleInteractionStart = useCallback((e) => {
        if (isSubmitting) return;
        setIsDragging(true);
        e.preventDefault();
    }, [isSubmitting]);

    const handleInteractionMove = useCallback((clientX) => {
        if (!isDragging || !sliderRef.current) return;
        const rect = sliderRef.current.getBoundingClientRect();
        const maxPosition = rect.width - 50;
        let newX = clientX - rect.left - 25;
        
        if (newX < 0) newX = 0;
        if (newX > maxPosition) newX = maxPosition;
        
        setSliderPosition(newX);
    }, [isDragging]);

    const handleInteractionEnd = useCallback(() => {
        if (!isDragging || !sliderRef.current) return;
        setIsDragging(false);
        const maxPosition = sliderRef.current.getBoundingClientRect().width - 50;
        if (sliderPosition >= maxPosition - 5) {
            onSend();
        }
        // Always reset if not sent
        if (sliderPosition < maxPosition - 5) {
            setSliderPosition(0);
        }
    }, [isDragging, onSend, sliderPosition]);
    
    useEffect(() => {
        setSliderPosition(0);
    }, [onInvalidAttempt]);


    useEffect(() => {
        const handleMouseMove = (e) => handleInteractionMove(e.clientX);
        const handleMouseUp = () => handleInteractionEnd();
        
        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }
        
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, handleInteractionMove, handleInteractionEnd]);

    const handleTouchMove = (e) => handleInteractionMove(e.touches[0].clientX);

    return (
        <div className="slider-submit-container">
            <div 
                className={`slider-track`}
                ref={sliderRef}
                onMouseDown={handleInteractionStart}
                onTouchStart={handleInteractionStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleInteractionEnd}
            >
                <div className="slider-progress" style={{ width: `${sliderPosition + 50}px` }}></div>
                <div className="slider-thumb" style={{ left: `${sliderPosition}px`, transition: isDragging ? 'none' : 'left 0.2s ease-out' }}>
                     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="var(--bg-dark)" transform="rotate(15)"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
                </div>
                <div className="slider-text" style={{ opacity: 1 - (sliderPosition / 100) }}>
                    {isSubmitting ? getText('form_sending') : getText('form_slide_to_send')}
                </div>
            </div>
        </div>
    );
};

// --- Component: Contact Form ---
const ContactForm = ({ lang }) => {
    const getText = (key) => translations[lang][key];
    const [status, setStatus] = useState({ submitting: false, submitted: false, error: false, validationError: '' });
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [attemptCounter, setAttemptCounter] = useState(0);

    const validateForm = () => {
        const isValid = formData.name.trim() && formData.email.trim() && formData.message.trim() && /\S+@\S+\.\S+/.test(formData.email);
        if (!isValid) {
            setStatus(prev => ({ ...prev, validationError: getText('form_validation_error') }));
            setTimeout(() => {
                setStatus(prev => ({ ...prev, validationError: '' }));
                setAttemptCounter(c => c + 1);
            }, 3000);
        }
        return isValid;
    };

    const handleSubmit = async () => {
        if (status.submitting) return;
        if (!validateForm()) {
            return;
        }

        setStatus({ submitting: true, submitted: false, error: false, validationError: '' });
        try {
            const response = await fetch(EMAIL_API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, formType: 'contact' }),
            });
            setStatus({ submitting: false, submitted: response.ok, error: !response.ok, validationError: '' });
             if (response.ok) {
                setFormData({ name: '', email: '', message: '' });
            }
        } catch (error) {
            setStatus({ submitting: false, submitted: false, error: true, validationError: '' });
        }
    };
    
    useEffect(() => {
        if (status.submitted) {
            const timer = setTimeout(() => {
                setStatus({ submitting: false, submitted: false, error: false, validationError: '' });
                 setAttemptCounter(c => c + 1);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [status.submitted]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    
    return (
        <div className="contact-form-container">
            <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
                <div className="form-group">
                    <label htmlFor="name">{getText('form_name')}</label>
                    <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="email">{getText('form_email')}</label>
                    <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="message">{getText('form_message')}</label>
                    <textarea id="message" name="message" rows="5" value={formData.message} onChange={handleChange} required></textarea>
                </div>
                <SlideToSend onSend={handleSubmit} lang={lang} isSubmitting={status.submitting} onInvalidAttempt={attemptCounter} />
                {status.validationError && <div className="form-status error">{status.validationError}</div>}
                {status.submitted && <div className="form-status success">{getText('form_success')}</div>}
                {status.error && <div className="form-status error">{getText('form_error')}</div>}
            </form>
        </div>
    );
};

// --- Component: Contact ---
const Contact = ({ lang }) => {
    const getText = (key) => translations[lang][key];
    return (
        <section id="contact" className="section container">
             <h2 className="section-title">{getText('contact_title')}</h2>
             <p className="section-subtitle">{getText('contact_subtitle')}</p>
             <ContactForm lang={lang} />
        </section>
    );
};

// --- Component: Footer ---
const Footer = ({ lang }) => {
    const getText = (key) => translations[lang][key];
    return (
        <footer className="footer">
            <p>&copy; {new Date().getFullYear()} {getText('footer_text')}</p>
            <div className="footer-address">
                <svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" fill="currentColor" viewBox="0 0 16 16"><path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/></svg>
                <span>{getText('address')}</span>
            </div>
        </footer>
    );
};

// --- Component: Cookie Bar ---
const CookieBar = ({ isVisible, onAccept, lang }) => {
    const getText = (key) => translations[lang][key];
    
    return (
        <div className={`cookie-bar ${isVisible ? 'visible' : ''}`}>
            <span>{getText('cookie_text')}</span>
            <button className="cookie-button" onClick={onAccept}>{getText('cookie_got_it')}</button>
        </div>
    );
};

// --- Component: Floating Chatbot Trigger ---
const ChatbotTrigger = ({ onClick, isVisible }) => {
    return (
        <div className={`chatbot-trigger ${isVisible ? '' : 'hidden'}`} onClick={onClick}>
            <img src="/images/chatbot-avatar.png" alt="Open Chatbot" />
        </div>
    );
}

// --- Component: Floating Call Button ---
const FloatingCallButton = ({ isVisible, lang }) => {
    const getText = (key) => translations[lang][key];
    return (
        <a href="tel:6937288572" className={`call-button ${isVisible ? '' : 'hidden'}`} aria-label={getText('call_us')}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="currentColor">
                <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1C10.74 21 3 13.25 3 4c0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
            </svg>
        </a>
    );
};

// --- Component: Generic Chatbot (Reusable) ---
const GenericChatbot = ({ lang, isVisible, onClose, initialGreeting, titleKey, apiUrl, formType }) => {
    const [history, setHistory] = useState([]);
    const [isTyping, setIsTyping] = useState(false);
    const [conversationCompleted, setConversationCompleted] = useState(false);
    const chatEndRef = useRef(null);
    const hasSentEmail = useRef(false);

    const sendChatData = useCallback(async (data) => {
        if (hasSentEmail.current) return;
        hasSentEmail.current = true;
        try {
            await fetch(EMAIL_API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...data, formType }),
            });
        } catch (error) {
           console.error(`Error sending ${formType} data:`, error);
        }
    }, [formType]);

    const handleNewChat = useCallback(() => {
        setHistory([{ sender: 'bot', text: initialGreeting }]);
        setConversationCompleted(false);
        hasSentEmail.current = false;
    }, [initialGreeting]);

    useEffect(() => {
        if (isVisible) {
            handleNewChat();
        }
    }, [isVisible, handleNewChat]);
    
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [history, isTyping]);

    const handleUserInput = useCallback(async (userInput) => {
        if (!userInput.trim() || conversationCompleted) return;

        const newUserMessage = { sender: 'user', text: userInput };
        const currentHistory = [...history, newUserMessage];
        setHistory(currentHistory);
        setIsTyping(true);
        
        const geminiHistory = currentHistory.slice(1).map(msg => ({
            role: msg.sender === 'bot' ? 'model' : 'user',
            parts: [{ text: msg.text }],
        }));

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    history: geminiHistory,
                    lang: lang
                }),
            });
            
            if (!response.ok) {
                const errorText = await response.text();
                try {
                    const errorJson = JSON.parse(errorText);
                    throw new Error(errorJson.error || `HTTP error! status: ${response.status}`);
                } catch (e) {
                    throw new Error(`Server returned a non-JSON error: ${response.status} ${response.statusText}`);
                }
            }

            const result = await response.json();
            
            if (result.conversationComplete) {
                setConversationCompleted(true);
                if(result.summary) { // For chat.js which might send a summary
                     sendChatData(result.summary);
                }
            }
            
            setHistory(prev => [...prev, { sender: 'bot', text: result.text }]);
        } catch (error) {
            console.error(`Error with ${formType} API:`, error);
            setHistory(prev => [...prev, { sender: 'bot', text: 'Sorry, an error occurred.' }]);
        } finally {
            setIsTyping(false);
        }
    }, [history, lang, apiUrl, formType, sendChatData, conversationCompleted]);
    
    return (
        <div className={`chatbot-container ${isVisible ? '' : 'hidden'}`} onClick={onClose}>
            <div className="chatbot-window" onClick={(e) => e.stopPropagation()}>
                <div className="chatbot-header">
                    <h3>{translations[lang][titleKey]}</h3>
                    <button className="close-chat-btn" onClick={onClose}>
                        <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" fill="none" viewBox="0 0 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                <div className="chat-messages">
                    {history.map((msg, i) => (
                        <div key={i} className={`chat-bubble ${msg.sender}`} dangerouslySetInnerHTML={{ __html: msg.text.replace(/\n/g, '<br />') }}></div>
                    ))}
                    {isTyping && <div className="chat-bubble bot typing">Typing...</div>}
                    <div ref={chatEndRef} />
                </div>
                <div className="chat-input-area">
                    <form className="chat-form" onSubmit={(e) => {
                        e.preventDefault();
                        const input = e.target.elements.userInput;
                        handleUserInput(input.value);
                        input.value = '';
                    }}>
                        <input name="userInput" type="text" className="chat-input" placeholder="Type your message..." autoComplete="off" disabled={isTyping || conversationCompleted} />
                        <button type="submit" className="chat-submit-btn" disabled={isTyping || conversationCompleted}>
                            <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" viewBox="0 0 24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

// --- Component: Welcome Modal ---
const WelcomeModal = ({ isVisible, onClose, translations }) => {
    if (!isVisible) return null;

    const modalStyle = {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(15, 23, 42, 0.85)',
        zIndex: 2000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        backdropFilter: 'blur(5px)',
    };

    const modalContentStyle = {
        backgroundColor: 'var(--bg-card)',
        color: 'var(--text-light)',
        padding: '2.5rem',
        borderRadius: '1rem',
        width: '100%',
        maxWidth: '650px',
        border: '1px solid var(--border-color)',
        boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
        textAlign: 'center',
        animation: 'fadeInScale 0.4s ease-out forwards',
    };
    
    const keyframes = `
        @keyframes fadeInScale {
            from { opacity: 0; transform: scale(0.9); }
            to { opacity: 1; transform: scale(1); }
        }
    `;

    return (
        <>
            <style>{keyframes}</style>
            <div style={modalStyle} onClick={onClose}>
                <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
                    <h2 style={{ color: 'var(--subtitle-color)', fontSize: '2rem', marginBottom: '1rem' }}>
                        {translations.welcome_title}
                    </h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '500px', margin: '0 auto 2.5rem auto' }}>
                        {translations.welcome_intro}
                    </p>

                    <div style={{ display: 'flex', gap: '2rem', textAlign: 'left' }}>
                        <div style={{ flex: 1 }}>
                            <div style={{ 
                                padding: '1rem', 
                                backgroundColor: 'var(--primary-accent)', 
                                borderRadius: '0.5rem',
                                color: 'var(--text-light)',
                                fontWeight: '700',
                                marginBottom: '1rem',
                                display: 'inline-block'
                            }}>
                               {translations.hero_cta}
                            </div>
                            <h3 style={{ marginBottom: '0.5rem' }}>{translations.welcome_intake_title}</h3>
                            <p style={{ color: 'var(--text-muted)', margin: 0 }}>
                                {translations.welcome_intake_desc}
                            </p>
                        </div>
                        
                        <div style={{ flex: 1 }}>
                            <img 
                                src="/images/chatbot-avatar.png" 
                                alt="Chatbot Assistant" 
                                style={{ 
                                    width: '60px', 
                                    height: '60px', 
                                    marginBottom: '1rem',
                                    border: '2px solid var(--border-color)',
                                    borderRadius: '50%'
                                }} 
                            />
                            <h3 style={{ marginBottom: '0.5rem' }}>{translations.welcome_chat_title}</h3>
                            <p style={{ color: 'var(--text-muted)', margin: 0 }}>
                                {translations.welcome_chat_desc}
                            </p>
                        </div>
                    </div>

                    <button 
                        onClick={onClose}
                        style={{
                            marginTop: '3rem',
                            padding: '0.75rem 2.5rem',
                            backgroundColor: 'var(--primary-accent)',
                            color: 'var(--text-light)',
                            fontWeight: '700',
                            borderRadius: '0.5rem',
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                        }}
                    >
                        {translations.welcome_close_button}
                    </button>
                </div>
            </div>
        </>
    );
};

// --- Main App Component ---
export default function App() {
    const [language, setLanguage] = useState('el');
    const [isChatbotVisible, setChatbotVisible] = useState(false);
    const [isIntakeVisible, setIntakeVisible] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [showCookieBar, setShowCookieBar] = useState(false);
    const [showWelcomeModal, setShowWelcomeModal] = useState(false);
    const [toneLoaded, setToneLoaded] = useState(false);

     useEffect(() => {
        const script = document.createElement('script');
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/tone/14.7.77/Tone.js";
        script.async = true;
        script.onload = () => setToneLoaded(true);
        document.body.appendChild(script);

        return () => {
            if (script.parentNode) {
                script.parentNode.removeChild(script);
            }
        }
    }, []);
    
    // Logic for the Welcome Modal
    useEffect(() => {
        try {
            const hasVisited = localStorage.getItem('hasVisitedBefore');
            if (!hasVisited) {
                // Use a short delay to ensure the page has rendered before showing the modal
                const timer = setTimeout(() => {
                    setShowWelcomeModal(true);
                }, 1500);
                return () => clearTimeout(timer);
            }
        } catch (e) {
            console.error("Could not access localStorage. Welcome modal will not be shown.", e);
        }
    }, []);

    const handleCloseWelcomeModal = useCallback(() => {
        setShowWelcomeModal(false);
        try {
            localStorage.setItem('hasVisitedBefore', 'true');
        } catch (e) {
            console.error("Could not save to localStorage", e);
        }
    }, []);

    const handleAcceptCookies = useCallback(() => {
        setShowCookieBar(false);
        try {
            localStorage.setItem('cookiesAccepted', 'true');
        } catch (e) {
            console.error("Could not save to localStorage", e);
        }
    }, []);
    
    // Logic for the Cookie Bar
    useEffect(() => {
        let accepted = false;
        try {
            accepted = localStorage.getItem('cookiesAccepted');
        } catch (e) {
            console.error("Could not read from localStorage", e);
        }
        
        if (!accepted) {
            const showTimer = setTimeout(() => {
                setShowCookieBar(true);
            }, 2000); 

            const hideTimer = setTimeout(() => {
                setShowCookieBar(false);
            }, 8000); 
            
            return () => {
                clearTimeout(showTimer);
                clearTimeout(hideTimer);
            };
        }
    }, []);

    // Logic for scrolled header
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Logic for setting page language and title
    useEffect(() => {
        document.documentElement.lang = language;
        document.title = translations[language].meta_title;
    }, [language]);

    const closeChatbot = useCallback(() => setChatbotVisible(false), []);
    const closeIntake = useCallback(() => setIntakeVisible(false), []);

    const getScopedTranslations = (lang) => {
        const allKeys = translations[lang];
        return {
            welcome_title: allKeys.welcome_title,
            welcome_intro: allKeys.welcome_intro,
            hero_cta: allKeys.hero_cta, // Pass the button text
            welcome_intake_title: allKeys.welcome_intake_title,
            welcome_intake_desc: allKeys.welcome_intake_desc,
            welcome_chat_title: allKeys.welcome_chat_title,
            welcome_chat_desc: allKeys.welcome_chat_desc,
            welcome_close_button: allKeys.welcome_close_button,
        };
    };

    return (
        <>
            <GlobalStyles />
            <WelcomeModal 
                isVisible={showWelcomeModal} 
                onClose={handleCloseWelcomeModal} 
                translations={getScopedTranslations(language)}
            />
            <Header lang={language} setLang={setLanguage} isScrolled={isScrolled} />
            <main>
                <Hero lang={language} onStartChat={() => setIntakeVisible(true)} />
                <Services lang={language} />
                <Portfolio lang={language} />
                <Contact lang={language} />
            </main>
            <Footer lang={language} />
            
            <ChatbotTrigger onClick={() => setChatbotVisible(true)} isVisible={!isChatbotVisible && !showCookieBar && !isIntakeVisible && !showWelcomeModal} />
            <FloatingCallButton isVisible={!isChatbotVisible && !isIntakeVisible && !showCookieBar && !showWelcomeModal} lang={language} />

            {toneLoaded && <GenericChatbot 
                lang={language} 
                isVisible={isChatbotVisible} 
                onClose={closeChatbot}
                initialGreeting={translations[language].chat_initial_greeting}
                titleKey="chat_title"
                apiUrl={CHAT_API_URL}
                formType="chatbot"
             />}

            {toneLoaded && <GenericChatbot 
                lang={language} 
                isVisible={isIntakeVisible} 
                onClose={closeIntake}
                initialGreeting={translations[language].intake_initial_greeting}
                titleKey="intake_title"
                apiUrl={INTAKE_API_URL}
                formType="intake"
             />}

            <CookieBar isVisible={showCookieBar} onAccept={handleAcceptCookies} lang={language} />
        </>
    );
}

