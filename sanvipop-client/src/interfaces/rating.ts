import { Product } from "./product";
import { User } from "./user";

export interface RatingInsert {
    rating: number;
    comment: string;
    product: number;
}

export interface Rating extends Omit<RatingInsert, "product"> {
    product: Product;
    user: User; 
}
