/* Aitor Moreno Iborra
Desarrollo web en entorno cliente: Tema 1 - JavaScript.
Proyecto final en TypeScript */

// Esta clase se encarga de realizar las peticiones al servidor para obtener información de usuarios

// Importamos la constante SERVER desde el archivo constants.ts
import { SERVER } from "../constants";

// Importamos la clase Http desde el archivo http.ts
import { Http } from "./http";

export class UserService {
    #http = new Http();

    // Método para obtener los datos de un usuario
    async getProfile(id?: number): Promise<Response> {
        try {
            return await this.#http.get(SERVER + "/users/" + id);
        } catch {
            throw new Error("Error al obtener los datos del usuario");
        }
    }

    // Método para obtener los datos del usuario logueado
    async getSelfProfile(): Promise<Response> {
        try {
            return await this.#http.get(SERVER + "/users/me");
        } catch {
            throw new Error("Error al obtener los datos del usuario");
        }
    }

    // Método para guardar el perfil de un usuario
    async saveProfile(name: string, email: string): Promise<void> {
        try {
            await this.#http.put(SERVER + "/users/me", { name, email });
        } catch {
            throw new Error("Error al guardar los datos del usuario");
        }
    }

    // Método para guardar el avatar de un usuario
    async saveAvatar(avatar: string): Promise<string> {
        try {
            return await this.#http.put(SERVER + "/users/me/photo", { photo: avatar });
        } catch (error) {
            throw new Error("Error al guardar el avatar del usuario.");
        }
    }

    // Método para guardar la contraseña de un usuario
    async savePassword(password: string): Promise<void> {
        try {
            await this.#http.put(SERVER + "/users/me/password", { password });
        } catch {
            throw new Error("Error al guardar la contraseña del usuario");
        }
    }
}