/* Aitor Moreno Iborra
Desarrollo web en entorno cliente: Tema 1 - JavaScript.
Proyecto final en TypeScript */

// Importamos las clases, interfaces y librerias necesarias
import Swal from "sweetalert2";
import { AuthService } from "./classes/auth-service";
import { UserService } from "./classes/user-service";
import {  UserResponse } from "./interfaces/responses";
import { API_KEY } from "./constants";
import { UserProfileEdit } from "./interfaces/user";
import { UserPasswordEdit } from "./interfaces/user";
import { UserPhotoEdit } from "./interfaces/user";

// Instanciamos las clases AuthService y UserService
const authService = new AuthService();
const userService = new UserService();

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

// Obtenemos el id del usuario de la URL
const id = parseInt(window.location.search.substring("?id=".length));

//Si obtenemos un id, llamamos a la función getProfile con el id
if (id) {
    const user = userService.getProfile(id);
    user.then((user) => {
        displayUserData(user as unknown as UserResponse);
    });
} else { // Si no, llamamos a la función getSelfProfile, que nos devolverá el perfil propio
    const selfUser = userService.getSelfProfile();
    selfUser.then((selfUser) => {
        displayUserData(selfUser as unknown as UserResponse);
    });
}

// Declaramos una interfaz global para poder acceder a la función showMap
declare global {
    interface Window { showMap: () => Promise<void>; }
}

// Función para cargar la API de Bing Maps
function loadBingAPI(): void {
    const script = document.createElement("script");
    script.src = "https://www.bing.com/api/maps/mapcontrol?callback=showMap";
    script.defer = true;
    document.body.append(script);
}

// Función para mostrar el mapa
async function showMap(lat: number, lng: number, mapDiv: HTMLElement): Promise<void> {    
    const Microsoft = window.Microsoft;
    const map = new Microsoft.Maps.Map(mapDiv, {
        credentials: API_KEY,
        center: new Microsoft.Maps.Location(lat ,lng),
        mapTypeId: Microsoft.Maps.MapTypeId.road,
        zoom: 13
    });
    
    const center = map.getCenter();

    const pin = new Microsoft.Maps.Pushpin(center);
    map.entities.push(pin);
}

