import { LoginForm } from '@/components/auth/login-form'
import Image from 'next/image'

export default function LoginPage() {
  return (
    <div className="flex min-h-screen w-full flex-col md:flex-row">
      <div 
        className="hidden md:flex md:w-[65.5%] bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/login-bg.png')" }}
      >
        {/* The background image already contains the hexagons and text from the user's screenshot */}
      </div>
      
      <div className="flex w-full md:w-[34.5%] flex-col items-center justify-center bg-[#7b96a8] p-6 sm:p-10">
        <div className="w-full max-w-sm flex flex-col items-center">
          {/* Logo container */}
          <div className="mb-6 rounded-xl bg-white p-3 shadow-lg flex items-center justify-center w-64 h-24 relative">
            <Image 
              src="/logo.png" 
              alt="KPRIT Logo" 
              fill
              className="object-contain p-2"
              priority
            />
          </div>
          
          <h1 className="mb-8 text-3xl font-bold text-white drop-shadow-md">Login</h1>
          
          <div className="w-full">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  )
}
