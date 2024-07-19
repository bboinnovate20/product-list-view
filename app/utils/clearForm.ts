import { ProductInformation } from "./product";

export const clearForm = (): ProductInformation => {
    return {
      name: '',
      price: 0,
      description: '',
      category: 0,
      image_path: {file: null, path: ''}
    }
  };
  