export interface Product {
  id: number;
  title: string;
  brand: Brand;
  category: Category;
}

export interface ProductOption {
  id: number;
  product: Product;
  productImages: ProductImage[];
  productSizes:ProductSize[];
  price: number;
  discount: number;
  underTitle:string;
  addedInDate:string;
  description: string;
  soldTimes:string;
  enabled:boolean;
}

export interface ProductImage {
  id: number;
  image: string;
  productOption: ProductOption;
}
export interface ProductSize {
  id: number;
  size: string;
  onStock: number;
  productOption: ProductOption;
}

export interface Category {
  id: number;
  name: string;
  parent: Category;
  children:Category[]
}
export interface Brand {
  id: number;
  name: string;
  image: string
}
export interface Payment {
  id:number;
  price:number;
  title:string;
}
export interface Delivery {
  id:number;
  price:number;
  title:string;
}

export interface product_category_autocomplete {
  categories:Category[];
  productOptions:ProductOption[];
}
export interface Product_CategoryDTO{
  categories:Category[];
  productOptions:any;
}

export interface Alert{
  id:number;
  text:string;
  color:string;
}

export interface Carousel{
  id:number;
  text:string;
  link:string;
  image:string;
}
