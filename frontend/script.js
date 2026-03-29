let conversationId = null;

async function sendMessage() {
  const input = document.getElementById("userInput");
  const message = input.value;

  if (!message) return;

  // Show user message
  addMessage("You", message);

  input.value = "";

  try {
    const response = await fetch("http://localhost:5000/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: message,
        conversationId: conversationId
      })
    });

    const data = await response.json();

    // Save conversation ID
    conversationId = data.conversationId;

    // Show AI response
    addMessage("AI", data.reply);

  } catch (error) {
    console.error(error);
    addMessage("AI", "Error connecting to server");
  }
}

// Function to display messages
function addMessage(sender, text) {
  const chatBox = document.getElementById("chatBox");

  const messageDiv = document.createElement("div");
  messageDiv.classList.add("message");

  if (sender === "You") {
    messageDiv.classList.add("user");
  } else {
    messageDiv.classList.add("ai");
  }

  messageDiv.innerText = text;

  chatBox.appendChild(messageDiv);

  // Auto scroll
  chatBox.scrollTop = chatBox.scrollHeight;
}