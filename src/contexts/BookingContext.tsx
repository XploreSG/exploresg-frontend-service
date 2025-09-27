import React, { createContext, useContext, useState, ReactNode } from "react";import React, { createContext, useContext, useState, ReactNode } from "react";import React, { createContext, useContext, useState, ReactNode } from "react";import React, { createContext, useContext, useState, ReactNode } from "react";

import type { RentalCarData } from "../data/rentalCars";

import type { RentalCarData } from "../data/rentalCars";

interface AddOnSelection {

  id: string;import type { RentalCarData } from "../data/rentalCars";import type { RentalCarData } from "../data/rentalCars";

  name: string;

  price: number;interface AddOnSelection {

  selected: boolean;

}  id: string;



interface DriverDetails {  name: string;

  firstName: string;

  lastName: string;  price: number;interface AddOnSelection {interface AddOnSelection {

  email: string;

  phone: string;  selected: boolean;

  dateOfBirth: string;

  licenseNumber: string;}  id: string;  id: string;

  licenseIssueDate: string;

  licenseExpiryDate: string;

  licenseCountry: string;

  address: string;interface DriverDetails {  name: string;  name: string;

  city: string;

  postalCode: string;  firstName: string;

  country: string;

  emergencyContactName: string;  lastName: string;  price: number;  price: number;

  emergencyContactPhone: string;

  drivingExperience: string;  email: string;

}

  phone: string;  selected: boolean;  selected: boolean;

interface BookingContextType {

  selectedCar: RentalCarData | null;  dateOfBirth: string;

  selectedCDW: string;

  selectedAddOns: AddOnSelection[];  licenseNumber: string;}}

  driverDetails: DriverDetails | null;

  bookingDates: {  licenseIssueDate: string;

    pickup: string;

    return: string;  licenseExpiryDate: string;

    nights: number;

  } | null;  licenseCountry: string;

  totalPrice: number;

  address: string;interface DriverDetails {interface DriverDetails {

  setSelectedCar: (car: RentalCarData) => void;

  setSelectedCDW: (cdw: string) => void;  city: string;

  setSelectedAddOns: (addOns: AddOnSelection[]) => void;

  setDriverDetails: (details: DriverDetails) => void;  postalCode: string;  firstName: string;  firstName: string;

  setBookingDates: (dates: {

    pickup: string;  country: string;

    return: string;

    nights: number;  emergencyContactName: string;  lastName: string;  lastName: string;

  }) => void;

  calculateTotal: () => void;  emergencyContactPhone: string;

  resetBooking: () => void;

}  drivingExperience: string;  email: string;  email: string;



const BookingContext = createContext<BookingContextType | undefined>(undefined);}



export const useBooking = () => {  phone: string;  phone: string;

  const context = useContext(BookingContext);

  if (!context) {interface BookingContextType {

    throw new Error("useBooking must be used within a BookingProvider");

  }  selectedCar: RentalCarData | null;  dateOfBirth: string;  dateOfBirth: string;

  return context;

};  selectedCDW: string;



export const BookingProvider: React.FC<{ children: ReactNode }> = ({  selectedAddOns: AddOnSelection[];  licenseNumber: string;  licenseNumber: string;

  children,

}) => {  driverDetails: DriverDetails | null;

  const [selectedCar, setSelectedCar] = useState<RentalCarData | null>(null);

  const [selectedCDW, setSelectedCDW] = useState<string>("basic");  bookingDates: {  licenseIssueDate: string;  licenseIssueDate: string;

  const [selectedAddOns, setSelectedAddOns] = useState<AddOnSelection[]>([]);

  const [driverDetails, setDriverDetails] = useState<DriverDetails | null>(null);    pickup: string;

  const [bookingDates, setBookingDates] = useState<{

    pickup: string;    return: string;  licenseExpiryDate: string;  licenseExpiryDate: string;

    return: string;

    nights: number;    nights: number;

  } | null>(null);

  const [totalPrice, setTotalPrice] = useState<number>(0);  } | null;  licenseCountry: string;  licenseCountry: string;



  const calculateTotal = () => {  totalPrice: number;

    if (!selectedCar || !bookingDates) return;

  address: string;  address: string;

    let total = selectedCar.price * bookingDates.nights;

  setSelectedCar: (car: RentalCarData) => void;

    // Add CDW cost

    const cdwPrices = { basic: 0, plus: 18, max: 40 };  setSelectedCDW: (cdw: string) => void;  city: string;  city: string;

    total +=

      (cdwPrices[selectedCDW as keyof typeof cdwPrices] || 0) *  setSelectedAddOns: (addOns: AddOnSelection[]) => void;

      bookingDates.nights;

  setDriverDetails: (details: DriverDetails) => void;  postalCode: string;  postalCode: string;

    // Add selected add-ons

    selectedAddOns.forEach((addon) => {  setBookingDates: (dates: {

      if (addon.selected) {

        total += addon.price;    pickup: string;  country: string;  country: string;

      }

    });    return: string;



    setTotalPrice(total);    nights: number;  emergencyContactName: string;  emergencyContactName: string;

  };

  }) => void;

  const resetBooking = () => {

    setSelectedCar(null);  calculateTotal: () => void;  emergencyContactPhone: string;  emergencyContactPhone: string;

    setSelectedCDW("basic");

    setSelectedAddOns([]);  resetBooking: () => void;

    setDriverDetails(null);

    setBookingDates(null);}  drivingExperience: string;  drivingExperience: string;

    setTotalPrice(0);

  };



  return (const BookingContext = createContext<BookingContextType | undefined>(undefined);}}

