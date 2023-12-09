import { Router } from "express";

export const webRouter = Router();

webRouter.get("/", (req, res) => {
  try {
    res.render("index.handlebars", { title: "Home" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error loading home" });
  }
});
webRouter.get('/chat', (req, res) => {
  res.render('chat.handlebars', { titulo: 'Chat' })
})
webRouter.get("/realTimeProducts", (req, res) => {
  try {
    console.log("Cliente conectado");
    res.render("realTimeProducts.handlebars", { title: "Productos en tiempo real" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error loading products" });
  }
});