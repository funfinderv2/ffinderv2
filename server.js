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
io.on('connection', (socket) => {
  console.log('🔌 Usuário conectado:', socket.id);

  socket.on('chat message', (msg) => {
    console.log('📨 Nova mensagem recebida:', msg); // 👈 Adicione isto para logar

    io.emit('chat message', msg);
  });

  socket.on('disconnect', () => {
    console.log('⛔ Usuário desconectado:', socket.id);
  });
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
