import React from 'react'
import Link from 'next/link'

const layout = ({children}: {children: React.ReactNode}) => {
  return (
    <div className='flex flex-col lg:flex-row gap-2 w-full'>
        
        <div className='flex-1'>
            <Link href='/' className='text-3xl absolute top-4 left-4 font-bold p-4 inline-block'>CyberCrime</Link>
            {children}
        </div>
        <div className='flex-1 absolute bottom-0 w-full h-1/2 -z-10 md:relative md:bottom-auto md:h-auto md:w-auto bg-secondary rounded-xl'></div>
    </div>
  )
}

export default layout