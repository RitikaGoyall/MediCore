import React from 'react';
import { specialityData } from '../assets/assets';
import { Link } from 'react-router-dom';

const SpecialityMenu = () => {
  
  const getSlug = (speciality) => {
    return speciality.toLowerCase().replace(/ /g, '-');
  };

  return (
    <div id='speciality' className='flex flex-col items-center gap-8 py-16 bg-white'>
      
      {/* Heading Section */}
      <div className='text-center'>
        <h1 className='text-3xl font-bold text-gray-800'>Search by Speciality</h1>
        <p className='mt-3 text-gray-500 max-w-xl'>
          Browse our diverse range of medical specialists and book consultations with top experts easily.
        </p>
      </div>

      {/* Speciality List - Cards Layout */}
      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 w-full max-w-6xl px-4'>
        {specialityData.map((item, index) => (
          <Link 
            to={`/doctors/${getSlug(item.speciality)}`} 
            onClick={() => window.scrollTo(0, 0)} 
            className='flex flex-col items-center text-center bg-white border border-gray-100 rounded-2xl p-5 transition-all duration-300 hover:shadow-xl hover:shadow-gray-200/50 hover:-translate-y-1 group'
            key={index}
          >
            <div className='w-16 h-16 flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full mb-3 group-hover:from-primary/10 group-hover:to-blue-50 transition-all'>
              <img className='w-10' src={item.image} alt={item.speciality} />
            </div>
            <p className='text-sm font-medium text-gray-700 group-hover:text-primary transition-colors'>{item.speciality}</p>
          </Link>
        ))}
      </div>

    </div>
  );
};

export default SpecialityMenu;
