import Image from "next/image";

export default function DashboardLayout({
    children, params
  }: {
    children: React.ReactNode,
    params: {slug: string}
  }) {
    return (
      <main className='flex flex-col min-h-screen place-items-center bg-white'>
        <nav className="flex flex-row place-items-center bg-blue-950 w-full p-4 mb-10   ">
            <a href="/">
                <Image
                            src="/logo_sly.jpeg"
                            alt="Vercel Logo"
                            className=""
                            width={50}
                            height={50}
                            priority
                        />
            </a>
            <h1 className=" text-white text-center flex-grow font-bold text-lg">{params.slug.split('_')[1].toUpperCase()} CATEGORIES</h1>   
        </nav>
        <section className="px-4 max-w-[800px]">
            {children}
        </section>
      </main>
    )};