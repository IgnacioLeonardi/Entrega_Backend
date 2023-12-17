import { Router } from "express";
import { productsManager, cartsManager } from "../dao/mongodb/mongodb.js";



export const webRouter = Router();


webRouter.get("/", async (req, res, next) => {
  try {
    const criterioDeBusqueda = {}

    if (req.query.category) { criterioDeBusqueda.category = req.query.category }
    if (req.query.status) { criterioDeBusqueda.status = req.query.status }
    if (req.query.gender) { criterioDeBusqueda.gender = req.query.gender }


    const opcionesDePaginacion = {
      sort: { price: req.query.sort === "asc" ? -1 : 1 } || { price: req.query.sort === "desc" ? 1 : -1 },
      limit: req.query.limit || 10,
      page: req.query.page || 1,
      lean: true
    }


    const result = await productsManager.paginate(criterioDeBusqueda, opcionesDePaginacion)

    console.log(result);

    res.render('products.handlebars', {
      title: 'Productos',
      hayDocs: result.docs.length > 0,
      ...result,
    })

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error loading Productos" });
  }
});
webRouter.get('/chat', (req, res) => {
  res.render('chat.handlebars', { title: 'Chat' })
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
webRouter.get("/carts/:cid", async (req, res, next) => {
  const { cid } = req.params;
  const result = await cartsManager.findById({ _id: cid }).lean();
  let productList = result.products;
  res.render("cart.handlebars", {
    title: "cart",
    products: productList,
    productsInCart: productList.length > 0,
  });
});