// 🔑 PUT YOUR OPENAI API KEY HERE
// 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
const OPENAI_API_KEY = "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";

// 🧠 SYSTEM PROMPT (RULES + PERSONALITY)
const SYSTEM_PROMPT = `
You are a friendly but very focused troubleshooting assistant
for ONE specific home music studio setup.

The user is a non-technical musician.
They may feel frustrated, confused, or blocked.
Your job is to help them calmly and efficiently.

You ONLY support this setup.

RULES:
- Only answer questions related to this setup.
- Use simple, human language.
- Avoid jargon unless explained.
- Prefer short step-by-step instructions.
- Use the numbered item names exactly.
- Never be condescending.
- If the user asks something unrelated, politely refuse.

TONE:
- calm
- reassuring
- slightly playful
`;

// 🎛️ SETUP CONTEXT (FACTS ABOUT HER STUDIO)
const SETUP_CONTEXT = `
HARDWARE (numbered):
- 🎤 Microphone (1): t-bone 440 USB
- 🔌 iPad Adapter (2): Apple Lightning to USB Camera Adapter
- 🎹 Midi (3): Impact GX Mini
- 🧩 Hub (4): USB Hub (4 ports)
- 🔗 Midi Cable (5): USB cables for mic and midi

DEVICES:
- iPad 8 (Lightning)
- HP laptop with Windows 11

SOFTWARE:
- GarageBand on iPad
- Cubase LE on Windows

KNOWN FACTS:
- GarageBand should be opened AFTER plugging everything in.
- Midi (3) never makes sound without a software instrument.
- In Cubase, tracks must be armed (red button) to record.
- Microphone (1) is a USB mic and acts as its own audio interface.
- Hub (4) does not affect sound quality.
- If Cubase records but no sound is heard, output device is likely wrong.
`;

const chat = document.getElementById("chat");
const input = document.getElementById("user-input");
const button = document.getElementById("send-btn");

button.addEventListener("click", sendMessage);
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendMessage();
});

function addMessage(text, className) {
  const div = document.createElement("div");
  div.className = `message ${className}`;
  div.textContent = text;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

async function sendMessage() {
  const userText = input.value.trim();
  if (!userText) return;

  addMessage(userText, "user");
  input.value = "";

  addMessage("assistant is thinking…", "bot");

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: "gpt-4.1-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "system", content: SETUP_CONTEXT },
        { role: "user", content: userText }
      ]
    })
  });

  const data = await response.json();
  chat.lastChild.remove();

  const reply = data.choices?.[0]?.message?.content || "something went wrong.";
  addMessage(reply, "bot");
}
