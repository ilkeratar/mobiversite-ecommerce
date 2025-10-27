'use client';

import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { MinusIcon, PlusIcon } from '@heroicons/react/20/solid';
import { Category, ProductFilters } from '@/types';

interface ProductSidebarFiltersProps {
  categories: Category[];
  filters: ProductFilters;
  onFiltersChange: (filters: ProductFilters) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export default function ProductSidebarFilters({
  categories,
  filters,
  onFiltersChange,
  isOpen,
  onToggle,
}: ProductSidebarFiltersProps) {
  const handleFilterChange = (key: keyof ProductFilters, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const clearAllFilters = () => {
    onFiltersChange({});
  };

  const getActiveFilterCount = () => {
    return Object.values(filters).filter(value => 
      value !== undefined && value !== '' && value !== false
    ).length;
  };

  const activeFilterCount = getActiveFilterCount();

  // Rating options
  const ratingOptions = [
    { value: 4, label: '4 Stars & Up' },
    { value: 3, label: '3 Stars & Up' },
    { value: 2, label: '2 Stars & Up' },
    { value: 1, label: '1 Star & Up' },
  ];

  // Brand options (from db.json)
  const brandOptions = [
    'Nike', 'Tommy Hilfiger', 'Levi\'s', 'Calvin Klein',
    'Swarovski', 'Cartier', 'Bulgari',
    'Sony', 'LG', 'Apple',
    'Zara', 'H&M', 'Forever 21'
  ];

  // Size options
  const sizeOptions = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Small', 'Medium', 'Large', 'One Size'];

  // Color options
  const colorOptions = [
    'Black', 'White', 'Red', 'Navy', 'Gray', 'Pink', 
    'Blue', 'Purple', 'Silver', 'Gold', 'Rose Gold', 'Space Gray'
  ];

  // Material options
  const materialOptions = [
    '100% Cotton', 'Cotton Blend', 'Polyester', 'Linen', 'Silk',
    'Gold', 'Silver', 'Rose Gold', 'Platinum', 'Stainless Steel'
  ];

  // Storage options (for electronics)
  const storageOptions = ['32GB', '64GB', '128GB', '256GB', '512GB', '1TB'];

  return (
    <>
      {/* Mobile filter dialog */}
      <Dialog open={isOpen} onClose={onToggle} className="relative z-40 lg:hidden">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-black/25 transition-opacity duration-300 ease-linear data-closed:opacity-0"
        />

        <div className="fixed inset-0 z-40 flex">
          <DialogPanel
            transition
            className="relative ml-auto flex size-full max-w-xs transform flex-col overflow-y-auto bg-white pt-4 pb-12 shadow-xl transition duration-300 ease-in-out data-closed:translate-x-full"
          >
            <div className="flex items-center justify-between px-4">
              <h2 className="text-lg font-medium text-gray-900">Filters</h2>
              <button
                type="button"
                onClick={onToggle}
                className="relative -mr-2 flex size-10 items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-50"
              >
                <span className="absolute -inset-0.5" />
                <span className="sr-only">Close menu</span>
                <XMarkIcon aria-hidden="true" className="size-6" />
              </button>
            </div>

            {/* Filters */}
            <form className="mt-4 border-t border-gray-200">
              {/* Clear All Button - Animated */}
              <div 
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  activeFilterCount > 0 ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-4 py-3 border-b border-gray-200">
                  <button
                    type="button"
                    onClick={clearAllFilters}
                    className="text-sm text-red-600 hover:text-red-700 font-medium transition-colors"
                  >
                    Clear all {activeFilterCount} {activeFilterCount === 1 ? 'filter' : 'filters'}
                  </button>
                </div>
              </div>

              {/* Categories */}
              <h3 className="sr-only">Categories</h3>
              <ul role="list" className="px-2 py-3 font-medium text-gray-900 border-b border-gray-200">
                {categories.map((category) => (
                  <li key={category.id}>
                    <button
                      type="button"
                      onClick={() => handleFilterChange('category', category.slug)}
                      className={`block px-2 py-3 w-full text-left capitalize ${
                        filters.category === category.slug ? 'text-blue-600 font-semibold' : ''
                      }`}
                    >
                      {category.name}
                    </button>
                  </li>
                ))}
              </ul>

              {/* Price Range */}
              <Disclosure as="div" className="border-t border-gray-200 px-4 py-6">
                <h3 className="-mx-2 -my-3 flow-root">
                  <DisclosureButton className="group flex w-full items-center justify-between bg-white px-2 py-3 text-gray-400 hover:text-gray-500">
                    <span className="font-medium text-gray-900">Price Range</span>
                    <span className="ml-6 flex items-center">
                      <PlusIcon aria-hidden="true" className="size-5 group-data-open:hidden" />
                      <MinusIcon aria-hidden="true" className="size-5 group-not-data-open:hidden" />
                    </span>
                  </DisclosureButton>
                </h3>
                <DisclosurePanel className="pt-6">
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="Min"
                        value={filters.minPrice || ''}
                        onChange={(e) => handleFilterChange('minPrice', e.target.value ? Number(e.target.value) : undefined)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="number"
                        placeholder="Max"
                        value={filters.maxPrice || ''}
                        onChange={(e) => handleFilterChange('maxPrice', e.target.value ? Number(e.target.value) : undefined)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </DisclosurePanel>
              </Disclosure>

              {/* Availability */}
              <Disclosure as="div" className="border-t border-gray-200 px-4 py-6">
                <h3 className="-mx-2 -my-3 flow-root">
                  <DisclosureButton className="group flex w-full items-center justify-between bg-white px-2 py-3 text-gray-400 hover:text-gray-500">
                    <span className="font-medium text-gray-900">Availability</span>
                    <span className="ml-6 flex items-center">
                      <PlusIcon aria-hidden="true" className="size-5 group-data-open:hidden" />
                      <MinusIcon aria-hidden="true" className="size-5 group-not-data-open:hidden" />
                    </span>
                  </DisclosureButton>
                </h3>
                <DisclosurePanel className="pt-6">
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <div className="flex h-5 shrink-0 items-center">
                        <div className="group grid size-4 grid-cols-1">
                          <input
                            id="filter-mobile-availability-instock"
                            type="checkbox"
                            checked={filters.inStock === true}
                            onChange={(e) => handleFilterChange('inStock', e.target.checked ? true : undefined)}
                            className="col-start-1 row-start-1 appearance-none rounded-sm border border-gray-300 bg-white checked:border-blue-600 checked:bg-blue-600 indeterminate:border-blue-600 indeterminate:bg-blue-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"
                          />
                          <svg
                            fill="none"
                            viewBox="0 0 14 14"
                            className="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-disabled:stroke-gray-950/25"
                          >
                            <path
                              d="M3 8L6 11L11 3.5"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="opacity-0 group-has-checked:opacity-100"
                            />
                          </svg>
                        </div>
                      </div>
                      <label
                        htmlFor="filter-mobile-availability-instock"
                        className="min-w-0 flex-1 text-gray-500"
                      >
                        In Stock Only
                      </label>
                    </div>
                  </div>
                </DisclosurePanel>
              </Disclosure>

              {/* Rating */}
              <Disclosure as="div" className="border-t border-gray-200 px-4 py-6">
                <h3 className="-mx-2 -my-3 flow-root">
                  <DisclosureButton className="group flex w-full items-center justify-between bg-white px-2 py-3 text-gray-400 hover:text-gray-500">
                    <span className="font-medium text-gray-900">Rating</span>
                    <span className="ml-6 flex items-center">
                      <PlusIcon aria-hidden="true" className="size-5 group-data-open:hidden" />
                      <MinusIcon aria-hidden="true" className="size-5 group-not-data-open:hidden" />
                    </span>
                  </DisclosureButton>
                </h3>
                <DisclosurePanel className="pt-6">
                  <div className="space-y-4">
                    {ratingOptions.map((option, optionIdx) => (
                      <div key={option.value} className="flex gap-3">
                        <div className="flex h-5 shrink-0 items-center">
                          <div className="group grid size-4 grid-cols-1">
                            <input
                              id={`filter-mobile-rating-${optionIdx}`}
                              type="checkbox"
                              checked={filters.rating === option.value}
                              onChange={(e) => handleFilterChange('rating', e.target.checked ? option.value : undefined)}
                              className="col-start-1 row-start-1 appearance-none rounded-sm border border-gray-300 bg-white checked:border-blue-600 checked:bg-blue-600 indeterminate:border-blue-600 indeterminate:bg-blue-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"
                            />
                            <svg
                              fill="none"
                              viewBox="0 0 14 14"
                              className="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-disabled:stroke-gray-950/25"
                            >
                              <path
                                d="M3 8L6 11L11 3.5"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="opacity-0 group-has-checked:opacity-100"
                              />
                            </svg>
                          </div>
                        </div>
                        <label
                          htmlFor={`filter-mobile-rating-${optionIdx}`}
                          className="min-w-0 flex-1 text-gray-500 flex items-center"
                        >
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <span
                                key={i}
                                className={`text-sm ${
                                  i < option.value ? 'text-yellow-400' : 'text-gray-300'
                                }`}
                              >
                                ★
                              </span>
                            ))}
                            <span className="ml-1 text-sm">& Up</span>
                          </div>
                        </label>
                      </div>
                    ))}
                  </div>
                </DisclosurePanel>
              </Disclosure>

              {/* Brand */}
              <Disclosure as="div" className="border-t border-gray-200 px-4 py-6">
                <h3 className="-mx-2 -my-3 flow-root">
                  <DisclosureButton className="group flex w-full items-center justify-between bg-white px-2 py-3 text-gray-400 hover:text-gray-500">
                    <span className="font-medium text-gray-900">Brand</span>
                    <span className="ml-6 flex items-center">
                      <PlusIcon aria-hidden="true" className="size-5 group-data-open:hidden" />
                      <MinusIcon aria-hidden="true" className="size-5 group-not-data-open:hidden" />
                    </span>
                  </DisclosureButton>
                </h3>
                <DisclosurePanel className="pt-6">
                  <div className="space-y-4 max-h-48 overflow-y-auto">
                    {brandOptions.map((brand) => (
                      <div key={brand} className="flex gap-3">
                        <div className="flex h-5 shrink-0 items-center">
                          <div className="group grid size-4 grid-cols-1">
                            <input
                              id={`filter-mobile-brand-${brand}`}
                              type="checkbox"
                              checked={filters.brand === brand}
                              onChange={(e) => handleFilterChange('brand', e.target.checked ? brand : undefined)}
                              className="col-start-1 row-start-1 appearance-none rounded-sm border border-gray-300 bg-white checked:border-blue-600 checked:bg-blue-600 indeterminate:border-blue-600 indeterminate:bg-blue-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"
                            />
                            <svg
                              fill="none"
                              viewBox="0 0 14 14"
                              className="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-disabled:stroke-gray-950/25"
                            >
                              <path
                                d="M3 8L6 11L11 3.5"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="opacity-0 group-has-checked:opacity-100"
                              />
                            </svg>
                          </div>
                        </div>
                        <label
                          htmlFor={`filter-mobile-brand-${brand}`}
                          className="min-w-0 flex-1 text-gray-500"
                        >
                          {brand}
                        </label>
                      </div>
                    ))}
                  </div>
                </DisclosurePanel>
              </Disclosure>

              {/* Size */}
              <Disclosure as="div" className="border-t border-gray-200 px-4 py-6">
                <h3 className="-mx-2 -my-3 flow-root">
                  <DisclosureButton className="group flex w-full items-center justify-between bg-white px-2 py-3 text-gray-400 hover:text-gray-500">
                    <span className="font-medium text-gray-900">Size</span>
                    <span className="ml-6 flex items-center">
                      <PlusIcon aria-hidden="true" className="size-5 group-data-open:hidden" />
                      <MinusIcon aria-hidden="true" className="size-5 group-not-data-open:hidden" />
                    </span>
                  </DisclosureButton>
                </h3>
                <DisclosurePanel className="pt-6">
                  <div className="flex flex-wrap gap-2">
                    {sizeOptions.map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => handleFilterChange('size', filters.size === size ? undefined : size)}
                        className={`px-3 py-1.5 text-sm border rounded-md transition-colors ${
                          filters.size === size
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-blue-600'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </DisclosurePanel>
              </Disclosure>

              {/* Color */}
              <Disclosure as="div" className="border-t border-gray-200 px-4 py-6">
                <h3 className="-mx-2 -my-3 flow-root">
                  <DisclosureButton className="group flex w-full items-center justify-between bg-white px-2 py-3 text-gray-400 hover:text-gray-500">
                    <span className="font-medium text-gray-900">Color</span>
                    <span className="ml-6 flex items-center">
                      <PlusIcon aria-hidden="true" className="size-5 group-data-open:hidden" />
                      <MinusIcon aria-hidden="true" className="size-5 group-not-data-open:hidden" />
                    </span>
                  </DisclosureButton>
                </h3>
                <DisclosurePanel className="pt-6">
                  <div className="flex flex-wrap gap-2">
                    {colorOptions.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => handleFilterChange('color', filters.color === color ? undefined : color)}
                        className={`px-3 py-1.5 text-sm border rounded-md transition-colors ${
                          filters.color === color
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-blue-600'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </DisclosurePanel>
              </Disclosure>

              {/* Material */}
              <Disclosure as="div" className="border-t border-gray-200 px-4 py-6">
                <h3 className="-mx-2 -my-3 flow-root">
                  <DisclosureButton className="group flex w-full items-center justify-between bg-white px-2 py-3 text-gray-400 hover:text-gray-500">
                    <span className="font-medium text-gray-900">Material</span>
                    <span className="ml-6 flex items-center">
                      <PlusIcon aria-hidden="true" className="size-5 group-data-open:hidden" />
                      <MinusIcon aria-hidden="true" className="size-5 group-not-data-open:hidden" />
                    </span>
                  </DisclosureButton>
                </h3>
                <DisclosurePanel className="pt-6">
                  <div className="space-y-4 max-h-48 overflow-y-auto">
                    {materialOptions.map((material) => (
                      <div key={material} className="flex gap-3">
                        <div className="flex h-5 shrink-0 items-center">
                          <div className="group grid size-4 grid-cols-1">
                            <input
                              id={`filter-mobile-material-${material}`}
                              type="checkbox"
                              checked={filters.material === material}
                              onChange={(e) => handleFilterChange('material', e.target.checked ? material : undefined)}
                              className="col-start-1 row-start-1 appearance-none rounded-sm border border-gray-300 bg-white checked:border-blue-600 checked:bg-blue-600 indeterminate:border-blue-600 indeterminate:bg-blue-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"
                            />
                            <svg
                              fill="none"
                              viewBox="0 0 14 14"
                              className="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-disabled:stroke-gray-950/25"
                            >
                              <path
                                d="M3 8L6 11L11 3.5"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="opacity-0 group-has-checked:opacity-100"
                              />
                            </svg>
                          </div>
                        </div>
                        <label
                          htmlFor={`filter-mobile-material-${material}`}
                          className="min-w-0 flex-1 text-gray-500"
                        >
                          {material}
                        </label>
                      </div>
                    ))}
                  </div>
                </DisclosurePanel>
              </Disclosure>

              {/* Storage */}
              <Disclosure as="div" className="border-t border-gray-200 px-4 py-6">
                <h3 className="-mx-2 -my-3 flow-root">
                  <DisclosureButton className="group flex w-full items-center justify-between bg-white px-2 py-3 text-gray-400 hover:text-gray-500">
                    <span className="font-medium text-gray-900">Storage</span>
                    <span className="ml-6 flex items-center">
                      <PlusIcon aria-hidden="true" className="size-5 group-data-open:hidden" />
                      <MinusIcon aria-hidden="true" className="size-5 group-not-data-open:hidden" />
                    </span>
                  </DisclosureButton>
                </h3>
                <DisclosurePanel className="pt-6">
                  <div className="flex flex-wrap gap-2">
                    {storageOptions.map((storage) => (
                      <button
                        key={storage}
                        type="button"
                        onClick={() => handleFilterChange('storage', filters.storage === storage ? undefined : storage)}
                        className={`px-3 py-1.5 text-sm border rounded-md transition-colors ${
                          filters.storage === storage
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-blue-600'
                        }`}
                      >
                        {storage}
                      </button>
                    ))}
                  </div>
                </DisclosurePanel>
              </Disclosure>
            </form>
          </DialogPanel>
        </div>
      </Dialog>

      {/* Desktop Filters */}
      <form className="hidden lg:block">
        {/* Clear All Button - Animated */}
        <div 
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            activeFilterCount > 0 ? 'max-h-20 opacity-100 mb-6' : 'max-h-0 opacity-0'
          }`}
        >
          <button
            type="button"
            onClick={clearAllFilters}
            className="text-sm text-red-600 hover:text-red-700 font-medium transition-colors"
          >
            Clear all {activeFilterCount} {activeFilterCount === 1 ? 'filter' : 'filters'}
          </button>
        </div>

        {/* Categories */}
        <h3 className="sr-only">Categories</h3>
        <ul role="list" className="space-y-4 border-b border-gray-200 pb-6 text-sm font-medium text-gray-900">
          {categories.map((category) => (
            <li key={category.id}>
              <button
                type="button"
                onClick={() => handleFilterChange('category', category.slug)}
                className={`capitalize ${
                  filters.category === category.slug ? 'text-blue-600 font-semibold' : ''
                }`}
              >
                {category.name}
              </button>
            </li>
          ))}
        </ul>

        {/* Price Range */}
        <Disclosure as="div" className="border-b border-gray-200 py-6" defaultOpen>
          <h3 className="-my-3 flow-root">
            <DisclosureButton className="group flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
              <span className="font-medium text-gray-900">Price Range</span>
              <span className="ml-6 flex items-center">
                <PlusIcon aria-hidden="true" className="size-5 group-data-open:hidden" />
                <MinusIcon aria-hidden="true" className="size-5 group-not-data-open:hidden" />
              </span>
            </DisclosureButton>
          </h3>
          <DisclosurePanel className="pt-6">
            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.minPrice || ''}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value ? Number(e.target.value) : undefined)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.maxPrice || ''}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value ? Number(e.target.value) : undefined)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </DisclosurePanel>
        </Disclosure>

        {/* Availability */}
        <Disclosure as="div" className="border-b border-gray-200 py-6" defaultOpen>
          <h3 className="-my-3 flow-root">
            <DisclosureButton className="group flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
              <span className="font-medium text-gray-900">Availability</span>
              <span className="ml-6 flex items-center">
                <PlusIcon aria-hidden="true" className="size-5 group-data-open:hidden" />
                <MinusIcon aria-hidden="true" className="size-5 group-not-data-open:hidden" />
              </span>
            </DisclosureButton>
          </h3>
          <DisclosurePanel className="pt-6">
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="flex h-5 shrink-0 items-center">
                  <div className="group grid size-4 grid-cols-1">
                    <input
                      id="filter-availability-instock"
                      type="checkbox"
                      checked={filters.inStock === true}
                      onChange={(e) => handleFilterChange('inStock', e.target.checked ? true : undefined)}
                      className="col-start-1 row-start-1 appearance-none rounded-sm border border-gray-300 bg-white checked:border-blue-600 checked:bg-blue-600 indeterminate:border-blue-600 indeterminate:bg-blue-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"
                    />
                    <svg
                      fill="none"
                      viewBox="0 0 14 14"
                      className="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-disabled:stroke-gray-950/25"
                    >
                      <path
                        d="M3 8L6 11L11 3.5"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="opacity-0 group-has-checked:opacity-100"
                      />
                    </svg>
                  </div>
                </div>
                <label htmlFor="filter-availability-instock" className="text-sm text-gray-600">
                  In Stock Only
                </label>
              </div>
            </div>
          </DisclosurePanel>
        </Disclosure>

        {/* Rating */}
        <Disclosure as="div" className="border-b border-gray-200 py-6" defaultOpen>
          <h3 className="-my-3 flow-root">
            <DisclosureButton className="group flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
              <span className="font-medium text-gray-900">Rating</span>
              <span className="ml-6 flex items-center">
                <PlusIcon aria-hidden="true" className="size-5 group-data-open:hidden" />
                <MinusIcon aria-hidden="true" className="size-5 group-not-data-open:hidden" />
              </span>
            </DisclosureButton>
          </h3>
          <DisclosurePanel className="pt-6">
            <div className="space-y-4">
              {ratingOptions.map((option, optionIdx) => (
                <div key={option.value} className="flex gap-3">
                  <div className="flex h-5 shrink-0 items-center">
                    <div className="group grid size-4 grid-cols-1">
                      <input
                        id={`filter-rating-${optionIdx}`}
                        type="checkbox"
                        checked={filters.rating === option.value}
                        onChange={(e) => handleFilterChange('rating', e.target.checked ? option.value : undefined)}
                        className="col-start-1 row-start-1 appearance-none rounded-sm border border-gray-300 bg-white checked:border-blue-600 checked:bg-blue-600 indeterminate:border-blue-600 indeterminate:bg-blue-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"
                      />
                      <svg
                        fill="none"
                        viewBox="0 0 14 14"
                        className="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-disabled:stroke-gray-950/25"
                      >
                        <path
                          d="M3 8L6 11L11 3.5"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="opacity-0 group-has-checked:opacity-100"
                        />
                      </svg>
                    </div>
                  </div>
                  <label htmlFor={`filter-rating-${optionIdx}`} className="text-sm text-gray-600 flex items-center">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={`text-sm ${
                            i < option.value ? 'text-yellow-400' : 'text-gray-300'
                          }`}
                        >
                          ★
                        </span>
                      ))}
                      <span className="ml-1 text-sm">& Up</span>
                    </div>
                  </label>
                </div>
              ))}
            </div>
          </DisclosurePanel>
        </Disclosure>

        {/* Brand */}
        <Disclosure as="div" className="border-b border-gray-200 py-6">
          <h3 className="-my-3 flow-root">
            <DisclosureButton className="group flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
              <span className="font-medium text-gray-900">Brand</span>
              <span className="ml-6 flex items-center">
                <PlusIcon aria-hidden="true" className="size-5 group-data-open:hidden" />
                <MinusIcon aria-hidden="true" className="size-5 group-not-data-open:hidden" />
              </span>
            </DisclosureButton>
          </h3>
          <DisclosurePanel className="pt-6">
            <div className="space-y-4 max-h-48 overflow-y-auto">
              {brandOptions.map((brand) => (
                <div key={brand} className="flex gap-3">
                  <div className="flex h-5 shrink-0 items-center">
                    <div className="group grid size-4 grid-cols-1">
                      <input
                        id={`filter-brand-${brand}`}
                        type="checkbox"
                        checked={filters.brand === brand}
                        onChange={(e) => handleFilterChange('brand', e.target.checked ? brand : undefined)}
                        className="col-start-1 row-start-1 appearance-none rounded-sm border border-gray-300 bg-white checked:border-blue-600 checked:bg-blue-600 indeterminate:border-blue-600 indeterminate:bg-blue-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"
                      />
                      <svg
                        fill="none"
                        viewBox="0 0 14 14"
                        className="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-disabled:stroke-gray-950/25"
                      >
                        <path
                          d="M3 8L6 11L11 3.5"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="opacity-0 group-has-checked:opacity-100"
                        />
                      </svg>
                    </div>
                  </div>
                  <label htmlFor={`filter-brand-${brand}`} className="text-sm text-gray-600">
                    {brand}
                  </label>
                </div>
              ))}
            </div>
          </DisclosurePanel>
        </Disclosure>

        {/* Size */}
        <Disclosure as="div" className="border-b border-gray-200 py-6">
          <h3 className="-my-3 flow-root">
            <DisclosureButton className="group flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
              <span className="font-medium text-gray-900">Size</span>
              <span className="ml-6 flex items-center">
                <PlusIcon aria-hidden="true" className="size-5 group-data-open:hidden" />
                <MinusIcon aria-hidden="true" className="size-5 group-not-data-open:hidden" />
              </span>
            </DisclosureButton>
          </h3>
          <DisclosurePanel className="pt-6">
            <div className="flex flex-wrap gap-2">
              {sizeOptions.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => handleFilterChange('size', filters.size === size ? undefined : size)}
                  className={`px-3 py-1.5 text-sm border rounded-md transition-colors ${
                    filters.size === size
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-blue-600'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </DisclosurePanel>
        </Disclosure>

        {/* Color */}
        <Disclosure as="div" className="border-b border-gray-200 py-6">
          <h3 className="-my-3 flow-root">
            <DisclosureButton className="group flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
              <span className="font-medium text-gray-900">Color</span>
              <span className="ml-6 flex items-center">
                <PlusIcon aria-hidden="true" className="size-5 group-data-open:hidden" />
                <MinusIcon aria-hidden="true" className="size-5 group-not-data-open:hidden" />
              </span>
            </DisclosureButton>
          </h3>
          <DisclosurePanel className="pt-6">
            <div className="flex flex-wrap gap-2">
              {colorOptions.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => handleFilterChange('color', filters.color === color ? undefined : color)}
                  className={`px-3 py-1.5 text-sm border rounded-md transition-colors ${
                    filters.color === color
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-blue-600'
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </DisclosurePanel>
        </Disclosure>

        {/* Material */}
        <Disclosure as="div" className="border-b border-gray-200 py-6">
          <h3 className="-my-3 flow-root">
            <DisclosureButton className="group flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
              <span className="font-medium text-gray-900">Material</span>
              <span className="ml-6 flex items-center">
                <PlusIcon aria-hidden="true" className="size-5 group-data-open:hidden" />
                <MinusIcon aria-hidden="true" className="size-5 group-not-data-open:hidden" />
              </span>
            </DisclosureButton>
          </h3>
          <DisclosurePanel className="pt-6">
            <div className="space-y-4 max-h-48 overflow-y-auto">
              {materialOptions.map((material) => (
                <div key={material} className="flex gap-3">
                  <div className="flex h-5 shrink-0 items-center">
                    <div className="group grid size-4 grid-cols-1">
                      <input
                        id={`filter-material-${material}`}
                        type="checkbox"
                        checked={filters.material === material}
                        onChange={(e) => handleFilterChange('material', e.target.checked ? material : undefined)}
                        className="col-start-1 row-start-1 appearance-none rounded-sm border border-gray-300 bg-white checked:border-blue-600 checked:bg-blue-600 indeterminate:border-blue-600 indeterminate:bg-blue-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"
                      />
                      <svg
                        fill="none"
                        viewBox="0 0 14 14"
                        className="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-disabled:stroke-gray-950/25"
                      >
                        <path
                          d="M3 8L6 11L11 3.5"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="opacity-0 group-has-checked:opacity-100"
                        />
                      </svg>
                    </div>
                  </div>
                  <label htmlFor={`filter-material-${material}`} className="text-sm text-gray-600">
                    {material}
                  </label>
                </div>
              ))}
            </div>
          </DisclosurePanel>
        </Disclosure>

        {/* Storage */}
        <Disclosure as="div" className="border-b border-gray-200 py-6">
          <h3 className="-my-3 flow-root">
            <DisclosureButton className="group flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
              <span className="font-medium text-gray-900">Storage</span>
              <span className="ml-6 flex items-center">
                <PlusIcon aria-hidden="true" className="size-5 group-data-open:hidden" />
                <MinusIcon aria-hidden="true" className="size-5 group-not-data-open:hidden" />
              </span>
            </DisclosureButton>
          </h3>
          <DisclosurePanel className="pt-6">
            <div className="flex flex-wrap gap-2">
              {storageOptions.map((storage) => (
                <button
                  key={storage}
                  type="button"
                  onClick={() => handleFilterChange('storage', filters.storage === storage ? undefined : storage)}
                  className={`px-3 py-1.5 text-sm border rounded-md transition-colors ${
                    filters.storage === storage
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-blue-600'
                  }`}
                >
                  {storage}
                </button>
              ))}
            </div>
          </DisclosurePanel>
        </Disclosure>
      </form>
    </>
  );
}
