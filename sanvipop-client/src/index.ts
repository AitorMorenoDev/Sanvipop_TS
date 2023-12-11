/* Aitor Moreno Iborra
Desarrollo web en entorno cliente: Tema 1 - JavaScript.
Proyecto final en TypeScript */

// En este fichero se encuentra el código para el index, en el que se muestran todos los productos

// Importamos la biblioteca Sweetalert
import Swal from "sweetalert2";

// Importamos las clases, interfaces y librerias necesarias
import { ProductsService } from "./classes/products-service";
import { AuthService } from "./classes/auth-service";

// Importamos las interfaces, Product y ProductsResponse desde sus respectivos archivos
import { Product } from "./interfaces/product";
import { ProductsResponse } from "./interfaces/responses";

// Instanciamos las clases ProductsService y AuthService
const productsService = new ProductsService();
const authService = new AuthService();

// Comprobamos si el usuario está logueado:
try {
    await authService.validateUser();
} catch (error) {
    Swal.fire({
        icon: "error",
        title: "Error",
        text: "El usuario no está logueado.",
        confirmButtonText: "Ir a login",
    }).then(() => {
        location.assign("/login.html");
    });
}

// Esta comprobación de token y posterior timeout es debido a que se ejecutaba primero el catch de la petición get de la clase ProductsService
// antes de que apareciera el mensaje de error de login en caso de que el usuario no estuviera logueado, por lo que no se mostraba el mensaje de error
if (!authService.checkToken()) {
    await new Promise((resolve) => setTimeout(resolve, 60000));
}

// Se añade un listener al botón de logout
document.getElementById("logout")!.addEventListener("click", () => {
    authService.logout();
}); 

// Se llama a la función para obtener los productos
try {
    const productsArray =  await productsService.getAll() as unknown as ProductsResponse;
    const productsContainer = document.getElementById("productsContainer")!;

    if (productsContainer) {
        productsArray.products.forEach((product: Product) => {
            const card = document.createElement("div");
            card.classList.add("col");
            productsContainer.appendChild(card);
            const productCard = productsService.toHTML(product);
            card.appendChild(productCard);
                
            productsService.findProductAndDelete(productCard);
        });
    }
} catch (error) {
    Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se han podido obtener los productos",
        confirmButtonText: "Aceptar",
    });
}