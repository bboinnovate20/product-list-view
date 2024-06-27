import React from 'react'

import Image from "next/image";

export default function HomPage() {
    

   const categoryItem = [
    {
        name: 'New Drink',
        price: '5,000',
        image: '/logo_sly.jpeg'
    },
    {
        name: 'Ha New Drink',
        price: '500,000',
        image: '/phone.jpg'
    },
    {
        name: 'New Drink 1',
        price: '5,000',
        image: '/logo_sly.jpeg'
    },
    {
        name: 'Ha New Drink 2',
        price: '500,000',
        image: '/phone.jpg'
    },
    {
        name: 'New Drink 3',
        price: '5,000',
        image: '/logo_sly.jpeg'
    },
    {
        name: 'Ha New Drink 4',
        price: '500,000',
        image: '/phone.jpg'
    }
   ]


  return (
    
        <section className='flex flex-row gap-4 flex-wrap justify-between lg:justify-start'>
            {categoryItem.map(({name, price, image}) =>  
            
                <article  key={name} className='basis-[44%] md:basis-[44%] lg:basis-[22%]'>
                    <div className=' bg-white flex place-items-center overflow-hidden object-contain'>
                        <Image
                            src={image}
                            alt="Vercel Logo"
                            className="dark:invert object-contain h-[120px]"
                            width={200}
                            height={100}
                            priority
                        />
                    </div>
                    <div className='px-2 py-2'>
                        <p className='text-sm line-clamp-1'>{name}</p>    
                        <h2 className='font-bold text-sm'>₦{price}</h2>

                    </div>
                </article>)
            }

        </section>    
    
  )
}


