"use client";

import React, { FormEvent, useEffect, useState } from 'react'
import { Category, ProductInformation, ProductInformationUpdate, supabaseProduct } from '@/app/utils/product';
import { isFileLessThan1MB } from '@/app/utils/imageOptimization';
import Image from 'next/image';
import { FormGroup, SelectionGroup } from '@/app/utils/components';

export default function ManageProduct() {
 
    const [id, setId] = useState<number | null>();
    
    

  return (
    <div>
        { <AllProduct onClick={(num) =>setId(13)} />}
        {id != null && <SingleProductPopUp id={id} onClose={() => setId(null)} />} 
    </div>
  )
}


function AllProduct({onClick}: {onClick: (arg: number) => void}) {
    const [product, setProduct] = useState<ProductInformation[]>([])
    const [filteredProduct, setFilteredProduct] = useState<ProductInformation[]>([])
    const [category, setCategories] = useState<Category[]>([]);

    const loadProduct = async () => {
        const {success, otherInfo} = await supabaseProduct().allProduct();
        
        if(success) {
            setFilteredProduct(otherInfo as ProductInformation[])
            setProduct(otherInfo as ProductInformation[])
        };
    
        

    }

    function filterProduct(id: number) {
        if(id) {
            const newFiltered = product.filter((item) => item.category == id);
            setFilteredProduct(newFiltered);
        }
        else {
            setFilteredProduct(product);
        }
    }
    async function loadCategories () {
        const data = await supabaseProduct().loadProductCategories()
        if(data) setCategories(data);
    }

    function checkCategories (id: number) {
        
        // return category.filter((item) => item.id == id)[0].name;
        return category.filter((item) => item.id == id)[0]?.name ?? '';
    }


    useEffect(() => {
        loadCategories()
        loadProduct();


    }, [])

  return (
    <div className=' w-[500px]'>
    {/* <SingleProductPopUp id={13} onClose={() => console.log('dd')} /> */}
    <SelectionGroup
            label='Categories'
            data={category}
            name='category'
            onChange={(data) => {
                filterProduct(data as number);
            }}
        />
    <table className='table-fixed' border={100}>
        <thead className='bg-blue-600 text-white'>
            <tr className='text-left'>
                <th className='p-2'>ID</th>
                <th className='w-[60%] p-2'>Product Name</th>
                <th className='p-2'>Price</th>
                <th className='p-2'>Categories</th>
                <th className='p-2'>Action</th>
            </tr>
        </thead>
       
        <tbody className='p-2 text-black'>
            {
               filteredProduct && filteredProduct.map((item, index) => (
                    <tr key={index} className={index % 2 == 0 ? 'bg-blue-200' : 'bg-white'}>
                        <td className='p-2'>{item.id}</td>
                        <td className='p-2'>{item.name}</td>
                        <td className='p-2'>{item.price}</td>
                        <td className='p-2'>{checkCategories(item.category)}</td>
                        <td>
                            <div>
                                <table>
                                <tbody>
                                    <tr>
                                        <td className='px-2 text-white rounded bg-green-500'><button onClick={() => onClick(item.id ?? -1)} >Edit</button></td>
                                        <td className='p-2 text-red-500'><button>Delete</button></td>
                                    </tr>
                                </tbody>

                                </table>

                            </div>
                        </td>
                    </tr>
                ))
            }
        </tbody>
    </table>
</div>
  )
}