// Función para mostrar toda la información del usuario
function displayUserData(user: UserResponse): void {
    const avatarElement = document.getElementById("photo") as HTMLImageElement;
    const nameElement = document.getElementById("name") as HTMLElement;
    const emailElement = document.querySelector("#email > small") as HTMLSpanElement;
    const photoButton = document.querySelector("#profile .btn-danger");
    const editPhotoElement = document.getElementById("photoInput") as HTMLInputElement;
    const editProfileElement = document.getElementById("editProfile") as HTMLDivElement;
    const editPasswordElement = document.getElementById("editPassword") as HTMLDivElement;
    const mapDiv = document.getElementById("map") as HTMLElement;

    avatarElement.src = user.user.photo;
    nameElement.innerHTML = user.user.name;
    emailElement.innerHTML = user.user.email;

    // Si es el perfil propio, se añaden las funcionalidades de editar
    if (user.user.me) {
        // Editar avatar
        // Escucha el evento change del input de tipo file
        editPhotoElement.addEventListener("change", async (changeEvent: Event) => {
            changeEvent.preventDefault();
            
            const target = changeEvent.target as HTMLInputElement;
            const file = target.files![0];
            const reader = new FileReader();

            if (file) {
                reader.readAsDataURL(file);
                reader.addEventListener("load", async (loadEvent: Event) => {
                    loadEvent.preventDefault();

                    const base64Image = reader.result as string;

                    // Realiza una petición PUT al servidor para actualizar el avatar
                    try {
                        const response = await userService.saveAvatar(base64Image) as unknown as UserPhotoEdit;
                        Swal.fire({
                            icon: "success",
                            title: "Éxito",
                            text: "Avatar actualizado correctamente",
                            confirmButtonText: "Aceptar",
                        }).then(() => {
                            user.user.photo = response.photo;
                            window.location.reload();
                        });
                    } catch (error) {
                        Swal.fire({
                            icon: "error",
                            title: "Error",
                            text: "No se ha podido actualizar el avatar",
                            confirmButtonText: "Aceptar",
                        });
                    }
                });
            }
        });


        // Editar perfil
        // Escucha el evento submit del botón de editar perfil
        editProfileElement.addEventListener("click", async (event: Event) => {
            event.preventDefault();
            const profileInfoElement = document.getElementById("profileInfo");
            const profileFormElement = document.getElementById("profileForm");

            profileInfoElement!.style.display = "none";
            profileFormElement?.classList.remove("d-none");

            const cancelButton = document.getElementById("cancelEditProfile") as HTMLButtonElement;

            // Si se pulsa el botón de cancelar, se vuelve a mostrar la información del perfil
            cancelButton.addEventListener("click", () => {
                profileInfoElement!.style.display = "block";
                profileFormElement?.classList.add("d-none");
            });

            // Escucha el evento submit del formulario de editar perfil
            profileFormElement!.addEventListener("submit", async (submitEvent: Event) => {
                submitEvent.preventDefault();

                const newEmailInput = document.querySelector("#profileForm input[type=\"email\"]") as HTMLInputElement;
                const newEmail = newEmailInput.value;
                const newNameInput = document.querySelector("#profileForm input[type=\"text\"]") as HTMLInputElement;
                const newName = newNameInput.value;
                
                try {
                    await userService.saveProfile(newName, newEmail) as unknown as UserProfileEdit;
                    Swal.fire({
                        icon: "success",
                        title: "Éxito",
                        text: "Perfil actualizado correctamente",
                        confirmButtonText: "Aceptar",
                    }).then(() => {
                        profileFormElement!.classList.add("d-none");
                        profileInfoElement!.style.display = "block";

                        emailElement.innerHTML = newEmail;
                        nameElement.innerHTML = newName;
                    });
                } catch (error) {
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: "No se ha podido actualizar el perfil",
                        confirmButtonText: "Aceptar",
                    });
                }
            });
        });

        // Editar contraseña
        // Escucha el evento submit del botón de editar contraseña
        editPasswordElement.addEventListener("click", async (event: Event) => {
            event.preventDefault();
            const profileInfoElement = document.getElementById("profileInfo");
            const passwordFormElement = document.getElementById("passwordForm");

            profileInfoElement!.style.display = "none";
            passwordFormElement?.classList.remove("d-none");

            const cancelButton = document.getElementById("cancelEditPassword") as HTMLButtonElement;

            // Si se pulsa el botón de cancelar, se vuelve a mostrar la información del perfil
            cancelButton.addEventListener("click", () => {
                profileInfoElement!.style.display = "block";
                passwordFormElement?.classList.add("d-none");
            });

            // Escucha el evento submit del formulario de editar contraseña
            passwordFormElement!.addEventListener("submit", async (submitEvent: Event) => {
                submitEvent.preventDefault();

                const newPasswordInput = document.querySelector("#passwordForm input[type=\"password\"]") as HTMLInputElement;
                const newPassword = newPasswordInput.value;
                const newPasswordRepeatInput = document.querySelector("#passwordForm input[type=\"password\"]") as HTMLInputElement;
                const newPasswordRepeat = newPasswordRepeatInput.value;

                if (newPassword !== newPasswordRepeat) {
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: "Las contraseñas no coinciden",
                        confirmButtonText: "Aceptar",
                    });
                    return;
                }
                
                try {
                    await userService.savePassword(newPassword) as unknown as UserPasswordEdit;
                    Swal.fire({
                        icon: "success",
                        title: "Éxito",
                        text: "Contraseña actualizada correctamente",
                        confirmButtonText: "Aceptar",
                    }).then(() => {
                        profileInfoElement!.style.display = "block";
                        passwordFormElement?.classList.add("d-none");
                    });
                } catch (error) {
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: "No se ha podido actualizar la contraseña",
                        confirmButtonText: "Aceptar",
                    });
                }
            });
        });

    } else { // Si no es el perfil propio, se ocultan los botones de editar
        photoButton!.remove();
        editProfileElement.remove();
        editPasswordElement.remove();
    }

    // Mostramos el mapa
    loadBingAPI();
    window.showMap = ():Promise<void> => showMap(user.user.lat, user.user.lng ,mapDiv); 
}