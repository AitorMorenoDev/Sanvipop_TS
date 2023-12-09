import { Category } from "./category";
import { Photo } from "./photo";
import { User } from "./user";

type Status = 1 | 2 | 3;

export interface ProductInsert {
    title: string;
    description: string;
    category: number;
    price: number;
    mainPhoto: string;
}

export interface Product extends Omit<ProductInsert, "category"> {
    id: number;
    category: Category;
    datePublished: string;
    status: Status;
    numVisits: number;
    owner: User;
    soldTo?: User;
    rating: number;
    photos?: Photo[];
    distance: number; 
    mine: boolean;
}
