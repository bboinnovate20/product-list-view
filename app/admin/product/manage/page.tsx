"use client";

import React, { FormEvent, useEffect, useState } from 'react'
import { Category, ProductInformation, ProductInformationUpdate, supabaseProduct } from '@/app/utils/product';
import { isFileLessThan1MB } from '@/app/utils/imageOptimization';
import Image from 'next/image';
import { FormGroup, SelectionGroup } from '@/app/utils/components';
import { currencyConvert } from '@/app/utils/currency';

export default function ManageProduct() {
 
    const [id, setId] = useState<number | null>();
    
    

  return (
    <div>
        { <AllProduct onDelete={(num) => setId(num)} onEdit={(num) =>setId(num)} />}
        {id != null && <SingleProductPopUp id={id} onClose={() => setId(null)} />} 
    </div>
  )
}


function AllProduct({onEdit, onDelete}: {onEdit: (arg: number) => void, onDelete: (arg: number) => void }) {
    const [product, setProduct] = useState<ProductInformation[]>([])
    const [filteredProduct, setFilteredProduct] = useState<ProductInformation[]>([])
    const [category, setCategories] = useState<Category[]>([]);
    const [deleteId, setDeleteId] = useState<number>(-1);

    const loadProduct = async () => {
        const {success, otherInfo} = await supabaseProduct().allProduct();
        
        if(success) {
            setFilteredProduct(otherInfo as ProductInformation[])
            setProduct(otherInfo as ProductInformation[])
        };
    
        

    }

    function filterProduct(id: number | string) {
        if(id) {
            let newFiltered;
            if(typeof id == 'number'){
                newFiltered = product.filter((item) => item.category == id);
            }
            else {
                
                newFiltered = product.filter((item) => item.name.toLowerCase().includes(id.toLowerCase()));
                
            }
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
    
    async function deleteProduct(id: number) {
        if(id < 0) return;
        setDeleteId(id);
        const {success} = await supabaseProduct().deleteProduct(id);
        if(success) {
            loadProduct();
        }
        return setDeleteId(-1)

    }

    useEffect(() => {
        loadCategories()
        loadProduct();


    }, [])

  return (
    <div className=' max-w-full overflow-x-scroll '>
    {/* <SingleProductPopUp id={13} onClose={() => console.log('dd')} /> */}
    <FormGroup label='Search Product' name='search' onChange={(data) => {filterProduct(data as string)}}/>
    <SelectionGroup
            label='Categories'
            data={category}
            name='category'
            onChange={(data) => {
                filterProduct(data as number);
            }}
        />
    
    <table className='table-fixed w-full min-w-[500px]' border={100}>
        <thead className='bg-black text-white'>
            <tr className='text-left'>
                <th className='p-2 w-[5%]'>ID</th>
                <th className='p-2 w-[30%]'>Product Name</th>
                <th className='p-2'>Price</th>
                <th className='p-2'>Categories</th>
                <th className='p-2 w-[30%]'>Action</th>
            </tr>
        </thead>
       
        <tbody className='p-2 text-black'>
            {
               filteredProduct && filteredProduct.map((item, index) => (
                    <tr key={index} className={index % 2 == 0 ? 'bg-slate-500' : 'bg-white'}>
                        <td className='p-2'>{index+1}</td>
                        <td className='p-2 w-[40%]'>{item.name}</td>
                        <td className='p-2'>{currencyConvert(item.price)}</td>
                        <td className='p-2'>{checkCategories(item.category)}</td>
                        <td>
                            <div>
                                <table>
                                <tbody>
                                    <tr>
                                        <td className='px-2 text-white rounded bg-green-500'><button onClick={() => onEdit(item.id ?? -1)} >Edit</button></td>
                                        <td className='p-2 text-red-500'><button disabled={deleteId >= 0} onClick={() => deleteProduct(item.id ?? -1)}>{item.id === deleteId ? "Deleting": "Delete"}</button></td>
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
        <div className='top-0 left-0 right-0 bottom-0 h-screen translate-0 fixed md:top-10 
                    bg-white p-2 rounded  md:translate-[-50%] md:left-[50%] md:translate-x-[-50%] md:w-[500px]  overflow-y-scroll md:h-[90vh] text-black'>
            
        {
            productInformation == null ? <div className='place-items-center'>Loading</div>:
            
            <div>
            
            <h1 className='font-bold text-black text-center'>Update Product</h1>
        
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
                <button type='submit' className={`w-full bg-black p-3 rounded text-white ${isLoading && 'bg-gray-700'}`}>
                    {isLoading ? "Updating Product" : "Update Product" }
                </button>
            </div>
            </form>     
        </div>
        }
        
        </div>

    )
    
}

