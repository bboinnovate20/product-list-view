"use client";

import { createClient } from '@/app/utils/client'
import { PRODUCT_PATH } from '@/app/utils/constant';
import { isFileLessThan1MB } from '@/app/utils/imageOptimization';
import { Category, ProductInformation, supabaseProduct } from '@/app/utils/product';
import { SupabaseClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import React, { useState, FormEvent, useEffect } from 'react'

export const clearForm = (): ProductInformation => {
  return {
    name: '',
    price: 0,
    description: '',
    category: 0,
    image_path: {file: null, path: ''}
  }
};

export default function AddProduct() {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isCompleted, setIsCompleted] = useState<boolean>(false)
  const [categories, setCategories] = useState<Category[]>([{}]);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
 
  const [productInformation, setProductInformation] = useState<ProductInformation>(clearForm())


  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    
    setFormError('');
    setFormSuccess('');

    setIsLoading(true)

    const uploadProduct = await supabaseProduct().addProduct(productInformation);

    if(uploadProduct[0]) {
      setFormSuccess('Successfully uploaded to Product')
      setProductInformation(clearForm());
    }
    else {
      setFormError(uploadProduct[1]);
    }

    setIsLoading(false);
    
  }

  const loadCategories = async () => {
    
    const categories = await supabaseProduct().loadProductCategories()
    if(categories) return setCategories(categories);
  }

  useEffect(() => {
     loadCategories()
     
  }, [])

  return (
    <div>
      
      <h1 className='font-bold text-blue-700 text-center'>Add Product</h1>
      <form onSubmit={onSubmit}>
        <FormGroup label='Product Name' name='name' onChange={(data) => productInformation['name'] = data as string} />
        <FormGroup label='Product Price' type={'number'} name='price' onChange={(data) => productInformation['price'] = data as number} />
        
        <SelectionGroup label='Category' 
          data={categories} name='category' 
          onChange={(data) => productInformation['category'] = data as number} />

        <FormGroup label='Description' name='description' onChange={(data) => productInformation['description'] = data as string} />
        
        <FormGroup label='Image Upload' type='file' accept='image/*' name='image' 
          onChange={(data) => {
            if(data != null) {
              if(isFileLessThan1MB(data as FileList) == false){
                setFormError('File must be less than 400kb')
                return;
              }
              setFormError('');
              productInformation['image_path'].file = data as FileList
            }
          }} />
        {formError && <div className='bg-red-500 text-white text-center py-2 mb-2'>{formError}</div>}
        {formSuccess && <div className='bg-green-500 text-white text-center py-2 mb-2'>{formSuccess}</div>}
        <button type='submit' className={`w-full bg-blue-600 p-3 rounded text-white ${isLoading && 'bg-gray-700'}`}>
          {isLoading ? "Adding Product" : "Add Product" }
        </button>
      </form>
    </div>
    
  )
}

<input onChange={(e) => e.target.files}/>


export function SelectionGroup({label, value, data, onChange}: {label: string, name: string, 
    onChange: (data: string | number) => void, data: Category[], value?: number}) {

  return (
    <div className='min-w-[400px] my-5 text-black'>
      <p className='text-sm'>{label}</p>
      <select  className='w-full outline-none border-[2px] border-blue-300 focus:border-blue-500 rounded p-2' 
         defaultValue={value}  
      onChange={({currentTarget}) => onChange(currentTarget.value)}
      
      required>
        <option  value="">--Select Category---</option>
      {
        data.map(({id, name}, index) => (
            <option selected={value == id} key={index} value={id}>{name}</option>
         ))
      }
      </select>
      
    </div>
  )
}

export function FormGroup({label, name, type, value, required, accept, onChange}: {
  type?:string,
  accept?: string,
  required?: boolean,
  value?: string | number,
  label: string, name: string, onChange: (data: string | number | FileList | null) => void}) {
  return (
    <div className='min-w-[400px] my-5'>
      <p className='text-sm'>{label}</p>
      <input type={type ?? 'text'} name={name} accept={accept}
      value={value}
       onChange={({currentTarget, target}) => {
        if(type == 'file')
            return onChange(target.files)
        return onChange(currentTarget.value)
      }}
      className='w-full outline-none border-[2px] border-blue-300 focus:border-blue-500 rounded p-2'  required={required ?? true}/>

    </div>
  )
}

