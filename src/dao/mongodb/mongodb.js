import mongoose from "mongoose";


const url = 'mongodb+srv://nacholeonardi:(nachos1989)@cluster0.dobwiq4.mongodb.net/ecommerce'
await mongoose.connect(url);
console.log('Database coneccted successfuly 🚀');


export { manager as productsManager } from "./models/Product.js";
export { manager as cartsManager } from "./models/Cart.js";
export { manager as messagesManager } from "./models/Message.js"