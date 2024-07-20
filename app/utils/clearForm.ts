import { ProductInformation } from "./product";

export const clearForm = (): ProductInformation => {
    return {
      name: '',
      price: 0,
      description: '',
      subcategory: null,
      category: -1,
      image_path: {file: null, path: ''}
    }
  };
  