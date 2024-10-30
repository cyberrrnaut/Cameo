import React from 'react'

export default function Table({title, description}:{title:string, description: string}) {
  return (
    <div className='flex gap-3'>
       
       <h1 className='text-xl font-bold'>{title}</h1>
       <h1 className='text-slate-400'>{description}</h1>
    </div>
  )
}
