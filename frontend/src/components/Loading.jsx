import React from 'react'

export default function Loading() {
    return (
        <div className='bg-gradient-to-br from-blue-500 to-purple-300 flex items-center justify-center min-h-screen'>
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
        </div>
    )
}
