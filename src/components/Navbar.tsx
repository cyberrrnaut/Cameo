import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import MobileNav from './MobileNav'
import {
  
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs'
export default function Navbar() {
  return (
    <div className='flex justify-between shadow-xl h-20' >
       <Link href={'/'}>
      <div className=' flex'>
       
       
      <Image src={'/icons/app.png'} width={100} height={100} alt='Logo'></Image> 
      <p className='font-extrabold text-white text-2xl pt-6 pr-2 max-sm:hidden'>Cameo</p>
    
      </div>
      </Link>
      

      <div className='pt-9 pr-12 '>
      <SignedOut>
            <SignInButton />
          </SignedOut>
          <SignedIn>
            <UserButton  />

          </SignedIn>
        mobile nav 
      <MobileNav/>
      </div>
      
     
  
    </div>
  )
}
