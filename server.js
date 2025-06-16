const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

// Evento de conexão
const socket = io("https://funfinder-socket.onrender.com");

socket.on("connect", () => {
  console.log("🟢 Socket conectado:", socket.id);
});

socket.on("chat message", (msg) => {
  if (msg.to == window.currentUserId) {
    console.log("🔔 Nova mensagem recebida:", msg);

    // Aqui você pode disparar um popup, badge ou som
    showPopup(msg);
  }
});



const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`✅ Servidor Socket.io no ar na porta ${PORT}`);
});
app.use(express.json());

app.post('/api/message', (req, res) => {
  const { from, to, message } = req.body;
  io.emit("chat message", { from, to, message });
  res.sendStatus(200);
});
