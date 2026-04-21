import React, { useState } from 'react'
import { assets } from '../assets/assets'

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      alert('Thank you for contacting us! We will get back to you soon.')
      setLoading(false)
      setFormData({ name: '', email: '', message: '' })
    }, 1000)
  }

  return (
    <div className='mt-24 pb-16 px-4'>

      {/* Header */}
      <div className='text-center mb-12'>
        <h1 className='text-3xl md:text-4xl font-bold text-gray-800'>Contact Us</h1>
        <p className='mt-3 text-gray-500'>We're here to help. Get in touch with us.</p>
      </div>

      <div className='max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-10'>
        {/* Image */}
        <div className='lg:w-1/2'>
          <img
            className='w-full rounded-3xl shadow-2xl'
            src={assets.contact_image}
            alt="Contact Us"
          />
        </div>

        {/* Contact Form & Info */}
        <div className='lg:w-1/2 w-full'>
          <div className='bg-white rounded-3xl shadow-xl p-8 border border-gray-100'>
            <h2 className='text-2xl font-bold text-gray-800 mb-6'>Send us a Message</h2>
            
            <form onSubmit={handleSubmit} className='space-y-5'>
              <div>
                <label className='block text-sm text-gray-600 mb-2'>Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className='w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary transition-colors'
                  placeholder='Your name'
                  required
                />
              </div>
              <div>
                <label className='block text-sm text-gray-600 mb-2'>Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className='w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary transition-colors'
                  placeholder='Your email'
                  required
                />
              </div>
              <div>
                <label className='block text-sm text-gray-600 mb-2'>Message</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className='w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary transition-colors h-32 resize-none'
                  placeholder='How can we help you?'
                  required
                />
              </div>
              <button
                type='submit'
                disabled={loading}
                className='w-full bg-primary text-white py-4 rounded-xl font-semibold hover:bg-blue-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2'
              >
                {loading ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span> : '📤'}
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>

            {/* Contact Info */}
            <div className='mt-8 pt-8 border-t border-gray-100'>
              <h3 className='text-lg font-semibold text-gray-800 mb-4'>Other Ways to Reach Us</h3>
              <div className='space-y-3 text-gray-600'>
                <p className='flex items-center gap-3'>📞 <span className='font-medium'>+91-212-456-7890</span></p>
                <p className='flex items-center gap-3'>✉️ <span className='font-medium'>medicorehospital@gmail.com</span></p>
                <p className='flex items-center gap-3'>📍 <span className='font-medium'>MediCore Hospital, Rajpura, Punjab</span></p>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Contact;


