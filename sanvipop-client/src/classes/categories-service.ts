/* Aitor Moreno Iborra
Desarrollo web en entorno cliente: Tema 1 - JavaScript.
Proyecto final en TypeScript */

// Esta clase se encarga de realizar las peticiones al servidor para obtener las categorías.

// Importamos las clases, interfaces y librerías necesarias.
import { Http } from "./http";
import Swal from "sweetalert2";
import { SERVER } from "../constants";
import { Category } from "../interfaces/category";


export class CategoriesService {
    #http = new Http();

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

