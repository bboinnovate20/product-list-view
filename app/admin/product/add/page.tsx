"use client";

import { clearForm } from '@/app/utils/clearForm';
import { createClient } from '@/app/utils/client'
import { FormGroup, SelectionGroup } from '@/app/utils/components';
import { PRODUCT_PATH } from '@/app/utils/constant';
import { isFileLessThan1MB } from '@/app/utils/imageOptimization';
import { Category, ProductInformation, supabaseProduct } from '@/app/utils/product';
import { SupabaseClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import React, { useState, FormEvent, useEffect } from 'react'


export default function AddProduct() {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isCompleted, setIsCompleted] = useState<boolean>(false)
  const [categories, setCategories] = useState<Category[]>([{}]);
  const [SCategories, SetSCategories] = useState<Category[]>([]);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
 
  const [productInformation, setProductInformation] = useState<ProductInformation>(clearForm())


  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()  
    const target = event.currentTarget;
    setFormError('');
    setFormSuccess('');

    setIsLoading(true)
    
    const uploadProduct = await supabaseProduct().addProduct(productInformation);

    if(uploadProduct[0]) {
      target.reset();
      setProductInformation(clearForm());
      setFormSuccess('Successfully uploaded to Product')
    }
    else {
      setFormError(uploadProduct[1]);
    }
    
    setIsLoading(false);
    
  }

  const loadSubCategories = async (categoryId: number) => {
    const {success, otherInfo} = await supabaseProduct().getSubCategory(categoryId);
    if(success) SetSCategories(otherInfo);

  }
  const loadCategories = async () => {
    
    const categories = await supabaseProduct().loadProductCategories()
   
    if(categories) return setCategories(categories);
  }
  async function isSubCategory(id: number) {
    const {success, otherInfo} = await supabaseProduct().loadSingleCategory(id);
    if(success && otherInfo) return otherInfo['isWithSubCategory'];
  }

  useEffect(() => {
     loadCategories()
     
  }, [productInformation])

  return (
    <div>
      
      <h1 className='font-bold text-black text-center'>Add Product</h1>
      <form onSubmit={onSubmit} className='text-black mb-10'>
        <FormGroup label='Product Name' value={productInformation['name']} name='name' onChange={(data) => {
          setProductInformation({...productInformation, name: data as string})}} />
        <FormGroup label='Product Price' value={productInformation['price']} type={'number'} name='price' 
          onChange={(data) => setProductInformation({...productInformation, price: data as number})} />
        
        <SelectionGroup label='Category' 
          data={categories} name='category' 
          value={productInformation['category']}
          onChange={(data) => {
            setProductInformation({...productInformation, category: data as number})
            loadSubCategories(data as number);
          }} />
        
       {SCategories.length >= 1 && <SelectionGroup label='Sub Category' 
          data={SCategories} name='subcategory' 
          value={productInformation['subcategory'] ?? -1}
          onChange={(data) => setProductInformation({...productInformation, subcategory: data as number})} />}

        <FormGroup label='Description' name='description' 
          value={productInformation['description']}
          onChange={(data) => setProductInformation({...productInformation, description: data as string})} />

        <FormGroup label='Image Upload' type='file' accept='image/*' name='image' 
          // value={productInformation['image_path']['path']}
          onChange={(data) => {
            if(data != null) {
              if(isFileLessThan1MB(data as FileList) == false){
                setFormError('File must be less than 400kb')
                return;
              }
              setFormError('');
              setProductInformation({...productInformation, image_path: {file: data as FileList, path: (data as FileList)[0].name} })
            }
          }} />
        {formError && <div className='bg-red-500 text-white text-center py-2 mb-2'>{formError}</div>}
        {formSuccess && <div className='bg-green-500 text-white text-center py-2 mb-2'>{formSuccess}</div>}
        <button type='submit' className={`w-full bg-black p-3 rounded text-white ${isLoading && 'bg-gray-700'}`}>
          {isLoading ? "Adding Product" : "Add Product" }
        </button>
      </form>
    </div>
    
  )
}

<input onChange={(e) => e.target.files}/>






