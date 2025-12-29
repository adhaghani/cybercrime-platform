import React from 'react'

const layout = ({children} : {children: React.ReactNode}) => {
  return (
    <div className='p-4 max-w-6xl! w-full mx-auto'>{children}</div>
  )
}

export default layout