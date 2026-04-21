import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const TopDoctors = () => {
  const navigate = useNavigate();
  const { doctors } = useContext(AppContext);

  return (
    <div className='flex flex-col items-center gap-8 py-16 bg-gradient-to-b from-white to-blue-50'>
      <div className='text-center'>
        <h1 className='text-3xl font-bold text-gray-800'>Top Doctors</h1>
        <p className='mt-3 text-gray-500 max-w-xl'>
          Get expert medical consultation from our most trusted professionals.
        </p>
      </div>

      {/* Doctor Cards Grid */}
      <div className='w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4 max-w-6xl'>
        {doctors.slice(0, 8).map((item, index) => (
          <div
            key={index}
            onClick={() => {
              navigate(`/appointment/${item._id}`);
              scrollTo(0, 0);
            }}
            className='group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-gray-200/50 hover:-translate-y-1 transition-all duration-300 cursor-pointer border border-gray-100'
          >
            {/* Image Section */}
            <div className='relative w-full h-48 bg-gradient-to-br from-blue-50 to-indigo-50 flex justify-center items-center'>
              {item.available && (
                <span className='absolute top-3 right-3 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium z-10'>
                  Available
                </span>
              )}
              <img className='w-28 h-28 rounded-full border-4 border-white shadow-md object-cover' src={item.image} alt={item.name} />
            </div>

            {/* Doctor Info */}
            <div className='p-4 text-center'>
              <p className='text-base font-semibold text-gray-800'>{item.name}</p>
              <p className='text-sm text-gray-500'>{item.speciality}</p>
              <div className='mt-3 flex items-center justify-center gap-1 text-yellow-500'>
                <span>⭐</span>
                <span className='text-sm text-gray-600'>4.8</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* View More Button */}
      <button
        onClick={() => {
          navigate('/doctors');
          scrollTo(0, 0);
        }}
        className='mt-4 px-8 py-3 rounded-full text-white bg-primary shadow-lg shadow-blue-200 hover:shadow-xl hover:bg-blue-700 hover:scale-105 transition-all duration-300 font-medium'
      >
        View All Doctors
      </button>
    </div>
  );
};

export default TopDoctors;
