import CardListType from '@/components/CardListType'
import React from 'react'

export default function Page() {
  return (
    <section >
     <div className='w-full h-[300px] shadow-lg bg-hero rounded-md  '>
       <div className=' h-full justify-start  flex flex-col '>
   <div className=' h-full justify-around  flex flex-col'>

   <p>  no meeting at 12:30 PM </p>

<p> 12:40 PM</p>

<p>Saturday, 29 NOV 2024 </p>
   </div>
     
    
       </div>
    
     </div>
     <CardListType />

    </section>
  )
}
