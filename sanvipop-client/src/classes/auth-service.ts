/* Aitor Moreno Iborra
Desarrollo web en entorno cliente: Tema 1 - JavaScript.
Proyecto final en TypeScript */

// Esta clase se encarga de realizar las peticiones al servidor para la autenticación de usuarios

// Importamos la biblioteca Sweetalert
import Swal from "sweetalert2";

// Importamos las interfaces UserLogin, User y TokenResponse desde sus respectivos archivos
import { UserLogin } from "../interfaces/user.js";
import { User } from "../interfaces/user.js";
import { TokenResponse } from "../interfaces/responses.js";

// Importamos la constante SERVER desde el archivo constants.js
import { SERVER } from "../constants.js";

// Importamos la clase Http desde el archivo http.js
import { Http } from "./http.js";

// Interfaz para detallar el error en el registro de usuarios
interface DetailedError {
    statusCode: number;
    message: string[];
    error: string;
}

// Clase AuthService
export class AuthService {

    #http = new Http();

    // Método para loguear a un usuario
    async login(userLogin: UserLogin): Promise<void> {
        try {
            const data = await this.#http.post<TokenResponse, UserLogin>(SERVER + "/auth/login", userLogin);

            // Si el servidor devuelve un token, se guarda en localStorage y se redirige al usuario a la página de inicio
            if (data.accessToken) {

                Swal.fire({
                    icon: "success",
                    title: "Inicio de sesión correcto",
                    text: "Se ha iniciado sesión correctamente",
                    confirmButtonText: "Aceptar",
                }).then(() => {
                    localStorage.setItem("token", data.accessToken);
                    window.location.href = "/index.html"; 
                });

            } else { // En caso contrario, se muestra un mensaje de error
                Swal.fire({
                    icon: "error",
                    title: "Error de autenticación",
                    text: "Error al iniciar sesión",
                    confirmButtonText: "Aceptar",
                });
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error de autenticación",
                text: "Error al iniciar sesión",
                confirmButtonText: "Aceptar",
            });
        }
    }

    // Método para registrar a un usuario
    async registerUser(userInfo: User): Promise<void> {
        try {
            await this.#http.post(SERVER + "/auth/register", userInfo);
            Swal.fire({
                icon: "success",
                title: "Registro correcto",
                text: "Se ha registrado correctamente",
                confirmButtonText: "Aceptar",
            }).then (() => {
                window.location.href = "/login.html";
            });

        } catch (error) {
            const detailedError = error as DetailedError;
            Swal.fire({
                icon: "error",
                title: "Error de registro",
                text: "statusCode: " + detailedError.statusCode + " - Message: " +
                detailedError.message.join(", ") + " - Error: " + detailedError.error,
                confirmButtonText: "Aceptar",
            });
        }
    }

    // Método para cerrar sesión
    logout(): void {
        localStorage.removeItem("token");
        window.location.href = "/login.html";
    }

    // Método para comprobar si el usuario está logueado
    async validateUser(): Promise<TokenResponse> {
        return await this.#http.get<TokenResponse>(SERVER + "/auth/validate");
    }

    // Método auxiliar de comprobación de token
    checkToken(): boolean {
        return !!localStorage.getItem("token");
    }
}