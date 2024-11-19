const socket = io('http://localhost:8000');

const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector('.container');

const name = prompt('Enter your name to join');
socket.emit('new-user-joined', name);

// Function to append messages to the container
function appendMessage(message, sender) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    messageElement.classList.add(sender === 'you' ? 'right' : 'left');
    messageElement.innerHTML = `${sender}: ${message}`;
    messageContainer.append(messageElement);
}

// Emit a 'send' event when the form is submitted
form.addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent the page from reloading
    const message = messageInput.value;
    if (message) {
        socket.emit('send', message); // Send message to the server
        appendMessage(message, 'you'); // Display the sent message
        messageInput.value = ''; // Clear the input field
    }
});

// Listen for incoming messages
socket.on('receive', (data) => {
    appendMessage(data.message, data.name);
});

// Listen for when a new user joins
socket.on('user-joined', (name) => {
    appendMessage(`${name} has joined the chat.`, 'system');
});

// Get the delete button
const clearChatBtn = document.getElementById('clearChatBtn');

// Get the chat container element (replace 'chat-container' with your actual container's id)
const chatContainer = document.getElementById('chatContainer');

// Event listener for the "Clear Chat" button
clearChatBtn.addEventListener('click', () => {
    // Clear chat container content
    chatContainer.innerHTML = ''; // This will remove all messages in the chat
    
    // Emit event to the server to notify all users
    socket.emit('clear-chats');
});