    <BookingContext.Provider

      value={{

        selectedCar,

        selectedCDW,export const useBooking = () => {

        selectedAddOns,

        driverDetails,  const context = useContext(BookingContext);

        bookingDates,

        totalPrice,  if (!context) {interface BookingContextType {interface BookingContextType {

        setSelectedCar,

        setSelectedCDW,    throw new Error("useBooking must be used within a BookingProvider");

        setSelectedAddOns,

        setDriverDetails,  }  selectedCar: RentalCarData | null;  selectedCar: RentalCarData | null;

        setBookingDates,

        calculateTotal,  return context;

        resetBooking,

      }}};  selectedCDW: string;  selectedCDW: string;

    >

      {children}

    </BookingContext.Provider>

  );export const BookingProvider: React.FC<{ children: ReactNode }> = ({  selectedAddOns: AddOnSelection[];  selectedAddOns: AddOnSelection[];

};
  children,

}) => {  driverDetails: DriverDetails | null;  driverDetails: DriverDetails | null;

  const [selectedCar, setSelectedCar] = useState<RentalCarData | null>(null);

  const [selectedCDW, setSelectedCDW] = useState<string>("basic");  bookingDates: {  bookingDates: {

  const [selectedAddOns, setSelectedAddOns] = useState<AddOnSelection[]>([]);

  const [driverDetails, setDriverDetails] = useState<DriverDetails | null>(null);    pickup: string;    pickup: string;

  const [bookingDates, setBookingDates] = useState<{

    pickup: string;    return: string;    return: string;

    return: string;

    nights: number;    nights: number;    nights: number;

  } | null>(null);

  const [totalPrice, setTotalPrice] = useState<number>(0);  } | null;  } | null;



  const calculateTotal = () => {  totalPrice: number;  totalPrice: number;

    if (!selectedCar || !bookingDates) return;



    let total = selectedCar.price * bookingDates.nights;

  setSelectedCar: (car: RentalCarData) => void;  setSelectedCar: (car: RentalCarData) => void;

    // Add CDW cost

    const cdwPrices = { basic: 0, plus: 18, max: 40 };  setSelectedCDW: (cdw: string) => void;  setSelectedCDW: (cdw: string) => void;

    total +=

      (cdwPrices[selectedCDW as keyof typeof cdwPrices] || 0) *  setSelectedAddOns: (addOns: AddOnSelection[]) => void;  setSelectedAddOns: (addOns: AddOnSelection[]) => void;

      bookingDates.nights;

  setDriverDetails: (details: DriverDetails) => void;  setDriverDetails: (details: DriverDetails) => void;

    // Add selected add-ons

    selectedAddOns.forEach((addon) => {  setBookingDates: (dates: {  setBookingDates: (dates: {

      if (addon.selected) {

        total += addon.price;    pickup: string;    pickup: string;

      }

    });    return: string;    return: string;



    setTotalPrice(total);    nights: number;    nights: number;

  };

  }) => void;  }) => void;

  const resetBooking = () => {

    setSelectedCar(null);  calculateTotal: () => void;  calculateTotal: () => void;

    setSelectedCDW("basic");

    setSelectedAddOns([]);  resetBooking: () => void;  resetBooking: () => void;

    setDriverDetails(null);

    setBookingDates(null);}}

