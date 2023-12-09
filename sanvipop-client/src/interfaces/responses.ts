import { Category } from "./category";
import { Product } from "./product";
import { Rating } from "./rating";
import { User } from "./user";

export interface CategoriesResponse {
    categories: Category[];
}

export interface ProductsResponse {
    products: Product[];
}

export interface SingleProductResponse {
    product: Product;
}

export interface TokenResponse {
    accessToken: string;
}

export interface UserResponse {
    user: User;
}

export interface UsersResponse {
    users: User[];
}

export interface PhotoResponse {
    photo: string;
}

export interface RatingsResponse {
    comments: Rating[];
}