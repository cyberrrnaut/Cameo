'use client'
import React, { useState } from 'react'
import HomeCard from './HomeCard'
import ModalCard from './ModalCard'
import { useUser } from '@clerk/nextjs';
import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk';
import { useToast } from "@/hooks/use-toast"
import { useRouter } from 'next/navigation';
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';


const initialValues = {
  dateTime: new Date(),
  description: '',
  link: '',
};


export default function CardListType() {

  const router = useRouter();
  const { toast } = useToast()

  const [meetingState,setMeetingState] = useState<
  'isScheduleMeeting' | 'isJoiningMeeting' | 'isInstantMeeting' | undefined
>(undefined);
const client = useStreamVideoClient();
const { user } = useUser();
const[values,setValues ] = useState(initialValues)
const[callDetail, setCallDetail]= useState<Call>();


  const createMeeting= async()=>{
  
    
    if (!client || !user) return;
    
   
      if (!values.dateTime) {
        toast({ title: 'Please select a date and time' });
        return;
      }
      const callType = 'default';
      const callId =   Math.random().toString(36).substr(2, 9);
  
      const call = client.call(callType, callId);
      if (!call) throw new Error('Failed to create meeting');
      
      const startsAt =
      values.dateTime.toISOString() || new Date(Date.now()).toISOString();     
       const description = values.description || 'Instant Meeting';
      
      try {
        await call.getOrCreate({
          data: {
            starts_at: startsAt,
            custom: {
              description,
            },
          },
        });
        
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error:any) {
        console.error('Error creating call:', error);
        toast({ title: 'Failed to create meeting', description: error.message });
      }
      
      setCallDetail(call); 
      
      if (!values.description) {  // if no description then it is an instant meet so redirect 
        router.push(`/meeting/${call.id}`);
      }
      toast({
        title: 'Meeting Created',
      });
   
  }

  const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${callDetail?.id}`;
  
  return (
  
    <div className='justify-between grid grid-cols-1 gap-3  md:grid-cols-2 xl:grid-cols-4  pt-10 '>
        <HomeCard className={' bg-green-700 shadow-slate-400 backdrop-blur-lg ' } title={'New Meeting'} img={'/icons/add-meeting.svg'} description={'Setup a new recording'}
         handleClick={()=>{setMeetingState('isInstantMeeting')}} /> 
         <HomeCard className={'  bg-pink-900 shadow-slate-400' } title={'Schedule Meeting'} img={'/icons/join-meeting.svg'} description={'Plan your meeting' }
         handleClick={()=>{setMeetingState('isScheduleMeeting')}} /> 
           <HomeCard className={' bg-orange-700 shadow-slate-400' } title={'Join Meeting'} img={'/icons/schedule.svg'} description={'via invitation link'}
         handleClick={()=>{setMeetingState('isJoiningMeeting')}} />
         <HomeCard className={'  bg-yellow-600 shadow-slate-400' } title={'View Recordings'} img={'/icons/recordings.svg'} description={'Meeting recordings'}
         handleClick={()=>{router.push(`/meeting-recordings`)}} />
        

         <ModalCard  isOpen= {meetingState==='isInstantMeeting'} onClose={()=>{setMeetingState(undefined)}}
            title='Create Meeting' className=''  handleClick={createMeeting} buttonText='Create Meeting'
            buttonIcon='' image=''  
           childrenUp={false} />

            {!callDetail ?    (    <ModalCard isOpen= {meetingState==='isScheduleMeeting'} onClose={()=>{setMeetingState(undefined)}}
            title='Schedule Meeting' className=''  handleClick={createMeeting} buttonText='Schedule Meeting'
            buttonIcon='' image=''  childrenUp={true}
            >
              <Textarea required
             className='border-none border-0 bg-slate-900' 
              onChange={(e) => {
              setValues((prevValues) => ({
               ...prevValues,
             description: e.target.value,
              }));}}/>

              <DatePicker className='bg-slate-900 p-2 rounded-md'
        selected={values.dateTime}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onChange={ (date:any) => {
          setValues((prevValues) => ({
            ...prevValues,
            dateTime: date,
          }));
        }}
        showTimeSelect
        dateFormat="Pp"  
        placeholderText="Select a date and time"
      />
        </ModalCard>) :  (     <ModalCard isOpen= {meetingState==='isScheduleMeeting'} onClose={()=>{setMeetingState(undefined)}}
            title={`Meeting scheduled`} className=''  handleClick={()=>{ navigator.clipboard.writeText(meetingLink);
              toast({ title: 'Link Copied' });}} buttonText='Copy Link'
          buttonIcon='/icons/copy.svg' image='/icons/checked.svg'  
           childrenUp={false} >
           <p onClick={()=>{setCallDetail(undefined)}} className='cursor-pointer text-slate-400'>  Schedule another meeting?</p> 
            </ModalCard>
          )
            }
      <ModalCard  isOpen= {meetingState==='isJoiningMeeting'} onClose={()=>{setMeetingState(undefined)}}
            title='Join Meeting' className=''  handleClick={()=>{router.push(values.link)}} buttonText='Join Meeting'
            buttonIcon='' image=''  
           childrenUp={true} >
           <Input placeholder='Input the meeting' className=' border-none bg-slate-900'
           onChange={(e)=>{setValues({...values, link:e.target.value})}}/>

            
           </ModalCard>
    </div>  
   )
}
