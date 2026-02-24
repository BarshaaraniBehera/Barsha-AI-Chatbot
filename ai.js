const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');
const clearChatButton = document.getElementById('clear-chat');
const themeToggle = document.getElementById('theme-toggle');
const loginButton = document.getElementById('login-button');
const loginContainer = document.getElementById('login-container');
const chatContainer = document.getElementById('chat-container');
const loginError = document.getElementById('login-error');
const voiceInputButton = document.getElementById('voice-input');
const emojiButton = document.getElementById('emoji-button');
const emojiPicker = document.getElementById('emoji-picker');

const API_KEY = 'AIzaSyBkJdjSdT9xRSBQjofirpaUhet6pPPQMOw'; // Store API key securely
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`;

// Load chat history from localStorage
function loadChatHistory() {
    const chatHistory = JSON.parse(localStorage.getItem("chatHistory")) || [];
    chatHistory.forEach(({ sender, message }) => {
        chatMessages.innerHTML += `<div class="${sender}-message">${message}</div>`;
    });
}

// Save chat messages to localStorage
function saveMessage(sender, message) {
    let chatHistory = JSON.parse(localStorage.getItem("chatHistory")) || [];
    chatHistory.push({ sender, message });
    localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
}

// Send message function
async function sendMessage() {
    const userMessage = userInput.value.trim();
    if (!userMessage) return;

    chatMessages.innerHTML += `<div class="user-message">${userMessage}</div>`;
    saveMessage("user", userMessage);
    userInput.value = '';

    const botMessage = await generateResponse(userMessage);
    chatMessages.innerHTML += `<div class="bot-message">${botMessage}</div>`;
    saveMessage("bot", botMessage);
}

// AI Response Fetching
async function generateResponse(prompt) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });

        if (!response.ok) throw new Error('Failed to fetch response');

        const data = await response.json();
        return data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm sorry, I couldn't generate a response.";
    } catch (error) {
        console.error('Error fetching AI response:', error);
        return "Error: Unable to connect to AI service.";
    }
}

// Clear Chat History
clearChatButton.addEventListener("click", () => {
    chatMessages.innerHTML = "";
    localStorage.removeItem("chatHistory");
});

// Theme Toggle
themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
});

// Login Validation
loginButton.addEventListener('click', () => {
    if (document.getElementById('username').value === "Ai_advisor" &&
        document.getElementById('password').value === "123456789") {
        loginContainer.classList.add('hidden');
        chatContainer.classList.remove('hidden');
        loadChatHistory(); // Load chat history after login
    } else {
        loginError.classList.remove('hidden');
    }
});

// Send Message Event
sendButton.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', (event) => {
    if (event.key === "Enter") sendMessage();
});

// Voice Input
voiceInputButton.addEventListener("click", () => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
        userInput.value = event.results[0][0].transcript;
    };
    recognition.start();
});

emojiButton.addEventListener("click", () => {
    const emojiList = ["😀", "😂", "😍", "👍", "🙌", "💡", "🎉", "🤖"];
    const randomEmoji = emojiList[Math.floor(Math.random() * emojiList.length)];
    userInput.value += randomEmoji; // Add emoji to the input field
});


// Load chat history on page load
window.addEventListener("load", loadChatHistory);
