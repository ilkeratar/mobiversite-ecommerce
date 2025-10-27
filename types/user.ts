// User related types

export interface User {
  id: number;
  email: string;
  username: string;
  password: string;
  name: UserName;
  phone: string;
  address: UserAddress;
  __v: number;
}

export interface UserName {
  firstname: string;
  lastname: string;
}

export interface UserAddress {
  geolocation: Geolocation;
  city: string;
  street: string;
  number: number;
  zipcode: string;
}

export interface Geolocation {
  lat: string;
  long: string;
}

// Auth related types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  username: string;
  firstname: string;
  lastname: string;
  phone: string;
}

export interface AuthUser {
  id: number;
  email: string;
  username: string;
  name: UserName;
  phone: string;
  address?: UserAddress;
}