    setTotalPrice(0);

  };



  return (const BookingContext = createContext<BookingContextType | undefined>(undefined);const BookingContext = createContext<BookingContextType | undefined>(undefined);

    <BookingContext.Provider

      value={{

        selectedCar,

        selectedCDW,export const useBooking = () => {export const useBooking = () => {

        selectedAddOns,

        driverDetails,  const context = useContext(BookingContext);  const context = useContext(BookingContext);

        bookingDates,

        totalPrice,  if (!context) {  if (!context) {

        setSelectedCar,

        setSelectedCDW,    throw new Error("useBooking must be used within a BookingProvider");    throw new Error("useBooking must be used within a BookingProvider");

        setSelectedAddOns,

        setDriverDetails,  }  }

        setBookingDates,

        calculateTotal,  return context;  return context;

        resetBooking,

      }}};};

    >

      {children}

    </BookingContext.Provider>

  );export const BookingProvider: React.FC<{ children: ReactNode }> = ({export const BookingProvider: React.FC<{ children: ReactNode }> = ({

};
  children,  children,

}) => {}) => {

  const [selectedCar, setSelectedCar] = useState<RentalCarData | null>(null);  const [selectedCar, setSelectedCar] = useState<RentalCarData | null>(null);

  const [selectedCDW, setSelectedCDW] = useState<string>("basic");  const [selectedCDW, setSelectedCDW] = useState<string>("basic");

  const [selectedAddOns, setSelectedAddOns] = useState<AddOnSelection[]>([]);  const [selectedAddOns, setSelectedAddOns] = useState<AddOnSelection[]>([]);

  const [driverDetails, setDriverDetails] = useState<DriverDetails | null>(  const [driverDetails, setDriverDetails] = useState<DriverDetails | null>(

    null,    null,

  );  );

  const [bookingDates, setBookingDates] = useState<{  const [bookingDates, setBookingDates] = useState<{

    pickup: string;    pickup: string;

    return: string;    return: string;

    nights: number;    nights: number;

  } | null>(null);  } | null>(null);

  const [totalPrice, setTotalPrice] = useState<number>(0);  const [totalPrice, setTotalPrice] = useState<number>(0);



  const calculateTotal = () => {  const calculateTotal = () => {

    if (!selectedCar || !bookingDates) return;    if (!selectedCar || !bookingDates) return;



    let total = selectedCar.price * bookingDates.nights;    let total = selectedCar.price * bookingDates.nights;



    // Add CDW cost    // Add CDW cost

    const cdwPrices = { basic: 0, plus: 18, max: 40 };    const cdwPrices = { basic: 0, plus: 18, max: 40 };

    total +=    total +=

      (cdwPrices[selectedCDW as keyof typeof cdwPrices] || 0) *      (cdwPrices[selectedCDW as keyof typeof cdwPrices] || 0) *

      bookingDates.nights;      bookingDates.nights;



    // Add selected add-ons    // Add selected add-ons

    selectedAddOns.forEach((addon) => {    selectedAddOns.forEach((addon) => {

      if (addon.selected) {      if (addon.selected) {

        total += addon.price;        total += addon.price;

      }      }

    });    });



    setTotalPrice(total);    setTotalPrice(total);

  };  };



  const resetBooking = () => {  const resetBooking = () => {

    setSelectedCar(null);    setSelectedCar(null);

    setSelectedCDW("basic");    setSelectedCDW("basic");

    setSelectedAddOns([]);    setSelectedAddOns([]);

    setDriverDetails(null);    setDriverDetails(null);

    setBookingDates(null);    setBookingDates(null);

    setTotalPrice(0);    setTotalPrice(0);

  };  };



  return (  return (

    <BookingContext.Provider    <BookingContext.Provider

      value={{      value={{

        selectedCar,        selectedCar,

        selectedCDW,        selectedCDW,

        selectedAddOns,        selectedAddOns,

        driverDetails,        driverDetails,

        bookingDates,        bookingDates,

        totalPrice,        totalPrice,

        setSelectedCar,        setSelectedCar,

        setSelectedCDW,        setSelectedCDW,

        setSelectedAddOns,        setSelectedAddOns,

        setDriverDetails,        setDriverDetails,

        setBookingDates,        setBookingDates,

        calculateTotal,        calculateTotal,

        resetBooking,        resetBooking,

      }}      }}

    >    >

      {children}      {children}

    </BookingContext.Provider>    </BookingContext.Provider>

  );  );

};};
