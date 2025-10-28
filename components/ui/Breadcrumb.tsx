'use client';

import Link from 'next/link';
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/24/outline';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export default function Breadcrumb({ items, className = '' }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={`flex ${className}`}>
      <ol className="flex items-center space-x-2">
        {/* Home Link */}
        <li>
          <Link 
            href="/"
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <HomeIcon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
            <span className="sr-only">Home</span>
          </Link>
        </li>

        {/* Breadcrumb Items */}
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          
          return (
            <li key={index} className="flex items-center">
              <ChevronRightIcon 
                className="h-5 w-5 flex-shrink-0 text-gray-400" 
                aria-hidden="true" 
              />
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="ml-2 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span 
                  className="ml-2 text-sm font-medium text-gray-900"
                  aria-current={isLast ? 'page' : undefined}
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

