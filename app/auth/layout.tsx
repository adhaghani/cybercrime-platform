import React from 'react'
import Link from 'next/link'

const layout = ({children}: {children: React.ReactNode}) => {
  return (
    <div className='flex flex-col lg:flex-row gap-2 w-full'>
        
        <div className='flex-1'>
            <Link href='/' className='text-3xl absolute top-4 left-4 font-bold p-4 inline-block'>CyberSecure</Link>
            {children}
        </div>
        <div className='flex-1 bottom-0 w-full h-1/2 -z-10 md:relative md:bottom-auto md:h-auto md:w-auto bg-gradient-to-br from-primary/20 via-secondary to-primary/10 rounded-xl relative overflow-hidden'>
          <h1 className='absolute top-1/2 text-lg md:text-2xl font-medium left-1/4'>
          Crime, Facility, and Announcement Platform,
          <br />
          All in One, universal, convenient place.
          </h1>
          <div className='absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]' />
          <div className='absolute top-0 right-0 w-96 h-96 bg-primary/30 rounded-full blur-3xl' />
          <div className='absolute bottom-0 left-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl' />
        </div>
    </div>
  )
}

export default layout