export interface UserLogin {
    email: string;
    password: string;
    lat?: number;
    lng?: number;
}

export interface User {
    id?: number;
    name: string;
    email: string;
    password?: string;
    photo: string;
    lat: number;
    lng: number;
    me?: boolean;
}

export interface UserProfileEdit {
    name: string;
    email: string;
}

export interface UserPhotoEdit {
    photo: string;
}

export interface UserPasswordEdit {
    password: string;
}