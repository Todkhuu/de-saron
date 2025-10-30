export interface ServiceType {
  _id: string;
  name: string;
  price: number;
  category: CategoryType;
  subcategory: SubCategoryType;
  duration: number; // minutes
  description: string;
  image: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SubCategoryType {
  _id: string;
  name: string;
  category: CategoryType;
  description: string;
  services: ServiceType[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CategoryType {
  _id: string;
  name: string;
  image: string;
  description: string;
  services: ServiceType[];
}
