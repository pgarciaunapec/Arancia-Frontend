export interface MenuItem {
  id: number;
  name: string;
  category: string;
  price: number;
  ingredients: string[];
  image: string;
}

export interface FilterState {
  category: string;
  sortBy: string;
}
