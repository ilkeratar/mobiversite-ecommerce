'use client';

import { Truck, Shield, Award } from 'lucide-react';

interface Feature {
  id: number;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  color: string;
}

const features: Feature[] = [
  {
    id: 1,
    icon: Truck,
    title: 'Free Shipping',
    description: 'Free shipping on orders over $150',
    color: 'text-blue-600'
  },
  {
    id: 2,
    icon: Shield,
    title: 'Secure Shopping',
    description: 'Secure payment system with 256-bit SSL encryption',
    color: 'text-green-600'
  },
  {
    id: 3,
    icon: Award,
    title: 'Quality Guarantee',
    description: '2-year quality guarantee on all our products',
    color: 'text-purple-600'
  }
];

export default function FeaturesSection() {
  return (
    <section className="py-16 px-4 md:px-8 bg-gray-50">
      <div className="container mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Choose Us?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We make a difference with our service approach that prioritizes customer satisfaction
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div
              key={feature.id}
              className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 text-center"
            >
              {/* Icon Container */}
              <div className="relative mb-6">
                <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 group-hover:bg-gray-200 transition-colors duration-300 ${feature.color}`}>
                  <feature.icon className="w-10 h-10" />
                </div>
                
                {/* Hover Effect Ring */}
                <div className={`absolute inset-0 rounded-full border-2 border-transparent group-hover:border-current group-hover:${feature.color} transition-all duration-300 scale-110 opacity-0 group-hover:opacity-100`} />
              </div>

              {/* Content */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-gray-700 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                  {feature.description}
                </p>
              </div>

              {/* Decorative Element */}
              <div className="mt-6 h-1 w-16 bg-gradient-to-r from-transparent via-gray-300 to-transparent mx-auto group-hover:via-gray-400 transition-colors duration-300" />
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-2xl p-8 shadow-lg max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">10K+</div>
                <div className="text-gray-600">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">50K+</div>
                <div className="text-gray-600">Successful Deliveries</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">99%</div>
                <div className="text-gray-600">Customer Satisfaction</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
