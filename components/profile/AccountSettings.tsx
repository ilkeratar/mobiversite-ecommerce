'use client';

import { User } from '@/types';
import { useState, useTransition } from 'react';
import { updateUserAddress, UpdateAddressState, updateUserInfo, UpdateProfileState } from '@/lib/actions';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

interface AccountSettingsProps {
  user: User;
}

export default function AccountSettings({ user }: AccountSettingsProps) {
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [isPendingPersonal, startTransitionPersonal] = useTransition();
  const [state, setState] = useState<UpdateAddressState | undefined>(undefined);
  const [personalState, setPersonalState] = useState<UpdateProfileState | undefined>(undefined);
  const router = useRouter();
  
  const hasAddress = !!(
    user.address && (
      user.address.addressLine?.trim() ||
      user.address.city?.trim() ||
      user.address.zipcode?.trim() ||
      user.address.country?.trim()
    )
  );
  
  const handleSubmit = async (formData: FormData) => {
    startTransition(async () => {
      const result = await updateUserAddress(undefined, formData);
      setState(result);
      
      if (result.success) {
        toast.success('Your address has been updated.');
        setIsEditingAddress(false);
        router.refresh();
        return;
      }

      if (result.error) {
      }
    });
  };

  const handlePersonalSubmit = async (formData: FormData) => {
    startTransitionPersonal(async () => {
      const result = await updateUserInfo(undefined, formData);
      setPersonalState(result);

      if (result.success) {
        toast.success('Your information has been updated.');
        setIsEditingPersonal(false);
        router.refresh();
        return;
      }

      if (result.error) {
      }
    });
  };

  return (
    <div>
      {/* Personal Information */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-lg font-medium text-gray-900">
            Personal Information
          </h2>
          {!isEditingPersonal && (
            <button
              onClick={() => setIsEditingPersonal(true)}
              className="text-sm text-gray-500 hover:text-gray-900 cursor-pointer transition-colors duration-200 flex items-center gap-1 group"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                strokeWidth={1.5} 
                stroke="currentColor" 
                className="w-4 h-4"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" 
                />
              </svg>
              <span className="group-hover:underline">Edit</span>
            </button>
          )}
        </div>

        {personalState?.error && (
          <div className="mb-4 p-3 text-sm bg-red-50 text-red-600 rounded">
            {personalState.error}
          </div>
        )}

        {!isEditingPersonal ? (
          <div className="space-y-6 max-w-2xl">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  First Name
                </label>
                <p className="text-sm text-gray-900">
                  {user.name.firstname}
                </p>
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Last Name
                </label>
                <p className="text-sm text-gray-900">
                  {user.name.lastname}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Email
                </label>
                <p className="text-sm text-gray-900">{user.email}</p>
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Phone
                </label>
                <p className="text-sm text-gray-900">
                  {user.phone || '—'}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <form action={handlePersonalSubmit} className="space-y-4 max-w-2xl">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="firstname"
                  className="block text-xs text-gray-500 mb-2"
                >
                  First Name *
                </label>
                <input
                  type="text"
                  id="firstname"
                  name="firstname"
                  defaultValue={user.name.firstname}
                  required
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-gray-900"
                />
              </div>
              <div>
                <label
                  htmlFor="lastname"
                  className="block text-xs text-gray-500 mb-2"
                >
                  Last Name *
                </label>
                <input
                  type="text"
                  id="lastname"
                  name="lastname"
                  defaultValue={user.name.lastname}
                  required
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-gray-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs text-gray-500 mb-2"
                >
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  defaultValue={user.email}
                  required
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-gray-900"
                />
              </div>
              <div>
                <label
                  htmlFor="phone"
                  className="block text-xs text-gray-500 mb-2"
                >
                  Phone
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  defaultValue={user.phone || ''}
                  inputMode="tel"
                  pattern="^[0-9+()\-\s]{7,20}$"
                  title="Use digits, spaces, +, -, () with 7-20 characters"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-gray-900"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={isPendingPersonal}
                className="px-6 py-2 text-sm bg-gray-900 text-white rounded hover:bg-gray-800 cursor-pointer transition-colors disabled:bg-gray-400"
              >
                {isPendingPersonal ? 'Saving...' : 'Save'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsEditingPersonal(false);
                  setPersonalState(undefined);
                }}
                disabled={isPendingPersonal}
                className="px-6 py-2 text-sm border border-gray-300 text-gray-900 rounded hover:bg-gray-50 cursor-pointer transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </section>

      {/* Divider */}
      <div className="border-t border-gray-200 mb-12 -mx-8" />

      {/* Shipping Address */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-lg font-medium text-gray-900">
            Shipping Address
          </h2>

          {!isEditingAddress && (
            <button
              onClick={() => setIsEditingAddress(true)}
              className="text-sm text-gray-500 hover:text-gray-900 cursor-pointer transition-colors duration-200 flex items-center gap-1 group"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                strokeWidth={1.5} 
                stroke="currentColor" 
                className="w-4 h-4"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" 
                />
              </svg>
              <span className="group-hover:underline">Edit</span>
            </button>
          )}
        </div>

        {state?.error && (
          <div className="mb-4 p-3 text-sm bg-red-50 text-red-600 rounded">
            {state.error}
          </div>
        )}

        {/* Success toast is handled via react-hot-toast; no inline success banner */}

        {!isEditingAddress ? (
          <div className="text-sm text-gray-900 max-w-2xl">
            {hasAddress ? (
              <div className="space-y-1">
                <p>{user.address.addressLine}</p>
                <p>
                  {user.address.city}
                  {user.address.state && `, ${user.address.state}`}
                </p>
                <p>{user.address.zipcode}</p>
                <p>{user.address.country}</p>
              </div>
            ) : (
              <p className="text-gray-400">You have no address yet. Please add your address.</p>
            )}
          </div>
        ) : (
          <form action={handleSubmit} className="space-y-4 max-w-2xl">
            <div>
              <label
                htmlFor="addressLine"
                className="block text-xs text-gray-500 mb-2"
              >
                Address Line *
              </label>
              <input
                type="text"
                id="addressLine"
                name="addressLine"
                defaultValue={user.address?.addressLine || ''}
                required
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-gray-900"
                placeholder="Street address, apartment, suite, etc."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="city"
                  className="block text-xs text-gray-500 mb-2"
                >
                  City *
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  defaultValue={user.address?.city || ''}
                  required
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-gray-900"
                />
              </div>

              <div>
                <label
                  htmlFor="state"
                  className="block text-xs text-gray-500 mb-2"
                >
                  State
                </label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  defaultValue={user.address?.state || ''}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-gray-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="zipcode"
                  className="block text-xs text-gray-500 mb-2"
                >
                  Zip Code *
                </label>
                <input
                  type="text"
                  id="zipcode"
                  name="zipcode"
                  defaultValue={user.address?.zipcode || ''}
                  required
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-gray-900"
                />
              </div>

              <div>
                <label
                  htmlFor="country"
                  className="block text-xs text-gray-500 mb-2"
                >
                  Country *
                </label>
                <input
                  type="text"
                  id="country"
                  name="country"
                  defaultValue={user.address?.country || ''}
                  required
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-gray-900"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={isPending}
                className="px-6 py-2 text-sm bg-gray-900 text-white rounded hover:bg-gray-800 cursor-pointer transition-colors disabled:bg-gray-400"
              >
                {isPending ? 'Saving...' : 'Save'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsEditingAddress(false);
                  setState(undefined);
                }}
                disabled={isPending}
                className="px-6 py-2 text-sm border border-gray-300 text-gray-900 rounded hover:bg-gray-50 cursor-pointer transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </section>
    </div>
  );
}
