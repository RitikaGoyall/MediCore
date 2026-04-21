import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const Login = () => {

  const [state, setState] = useState('Sign Up')
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [otp, setOtp] = useState('')
  const [triggered, setTriggered] = useState(false);

  const navigate = useNavigate()
  const { backendUrl, token, setToken } = useContext(AppContext)

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    return;
  }
  
  const signUp = async () => {
    if (!name || !email || !password) {
      toast.error('Please fill all fields')
      return
    }
    setLoading(true)
    try {
      const { data } = await axios.post(backendUrl + '/api/user/register', { name, email, password })
      if (data.success) {
        setState('OTP')
        toast.success('Registration successful! Verify OTP')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }
  
  const Login = async () => {
    if (!email || !password) {
      toast.error('Please fill all fields')
      return
    }
    setLoading(true)
    try {
      const { data } = await axios.post(backendUrl + '/api/user/login', { email, password })
      if (data?.success) {
        setState('OTP')
        toast.info('Enter the OTP sent to your email')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }
  
  const triggerOtp = async () => {
    if (!email) {
      toast.error('Please enter your email')
      return
    }
    setLoading(true)
    try {
      const { data } = await axios.post(backendUrl + '/api/user/otp/gen', { email })
      if (!data?.success) {
        toast.error(data.message)
      } else if (data?.message) {
        toast.info(data.message)
      }
    } catch (error) {
      toast.error('Failed to send OTP')
    } finally {
      setLoading(false)
    }
  }

  const triggerResetOtp = async () => {
    if (!email) {
      toast.error('Please enter your email')
      return
    }
    setLoading(true)
    try {
      const { data } = await axios.post(backendUrl + '/api/user/otp/gen', { email })
      if (!data?.success) {
        toast.error(data.message)
      } else if (data?.message) {
        setTriggered(true)
        toast.info(data.message)
      }
    } catch (error) {
      toast.error('Failed to send OTP')
    } finally {
      setLoading(false)
    }
  }

  
  const verifyOtp = async () => {
    if (!otp) {
      toast.error('Please enter OTP')
      return
    }
    setLoading(true)
    try {
      const { data } = await axios.post(backendUrl + '/api/user/otp/verify', {email, password, otp})
      if (data?.success) {
        localStorage.setItem('token', data.token)
        setToken(data.token)
        toast.success('Welcome!')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error('Invalid OTP')
    } finally {
      setLoading(false)
    }
  }
  
  const resetPassword = async () => {
    if (!email || !otp || !password) {
      toast.error('please fill all the fields')
      return
    }
    setLoading(true)
    try {
      const { data } = await axios.post(backendUrl + '/api/user/reset', {email, password, otp})
      if (!data.success) {
        toast.error(data.message)
      } else {
        setToken(data.token)
        localStorage.setItem('token', data.token)
        toast.success('Password reset successful!')
      }
    } catch (error) {
      toast.error('Reset failed')
    } finally {
      setLoading(false)
    }
  }

  const chain = (match, options ) => {
    let res = <></>;
    options.forEach(element => {
      element.opt === match ? 
      res = (<>{element.html}</>) : (<></>);
    });
    return res;
  }

  useEffect(() => {
    if (token) {
      navigate('/')
    }
  }, [token])

  return (
    <form onSubmit={onSubmitHandler} className='min-h-[80vh] flex items-center justify-center py-8'>
      <div className='flex flex-col gap-4 p-8 w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100'>
        <div className='text-center mb-2'>
          <h2 className='text-2xl font-bold text-gray-800'>{chain(state, [
            { opt: 'Login', html: 'Welcome Back' },
            { opt: 'Sign Up', html: 'Create Account' },
            { opt: 'OTP', html: 'Verify OTP' },
            { opt: 'Reset', html: 'Reset Password' },
          ])}</h2>
          <p className='text-gray-500 text-sm mt-1'>{chain(state, [
            {opt: 'Login', html: 'Sign in to continue'},
            {opt: 'Sign Up', html: 'Join us for better healthcare'},
            {opt: 'OTP', html: 'Enter the code sent to your email'},
            {opt: 'Reset', html: 'Enter OTP to reset password'}
          ])}</p>
        </div>
          
        {state === 'Reset' ?
          <div className='space-y-3'>
            <div>
              <label className='text-sm text-gray-600 mb-1 block'>Email</label>
              <input onChange={(e) => setEmail(e.target.value)} value={email} className='w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary transition-colors' type="email" />
            </div>
          </div>
          : ''
        }
        
        {state === 'Sign Up'
          ? <div className='space-y-3'>
              <div>
                <label className='text-sm text-gray-600 mb-1 block'>Full Name</label>
                <input onChange={(e) => setName(e.target.value)} value={name} className='w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary transition-colors' type="text" />
              </div>
            </div>
          : ''
        }
        
        {state === 'OTP' || state === 'Reset' ? 
          <div className='space-y-3'>
              <div>
                <label className='text-sm text-gray-600 mb-1 block'>OTP</label>
                <input disabled={state === 'Reset' && !triggered} onChange={(e) => {setOtp(e.target.value)}} value={otp} className='w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary transition-colors' type="number" />
              </div>
            </div>
           : ''
        }
        
        {state === 'Login' || state === 'Sign Up' ?
        (<div className='space-y-3'>
            <div>
              <label className='text-sm text-gray-600 mb-1 block'>Email</label>
              <input onChange={(e) => setEmail(e.target.value)} value={email} className='w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary transition-colors' type="email" />
            </div>
            <div>
              <label className='text-sm text-gray-600 mb-1 block'>Password</label>
              <input onChange={(e) => setPassword(e.target.value)} value={password} className='w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary transition-colors' type="password" />
            </div>
        </div>) : ''
        }

        {state === 'OTP' && 
          <button 
            type="button" 
            onClick={triggerOtp} 
            disabled={loading}
            className='w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50'
          >
            {loading ? <span className="w-5 h-5 border-2 border-gray-500 border-t-transparent rounded-full animate-spin"></span> : '📧'}
            Resend OTP
          </button>
        }
        
        {(state === 'Reset') &&
          <button 
            type="button" 
            onClick={triggerResetOtp} 
            disabled={loading}
            className='w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50'
          >
            {loading ? <span className="w-5 h-5 border-2 border-gray-500 border-t-transparent rounded-full animate-spin"></span> : '📧'}
            Send OTP
          </button>
        }
        
        {(state === 'Reset' && triggered) ? 
          <div className='space-y-3'>
            <div>
              <label className='text-sm text-gray-600 mb-1 block'>New Password</label>
              <input placeholder='Enter new Password' onChange={(e) => setPassword(e.target.value)} value={password} className='w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary transition-colors' type="password" />
            </div>
          </div>: '' 
        }

        
        {state === 'OTP' &&  
          <button 
            type="button" 
            onClick={verifyOtp} 
            disabled={loading}
            className='w-full bg-primary text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50'
          >
            {loading && <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>}
            Verify & Login
          </button>
        }
        
        {state === 'Sign Up' ? 
          <button 
            type="button" 
            onClick={signUp} 
            disabled={loading}
            className='w-full bg-primary text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50'
          >
            {loading && <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>}
            Create Account
          </button> : ''
        }
        
        {state === 'Login' ?  
          <button 
            type="button" 
            onClick={Login} 
            disabled={loading}
            className='w-full bg-primary text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50'
          >
            {loading && <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>}
            Sign In
          </button> : ''
        }
        
        {state === 'Reset' ? 
          <button 
            type="button" 
            onClick={resetPassword} 
            disabled={loading}
            className='w-full bg-primary text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50'
          >
            {loading && <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>}
            Reset Password
          </button> : ''
        }
        
        
        <div className='text-center pt-2'>
          {state === 'Sign Up'
            ? <p className='text-gray-600'>Already have an account? <span onClick={() => setState('Login')} className='text-primary font-medium cursor-pointer hover:underline'>Sign In</span></p>
            : <p className='text-gray-600'>New to MediCore? <span onClick={() => setState('Sign Up')} className='text-primary font-medium cursor-pointer hover:underline'>Create Account</span></p>
          }
        </div>

        {
          state !== 'Reset' ?
            <div className='text-center'>
              <p className='text-gray-500 text-sm'>Forgot password? <span onClick={() => setState('Reset')} className='text-primary cursor-pointer hover:underline'>Reset here</span></p>
            </div> :
            <div className='text-center'>
              <p className='text-gray-500 text-sm'>Remember password? <span onClick={() => setState('Login')} className='text-primary cursor-pointer hover:underline'>Sign In</span></p>
            </div>
        }
      </div>
    </form>
  )
}

export default Login