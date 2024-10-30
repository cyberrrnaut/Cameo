'use client'

import Table from '@/components/Table'
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useGetCallById } from '@/hooks/useGetCallById';
import { useUser } from '@clerk/nextjs'
import { useStreamVideoClient } from '@stream-io/video-react-sdk';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react'



export default function Page() {
  const {toast} = useToast();
  const router= useRouter();
   const {user} =useUser();
  
   const meetingId = user?.id;

   const client  = useStreamVideoClient();

  const MeetinLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${meetingId}?personal=true`;
   
   const {call} = useGetCallById(meetingId!);


  const startMeeting= async()=>{
    
    if(!client || !user || !meetingId) return;
      
      if(!call){
        const newCall =client.call('default',meetingId);

        await newCall.getOrCreate({
          data:{
            starts_at: new Date().toISOString(),
          }
        })
      
       router.push(`meeting/${meetingId}?personal=true`)
      }
    }

    const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${meetingId}`;

  return (
    <div className='text-white flex flex-col gap-7'>
      <h1 className='text-3xl font-extrabold'>  Personal Room 
      </h1>
      

      <div className='flex flex-col gap-4'>
      <Table title='Topic' description={`${user?.username}'s personal room`}/>
      <Table title='Meeting Id' description={`${user?.id}`}/>
      <Table title='Invite Link' description={`${MeetinLink}`}/>
      </div>

      


      <div className='flex gap-4'>
       <Button className='bg-cyan-400' onClick={startMeeting}>Start meeting</Button>
        
       <Button onClick={()=>{navigator.clipboard.writeText(meetingLink);
              toast({ title: 'Link Copied' });}} >  <Image src={'icons/copy.svg'} width={13} height={13} alt='play'/> 
              <h1>Copy Invitation</h1></Button>

      </div>


    </div>
  )
}
