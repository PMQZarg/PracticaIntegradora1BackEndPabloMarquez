import express from "express";
import path from "path";
import handlebars from "express-handlebars";
import viewsRouter from "./routes/views.router.js";
import { Server } from "socket.io"; // este Server se creará a partir del server HTTP
import { ProductManager } from "./manager/productManager.js";
import { CartManager } from "./manager/cartManager.js";
//import Index from "./router/indexRouter.js";
import productsRouter from "./routeManager/routeProductsManager.js";
import cartsRouter from "./routeManager/routeCartsManager.js";

import mongoose from "mongoose";

const app = express();
const PORT = 8080;

//Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const pathProducts = path.join(__dirname,"./src/data/products.json");
const pathCarts = path.join(__dirname,"./src/data/carts.json");

export const productManager = new ProductManager(pathProducts);
export const cartManager = new CartManager(pathCarts);

app.use("/api", viewsRouter);
app.use("/api/products/", productsRouter);
app.use("/api/carts/", cartsRouter);

const httpServer = app.listen(PORT, () =>
  console.log(`Servidor corriendo en el puerto ${PORT}`)
); //solo el server HTTP
const socketServer = new Server(httpServer);
//configuracion que se usa para activar el handlebars
app.engine("handlebars", handlebars.engine());
app.set("views", path.join(__dirname + "/views"));
app.set("view engine", "handlebars");
app.use(express.static(path.join(__dirname + "/public"))); //sirve para tener archivos js y css en las plantillas
app.use("/", viewsRouter);


app.use("/api/products/", productsRouter);
app.use("/api/carts/", cartsRouter);





socketServer.on("connection", (socket) => {
  console.log("Nuevo cliente conectado");

  socket.on("message", (data) => {
    console.log(data); // este console.log dice que va a mostrar(data), lo pone entre parentesis, luego el punto y coma
    socket.emit("message", data); // aqui se emite mnesaje desde mi servidor, pero como cliente, esto conectado a index.js (desde ahi)
  });
});
