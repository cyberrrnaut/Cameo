'use client'

import CardListType from '@/components/CardListType'
import Loader from '@/components/Loader';
import { useGetCalls } from '@/hooks/useGetCalls';
import React, { useEffect, useState } from 'react'

export default function Page() {

  const [time, setTime] = useState('');
  const [date, setDate] = useState('');

  const {upcomingCalls, isLoading } = useGetCalls();
  
  
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();

      // Format time as hh:mm AM/PM
      const hours = now.getHours();
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const period = hours >= 12 ? 'PM' : 'AM';
      const formattedTime = `${((hours + 11) % 12) + 1}:${minutes} ${period}`;

      // Format date as day, DD MON YYYY
      const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const monthNames = [
        'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 
        'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'
      ];
      const dayName = dayNames[now.getDay()];
      const day = String(now.getDate()).padStart(2, '0');
      const month = monthNames[now.getMonth()];
      const year = now.getFullYear();
      const formattedDate = `${dayName}, ${day} ${month} ${year}`;

      // Update state
      setTime(formattedTime);
      setDate(formattedDate);
    };

    // Initial call and set interval for every minute
    updateDateTime();
    const timer = setInterval(updateDateTime, 60000);

    return () => clearInterval(timer); // Cleanup on unmount
  }, []);

if(isLoading){
  return <Loader/>
}

return (
  <section>
    <div className="w-full h-[300px] shadow-lg bg-hero rounded-md pl-11">
      <div className="h-full justify-start flex flex-col">
        <div className="h-full justify-around flex flex-col">
          {upcomingCalls.length === 0 ? (
            <p className="text-2xl">No upcoming Meetings</p>
          ) : (
            <p className="text-2xl">Upcoming Meeting at {upcomingCalls[0].state?.startsAt?.toLocaleString() } </p>
          )}
          <p className="text-7xl font-bold">{time}</p>
          <p className="text-2xl">{date}</p>
        </div>
      </div>
    </div>
    <CardListType />
  </section>
);


}
