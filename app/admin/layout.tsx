import Image from "next/image";
import { useEffect } from "react";


export default function DashboardLayout({
    children
  }: {
    children: React.ReactNode,
  }) {


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
        </nav>
        <section className="px-4 max-w-[800px]">
            {children}
        </section>
      </main>
    )};