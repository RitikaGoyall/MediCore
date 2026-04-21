import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { assets } from '../assets/assets';
import RelatedDoctors from '../components/RelatedDoctors';
import axios from 'axios';
import { toast } from 'react-toastify';

const Appointment = () => {
    const { docId } = useParams();
    const { doctors, currencySymbol, backendUrl, token, getDoctosData } = useContext(AppContext);
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const [docInfo, setDocInfo] = useState(null);
    const [docSlots, setDocSlots] = useState([]);
    const [slotIndex, setSlotIndex] = useState(0);
    const [slotTime, setSlotTime] = useState('');
    const [loading, setLoading] = useState(false);
    
    const navigate = useNavigate();

    useEffect(() => {
        if (doctors.length > 0) {
            setDocInfo(doctors.find((doc) => doc._id === docId));
        }
    }, [doctors, docId]);

    useEffect(() => {
        if (docInfo) {
            getAvailableSlots();
        }
    }, [docInfo]);

    const getAvailableSlots = () => {
        setDocSlots([]);
        let today = new Date();

        for (let i = 0; i < 7; i++) {
            let currentDate = new Date(today);
            currentDate.setDate(today.getDate() + i);

            let endTime = new Date(currentDate);
            endTime.setHours(21, 0, 0, 0);

            let timeSlots = [];
            while (currentDate < endTime) {
                let formattedTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                let slotDate = `${currentDate.getDate()}_${currentDate.getMonth() + 1}_${currentDate.getFullYear()}`;
                const isSlotAvailable = !(docInfo.slots_booked[slotDate]?.includes(formattedTime));
                if (isSlotAvailable) {
                    timeSlots.push({ datetime: new Date(currentDate), time: formattedTime });
                }
                currentDate.setMinutes(currentDate.getMinutes() + 30);
            }
            setDocSlots((prev) => [...prev, timeSlots]);
        }
    };

    const bookAppointment = async () => {
        if (!token) {
            toast.warning('Login to book appointment');
            return navigate('/login');
        }
        if (!slotTime) {
            toast.warning('Please select a time slot');
            return;
        }

        setLoading(true);
        const date = docSlots[slotIndex][0].datetime;
        let slotDate = `${date.getDate()}_${date.getMonth() + 1}_${date.getFullYear()}`;

        try {
            const { data } = await axios.post(`${backendUrl}/api/user/book-appointment`, { docId, slotDate, slotTime }, { headers: { token } });
            data.success ? toast.success(data.message) : toast.error(data.message);
            getDoctosData();
            navigate('/my-appointments');
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return docInfo ? (
        <div className='mt-24 pb-12 px-4 max-w-5xl mx-auto'>
            {/* Doctor Info Card */}
            <div className='bg-white rounded-3xl shadow-lg overflow-hidden mb-8'>
                <div className='flex flex-col md:flex-row'>
                    <div className='md:w-1/3 bg-gradient-to-br from-blue-50 to-indigo-50 p-8 flex items-center justify-center'>
                        <img className='w-56 h-56 rounded-2xl shadow-xl object-cover' src={docInfo.image} alt="Doctor" />
                    </div>
                    <div className='md:w-2/3 p-8'>
                        <div className='flex items-center gap-3 mb-2'>
                            <h2 className='text-2xl font-bold text-gray-800'>{docInfo.name}</h2>
                            <img className='w-6' src={assets.verified_icon} alt="" />
                        </div>
                        <div className='flex items-center gap-4 text-gray-600 mb-4'>
                            <span>{docInfo.degree}</span>
                            <span className='w-1 h-1 bg-gray-400 rounded-full'></span>
                            <span>{docInfo.speciality}</span>
                            <span className='w-1 h-1 bg-gray-400 rounded-full'></span>
                            <span className='flex items-center gap-1 text-yellow-500'>⭐ 4.8</span>
                        </div>
                        <p className='text-gray-600 mb-4'>{docInfo.about}</p>
                        <div className='flex flex-wrap gap-4 mb-4'>
                            <div className='bg-blue-50 px-4 py-2 rounded-xl'>
                                <p className='text-sm text-gray-500'>Experience</p>
                                <p className='font-semibold text-gray-800'>{docInfo.experience} Years</p>
                            </div>
                            <div className='bg-green-50 px-4 py-2 rounded-xl'>
                                <p className='text-sm text-gray-500'>Consultation Fee</p>
                                <p className='font-semibold text-gray-800'>{currencySymbol}{docInfo.fees}</p>
                            </div>
                            <div className={`px-4 py-2 rounded-xl ${docInfo.available ? 'bg-green-50' : 'bg-gray-50'}`}>
                                <p className='text-sm text-gray-500'>Status</p>
                                <p className={`font-semibold ${docInfo.available ? 'text-green-600' : 'text-gray-400'}`}>
                                    {docInfo.available ? 'Available' : 'Unavailable'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Booking Section */}
            <div className='bg-white rounded-3xl shadow-lg p-6 md:p-8'>
                <h3 className='text-xl font-semibold text-gray-800 mb-6'>Book Appointment</h3>
                
                {/* Date Selection */}
                <div className='mb-6'>
                    <p className='text-sm text-gray-500 mb-3'>Select Date</p>
                    <div className='flex gap-3 overflow-x-auto pb-2'>
                        {docSlots.map((item, index) => {
                            const date = item[0]?.datetime;
                            const isSelected = slotIndex === index;
                            const isToday = index === 0;
                            
                            return (
                                <button 
                                    key={index} 
                                    onClick={() => { setSlotIndex(index); setSlotTime(''); }}
                                    className={`flex-shrink-0 px-5 py-3 rounded-xl font-medium transition-all ${
                                        isSelected 
                                        ? 'bg-primary text-white shadow-lg shadow-blue-200' 
                                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                                    }`}
                                >
                                    <p className={`text-sm ${isSelected ? 'text-white/80' : 'text-gray-500'}`}>
                                        {isToday ? 'Today' : daysOfWeek[date?.getDay()]}
                                    </p>
                                    <p className={`text-lg font-bold ${isSelected ? 'text-white' : 'text-gray-800'}`}>
                                        {date?.getDate()}
                                    </p>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Time Slot Grid */}
                <div className='mb-8'>
                    <p className='text-sm text-gray-500 mb-3'>Select Time Slot</p>
                    {docSlots[slotIndex]?.length > 0 ? (
                        <div className='grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3'>
                            {docSlots[slotIndex].map((item, index) => {
                                const isSelected = item.time === slotTime;
                                return (
                                    <button 
                                        key={index}
                                        onClick={() => setSlotTime(item.time)}
                                        className={`py-3 rounded-xl text-sm font-medium transition-all ${
                                            isSelected
                                            ? 'bg-primary text-white shadow-lg shadow-blue-200'
                                            : 'bg-gray-50 text-gray-600 hover:bg-blue-50 hover:text-primary border border-gray-100'
                                        }`}
                                    >
                                        {item.time}
                                    </button>
                                );
                            })}
                        </div>
                    ) : (
                        <div className='text-center py-8 bg-gray-50 rounded-xl'>
                            <p className='text-gray-500'>No available slots for this date</p>
                        </div>
                    )}
                </div>

                {/* Book Button */}
                <button 
                    onClick={bookAppointment}
                    disabled={loading || !slotTime}
                    className='w-full bg-primary text-white py-4 rounded-xl font-semibold text-lg hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'
                >
                    {loading ? (
                        <span className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    ) : (
                        '📅'
                    )}
                    {loading ? 'Booking...' : slotTime ? `Book Appointment at ${slotTime}` : 'Select a time slot'}
                </button>
            </div>

            <RelatedDoctors speciality={docInfo.speciality} docId={docId} />
        </div>
    ) : (
        <div className='mt-24 text-center py-12'>
            <div className='animate-pulse'>
                <div className='w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4'></div>
                <div className='h-6 bg-gray-200 rounded w-1/3 mx-auto'></div>
            </div>
        </div>
    );
};

export default Appointment;
