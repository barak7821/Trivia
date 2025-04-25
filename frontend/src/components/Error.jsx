import React from 'react'
import { useNavigate } from 'react-router-dom';

export default function Error() {
    const nav = useNavigate()
    
    return (
        <div className='flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-purple-300 p-6 text-center gap-6'>
            <div className='bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-xl max-w-md w-full'>
                <h2 className='text-2xl font-bold text-white mb-2'>An Error Occurred</h2>
                <p className='text-white mb-4'>We couldn't load the quiz questions. Please try again later.</p>
                <button onClick={() => nav("/")} className='w-full bg-red-500 hover:bg-red-600 text-white font-semibold rounded-full py-3 transition-colors shadow-md active:scale-95'>Back to Home</button>
            </div>
        </div>
    )
}
