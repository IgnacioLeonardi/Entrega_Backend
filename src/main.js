import express from 'express'
import handlebars from 'express-handlebars'
import { Server } from 'socket.io'

import { apiRouter } from "./routes/api.router.js";
import { webRouter } from "./routes/web.router.js";
import { productManager } from "./services/ProductManager.js";

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

  socket.emit("getProducts", await productManager.getProducts());

  socket.on("deleteProduct", async (id) => {
    await productManager.deleteProduct(id);
    webSocketServer.emit("getProducts", await productManager.getProducts());
  });

  socket.on(
    "addProduct",
    async (
      objeto
    ) => {
      await productManager.addProduct(objeto);
      webSocketServer.emit("getProducts", await productManager.getProducts());
    }
  );
  socket.on("disconnecting", () => {
    socket.broadcast.emit("user-disconnected", socket.handshake.auth.username);
  });
});