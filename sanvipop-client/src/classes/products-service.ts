/* Aitor Moreno Iborra
Desarrollo web en entorno cliente: Tema 1 - JavaScript.
Proyecto final en TypeScript */

// Esta clase se encarga de realizar las peticiones al servidor para la obtención de productos

// Importamos las clases, interfaces y librerías necesarias.
import Swal from "sweetalert2";
import { SERVER } from "../constants";
import { Http } from "./http";
import { Product, ProductInsert } from "../interfaces/product";

export class ProductsService {
    #http = new Http();

    async getAll(): Promise<Product[]> {
        try {
            return await this.#http.get<Product[]>(SERVER + "/products");
        } catch {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "No se han podido obtener los productos",
                confirmButtonText: "Aceptar",
            });
            return [];
        }
    }

    async get(id: number): Promise<Product> {
        try {
            return await this.#http.get<Product>(SERVER + "/products/" + id);
        } catch (error) {
            console.error("Error al obtener el producto:");
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "No se ha podido obtener el producto.",
                confirmButtonText: "Aceptar",
            });
            return {} as Product;
        }
    }

    async insertProduct (product: ProductInsert): Promise<Product> {
        try {
            const response = await this.#http.post(SERVER + "/products", product);
            Swal.fire({
                icon: "success",
                title: "Producto creado",
                text: "Se ha creado el producto correctamente",
                confirmButtonText: "Aceptar",
            }).then(() => {
                window.location.href = "/index.html";
            });
            return response as Product;
        }
        catch (error) {
            console.error("Error al crear el producto:");
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "No se ha podido crear el producto: " + error,
                confirmButtonText: "Aceptar",
            });
            return {} as Product;
        }
    }

    async deleteProduct (id: number): Promise<void> {
        try {
            await this.#http.delete(SERVER + "/products/" + id);
            Swal.fire({
                icon: "success",
                title: "Producto eliminado",
                text: "Se ha eliminado el producto correctamente",
                confirmButtonText: "Aceptar",
            }).then(() => {
                window.location.href = "/index.html";
            });
        }
        catch (error) {
            console.error("Error al eliminar el producto:");
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "No se ha podido eliminar el producto: " + error,
                confirmButtonText: "Aceptar",
            });
        }
    }

    toHTML(product: Product): HTMLDivElement {

        // -------------------- CARD ------------------
        const cardDiv = document.createElement("div");
        cardDiv.classList.add("card", "h-100", "shadow");
    
        const cardBody = document.createElement("div");
        cardBody.classList.add("card-body");
    
        const cardFooter = document.createElement("div");
        cardFooter.classList.add("card-footer", "bg-transparent", "text-muted");
    
        const rowDiv = document.createElement("div");
        rowDiv.classList.add("row");
    
        function goToProductDetail(): void {
            window.location.href = "/product-detail.html?id=" + product.id;
    
            if (!product.id) {
                window.location.href = "/index.html";
            }
        }
    
        const img = document.createElement("img");
        img.classList.add("card-img-top");
        img.src = product.mainPhoto;
        img.addEventListener("click", () => {
            goToProductDetail();
        });
    
        // -------------------- BODY ------------------
        const title = document.createElement("h5");
        title.classList.add("card-title", "fw-bold");
        title.textContent = product.title;
        title.addEventListener("click", () => {
            goToProductDetail();
        });
    
        const description = document.createElement("p");
        description.classList.add("card-text");
        description.textContent = product.description;
        description.style.fontStyle = "italic";
    
        const price = document.createElement("p");
        price.classList.add("card-text", "float-end", "text-muted");
        price.textContent = product.price.toFixed(2) + "€";
    
        const category = document.createElement("p");
        category.classList.add("col", "text-muted", "float-start");
        category.textContent = product.category.name;
    
        // Contenedor flexbox para alinear el precio y la categoría
        const flexContainer = document.createElement("div");
        flexContainer.classList.add();
        flexContainer.appendChild(category);
        flexContainer.appendChild(price);
    
    
        //-------------------- FOOTER ------------------
    
        const date = document.createElement("p");
        date.classList.add("card-text");
    
        const options: Intl.DateTimeFormatOptions = {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        };
    
        const formattedDate = new Intl.DateTimeFormat("es", options).format(new Date(product.datePublished));
        date.textContent = formattedDate;
    
        const owner = document.createElement("p");
        owner.classList.add("card-text", "fw-bold");
        owner.textContent = product.owner.name;
        owner.addEventListener("click", () => {
            window.location.href = "/profile.html?id=" + product.owner.id;
        });
    
        const ownerPhoto = document.createElement("img");
        ownerPhoto.classList.add("float-start");
        ownerPhoto.src = product.owner.photo;
        ownerPhoto.style.maxWidth = "100px";
        ownerPhoto.style.maxHeight = "100px";
        ownerPhoto.style.marginRight = "10px";
        ownerPhoto.addEventListener("click", () => {
            window.location.href = "/profile.html?id=" + product.owner.id;
        });
    
        // Contenedor para albergar foto de usuario, nombre de usuario y fecha de publicación
        const flexContainer2 = document.createElement("div");
        flexContainer2.classList.add("col", "float-start");
        flexContainer2.appendChild(ownerPhoto);
        flexContainer2.appendChild(owner);
        flexContainer2.appendChild(date);
    
        // Añadimos el botón "Delete"
        const deleteButton = document.createElement("button");
        deleteButton.classList.add("btn", "btn-danger", "btn-sm");
        deleteButton.textContent = "Delete";
        deleteButton.setAttribute("data-id", product.id.toString());
    
        const distance = document.createElement("p");
        distance.classList.add("card-text");
        distance.textContent = product.distance + " km";
    
        const numVisits = document.createElement("p");
        numVisits.classList.add("card-text");
        numVisits.textContent = product.numVisits + " visitas";
    
        // Contenedor para albergar el número de visitas y la distancia
        const flexContainer3 = document.createElement("div");
        flexContainer3.classList.add("col", "float-end");
        flexContainer3.appendChild(numVisits);
        flexContainer3.appendChild(distance);
    
        // Conteneder para albergar el botón para borrar
        const flexContainer4 = document.createElement("div");
        flexContainer4.classList.add("col");
    
        // Se incrusta el botón de borrar en el contenedor si el producto es del usuario logueado
        if (product.mine) {
            flexContainer4.appendChild(deleteButton);
        }
    
        flexContainer2.style.flexGrow = "3";
        flexContainer3.style.flexGrow = "1";
        flexContainer4.style.flexGrow = "1";
    
        // Agregamos los elementos a la jerarquía y damos formato
        rowDiv.appendChild(flexContainer2);
        rowDiv.appendChild(flexContainer4);
        rowDiv.appendChild(flexContainer3);
        cardFooter.appendChild(rowDiv);
    
        cardBody.appendChild(title);
        cardBody.appendChild(description);
        cardBody.appendChild(flexContainer);
    
        cardDiv.appendChild(img);
        cardDiv.appendChild(cardBody);
        cardDiv.appendChild(cardFooter);
    
        return cardDiv;
    }

    findProductAndDelete(card: HTMLDivElement): void {
        const deleteButton = card.querySelector("button.btn-danger");
        if (deleteButton) {
            const productId = deleteButton.getAttribute("data-id");
            if (productId) {
                // Al hacer click en el botón de borrar, se llama a la función deleteProduct
                deleteButton.addEventListener("click", () => {
                    Swal.fire({
                        title: "¿Estás seguro?",
                        text: "No podrás recuperar el producto",
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonText: "Eliminar",
                        cancelButtonText: "Cancelar",
                    }).then((result) => {
                        if (result.isConfirmed) {
                            this.deleteProduct(parseInt(productId));
                        }
                    });
                });
            }
        }
    }
}