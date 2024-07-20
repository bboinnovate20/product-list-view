import { createBrowserClient } from "@supabase/ssr";
import { SupabaseClient } from "@supabase/supabase-js";
import router from "next/router";
import { ResponseData } from "./product";



class User {

    supabaseClient: SupabaseClient<any>; 

    constructor(url: string, key: string) {
        this.supabaseClient = createBrowserClient(url, key);
    }

    async signInUser(email: string, password: string): Promise<ResponseData> {
        const { error, data } = await this.supabaseClient.auth.signInWithPassword({email, password});

        if(error) return {success: false, message: error.message}
        return {success: true, otherInfo: data}
    
    }

    async getUserData() {
        const { data: { user } } = await this.supabaseClient.auth.getUser();
        if(user) return user
        return null
    }

    async logoutUser() {
       await this.supabaseClient.auth.signOut();
    }

}

export const authUser = () => new User(
    
    process.env.NEXT_PUBLIC_VERCEL_URL!, process.env.NEXT_PUBLIC_VERCEL_ENV_SUPABASE_KEY!
)

// const supabaseInstance = new SupabaseProduct(process.env.NEXT_PUBLIC_VERCEL_URL!, process.env.NEXT_PUBLIC_VERCEL_ENV_SUPABASE_KEY!)