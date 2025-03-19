import React from 'react'
import LoginForm from '../components/LoginForm';

const Home = () => {
  return (
    <div className='bg-gradient-to-r from-blue-700 to-blue-600 h-screen'>
      <h1 className=' text-6xl text-center pt-7 text-white cursor-pointer'>Geslab</h1>
      <LoginForm/>
    </div>
  )
}

export default Home
