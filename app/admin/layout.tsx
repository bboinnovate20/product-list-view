"use client";
import Image from "next/image";
import { authUser } from "../utils/userAuth";
import { redirect } from 'next/navigation'
import { useRouter } from 'next/navigation';

export default function DashboardLayout({
    children
  }: {
    children: React.ReactNode,
  }) {
    const router = useRouter();

    async function logoutUser() {
      await authUser().logoutUser();
      router.replace('/login')  
    }

    return (
      
      <main className='flex flex-col min-h-screen place-items-center bg-white'>
        <nav className="flex flex-row place-items-center bg-blue-950 w-full p-4 mb-10   ">
            <a href="/">
                <Image
                            src="/logo_sly.jpeg"
                            alt="Vercel Logo"
                            className="dark:invert"
                            width={50}
                            height={50}
                            priority
                        />
            </a>
            <h1 className=" text-white text-center flex-grow font-bold text-lg"> ADMIN SECTION </h1>  
            <button type='submit' className={` bg-blue-600 p-3 rounded text-white`} onClick={() => logoutUser()}>
            Logout
          </button>
        </nav>
        <section className="w-[90vw] lg:max-w-[800px]">
            {children}
        </section>
      </main>
    )};