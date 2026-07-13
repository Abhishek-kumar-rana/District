import React from 'react'
import   { useAuth } from '../hooks/useAuth'
import { UseBookings } from '../api/userApi';

const Bookings = () => {

    const {getCurrentUser}= useAuth();
    const user=getCurrentUser();
    const { data, isLoading, error }=UseBookings(user?.id);
    

    if(error) return (
        <div className='h-screen w-full '>
        <div className='mt-50 lg:mt-30'>
            <span className='text-3xl' >Unknown Error ocured</span>
        </div>
    </div>
    )
    if(isLoading)return (
        <div className='h-screen w-full '>
        <div className='mt-50 lg:mt-30'>
            <span className='text-3xl' >Loading...</span>
        </div>
    </div>
    )


  return (
    <>
    <div className='h-screen w-full '>
        <div className='mt-50 lg:mt-30'>
            <span className='text-3xl' >My Bookings</span>
            <div>
                {/* {data.data.map((books,index)=>
                    <>
                    <div key={index}>
                        <span>{books.movieTitle}</span>
                    {books.seatIds.map((seat:string)=>(
                        <span className=' p-3 border roundex-xl'>{seat } </span>
                    ))}
                    </div>
                    </>
                )} */}
            </div>
        </div>
    </div>
    </>
  )
}

export default Bookings