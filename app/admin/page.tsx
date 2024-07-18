import React, {createContext} from 'react'

import Image from "next/image";



export default function AdminPage() {
  

  return (
    
    <section className=''>
        <Features name={"Add Product"} icon="add-prod.svg" route='/product/add'/>
        <Features name={"Manage Product"} icon="products.svg" route='/product/manage'/>
        <Features name={"Notification"} icon="notification.svg" route='/product/notification'/>
    </section>
    
  )
}


function Features({name, icon, route}: {name: string, icon: string,  route: string}) {
  return (
      <a className='bg-blue-400 rounded-lg p-2 flex flex-col gap-4 place-items-center my-2 min-w-[200px] 
                    transition-transform hover:scale-105 cursor-pointer ' href={route}>
                <Image
                                src={icon}
                                alt={name}
                                width={50}
                                height={10}
                                priority/>
                        
                        <h1 className='text-white'>{name}</h1>
                        {/* <div>
                            <h1>{name}</h1>    
                        </div> */}
           
        </a>
    
        
  )
}

