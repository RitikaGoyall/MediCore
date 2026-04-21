import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const MyProfile = () => {
    const data = [
        { name: 'Jan', patients: Math.floor(Math.random() * 9) + 1 },
        { name: 'Feb', patients: Math.floor(Math.random() * 9) + 1 },
        { name: 'Mar', patients: Math.floor(Math.random() * 9) + 1 },
        { name: 'Apr', patients: Math.floor(Math.random() * 9) + 1 },
        { name: 'May', patients: Math.floor(Math.random() * 9) + 1 },
    ];

    const [isEdit, setIsEdit] = useState(false)
    const [image, setImage] = useState(false)
    const [loading, setLoading] = useState(false)
    const { token, backendUrl, userData, setUserData, loadUserProfileData } = useContext(AppContext)

    const updateUserProfileData = async () => {
        setLoading(true)
        try {
            const formData = new FormData();
            formData.append('name', userData.name)
            formData.append('phone', userData.phone)
            formData.append('address', JSON.stringify(userData.address))
            formData.append('gender', userData.gender)
            formData.append('dob', userData.dob)
            image && formData.append('image', image)

            const { data } = await axios.post(backendUrl + '/api/user/update-profile', formData, { headers: { token } })

            if (data.success) {
                toast.success(data.message)
                await loadUserProfileData()
                setIsEdit(false)
                setImage(false)
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

    return userData ? (
        <div className='mt-24 px-4 pb-12 max-w-4xl mx-auto'>
            <div className='bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden'>
                {/* Header Banner */}
                <div className='bg-gradient-to-r from-primary to-blue-600 h-32'></div>
                
                <div className='px-8 pb-8'>
                    {/* Profile Image */}
                    <div className='relative -mt-16 mb-6'>
                        {isEdit ? (
                            <label htmlFor='image' className='cursor-pointer inline-block relative'>
                                <div className='relative'>
                                    <img 
                                        className='w-28 h-28 rounded-2xl border-4 border-white shadow-lg object-cover' 
                                        src={image ? URL.createObjectURL(image) : userData.image} 
                                        alt="" 
                                    />
                                    <div className='absolute bottom-0 right-0 w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg'>
                                        <img className='w-5' src={assets.upload_icon} alt="" />
                                    </div>
                                </div>
                                <input onChange={(e) => setImage(e.target.files[0])} type="file" id="image" hidden />
                            </label>
                        ) : (
                            <img className='w-28 h-28 rounded-2xl border-4 border-white shadow-lg object-cover' src={userData.image} alt="" />
                        )}
                    </div>

                    {/* Name */}
                    {isEdit ? (
                        <input 
                            className='text-3xl font-bold text-gray-800 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 w-full max-w-md mb-6 focus:outline-none focus:border-primary' 
                            type="text" 
                            onChange={(e) => setUserData(prev => ({ ...prev, name: e.target.value }))} 
                            value={userData.name} 
                        />
                    ) : (
                        <h1 className='text-3xl font-bold text-gray-800 mb-2'>{userData.name}</h1>
                    )}
                    <p className='text-gray-500 mb-6'>{userData.email}</p>

                    {/* Contact Information */}
                    <div className='bg-gray-50 rounded-2xl p-6 mb-6'>
                        <div className='flex items-center gap-2 mb-4'>
                            <span className='text-xl'>📞</span>
                            <h2 className='text-lg font-semibold text-gray-800'>Contact Information</h2>
                        </div>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            <div>
                                <p className='text-sm text-gray-500 mb-1'>Phone</p>
                                {isEdit ? (
                                    <input 
                                        className='w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary' 
                                        type="text" 
                                        onChange={(e) => setUserData(prev => ({ ...prev, phone: e.target.value }))} 
                                        value={userData.phone} 
                                    />
                                ) : (
                                    <p className='text-gray-800 font-medium'>{userData.phone || 'Not provided'}</p>
                                )}
                            </div>
                            <div>
                                <p className='text-sm text-gray-500 mb-1'>Address</p>
                                {isEdit ? (
                                    <div className='space-y-2'>
                                        <input 
                                            className='w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary' 
                                            type="text" 
                                            onChange={(e) => setUserData(prev => ({ ...prev, address: { ...prev.address, line1: e.target.value } }))} 
                                            value={userData.address.line1} 
                                        />
                                        <input 
                                            className='w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary' 
                                            type="text" 
                                            onChange={(e) => setUserData(prev => ({ ...prev, address: { ...prev.address, line2: e.target.value } }))} 
                                            value={userData.address.line2} 
                                        />
                                    </div>
                                ) : (
                                    <p className='text-gray-800'>{userData.address.line1}, {userData.address.line2}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Basic Information */}
                    <div className='bg-gray-50 rounded-2xl p-6 mb-6'>
                        <div className='flex items-center gap-2 mb-4'>
                            <span className='text-xl'>👤</span>
                            <h2 className='text-lg font-semibold text-gray-800'>Basic Information</h2>
                        </div>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            <div>
                                <p className='text-sm text-gray-500 mb-1'>Gender</p>
                                {isEdit ? (
                                    <select 
                                        className='w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary' 
                                        onChange={(e) => setUserData(prev => ({ ...prev, gender: e.target.value }))} 
                                        value={userData.gender}
                                    >
                                        <option value="Not Selected">Not Selected</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </select>
                                ) : (
                                    <p className='text-gray-800 font-medium'>{userData.gender || 'Not specified'}</p>
                                )}
                            </div>
                            <div>
                                <p className='text-sm text-gray-500 mb-1'>Birthday</p>
                                {isEdit ? (
                                    <input 
                                        className='w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary' 
                                        type='date' 
                                        onChange={(e) => setUserData(prev => ({ ...prev, dob: e.target.value }))} 
                                        value={userData.dob} 
                                    />
                                ) : (
                                    <p className='text-gray-800 font-medium'>{userData.dob || 'Not provided'}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className='flex gap-4'>
                        {isEdit ? (
                            <>
                                <button 
                                    onClick={updateUserProfileData} 
                                    disabled={loading}
                                    className='px-8 py-3 bg-primary text-white rounded-full font-medium hover:bg-blue-700 transition-all disabled:opacity-50 flex items-center gap-2'
                                >
                                    {loading && <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>}
                                    Save Changes
                                </button>
                                <button 
                                    onClick={() => { setIsEdit(false); setImage(false); }} 
                                    className='px-8 py-3 border border-gray-300 text-gray-700 rounded-full font-medium hover:bg-gray-100 transition-all'
                                >
                                    Cancel
                                </button>
                            </>
                        ) : (
                            <button 
                                onClick={() => setIsEdit(true)} 
                                className='px-8 py-3 border border-primary text-primary rounded-full font-medium hover:bg-primary hover:text-white transition-all flex items-center gap-2'
                            >
                                ✏️ Edit Profile
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Stats Chart */}
            <div className='mt-8 bg-white rounded-3xl shadow-sm border border-gray-100 p-6'>
                <h2 className='text-lg font-semibold text-gray-800 mb-4'>Appointment Statistics</h2>
                <div className='h-64'>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="name" stroke="#888" fontSize={12} />
                            <YAxis stroke="#888" fontSize={12} />
                            <Tooltip 
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                            />
                            <Legend />
                            <Bar dataKey="patients" fill="#1E3A8A" radius={[8, 8, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    ) : (
        <div className='mt-24 text-center py-12'>
            <div className='animate-pulse'>
                <div className='w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4'></div>
                <div className='h-6 bg-gray-200 rounded w-1/3 mx-auto'></div>
            </div>
        </div>
    )
}

export default MyProfile