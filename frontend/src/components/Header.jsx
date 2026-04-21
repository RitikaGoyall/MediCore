import React from 'react';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';

const Header = () => {
    const navigate = useNavigate();
    
    return (
        <div className='flex flex-col md:flex-row items-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 rounded-2xl px-6 md:px-12 lg:px-20 py-12 mt-20 mb-8 mx-4'>
            
            {/* Left Section */}
            <div className='md:w-1/2 flex flex-col items-start justify-center gap-6'>
                <div className='inline-flex items-center gap-2 bg-blue-100 text-primary px-4 py-1.5 rounded-full text-sm font-medium'>
                    <span className='w-2 h-2 bg-green-500 rounded-full animate-pulse'></span>
                    24/7 Healthcare Support
                </div>
                <h1 className='text-4xl md:text-5xl font-bold leading-tight text-gray-900'>
                    Your Health, <span className='text-primary'>Our Priority</span>
                </h1>
                <p className='text-lg text-gray-600 leading-relaxed'>
                    Book an appointment with trusted doctors and get quality medical care at your convenience. We ensure expert consultations and seamless healthcare services.
                </p>
                <div className='flex flex-col md:flex-row items-center gap-6'>
                    <img className='w-32' src={assets.group_profiles} alt="Doctors" />
                    <div>
                        <p className='font-semibold text-gray-700'>Trusted by 50,000+ patients</p>
                        <p className='text-sm text-gray-500'>Rated 4.9/5 by our community</p>
                    </div>
                </div>
                <div className='flex flex-wrap gap-4'>
                    <button onClick={() => navigate('/doctors')} className='flex items-center gap-2 bg-primary text-white px-8 py-3.5 rounded-full text-base font-medium hover:shadow-xl hover:shadow-blue-300 hover:scale-105 transition-all duration-300'>
                        Book Appointment <span className='text-lg'>→</span>
                    </button>
                    <button onClick={() => navigate('/about')} className='flex items-center gap-2 bg-white text-gray-700 border border-gray-200 px-8 py-3.5 rounded-full text-base font-medium hover:bg-gray-50 hover:shadow-lg transition-all duration-300'>
                        Learn More
                    </button>
                </div>
            </div>
            
            {/* Right Section */}
            <div className='md:w-1/2 relative mt-10 md:mt-0 flex justify-center'>
                <div className='relative'>
                    <img className='w-full md:w-[90%] rounded-2xl shadow-2xl' src={assets.header_img} alt="Doctor" />
                    <div className='absolute bottom-6 left-6 bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-lg text-sm'>
                        <div className='flex items-center gap-3 mb-2'>
                            <div className='w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-lg'>✓</div>
                            <div>
                                <p className='font-semibold text-gray-800'>Verified Doctors</p>
                                <p className='text-xs text-gray-500'>100% verified</p>
                            </div>
                        </div>
                    </div>
                    <div className='absolute top-6 right-6 bg-white/95 backdrop-blur-sm p-3 rounded-xl shadow-lg'>
                        <div className='flex items-center gap-2'>
                            <span className='text-yellow-500 text-lg'>⭐</span>
                            <span className='font-semibold'>4.9</span>
                            <span className='text-gray-400 text-sm'>(2k+ reviews)</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;
