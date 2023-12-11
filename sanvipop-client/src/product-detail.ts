/* Aitor Moreno Iborra
Desarrollo web en entorno cliente: Tema 1 - JavaScript.
Proyecto final en TypeScript */

// En este fichero se encuentra el código relacionado con un producto y sus detalles

// Importamos la biblioteca Sweetalert
import Swal from "sweetalert2";

// Importamos las clases ProductsService y AuthService desde sus respectivos archivos
import { ProductsService } from "./classes/products-service";
import { AuthService } from "./classes/auth-service";

// Importamos la interfaz SingleProductResponse desde el archivo interfaces/responses.ts
import { SingleProductResponse } from "./interfaces/responses";

// Importamos la constante API_KEY desde el archivo constants.ts, que contiene la clave de la API de Bing Maps
import { API_KEY } from "./constants";

// Instanciamos la clase ProductsService y AuthService
const productsService = new ProductsService();
const authService = new AuthService();

// Declaramos una interfaz global para poder acceder a la función showMap
declare global {
    interface Window { showMap: () => Promise<void>; }
}

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

// Función para cargar la API de Bing Maps
function loadBingAPI(): void {
    const script = document.createElement("script");
    script.src = "https://www.bing.com/api/maps/mapcontrol?callback=showMap";
    script.defer = true;
    document.body.append(script);
}

// Función para mostrar el mapa
async function showMap(): Promise<void> {
    // Llamamos a la función get de la clase ProductsService, pasándole como parámetro el id del producto
    const id = parseInt(window.location.search.substring("?id=".length));
    const product = await productsService.get(id) as unknown as SingleProductResponse;

    // Obtenemos las coordenadas del propietario del producto y el div donde se mostrará el mapa
    const latOwner = product.product.owner.lat;
    const lngOwner = product.product.owner.lng;
    const mapDiv = document.getElementById("map")!;

    const Microsoft = window.Microsoft;
    const map = new Microsoft.Maps.Map(mapDiv, {
        credentials: API_KEY,
        center: new Microsoft.Maps.Location(latOwner, lngOwner),
        mapTypeId: Microsoft.Maps.MapTypeId.road,
        zoom: 13
    });

    const center = map.getCenter();

    const pin = new Microsoft.Maps.Pushpin(center);
    map.entities.push(pin);
}

// Se añade un listener al botón de logout
document.getElementById("logout")!.addEventListener("click", () => {
    authService.logout();
}); 

// Llamamos a la función get de la clase ProductsService, pasándole como parámetro el id del producto
const id = parseInt(window.location.search.substring("?id=".length));
const product = await productsService.get(id) as unknown as SingleProductResponse;

// Si el producto no existe, mostramos un mensaje de error y redirigimos a index.html
if (product.product.id === undefined) {
    Swal.fire({
        icon: "error",
        title: "Error",
        text: "El producto no existe",
        confirmButtonText: "Aceptar",
    }).then(() => {
        window.location.href = "index.html";
    });
}// Si el producto existe, lo mostramos en pantalla
else {
    const cardContainer = document.getElementById("cardContainer")!;
    const productCard = productsService.toHTML(product.product);
    cardContainer.appendChild(productCard);

    productsService.findProductAndDelete(productCard);
}

// Mostramos el mapa
loadBingAPI();
window.showMap = showMap;

