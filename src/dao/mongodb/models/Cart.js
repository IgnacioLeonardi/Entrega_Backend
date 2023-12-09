import { Schema, model } from "mongoose";
import { randomUUID } from "node:crypto";
import { productsManager } from "../mongodb.js"
import { cartsManager } from "../mongodb.js";

const cartSchema = new Schema(
  {
    _id: { type: String, default: randomUUID },
    products: { type: [Object], default: [] },
  },
  {
    strict: "throw",
    versionKey: false,
    statics: {
      addProductToCart: async function (cid, pid) {
        const initialQuantity = 1;

        // Obtener el carrito y el producto
        const cart = await cartsManager.findById(cid);
        const product = await productsManager.findById(pid).lean();

        // Verificar si el producto ya está en el carrito
        const productIndexFind = cart.products.findIndex(
          (p) => p._id === product._id
        );

        if (productIndexFind === -1) {
          // Si el producto no está en el carrito, agregarlo con la cantidad inicial
          await cartsManager.findOneAndUpdate(
            { _id: cid },
            {
              $addToSet: {
                products: { _id: product._id, quantity: initialQuantity },
              },
            }
          );
        } else {
          // Si el producto ya está en el carrito, actualizar la cantidad
          await cartsManager.findOneAndUpdate(
            { _id: cid, "products._id": product._id },
            {
              $inc: {
                "products.$.quantity": initialQuantity,
              },
            }
          );
        }
      },
    },
  }
);

export const manager = model("carts", cartSchema);
