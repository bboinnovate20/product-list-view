import Image from "next/image";

export default function DashboardLayout({
    children, params
  }: {
    children: React.ReactNode,
    params: {slug: string}
  }) {
    return (
      <main className='flex flex-col min-h-screen place-items-center bg-white'>
        <nav className="flex flex-row place-items-center bg-black w-full p-4 mb-8   ">
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
        <div className="flex flex-col mb-10 justify-center place-items-center gap-3 text-black">

            <Image
                            src="/logo_sly.jpeg"
                            alt="Vercel Logo"
                            className=""
                            width={180}
                            height={100}
                            priority
                        />
						<h3 className="text-center">
							<a
								className="underline underline-offset-2 text-black text-sm"
								href="https://www.google.com/maps/place/2+Simpson+St,+Lagos+Island,+Lagos+102273,+Lagos/@6.4501,3.3991474,17z/data=!3m1!4b1!4m6!3m5!1s0x103b8b3d297725e9:0x1c541a25b990822a!8m2!3d6.4500947!4d3.4017223!16s%2Fg%2F11fx0s80j3?entry=ttu"
							>
								2, Simpson Street, Opp High Court, Lagos Island, Lagos State
							</a>{" "}
						</h3>
					</div>
            <h1 className='text-[30px] font-bold text-black'>{params.slug.split('_')[1]}</h1>
            <hr className='mb-5 border-1' />
            {children}
        </section>
      </main>
    )};