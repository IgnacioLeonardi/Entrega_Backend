import fs from "fs/promises";
import { Product } from "../models/Product.js";
import crypto from "crypto";
let id = ""
class ProductManager {
  #path
  constructor(path) {
    this.#path = path;
  }


  async addProduct(dataProduct) {
    const products = await this.getProducts();
    const productToAdd = products.find((product) => product.code === dataProduct.code);
    try {
      if (!productToAdd) {
        dataProduct.id = crypto.randomUUID();
        const newProducts = JSON.parse(await fs.readFile(this.#path, 'utf-8'))
        const newProduct = new Product(dataProduct)
        newProducts.push(newProduct)
        await fs.writeFile(this.#path, JSON.stringify(newProducts, null, 2))
        return newProduct
      } else {
        throw new Error('El codigo de producto ya existe.');
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  async getProducts() {
    const data = await fs.readFile(this.#path, "utf-8");
    return JSON.parse(data) || [];
  }

  async getProductById(id) {
    const products = await this.getProducts();
    const productToFind = products.find((p) => p.id === id);
    if (!productToFind) {
      throw new Error(`El producto con id ${id} no se encuentra o no existe`);
    }
    return productToFind;
  }

  async updateProduct(idProduct, updateData) {
    const products = await this.getProducts();
    try {
      const product = products.find((p) => p.id === idProduct);
      if (!product) {
        throw new Error(`El producto con ID: ${idProduct} no es correcto.`);
      }
      for (let key in updateData) {
        if (product.hasOwnProperty(key)) {
          product[key] = updateData[key];
        }
      }
      await fs.writeFile(this.#path, JSON.stringify(products, null, 2));
      return console.log("El producto se actualizo correctamente")
    } catch (error) {
      console.log(error.message);
    }
  }


  async deleteProduct(id) {
    try {
      const productsList = await this.getProducts();
      const products = productsList.filter(
        (product) => product.id !== id
      );
      if (productsList.length === products.length) {
        throw new Error(`Producto con id "${id}" no existe.`);
      }
      await fs.writeFile(this.#path, JSON.stringify(products, null, 2));
      return products;
    } catch (error) {
      throw error;
    }
  }
}

export const productManager = new ProductManager("./db/products.json");
