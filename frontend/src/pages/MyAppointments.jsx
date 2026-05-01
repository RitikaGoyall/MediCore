import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets'

const MyAppointments = () => {

    const { backendUrl, token } = useContext(AppContext)
    const navigate = useNavigate()

    const [appointments, setAppointments] = useState([])
    const [payment, setPayment] = useState('')
    const [loading, setLoading] = useState(false)
    const [upiId, setUpiId] = useState('')
    const [paymentMethod, setPaymentMethod] = useState('')
    const [upiError, setUpiError] = useState('')

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const validateUpiId = (upiId) => {
        const upiRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+$/;
        return upiRegex.test(upiId);
    };

  
    const slotDateFormat = (slotDate) => {
        const dateArray = slotDate.split('_')
        return dateArray[0] + " " + months[Number(dateArray[1]) - 1] + " " + dateArray[2]
    }

    
    const getUserAppointments = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/user/appointments', { headers: { token } })
            setAppointments(data.appointments.reverse())
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    
    const cancelAppointment = async (appointmentId) => {
        if (!window.confirm('Are you sure you want to cancel this appointment?')) return
        
        setLoading(true)
        try {
            const { data } = await axios.post(backendUrl + '/api/user/cancel-appointment', { appointmentId }, { headers: { token } })
            if (data.success) {
                toast.success(data.message)
                getUserAppointments()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    const initPay = (order) => {
        const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY_ID,
            amount: order.amount,
            currency: order.currency,
            name: 'Appointment Payment',
            description: "Appointment Payment",
            order_id: order.id,
            receipt: order.receipt,
            handler: async (response) => {
                try {
                    const { data } = await axios.post(backendUrl + "/api/user/verifyRazorpay", response, { headers: { token } });
                    if (data.success) {
                        toast.success('Payment completed successfully!')
                        navigate('/my-appointments')
                        getUserAppointments()
                    } else {
                        toast.error(data.message || 'Payment verification failed')
                    }
                } catch (error) {
                    console.log(error)
                    toast.error(error.message || 'Payment verification failed')
                }
            }
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
    };

    const initUpiPay = (order, upiId) => {
        const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY_ID,
            amount: order.amount,
            currency: order.currency,
            name: 'Appointment Payment',
            description: "Appointment Payment via UPI",
            order_id: order.id,
            receipt: order.receipt,
            prefill: {
                vpa: upiId
            },
            method: {
                upi: true
            },
            config: {
                display: {
                    language: 'en',
                    hide: [
                        {
                            method: 'paylater'
                        },
                        {
                            method: 'card'
                        },
                        {
                            method: 'netbanking'
                        },
                        {
                            method: 'wallet'
                        }
                    ]
                }
            },
            handler: async (response) => {
                try {
                    const { data } = await axios.post(backendUrl + "/api/user/verifyRazorpay", response, { headers: { token } });
                    if (data.success) {
                        toast.success('Payment completed successfully!')
                        navigate('/my-appointments')
                        getUserAppointments()
                        setUpiId('')
                        setPaymentMethod('')
                        setPayment('')
                    } else {
                        toast.error(data.message || 'Payment verification failed')
                    }
                } catch (error) {
                    console.log(error)
                    toast.error(error.message || 'Payment verification failed')
                }
            }
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
    };

  
    const appointmentRazorpay = async (appointmentId, method = 'razorpay') => {
        setLoading(true)
        try {
            const { data } = await axios.post(backendUrl + '/api/user/payment-razorpay', { appointmentId }, { headers: { token } })
            if (data.success) {
                if (method === 'upi') {
                    initUpiPay(data.order, upiId)
                } else {
                    initPay(data.order)
                }
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    
    const appointmentStripe = async (appointmentId) => {
        setLoading(true)
        try {
            const { data } = await axios.post(backendUrl + '/api/user/payment-stripe', { appointmentId }, { headers: { token } })
            if (data.success) {
                const { session_url } = data
                window.location.replace(session_url)
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (token) {
            getUserAppointments()
        }
    }, [token])

    const getStatusBadge = (item) => {
        if (item.cancelled) {
            return <span className='px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-600'>Cancelled</span>
        }
        if (item.isCompleted) {
            return <span className='px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600'>Completed</span>
        }
        if (item.payment) {
            return <span className='px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-600'>Paid</span>
        }
        return <span className='px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-600'>Pending</span>
    }

    return (
        <div className='mt-24 px-4 pb-12 max-w-5xl mx-auto'>
            <div className='mb-8'>
                <h1 className='text-2xl font-bold text-gray-800'>My Appointments</h1>
                <p className='text-gray-500 mt-1'>Manage and track your appointments</p>
            </div>
            
            {appointments.length === 0 ? (
                <div className='text-center py-16 bg-white rounded-2xl shadow-sm'>
                    <div className='text-5xl mb-4'>📅</div>
                    <h3 className='text-xl font-semibold text-gray-700 mb-2'>No appointments yet</h3>
                    <p className='text-gray-500 mb-4'>Book your first appointment with our doctors</p>
                    <button onClick={() => navigate('/doctors')} className='bg-primary text-white px-6 py-2.5 rounded-full font-medium hover:bg-blue-700 transition-all'>
                        Find Doctors
                    </button>
                </div>
            ) : (
                <div className='space-y-4'>
                    {appointments.map((item, index) => (
                        <div key={index} className='bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow'>
                            <div className='flex flex-col md:flex-row'>
                                {/* Doctor Image */}
                                <div className='md:w-48 bg-gradient-to-br from-blue-50 to-indigo-50 p-4 flex items-center justify-center'>
                                    <img className='w-32 h-32 rounded-xl object-cover shadow' src={item.docData.image} alt="" />
                                </div>
                                
                                {/* Details */}
                                <div className='flex-1 p-5'>
                                    <div className='flex items-start justify-between mb-3'>
                                        <div>
                                            <h3 className='text-lg font-semibold text-gray-800'>{item.docData.name}</h3>
                                            <p className='text-gray-500 text-sm'>{item.docData.speciality}</p>
                                        </div>
                                        {getStatusBadge(item)}
                                    </div>
                                    
                                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4'>
                                        <div className='flex items-center gap-2 text-sm text-gray-600'>
                                            <span className='text-lg'>📍</span>
                                            <span>{item.docData.address.line1}, {item.docData.address.line2}</span>
                                        </div>
                                        <div className='flex items-center gap-2 text-sm text-gray-600'>
                                            <span className='text-lg'>🕐</span>
                                            <span>{slotDateFormat(item.slotDate)} at {item.slotTime}</span>
                                        </div>
                                    </div>
                                    
                                    {/* Actions */}
                                    <div className='flex flex-wrap gap-3 pt-3 border-t border-gray-100'>
                                        {!item.cancelled && !item.payment && !item.isCompleted && payment !== item._id && (
                                            <button onClick={() => setPayment(item._id)} className='px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors'>
                                                💳 Pay Now
                                            </button>
                                        )}
                                        
                                        {!item.cancelled && !item.payment && !item.isCompleted && payment === item._id && (
                                            <div className='w-full space-y-3'>
                                                <div className='flex gap-2'>
                                                    <button
                                                        onClick={() => setPaymentMethod('razorpay')}
                                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                                                            paymentMethod === 'razorpay' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                        }`}
                                                    >
                                                        <img className='h-4' src={assets.razorpay_logo} alt="Razorpay" /> Razorpay
                                                    </button>
                                                    <button
                                                        onClick={() => setPaymentMethod('upi')}
                                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                                                            paymentMethod === 'upi' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                        }`}
                                                    >
                                                        💰 UPI ID
                                                    </button>
                                                    <button
                                                        onClick={() => appointmentStripe(item._id)}
                                                        className='px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors flex items-center gap-2'
                                                    >
                                                        <img className='h-4' src={assets.stripe_logo} alt="Stripe" /> Stripe
                                                    </button>
                                                </div>

                                                {paymentMethod === 'upi' && (
                                                    <div className='bg-blue-50 p-3 rounded-lg'>
                                                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                                                            Enter your UPI ID
                                                        </label>
                                                        <input
                                                            type='text'
                                                            value={upiId}
                                                            onChange={(e) => {
                                                                setUpiId(e.target.value);
                                                                if (upiError) setUpiError('');
                                                            }}
                                                            onBlur={() => {
                                                                if (upiId && !validateUpiId(upiId)) {
                                                                    setUpiError('Please enter a valid UPI ID (e.g., user@bank)');
                                                                }
                                                            }}
                                                            placeholder='example@upi'
                                                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                                                upiError ? 'border-red-300' : 'border-gray-300'
                                                            }`}
                                                        />
                                                        {upiError && (
                                                            <p className='text-red-500 text-xs mt-1'>{upiError}</p>
                                                        )}
                                                        <button
                                                            onClick={() => {
                                                                if (!validateUpiId(upiId)) {
                                                                    setUpiError('Please enter a valid UPI ID (e.g., user@bank)');
                                                                    return;
                                                                }
                                                                appointmentRazorpay(item._id, 'upi');
                                                            }}
                                                            disabled={!upiId.trim() || loading || upiError}
                                                            className='w-full mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                                                        >
                                                            {loading ? 'Initiating UPI Payment...' : 'Pay with UPI ID'}
                                                        </button>
                                                    </div>
                                                )}

                                                {paymentMethod === 'razorpay' && (
                                                    <button
                                                        onClick={() => appointmentRazorpay(item._id, 'razorpay')}
                                                        className='w-full px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors'
                                                    >
                                                        Proceed with Razorpay
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                        
                                        {!item.cancelled && item.payment && !item.isCompleted && (
                                            <button className='px-4 py-2 bg-green-50 text-green-600 rounded-lg text-sm font-medium'>
                                                ✓ Payment Confirmed
                                            </button>
                                        )}
                                        
                                        {item.isCompleted && (
                                            <button className='px-4 py-2 bg-green-50 text-green-600 rounded-lg text-sm font-medium flex items-center gap-2'>
                                                ✓ Appointment Completed
                                            </button>
                                        )}
                                        
                                        {!item.cancelled && !item.isCompleted && (
                                            <button 
                                                onClick={() => cancelAppointment(item._id)} 
                                                disabled={loading}
                                                className='px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium transition-colors disabled:opacity-50'
                                            >
                                                ✕ Cancel Appointment
                                            </button>
                                        )}
                                        
                                        {item.cancelled && !item.isCompleted && (
                                            <button className='px-4 py-2 bg-red-50 text-red-500 rounded-lg text-sm font-medium'>
                                                ✕ Appointment Cancelled
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default MyAppointments