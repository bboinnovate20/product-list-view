"use client"
import React, { useEffect, useState } from 'react'

import Image from "next/image";
import { supabaseProduct, ProductInformation, Category } from '@/app/utils/product';
import { currencyConvert } from '@/app/utils/currency';

export default function HomPage({params}: {params: {
    slug: string
}}) {
    
    const [productCatg, setProductCatg] = useState<ProductInformation[]>([]);
    const [subCategory, setSubCategory] = useState<Category[]>([]);

    async function getSubCategory() {
        const id = Number(params.slug.split('_')[0] ?? 0);
        const {success, otherInfo} = await supabaseProduct().getSubCategory(id);
        if(success  && await isSubCategory(id)) setSubCategory(otherInfo);
        
   }

  async function getProductByCategory() {
    const id = Number(params.slug.split('_')[0] ?? 0);
    console.log(id);
    const {success, otherInfo} = await supabaseProduct().getProductByCategory(id);
    if(success) setProductCatg(otherInfo);

  }

  async function isSubCategory(id: number) {
    const {success, otherInfo} = await supabaseProduct().loadSingleCategory(id);
    if(success && otherInfo) return otherInfo['isWithSubCategory'];
  }



  useEffect(() => {
    getProductByCategory();
    getSubCategory();
  }, [])

  return (
            <section key={11} className='flex flex-row gap-y-5 gap-2 lg:gap-5 flex-wrap justify-between lg:justify-start text-black'>
            {
                subCategory.length >= 1 ? subCategory.map(({name, id}, index) => 
                 <>
                     <h2 key={index} className='font-bold w-full bg-black text-white p-2 px-4 rounded'>{name}</h2>
                    {
                        productCatg.filter(({subcategory}) => subcategory == id)
                        .map(({name, image_path, price}) =>  
                            <article  key={name} className='basis-[47%] lg:basis-[48%]  cursor-pointer hover:scale-105 hover:shadow-lg rounded transition-transform'>
                                <div className=' bg-white flex place-items-center overflow-hidden object-contain'>
                                    <Image
                                        src={supabaseProduct().getProductURL(image_path.toString())}
                                        loader={({src}) => supabaseProduct().getProductURL(image_path.toString())}
                                        alt={name}
                                        className="object-cover lg:h-[350px] h-[200px]"
                                        width={400}
                                        height={200}
                                        priority
                                    />
                                </div>
                                <div className='px-2 py-2'>
                                    <p className='text-sm line-clamp-1'>{name}</p>    
                                    <h2 className='font-bold text-lg'>₦{currencyConvert(price)}</h2>
                                </div>
                            </article>)
                    }
                 </>) : 
                 <>
                 {
                    productCatg.length >= 1 && productCatg
                        .map(({name, image_path, price}) =>  
                            <article  key={name} className='basis-[47%] lg:basis-[48%]  cursor-pointer hover:scale-105 hover:shadow-lg rounded transition-transform'>
                                <div className=' bg-white flex place-items-center overflow-hidden object-contain'>
                                    <Image
                                        src={supabaseProduct().getProductURL(image_path.toString())}
                                        loader={({src}) => supabaseProduct().getProductURL(image_path.toString())}
                                        alt={name}
                                        className="object-cover lg:h-[350px] h-[200px]"
                                        width={400}
                                        height={200}
                                        priority
                                    />
                                </div>
                                <div className='px-2 py-2'>
                                    <p className='text-sm line-clamp-1'>{name}</p>    
                                    <h2 className='font-bold text-lg'>₦{currencyConvert(price)}</h2>
                                </div>
                            </article>)
                    }
                 </>
            }
                
            </section>    
        )
            
    
}


