import express from 'express'
import handlebars from 'express-handlebars'
import { Server } from 'socket.io'

import { apiRouter } from "./routes/api.router.js";
import { webRouter } from "./routes/web.router.js";
import { productsManager } from './dao/mongodb/mongodb.js';
import { messagesManager } from './dao/mongodb/mongodb.js';
export const BASE_URL = "http://localhost:8080";
const app = express();

app.engine("handlebars", handlebars.engine());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const server = app.listen(8080, () => {
  console.log(`Conectado: ${BASE_URL}`);
});


const webSocketServer = new Server(server);


app.use(express.static("public"));
app.use(express.static("views"));
app.use(express.static("static"));


app.use("/", webRouter);
app.use("/api", apiRouter);

webSocketServer.on("connection", async (socket) => {
  socket.broadcast.emit("new-user", socket.handshake.auth.username);

  socket.emit("getProducts", await productsManager.find());

  socket.on("deleteProduct", async (id) => {
    await productsManager.deleteOne(id);
    webSocketServer.emit("getProducts", await productsManager.find());
  });

  socket.on(
    "addProduct",
    async (
      objeto
    ) => {
      await productsManager.create(objeto);
      webSocketServer.emit("getProducts", await productsManager.find());
    }
  );
  socket.on("disconnecting", () => {
    socket.broadcast.emit("user-disconnected", socket.handshake.auth.username);
  });
  socket.emit("getMessages", await messagesManager.find());

  socket.on("addMessage", async ({ nombreUsuario, emailUsuario, message }) => {
    await messagesManager.create({
      user: nombreUsuario,
      emailUser: emailUsuario,
      content: message,
    });
    webSocketServer.emit("getMessages", await messagesManager.find());
  });
});