"use client"

import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { SupabaseClient, SupabaseClientOptions } from "@supabase/supabase-js";
import { cookies } from "next/headers";

export const createClient  = (cookieStore: ReturnType<typeof cookies>) => {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({name, value, options}) => 
              cookieStore.set(name, value, options));
          } catch (error) {
          }
        },
      },
    },
  );
};
