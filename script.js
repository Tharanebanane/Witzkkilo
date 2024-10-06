// Dummy-Benutzername und Passwort (werden durch Registrierung gesetzt)
let registeredUser = { username: "", password: "" };

// Zähler für fehlgeschlagene Anmeldeversuche
let loginAttempts = 0;
const maxAttempts = 5;

// Anmeldefunktion
function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const loginError = document.getElementById("loginError");

    // Überprüfung, ob der Benutzer die maximale Anzahl an Versuchen erreicht hat
    if (loginAttempts >= maxAttempts) {
        document.body.style.backgroundColor = "red";
        document.title = "Zu viele Fehlversuche!";
        loginError.textContent = "Du hast zu viele Fehlversuche gemacht!";
        return;
    }

    // Daten aus dem LocalStorage laden
    let storedUser = JSON.parse(localStorage.getItem("registeredUser"));

    // Überprüfung der Anmeldeinformationen mit den gespeicherten Werten
    if (storedUser && username === storedUser.username && password === storedUser.password) {
        document.getElementById("loginForm").style.display = "none";
        document.getElementById("mainContent").style.display = "block";
        loginError.textContent = ""; // Fehlernachricht zurücksetzen
        loginAttempts = 0; // Fehlversuche zurücksetzen nach erfolgreicher Anmeldung
    } else {
        loginAttempts++;
        loginError.textContent = "Falscher Benutzername oder Passwort!";
    }

    // Zeige an, wie viele Versuche noch übrig sind
    if (loginAttempts < maxAttempts) {
        loginError.textContent += ` (${maxAttempts - loginAttempts} Versuche übrig)`;
    }
}

// Registrierungsfunktion
function register() {
    const newUsername = document.getElementById("newUsername").value;
    const newPassword = document.getElementById("newPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const registerError = document.getElementById("registerError");

    // Überprüfung, ob die Passwörter übereinstimmen
    if (newPassword !== confirmPassword) {
        registerError.textContent = "Passwörter stimmen nicht überein!";
        return;
    }

    // Benutzerinformationen im LocalStorage speichern
    let newUser = {
        username: newUsername,
        password: newPassword
    };

    localStorage.setItem("registeredUser", JSON.stringify(newUser));

    // Registrierung erfolgreich, Formular verbergen und Anmeldeseite anzeigen
    document.getElementById("registerForm").style.display = "none";
    document.getElementById("loginForm").style.display = "block";
    registerError.textContent = ""; // Fehlernachricht zurücksetzen
}

// Funktion zum Anzeigen des Registrierungsformulars
function showRegister() {
    document.getElementById("loginForm").style.display = "none";
    document.getElementById("registerForm").style.display = "block";
}

// Abmeldefunktion
function logout() {
    document.getElementById("mainContent").style.display = "none";
    document.getElementById("loginForm").style.display = "block";
}

// Funktion zum Anzeigen des Chatbots
function showChatbot() {
    document.getElementById("mainContent").style.display = "none";
    document.getElementById("chatbot").style.display = "block";
}

// Funktion zum Schließen des Chatbots
function closeChatbot() {
    document.getElementById("chatbot").style.display = "none";
    document.getElementById("mainContent").style.display = "block";
}

// Funktion zum Senden von Nachrichten im Chatbot mit OpenAI API
async function sendMessage() {
    const chatInput = document.getElementById("chatInput").value;
    const chatOutput = document.getElementById("chatOutput");

    if (chatInput.trim() === "") return;

    // Zeige Benutzer-Eingabe im Chat-Bereich
    chatOutput.innerHTML += `<p><strong>Du:</strong> ${chatInput}</p>`;

    // Sende die Anfrage an die OpenAI API
    const botResponse = await getBotResponseFromAPI(chatInput);

    // Zeige die Antwort des Bots
    chatOutput.innerHTML += `<p><strong>Chatbot:</strong> ${botResponse}</p>`;

    // Leere das Eingabefeld
    document.getElementById("chatInput").value = "";

    // Scrollen nach unten, damit die neueste Nachricht sichtbar ist
    chatOutput.scrollTop = chatOutput.scrollHeight;
}

async function getBotResponseFromAPI(input) {
    const apiKey = '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';
    const apiUrl = 'https://api.openai.com/v1/chat/completions';

    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo", // Verwende das gewünschte Modell
            messages: [{ role: "user", content: input }],
            max_tokens: 150 // Begrenze die Länge der Antwort
        })
    });

    const data = await response.json();
    return data.choices[0].message.content; // Rückgabe der KI-Antwort
}