const SingleProductPopUp = ({id, onClose}: {id: number, onClose: () => void}) => {

    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isCompleted, setIsCompleted] = useState<boolean>(false)
    const [categories, setCategories] = useState<Category[]>([{}]);
    const [formError, setFormError] = useState("");
    const [formSuccess, setFormSuccess] = useState("");
    const [imageChanged, setImageChanged] = useState<boolean>(false);
    
    const [productInformation, setProductInformation] = useState<ProductInformation | null>(null)
    const [updatedInfo, setUpdatedInfo] = useState<ProductInformationUpdate>({});

    async function onSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        
        setFormError('');
        setFormSuccess('');
        
        setIsLoading(true)
        
        if(updatedInfo != null && productInformation != null){
            let newUpdatedInfo = {...updatedInfo}
            if(updatedInfo.image_path?.file) {
                const id = productInformation.id?.toString() ?? '0';
                const {success, message, otherInfo} = 
                    await supabaseProduct().replacePath(productInformation.image_path.path, updatedInfo.image_path.file[0]);
                
                if(success) {
                    newUpdatedInfo['image_path'] = otherInfo;
                }
                else {
                    setFormError(message ?? '')
                    setIsLoading(false);
                    return;
                };
            }
            
            const {success, message} = await supabaseProduct()
                        .updateProduct({...newUpdatedInfo}, productInformation!.id ?? -1)
            
            if(success) setFormSuccess('Successfully updated Info') 
            else setFormError(message ?? "");   
        }
    
        setIsLoading(false);
        
      }

      const loadCategories = async () => {
        const categories = await supabaseProduct().loadProductCategories()
        if(categories) return setCategories(categories);
      }

      const loadSingleProduct = async () => {
        const {success, data, message} = await supabaseProduct().loadSingleProduct(id);
        if(success && data != null) setProductInformation(data)
        if(!success && message) setFormError(message)    
      }

      useEffect(() => {
        loadCategories();
        loadSingleProduct();
      }, [productInformation]);

    return  (
        <div className='fixed top-10 bg-white p-2 rounded  translate-[-50%]  overflow-y-scroll h-[90vh] text-black'>
            
        {
            productInformation == null ? <div className='place-items-center'>Loading</div>:
            
            <div>
            
            <h1 className='font-bold text-blue-700 text-center'>Update Product</h1>
        
        <form onSubmit={onSubmit}>
            <FormGroup label='Product Name' name='name' value={updatedInfo['name'] ?? productInformation['name']} 
                        onChange={(data) => setUpdatedInfo({...updatedInfo, name: data as string})} />
                        
            <FormGroup label='Product Price' type={'number'} value={updatedInfo['price'] ?? productInformation['price']} name='price' 
                        onChange={(data) => setUpdatedInfo({...updatedInfo, price: data as number})} />
            
            <SelectionGroup label='Category' 
                value={productInformation['category']}
                data={categories} name='category' 
                onChange={(data) => setUpdatedInfo({...updatedInfo, category: data as number})} />

            <FormGroup label='Description' value={updatedInfo['description'] ?? productInformation['description']}
                 name='description' onChange={(data) => setUpdatedInfo({...updatedInfo, description: data as string})} />
            
            <FormGroup label='Image Upload' type='file' accept='image/*' name='image' 
                required={false}
                onChange={(data) => {
                if(data != null) {
                    const file = data as FileList;
                    if(isFileLessThan1MB(file) == false){
                    setFormError('File must be less than 400kb')
                    return;
                    }
                    setFormError('');
                    setUpdatedInfo({
                        ...updatedInfo,
                        image_path: {
                            file: data as FileList,
                            path: ""
                        }
                    })
                    // updatedInfo['image_path'] = data as FileList
                    setImageChanged(true);
                }
                }} />
            
            { 
            !imageChanged && <Image
                loader={({src}) => supabaseProduct().getProductURL(productInformation.image_path.path)}
                src={supabaseProduct().getProductURL(productInformation.image_path.path)}
                alt={productInformation.name}
                width={200}
                height={200}
            />}
            {formError && <div className='bg-red-500 text-white text-center py-2 mb-2'>{formError}</div>}
            {formSuccess && <div className='bg-green-500 text-white text-center py-2 mb-2'>{formSuccess}</div>}
            <div className='flex gap-2'>
                
            <button className={`w-full bg-red-600 p-3 rounded text-white`} onClick={onClose}>
                    Close
                </button>    
                <button type='submit' className={`w-full bg-blue-600 p-3 rounded text-white ${isLoading && 'bg-gray-700'}`}>
                    {isLoading ? "Updating Product" : "Update Product" }
                </button>
            </div>
            </form>     
        </div>
        }
        
        </div>

    )
    
}



const allProduct = (): ProductInformation[] => {
    return [
        {
            id: 0,
            name: 'New Product',
            price: 2000,
            description: 'New product to launch',
            category: 1,
            image_path: {
                file: null,
                path: 'new'
            }   
        },
        {
            id: 1,
            name: 'New Product',
            price: 2000,
            description: 'New product to launch',
            category: 1,
            image_path: {
                file: null,
                path: 'new'
            }   
        },
        {
            id: 2,
            name: 'New Product',
            price: 2000,
            description: 'New product to launch',
            category: 1,
            image_path: {
                file: null,
                path: 'new'
            }   
        }

    ]
}