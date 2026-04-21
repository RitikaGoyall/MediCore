import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { useNavigate, useParams } from 'react-router-dom'
import { assets } from '../assets/assets'

const Doctors = () => {
  const { speciality } = useParams()
  const [filterDoc, setFilterDoc] = useState([])
  const [showFilter, setShowFilter] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('experience')
  const navigate = useNavigate()
  const { doctors } = useContext(AppContext)

  const applyFilter = () => {
    let filtered = doctors.filter(doc => {
      const name = doc.name.toLowerCase()
      return !name.includes('gadha') && !name.includes('gadhi')
    })
    
    if (speciality) {
      const normalizedSpecialty = speciality.toLowerCase().replace(/-/g, ' ')
      filtered = filtered.filter(doc => {
        const docSpecialty = doc.speciality.toLowerCase().replace(/ /g, '_')
        return docSpecialty === normalizedSpecialty.replace(/ /g, '_')
      })
    }
    
    if (searchTerm) {
      filtered = filtered.filter(doc => 
        doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.speciality.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    
    if (sortBy === 'name') {
      filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name))
    } else if (sortBy === 'experience') {
      filtered = [...filtered].sort((a, b) => Number(b.experience) - Number(a.experience))
    } else if (sortBy === 'fees') {
      filtered = [...filtered].sort((a, b) => a.fees - b.fees)
    }
    
    setFilterDoc(filtered)
  }

  useEffect(() => {
    applyFilter();
  }, [doctors, speciality, searchTerm, sortBy])

  const specialties = [
    { name: 'General physician', slug: 'general-physician' },
    { name: 'Gynecologist', slug: 'gynecologist' },
    { name: 'Dermatologist', slug: 'dermatologist' },
    { name: 'Pediatricians', slug: 'pediatricians' },
    { name: 'Neurologist', slug: 'neurologist' },
    { name: 'Gastroenterologist', slug: 'gastroenterologist' }
  ]

  if (doctors.length === 0) {
    return (
      <div className='mt-20 p-8 text-center'>
        <div className='animate-pulse'>
          <div className='w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4'></div>
          <div className='h-6 bg-gray-200 rounded w-1/3 mx-auto mb-2'></div>
          <div className='h-4 bg-gray-200 rounded w-1/4 mx-auto'></div>
        </div>
      </div>
    )
  }

  return (
    <div className='mt-24 px-4'>
      <div className='text-center mb-8'>
        <h1 className='text-3xl font-bold text-gray-800'>Find Your Doctor</h1>
        <p className='text-gray-600 mt-2'>Browse through our specialist doctors and book your appointment</p>
      </div>
      
      <div className='flex flex-col lg:flex-row gap-6'>
        {/* Sidebar */}
        <div className='lg:w-1/4'>
          <div className='bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sticky top-24'>
            <div className='flex items-center justify-between mb-4'>
              <h3 className='font-semibold text-gray-800'>Filters</h3>
              <button onClick={() => { setSearchTerm(''); setSortBy('experience'); navigate('/doctors'); }} className='text-primary text-sm hover:underline'>Reset</button>
            </div>
            
            {/* Search */}
            <div className='mb-4'>
              <label className='text-sm text-gray-600 mb-2 block'>Search</label>
              <div className='relative'>
                <input 
                  type="text" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search doctors..."
                  className='w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-primary text-sm'
                />
                <span className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400'>🔍</span>
              </div>
            </div>
            
            {/* Sort */}
            <div className='mb-4'>
              <label className='text-sm text-gray-600 mb-2 block'>Sort By</label>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className='w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-primary text-sm'
              >
                <option value="experience">Experience (High to Low)</option>
                <option value="name">Name (A to Z)</option>
                <option value="fees">Fees (Low to High)</option>
              </select>
            </div>
            
            {/* Specialties */}
            <div>
              <label className='text-sm text-gray-600 mb-2 block'>Specialty</label>
              <div className='space-y-2'>
                <button
                  onClick={() => navigate('/doctors')}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-sm transition-all ${
                    !speciality
                    ? 'bg-primary text-white' 
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  All Doctors
                </button>
                {specialties.map((spec) => (
                  <button
                    key={spec.slug}
                    onClick={() => navigate(`/doctors/${spec.slug}`)}
                    className={`w-full text-left px-4 py-2.5 rounded-xl text-sm transition-all ${
                      speciality === spec.slug || speciality === spec.name.toLowerCase().replace(/ /g, '-')
                      ? 'bg-primary text-white' 
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {spec.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Doctor Grid */}
        <div className='lg:w-3/4'>
          {speciality && (
            <div className='mb-4 flex items-center gap-2'>
              <span className='text-gray-500'>Filtering by:</span>
              <span className='bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium'>
                {speciality.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </span>
              <button onClick={() => navigate('/doctors')} className='text-gray-500 hover:text-red-500 text-sm'>
                ✕ Clear
              </button>
            </div>
          )}
          <p className='text-gray-600 mb-4'>{filterDoc.length} doctors found</p>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
            {filterDoc.map((item, index) => (
              <div 
                onClick={() => { navigate(`/appointment/${item._id}`); scrollTo(0, 0) }} 
                className='bg-white rounded-2xl border border-gray-100 overflow-hidden cursor-pointer hover:shadow-xl hover:shadow-gray-200/50 hover:-translate-y-1 transition-all duration-300 group'
                key={index}
              >
                <div className='relative'>
                  <img className='w-full h-56 object-cover bg-gradient-to-br from-blue-50 to-indigo-50 group-hover:scale-105 transition-transform duration-500' src={item.image} alt="" />
                  {item.available && (
                    <span className='absolute top-3 left-3 bg-green-500 text-white text-xs px-3 py-1 rounded-full font-medium'>
                      Available Today
                    </span>
                  )}
                  {!item.available && (
                    <span className='absolute top-3 left-3 bg-gray-400 text-white text-xs px-3 py-1 rounded-full font-medium'>
                      Not Available
                    </span>
                  )}
                </div>
                <div className='p-4'>
                  <div className='flex items-center justify-between mb-2'>
                    <div className={`flex items-center gap-2 text-sm ${item.available ? 'text-green-600' : "text-gray-400"}`}>
                      <span className={`w-2 h-2 rounded-full ${item.available ? 'bg-green-500' : "bg-gray-400"}`}></span>
                      {item.available ? 'Available' : "Unavailable"}
                    </div>
                    <div className='flex items-center gap-1 text-yellow-500'>
                      <span>⭐</span>
                      <span className='text-sm text-gray-600'>4.8</span>
                    </div>
                  </div>
                  <h3 className='text-gray-800 font-semibold text-lg'>{item.name}</h3>
                  <p className='text-gray-500 text-sm'>{item.speciality}</p>
                  <div className='flex items-center justify-between mt-3 pt-3 border-t border-gray-100'>
                    <span className='text-sm text-gray-500'>🩺 {item.experience} years exp.</span>
                    <span className='text-primary font-semibold'>₹{item.fees}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {filterDoc.length === 0 && (
            <div className='text-center py-12'>
              <div className='text-5xl mb-4'>🔍</div>
              <h3 className='text-xl font-semibold text-gray-700 mb-2'>No doctors found</h3>
              <p className='text-gray-500'>Try adjusting your search or filters</p>
              <button onClick={() => { setSearchTerm(''); navigate('/doctors'); }} className='mt-4 text-primary hover:underline'>Clear filters</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Doctors