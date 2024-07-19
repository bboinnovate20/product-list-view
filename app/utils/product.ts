import { createBrowserClient } from "@supabase/ssr";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { PRODUCT_PATH } from "./constant";
import { url } from "inspector";


export interface Response  {success: boolean, message?: string, data?: ProductInformation, otherInfo?: any}
export interface ProductInformation {
    id?: number,
    name: string,
    price: number,
    description: string,
    category: number,
    image_path: {file: FileList | null, path: string, updatedPath?: string}
}

export interface ProductInformationUpdate {
    name?: string,
    price?: number,
    description?: string,
    category?: number,
    image_path?: {file: FileList | null, path: string, updatedPath?: string}
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

    async getLastId() {
        const {data} = await this.supabaseClient.from('product').select('id').order('id', {ascending: false}).limit(1);

        return data && data[0].id;

    }
    async addProduct(productInformation: ProductInformation): Promise<any[]> {
        const productId = await this.getLastId();
        const name = (productId ?? 0) + 1 + '_' + productInformation.name.split(' ').join('_');

        if(productInformation.image_path != null) {
            const serverImageUpload: any[] = await 
                    this.uploadImageToServer(name, 
                        productInformation.image_path.file!);
      
            if(serverImageUpload[0]) {
                const info = productInformation;
                info.image_path.path =  serverImageUpload[1];
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

    async updateProduct(productInfo: ProductInformationUpdate, id: number): Promise<Response> {
        const{data, error} = await this.supabaseClient.from('product').update(productInfo).eq('id', id);

        if(error) return {success: false, message: error.message};
        return {success: true}
    }

    deleteProduct() {

    }

    async allProduct(): Promise<Response>{
        const {data, error} = await this.supabaseClient.from('product').select('*');

        if(error) return {success: false, message: error.message}

        return {success: true, otherInfo: data as ProductInformation[]}
    }

    

    async loadSingleProduct(id: number) : Promise<Response> {
        const {error, data} = await this.supabaseClient.from('product').select('*').eq('id', id).limit(1);

        if(error) return {success: false, message: error.message}
        
        if(data.length >= 1){
            const product: ProductInformation = {
                id: data[0].id,
                name: data[0].name,
                price: data[0].price,
                description: data[0].description,
                category: data[0].category,
                image_path: {
                    file: null,
                    path: data[0].image_path
                }
            }
    
            return {success: true, data: product}
        }
        return {success: false}
        
    }

    async   replacePath (prevPath: string, replacedPath: File): Promise<Response> {

        const{data, error} = await this.supabaseClient.storage.from('products_path').update(prevPath, replacedPath)
        
        if(error) return {success: false, message: error.message}
        return {success: true, otherInfo: data?.path}

    }
    uploadImageToServer = async (name: string, file: FileList): Promise<any[]> => {
        
        if(file[0] == null) return [false, null];
        
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
  getProductURL(path: string) {
    console.log(path);
    return this.supabaseClient.storage.from('products_path').getPublicUrl(path).data.publicUrl;
  }



  async loadProductCategories(): Promise<Category[] | null> {
    const {data, error} = await this.supabaseClient.from('product_categories') .select('name, id');
    if(error) return null
    return data as Category[]
  }

  async getProductByCategory(id: number): Promise<Response> {
    const {data, error} = await this.supabaseClient.from('product').select('*').eq('category', id);
    if(error) return {success: false}
    return {success: true, otherInfo: data as ProductInformation[]}
  }
}



export const supabaseProduct = () => {
    const supabaseInstance = new SupabaseProduct(process.env.NEXT_PUBLIC_VERCEL_URL!, process.env.NEXT_PUBLIC_VERCEL_ENV_SUPABASE_KEY!)
    return supabaseInstance;
}