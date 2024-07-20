"use client";
import React, {createContext, FormEvent, useEffect, useState} from 'react'

import Image from "next/image";
import { FormGroup } from '../utils/components';
import { useRouter } from 'next/navigation';
import { authUser } from '../utils/userAuth';
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export default function AdminPage() {
  
  const [isLoading, setIsLoading] = useState<boolean>();
  const [formError, setFormError] = useState("");
  const [loginInfo, setLoginInfo] = useState({email: '', password: ''});
  const [show, setShow] = useState<boolean>(false);

  const router = useRouter()

  async function signIn(email: string, password: string) {
      setFormError('');
      
      const { success, otherInfo, message } = await authUser().signInUser(email, password);

      if (!success) { return setFormError(message?.toString() ?? '') }
      
      // revalidatePath('/admin', 'layout')
      router.push("/admin")
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    await signIn(loginInfo.email, loginInfo.password);
    setIsLoading(false)
  }

  
  return (
    <section>
   <form onSubmit={onSubmit}>
        <h1 className='text-center font-bold font-xlg text-xl'>User Login</h1>
        <FormGroup label='Email' name='email' value={loginInfo['email']} onChange={(email)=>setLoginInfo({...loginInfo, email: email as string})}/>
        <FormGroup label='Password' type='password' value={loginInfo['password']} name='password' onChange={(email)=>setLoginInfo({...loginInfo, password: email as string})}/>
        {formError && <div className='bg-red-500 text-white text-center py-2 mb-2'>{formError}</div>}
        <button type='submit' className={`w-full bg-blue-600 p-3 rounded text-white ${isLoading && 'bg-gray-700'}`}>
            {isLoading ? "Logging User" : "Login In" }
          </button>
      </form>
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

