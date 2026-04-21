import React from 'react';

const StatsSection = () => {
  const stats = [
    { icon: '👨‍⚕️', value: '500+', label: 'Expert Doctors' },
    { icon: '🏥', value: '50+', label: 'Hospitals' },
    { icon: '🤝', value: '50k+', label: 'Happy Patients' },
    { icon: '⭐', value: '4.9', label: 'Rating' },
  ];

  return (
    <div className="py-12 bg-gradient-to-r from-blue-50 to-indigo-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="text-center p-6 bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300">
              <div className="text-4xl mb-3">{stat.icon}</div>
              <div className="text-3xl font-bold text-primary mb-1">{stat.value}</div>
              <div className="text-gray-600 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatsSection;