import React from 'react'

import Image from "next/image";

export default function HomPage() {


const list: {href: string, title: string}[] = [
    {    href: '/category/bar',
        title: 'Bar'
    },

    {    href: '/category/cigar',
        title: 'Cigar'
    },

    {    href: '/category/kitchen',
        title: 'Kitchen'
    },

];

  return (
    <main className='flex min-h-screen justify-center place-items-center bg-white px-4'>
        <div className='max-w-[800px]'> 
            <div>
            <div className='flex flex-col mb-10 justify-center place-items-center gap-3'>
                <div>
                    <Image
                        src="/logo_sly.jpeg"
                        alt="Vercel Logo"
                        className="dark:invert"
                        width={200}
                        height={100}
                        priority
                    />

                </div>

                <h3 className='text-center'> 
                    <a className='underline underline-offset-2 text-black' href="https://www.google.com/maps/place/2+Simpson+St,+Lagos+Island,+Lagos+102273,+Lagos/@6.4501,3.3991474,17z/data=!3m1!4b1!4m6!3m5!1s0x103b8b3d297725e9:0x1c541a25b990822a!8m2!3d6.4500947!4d3.4017223!16s%2Fg%2F11fx0s80j3?entry=ttu">
                    2, Simpson Street, Opp High Court, Lagos Island, Lagos State</a> </h3>
            </div>
            </div>
            <h1 className='font-bold text-center mb-5'>Choose from our Categories</h1>
            <ul className='leading-9'>
                {
                    list.map(({href, title}) => <li key={title.toLowerCase()} className='mb-2'><ListItem href={href} title={title}/></li> )
                }
                
            </ul>
        </div>
    </main>
  )
}


function ListItem ({href, title}: {href: string, title: string}) {
    return  <a role='button' className='animate-fade-in text-white w-full bg-gradient-to-r from-blue-500 to-blue-950 rounded-lg p-3 px-5 font-bold block' href={href}>{title}</a>
}