const express = require("express");
const path = require("path");

const app = express();
const server = require("http").createServer(app); //http configurado
const io = require("socket.io")(server); //websocket

app.use(express.static(path.join(__dirname, "public"))); //fazer o front aqui
app.set("views", path.join(__dirname, "public"));
app.engine("html", require("ejs").renderFile); //usar html no node
app.set("view engine", "html");

app.use("/", (req, res) => {
  res.render("index.html");
});

let messages = [];

io.on('connection', socket => {
    console.log(`Socket Conectado: ${socket.id}`);

    socket.emit('previousMessages', messages) //mesmo com o refresh as mensagens ficam salvas

    socket.on('sendMessage', data => {
        messages.push(data);
        socket.broadcast.emit('receivedMenssage', data);
    }) //mesmo metodo do frontEnd, recebe no BackEnd
})


server.listen(3001);


//o socket tem tres eventos
//socket.emit() : enviaruma mensagem pra um socket
//socket.on() ouvir uma mensagem 
//socket.broadcast.emit() //enviar pra todos os sockets conectados na aplicação