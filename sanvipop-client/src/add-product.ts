/* Aitor Moreno Iborra
Desarrollo web en entorno cliente: Tema 1 - JavaScript.
Proyecto final en TypeScript */

// Importamos las clases ProductsService, CategoriesService y AuthService desde sus respectivos archivos
import { ProductsService } from "./classes/products-service.js";
import { CategoriesService } from "./classes/categories-service.js";
import { AuthService } from "./classes/auth-service.js";

// Importamos las interfaces, ProductInsert y Category desde sus respectivos archivos
import { ProductInsert } from "./interfaces/product.js";
import { Category } from "./interfaces/category.js";
import { CategoriesResponse } from "./interfaces/responses.js";

// Importamos la biblioteca Sweetalert
import Swal from "sweetalert2";

// Creamos una instancia de las clases ProductsService, CategoriesService y AuthService
const productsService = new ProductsService();
const categoriesService = new CategoriesService();
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

// Se añade un listener al botón de logout
document.getElementById("logout")!.addEventListener("click", () => {
    authService.logout();
});

// Cargamos todas las categorías desde el servidor y las agregamos a select#category
const categorySelect = document.getElementById("category") as HTMLSelectElement;
const newProdForm = document.getElementById("newProduct") as HTMLFormElement;

// Creamos el elemento option, con la id de la categoría como valor y el nombre como texto
try {
    const categories = await categoriesService.getAll() as unknown as CategoriesResponse;
    
    categories.categories.forEach((category: Category) => {
        const option = document.createElement("option");
        option.value = category.id.toString();
        option.text = category.name;
        categorySelect.add(option);
    });
} catch (error) {
    Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se han podido obtener las categorías",
        confirmButtonText: "Aceptar",
    });
}

const imagePreview = document.getElementById("imgPreview") as HTMLImageElement;

// Eliminamos el elemento d-none de la imagen de vista previa cuando se selecciona una imagen
newProdForm.image.addEventListener("change", (event: Event) => {
    const target = event.target as HTMLInputElement;
    const file = target.files![0];
    const reader = new FileReader();

    if (file) {
        reader.readAsDataURL(file);

        reader.addEventListener("load", () => {
            imagePreview.src = reader.result as string;
            imagePreview.classList.remove("d-none");
        });
    }
});

// Añadimos un listener al formulario de creación de producto
newProdForm.addEventListener("submit", async (event: Event) => {
    event.preventDefault();
    let isValid = true;

    // Obtenemos los datos del formulario
    const title = document.getElementById("title") as HTMLInputElement;
    const description = document.getElementById("description") as HTMLInputElement;
    const price = document.getElementById("price") as HTMLInputElement;
    const priceNumber = parseFloat(price.value);
    const categorySelect = document.getElementById("category") as HTMLSelectElement;
    const categoryId = parseInt(categorySelect.value);
    const image = document.createElement("img");
    image.classList.add("card-img-top");
    image.src = imagePreview.src;


    // Validamos que los campos sean correctos: 
    // Título de al menos 4 caracteres:
    if (title.value.length < 4) {
        title.classList.add("is-invalid");
        isValid = false;
    } else {
        title.classList.add("is-valid");
    }

    // Descripción rellena:
    if (description.value.trim() == "") {
        description.classList.add("is-invalid");
        isValid = false;
    } else {
        description.classList.add("is-valid");
    }

    // Imagen seleccionada: 
    if (!imagePreview.src || imagePreview.classList.contains("d-none") || imagePreview.src === "") {
        image.classList.add("is-invalid");
        isValid = false;
    } else {
        image.classList.add("is-valid");
    }

    // Precio numérico y mayor que 0:
    if (isNaN(priceNumber) || priceNumber <= 0) {
        price.classList.add("is-invalid");
        isValid = false;
    } else {
        price.classList.add("is-valid");
    }

    // Categoría numérica y mayor que 0:
    if (isNaN(categoryId) || categoryId <= 0) {
        categorySelect.classList.add("is-invalid");
        isValid = false;
    } else {
        categorySelect.classList.add("is-valid");
    }

    // Si los datos son válidos, se crea el producto
    if (isValid) {
        const product: ProductInsert = {
            title: title.value,
            description: description.value,
            price: priceNumber,
            category: categoryId,
            mainPhoto: image.src,
        };

        try {
            await productsService.insertProduct(product);
        } catch (error) {
            console.error("Error al crear el producto:");
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "No se ha podido crear el producto",
                confirmButtonText: "Aceptar",
            });
        }
    }
});