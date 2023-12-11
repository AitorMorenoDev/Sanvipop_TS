/* Aitor Moreno Iborra
Desarrollo web en entorno cliente: Tema 1 - JavaScript.
Proyecto final en TypeScript */

// Esta clase se encarga de realizar las peticiones al servidor para obtener las categorías.

// Importamos la biblioteca Sweetalert
import Swal from "sweetalert2";

// Importamos la constante SERVER desde el archivo constants.ts
import { SERVER } from "../constants";

// Importamos la clase Http desde el archivo http.ts
import { Http } from "./http";

// Importamos la interfaz Category desde el archivo interfaces/category.ts
import { Category } from "../interfaces/category";


export class CategoriesService {
    #http = new Http();

    // Método para obtener todas las categorías
    async getAll(): Promise<Category[]> {
        try {
            const result =  await this.#http.get<Category[]>(SERVER + "/categories") as Category[];
            return result;
        } catch {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "No se han podido obtener las categorías",
                confirmButtonText: "Aceptar",
            });
            return [];
        }
    }
}

