/* Aitor Moreno Iborra
Desarrollo web en entorno cliente: Tema 1 - JavaScript.
Proyecto final en TypeScript */

// En este fichero se encuentra el código para el registro de usuarios

// Importamos la biblioteca Sweetalert
import Swal from "sweetalert2";

// Importamos las clases MyGeolocation y AuthService desde sus respectivos archivos
import { MyGeolocation } from "../src/classes/my-geolocation";
import { AuthService } from "./classes/auth-service";

// Importamos la interfaz User desde el archivo interfaces/user.ts
import { User } from "./interfaces/user";

// Instanciamos la clase AuthService
const authService = new AuthService();

// Comprobamos si el usuario está logueado:
if (authService.checkToken()) {
    window.location.href = "/index.html";
}

// Se añade un listener al formulario de registro
document.getElementById("form-register")!.addEventListener("submit", async (event: Event) => {
    event.preventDefault();

    // Obtenemos los valores del formulario
    const name: string = (document.getElementById("name") as HTMLInputElement).value;
    const email: string = (document.getElementById("email") as HTMLInputElement).value;
    const email2: string = (document.getElementById("email2") as HTMLInputElement).value;
    const password: string = (document.getElementById("password") as HTMLInputElement).value;
    const photo = document.getElementById("photo") as HTMLInputElement;

    // Comprobamos que la foto existe, y que se ha seleccionado una imagen.
    if (!photo || !photo.files || !photo.files[0]) {
        Swal.fire({
            icon: "error",
            title: "Error de registro",
            text: "No se ha seleccionado ninguna imagen",
        });
        return;
    }
    
    // Obtenemos la imagen del usuario en base64
    const readFile = (input: HTMLInputElement): Promise<string> => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(input.files![0]);

            fileReader.onload = (): void => resolve(fileReader.result as string);
            fileReader.onerror = (error): void => reject(error);
        });
    };

    const avatarBase64: string = await readFile(photo);

    // Comprobamos que ambas direcciones de correo son iguales
    if (email !== email2) {
        Swal.fire({
            icon: "error",
            title: "Error de registro",
            text: "Las direcciones de correo no coinciden",
        });
        return;
    }

    // Obtenemos la localización del usuario
    let position;
    try {
        position = await MyGeolocation.getLocation();
    } catch (error) {
        console.error("Error al obtener la localización: ", error);
        // En caso de error, establecemos valores por defecto para latitud y longitud
        position = { latitude: 0, longitude: 0 };
    }

    // Si se ha obtenido la localización del usuario, se envía la petición al servidor
    if (position) {
        const { latitude, longitude } = position;
        return await authService.registerUser({ name, email, password, photo: avatarBase64, lat: latitude, lng: longitude } as User);
    } else { // En caso contrario, se muestra un mensaje de error
        Swal.fire({
            icon: "error",
            title: "Error de localización",
            text: "No se ha podido obtener la localización del usuario",
        });
    }
});
