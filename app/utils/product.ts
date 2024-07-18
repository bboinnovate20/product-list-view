import { createBrowserClient } from "@supabase/ssr";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { PRODUCT_PATH } from "./constant";
import { url } from "inspector";

export interface ProductInformation {
    name: string,
    price: number,
    description: string,
    category: number,
    image_path: {file: FileList | null, path: string}
}

export interface Category {
    id?: number,
    name?: string
  }
  

class SupabaseProduct {

    supabaseClient: SupabaseClient<any>; 

    constructor(url: string, key: string){
        this.supabaseClient = createBrowserClient(url, key);
    }

    async addProduct(productInformation: ProductInformation): Promise<any[]> {
        if(productInformation.image_path != null) {
            const serverImageUpload: any[] = await 
                    this.uploadImageToServer(productInformation.name.split(' ').join('_'), 
                        productInformation.image_path.file!);
      
            if(serverImageUpload[0]) {
                const info = productInformation;
                info.image_path.path =  PRODUCT_PATH + "/" + serverImageUpload[1];
                const response = await this.addProductToServer(info);
                if(response[0]) {
                    return [true, response[1]]
                }
                return [false, response[1]]
            }

            return [false, serverImageUpload[1]];
           
        }
        return [false, null]
    }

    updateProduct() {

    }

    deleteProduct() {

    }


    uploadImageToServer = async (name: string, file: FileList): Promise<any[]> => {
        
        if(file[0] == null) return [false, null];

        const myFile = file[0];
        
        
        const { data, error } = await this.supabaseClient
          .storage
          .from(PRODUCT_PATH)
          .upload(`products/${name}`, file[0], {
            cacheControl: '3600',
            upsert: false
          });
        
        if(error) [false, error.message]
        
        return [true, data?.path];
  }

   addProductToServer = async (data: ProductInformation): Promise<any[]> => {
    
        const addProduct = await this.supabaseClient.from('product')
                                .insert([{...data, image_path: data.image_path.path}])
        
        if(addProduct.error) return [false, addProduct.error.message];
        
        if(addProduct.status == 201) {
            return [true, null];
        }

        return [false, null]
  } 

  async loadProductCategories(): Promise<Category[] | null> {
    const {data, error} = await this.supabaseClient.from('product_categories') .select('name, id');
    if(error) return null
    return data as Category[]
  }
}



export const supabaseProduct = () => {
    const supabaseInstance = new SupabaseProduct(process.env.NEXT_PUBLIC_PROJECT_URL!, process.env.NEXT_PUBLIC_SUPABASE_KEY!)
    return supabaseInstance;
}