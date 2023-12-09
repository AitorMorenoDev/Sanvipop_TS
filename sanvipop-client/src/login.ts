/* Aitor Moreno Iborra
Desarrollo web en entorno cliente: Tema 1 - JavaScript.
Proyecto final en TypeScript */

// En este fichero se encuentra el código para el inicio de sesión de usuarios

// Importamos las clases, interfaces y librerias necesarias
import Swal from "sweetalert2";
import { MyGeolocation } from "../src/classes/my-geolocation";
import { AuthService } from "./classes/auth-service";
import { UserLogin } from "./interfaces/user";

// Instanciamos la clase AuthService
const authService = new AuthService();

// Comprobamos si el usuario está logueado:
if (authService.checkToken()) {
    window.location.href = "/index.html";
}

// Se añade un listener al formulario de inicio de sesión
document.getElementById("form-login")!.addEventListener("submit", async (event: Event) => {
    event.preventDefault();

    // Obtenemos los valores del formulario
    const email: string = (document.getElementById("email") as HTMLInputElement).value;
    const password: string = (document.getElementById("password") as HTMLInputElement).value;

    // Obtenemos la localización del usuario
    const position = await MyGeolocation.getLocation();

    // Si se ha obtenido la localización del usuario, se envía la petición al servidor
    if (position) {
        const { latitude, longitude } = position;
        await authService.login({ email: email, password: password, lat: latitude, lng: longitude } as UserLogin);
    } else { // En caso contrario, se muestra un mensaje de error
        Swal.fire({
            icon: "error",
            title: "Error de localización",
            text: "No se ha podido obtener la localización del usuario",
        });
    }
});