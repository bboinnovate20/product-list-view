"use client"
import React, { useEffect, useState } from 'react'

import Image from "next/image";
import { supabaseProduct, ProductInformation } from '@/app/utils/product';

export default function HomPage({params}: {params: {
    slug: string
}}) {
    
    const [productCatg, setProductCatg] = useState<ProductInformation[]>([]);

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

  async function getProductByCategory() {
    const id = Number(params.slug.split('_')[0]);
    const {success, otherInfo} = await supabaseProduct().getProductByCategory(id);
    if(success) setProductCatg(otherInfo);
  }

  useEffect(() => {
    getProductByCategory();
  }, [])

  return (
    
        <section className='flex flex-row gap-y-10 gap-5 flex-wrap justify-between lg:justify-start text-black'>
            {productCatg.map(({name, price, image_path}) =>  
            
                <article  key={name} className='basis-[44%] md:basis-[44%] lg:basis-[22%] lg:min-w-[200px] cursor-pointer hover:scale-105 hover:shadow-lg rounded transition-transform'>
                    <div className=' bg-white flex place-items-center overflow-hidden object-contain'>
                        <Image
                            src={supabaseProduct().getProductURL(image_path.toString())}
                            loader={({src}) => supabaseProduct().getProductURL(image_path.toString())}
                            alt={name}
                            className="object-contain h-[120px]"
                            width={200}
                            height={100}
                            priority
                        />
                    </div>
                    <div className='px-2 py-2'>
                        <p className='text-sm line-clamp-1'>{name}</p>    
                        <h2 className='font-bold text-lg'>₦{price}</h2>
                    </div>
                </article>)
            }

        </section>    
    
  )
}


