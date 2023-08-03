"use client"
import { signOut } from 'next-auth/react'
import { FC, HtmlHTMLAttributes, useState } from 'react'
import Button from './Button'
import { toast } from 'react-hot-toast'
import { Loader2, LogOut } from 'lucide-react'

interface SignOutButtonProps extends HtmlHTMLAttributes<HTMLButtonElement> {
  
}

const SignOutButton: FC<SignOutButtonProps> = ({...props}) => {

    const [isSigningOut, setIsSigningOut] = useState<boolean>(false)
  return <Button {...props} 
  onClick={ async ()  => {
    setIsSigningOut(true)

    try {
        await signOut()
    }
    catch(err){
        toast.error('There was a problem signing out')
    }finally{
        setIsSigningOut(false)
    }


  }} variant={'ghost'}>
    {isSigningOut ? <Loader2 className='animate-spin h-4 w-4' /> : <LogOut className='w-4 h-4' />}
  </Button>
}

export default SignOutButton