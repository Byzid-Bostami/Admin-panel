import React from 'react'

const notFound = () => {
  return(
    <div className='min-h-screen flex flex-col justify-center items-center'>
        <div className=' space-y-2'>
            <h1 className='text-9xl [text-shadow:2px_2px_4px_rgba(0,0,0,0.5)] md:text-[260px] font-bold text-[#25937b]'>404</h1>
            <p className=' capitalize text-xl text-center text-gray-500 font-medium'>page not found</p>
        </div>
    </div>
  )
}

export default notFound;