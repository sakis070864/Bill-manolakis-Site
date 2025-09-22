import React, { useState, useEffect } from 'react';

// A reusable Modal component to avoid writing the same styles twice.
// This keeps all the new UI code within this single file.
const Modal = ({ children, onClose }) => {
    const modalOverlayStyle = {
        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
        backgroundColor: 'rgba(15, 23, 42, 0.85)', zIndex: 2000,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        backdropFilter: 'blur(5px)',
        animation: 'fadeIn 0.2s ease-out'
    };
    const modalContentStyle = {
        backgroundColor: '#1e293b', color: '#f1f5f9', padding: '2rem',
        borderRadius: '0.75rem', width: '100%', maxWidth: '550px',
        border: '1px solid #334155', boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
        animation: 'scaleUp 0.2s ease-out'
    };
    const keyframes = `
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleUp { from { transform: scale(0.95); } to { transform: scale(1); } }
    `;

    return (
        <>
            <style>{keyframes}</style>
            <div style={modalOverlayStyle} onClick={onClose}>
                <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
                    {children}
                </div>
            </div>
        </>
    );
};

// This is the main component that manages the logic for this feature.
export default function InternalInfo({ isVisible, onClose }) {
    const [internalKey, setInternalKey] = useState('');
    const [passwordInput, setPasswordInput] = useState('');
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [showInfoDisplay, setShowInfoDisplay] = useState(false);

    // This effect runs when the "Internal" link is clicked (isVisible becomes true).
    useEffect(() => {
        if (isVisible) {
            // Reset state from any previous attempt and show the password prompt.
            setShowInfoDisplay(false);
            setPasswordInput('');
            setShowPasswordModal(true);

            // Fetch the correct password from our secure API endpoint.
            fetch('/api/internal-key')
                .then(res => {
                    if (!res.ok) throw new Error('Network response was not ok');
                    return res.json();
                })
                .then(data => {
                    if (data.key) {
                        setInternalKey(data.key);
                    }
                })
                .catch(err => console.error("Failed to fetch internal key:", err));
        } else {
            // Hide everything if the component is told to close.
            setShowPasswordModal(false);
            setShowInfoDisplay(false);
        }
    }, [isVisible]);

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        // Check if the user's input matches the key we fetched from the API.
        if (passwordInput === internalKey && internalKey !== '') {
            // If correct, hide the password modal and show the info display.
            setShowPasswordModal(false);
            setShowInfoDisplay(true);
        } else {
            // If incorrect, close everything immediately as requested.
            onClose();
        }
    };

    // Don't render anything if the feature is not active.
    if (!isVisible) {
        return null;
    }

    return (
        <>
            {/* RENDER THE PASSWORD MODAL */}
            {showPasswordModal && (
                <Modal onClose={onClose}>
                    <h2 style={{ marginTop: 0, color: '#94a3b8' }}>Internal Access</h2>
                    <p>Please enter the password to view project details.</p>
                    <form onSubmit={handlePasswordSubmit}>
                        <input
                            type="password"
                            value={passwordInput}
                            onChange={(e) => setPasswordInput(e.target.value)}
                            autoFocus
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#f1f5f9', boxSizing: 'border-box' }}
                        />
                        <button type="submit" style={{ width: '100%', padding: '0.75rem', marginTop: '1rem', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '0.5rem', cursor: 'pointer' }}>
                            Authenticate
                        </button>
                    </form>
                </Modal>
            )}

            {/* RENDER THE INFORMATION DISPLAY MODAL (only after successful auth) */}
            {showInfoDisplay && (
                <Modal onClose={onClose}>
                    <h2 style={{ marginTop: 0, color: '#2dd4bf' }}>Internal Project Information</h2>
                    <div style={{ lineHeight: '1.6' }}>
                        <h3 style={{ borderBottom: '1px solid #334155', paddingBottom: '0.5rem' }}>Source Code</h3>
                        <p><strong>GitHub Repo:</strong> <code style={{ backgroundColor: '#0f172a', padding: '2px 6px', borderRadius: '4px' }}>sakis070864/Bill-manolakis-Site</code></p>

                        <h3 style={{ borderBottom: '1px solid #334155', paddingBottom: '0.5rem' }}>Deployment & Credentials</h3>
                        <p><strong>Platform:</strong> Vercel</p>
                        <p><strong>Vercel / Google Login:</strong> <code style={{ backgroundColor: '#0f172a', padding: '2px 6px', borderRadius: '4px' }}>billmanolaki@gmail.com</code></p>
                        <p><strong>Vercel / Google Password:</strong> <code style={{ backgroundColor: '#0f172a', padding: '2px 6px', borderRadius: '4px' }}>billmanolaki1969@gmail.com</code></p>
                        
                        <h3 style={{ borderBottom: '1px solid #334155', paddingBottom: '0.5rem' }}>API Keys</h3>
                        <p>The Google Gemini API keys are located in the Google Cloud project associated with the account above.</p>

                        <h3 style={{ borderBottom: '1px solid #334155', paddingBottom: '0.5rem' }}>Key Files</h3>
                        <ul style={{ paddingLeft: '20px' }}>
                            <li><strong>App.jsx:</strong> Main front-end React component.</li>
                            <li><strong>api/chat.js:</strong> Powers the general-purpose chatbot.</li>
                            <li><strong>api/intake.js:</strong> Powers the "Describe your project" intake bot.</li>
                            <li><strong>api/send-email.js:</strong> Sends email from the contact form.</li>
                        </ul>
                    </div>
                     <button onClick={onClose} style={{ width: '100%', padding: '0.75rem', marginTop: '1rem', backgroundColor: '#94a3b8', color: '#0f172a', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: 'bold' }}>
                        Close
                    </button>
                </Modal>
            )}
        </>
    );
}
