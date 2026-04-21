import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const RelatedDoctors = ({ speciality, docId }) => {
    const navigate = useNavigate();
    const { doctors } = useContext(AppContext);
    const [relDoc, setRelDoc] = useState([]);

    useEffect(() => {
        if (doctors.length > 0 && speciality) {
            const doctorsData = doctors.filter((doc) => doc.speciality === speciality && doc._id !== docId);
            setRelDoc(doctorsData.slice(0, 3));
        }
    }, [doctors, speciality, docId]);

    if (relDoc.length === 0) return null;

    return (
        <div className='mt-16 px-4 max-w-6xl mx-auto'>
            <div className='text-center mb-8'>
                <h2 className='text-2xl font-bold text-gray-800'>Related Doctors</h2>
                <p className='text-gray-500 mt-2'>Other doctors in the same specialty</p>
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                {relDoc.map((item, index) => (
                    <div 
                        onClick={() => { navigate(`/appointment/${item._id}`); scrollTo(0, 0); }} 
                        className='bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300'
                        key={index}
                    >
                        <div className='relative'>
                            <img className='w-full h-48 object-cover bg-gradient-to-br from-blue-50 to-indigo-50' src={item.image} alt={item.name} />
                            {item.available && (
                                <span className='absolute top-3 left-3 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium'>
                                    Available
                                </span>
                            )}
                        </div>
                        <div className='p-4'>
                            <p className='font-semibold text-gray-800'>{item.name}</p>
                            <p className='text-sm text-gray-500'>{item.speciality}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RelatedDoctors;
