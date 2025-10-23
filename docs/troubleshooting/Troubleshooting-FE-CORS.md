This is my npm run dev app connecting to online api's directly

🔍 ReviewPage: Using publicModelId for booking: c04a0e91-76a0-4b2a-8950-8b38343f1114
selectedCar.publicModelId: c04a0e91-76a0-4b2a-8950-8b38343f1114
selectedCar.carId: c04a0e91-76a0-4b2a-8950-8b38343f1114
ReviewPage.tsx:85 📤 ReviewPage: Sending booking request to API: {
"publicModelId": "c04a0e91-76a0-4b2a-8950-8b38343f1114",
"startDate": "2025-10-20T03:00:00Z",
"endDate": "2025-10-25T02:00:00Z",
"pickupLocation": "Changi Airport Terminal 1",
"returnLocation": "Changi Airport Terminal 1",
"driverDetails": {
"firstName": "SREERAJ",
"lastName": "CHELLAPPAN",
"email": "sreeraj_ec@hotmail.com",
"phone": "+6597342754",
"licenseNumber": "F123456"
}
}
ReviewPage.tsx:26 🔍 ReviewPage - Received booking data: {selectedCar: {…}, selectedCarModel: 'Toyota Prius', selectedCarId: 'c04a0e91-76a0-4b2a-8950-8b38343f1114', publicModelId: 'c04a0e91-76a0-4b2a-8950-8b38343f1114', bookingDates: {…}, …}
ReviewPage.tsx:26 🔍 ReviewPage - Received booking data: {selectedCar: {…}, selectedCarModel: 'Toyota Prius', selectedCarId: 'c04a0e91-76a0-4b2a-8950-8b38343f1114', publicModelId: 'c04a0e91-76a0-4b2a-8950-8b38343f1114', bookingDates: {…}, …}
ReviewPage.tsx:92 ✅ ReviewPage: Booking created successfully! {bookingId: 'f368ed30-6543-4267-98b0-ef47b1b69625', userId: '3a27bef3-887e-41d3-92c0-61016978a2f1', publicModelId: 'c04a0e91-76a0-4b2a-8950-8b38343f1114', vehicleId: '2b1f9304-daf5-4c6d-88fb-62cde22e3628', reservationId: 'e824cefd-21ba-48f5-827b-8c39b0c0b5b2', …}
ReviewPage.tsx:102 💾 ReviewPage: Saving booking to context: {bookingId: 'f368ed30-6543-4267-98b0-ef47b1b69625', status: 'PENDING_PAYMENT', reservationExpiresAt: '2025-10-19T08:39:46Z', totalAmount: 200}
ReviewPage.tsx:105 🧭 ReviewPage: Navigating to payment page...
ReviewPage.tsx:26 🔍 ReviewPage - Received booking data: {selectedCar: {…}, selectedCarModel: 'Toyota Prius', selectedCarId: 'c04a0e91-76a0-4b2a-8950-8b38343f1114', publicModelId: 'c04a0e91-76a0-4b2a-8950-8b38343f1114', bookingDates: {…}, …}
ReviewPage.tsx:26 🔍 ReviewPage - Received booking data: {selectedCar: {…}, selectedCarModel: 'Toyota Prius', selectedCarId: 'c04a0e91-76a0-4b2a-8950-8b38343f1114', publicModelId: 'c04a0e91-76a0-4b2a-8950-8b38343f1114', bookingDates: {…}, …}
PaymentPage.tsx:25 💳 PaymentPage - Loaded with context: {bookingId: 'f368ed30-6543-4267-98b0-ef47b1b69625', hasBooking: true, booking: {…}, hasSelectedCar: true, selectedCar: {…}, …}
PaymentPage.tsx:25 💳 PaymentPage - Loaded with context: {bookingId: 'f368ed30-6543-4267-98b0-ef47b1b69625', hasBooking: true, booking: {…}, hasSelectedCar: true, selectedCar: {…}, …}

this the app on K8s connecting the online api's. what is not set?
🔍 ReviewPage: Using publicModelId for booking: c04a0e91-76a0-4b2a-8950-8b38343f1103
selectedCar.publicModelId: c04a0e91-76a0-4b2a-8950-8b38343f1103
selectedCar.carId: c04a0e91-76a0-4b2a-8950-8b38343f1103
index-SKfuVxJB.js:2938 📤 ReviewPage: Sending booking request to API: {
"publicModelId": "c04a0e91-76a0-4b2a-8950-8b38343f1103",
"startDate": "2025-10-20T03:00:00Z",
"endDate": "2025-10-25T02:00:00Z",
"pickupLocation": "Changi Airport Terminal 1",
"returnLocation": "Changi Airport Terminal 1",
"driverDetails": {
"firstName": "SREERAJ",
"lastName": "CHELLAPPAN",
"email": "sreeraj_ec@hotmail.com",
"phone": "+6597342754",
"licenseNumber": "F123"
}
}
index-SKfuVxJB.js:2936 🔍 ReviewPage - Received booking data: {selectedCar: {…}, selectedCarModel: 'Nissan Sentra', selectedCarId: 'c04a0e91-76a0-4b2a-8950-8b38343f1103', publicModelId: 'c04a0e91-76a0-4b2a-8950-8b38343f1103', bookingDates: {…}, …}
index-SKfuVxJB.js:2936 POST https://api.xplore.town/booking/api/v1/bookings 403 (Forbidden)
\_G @ index-SKfuVxJB.js:2936
le @ index-SKfuVxJB.js:2938
k0 @ index-SKfuVxJB.js:48
(anonymous) @ index-SKfuVxJB.js:48
Sf @ index-SKfuVxJB.js:48
my @ index-SKfuVxJB.js:48
Y0 @ index-SKfuVxJB.js:49
X0 @ index-SKfuVxJB.js:49
index-SKfuVxJB.js:2936 🔍 ReviewPage - Received booking data: {selectedCar: {…}, selectedCarModel: 'Nissan Sentra', selectedCarId: 'c04a0e91-76a0-4b2a-8950-8b38343f1103', publicModelId: 'c04a0e91-76a0-4b2a-8950-8b38343f1103', bookingDates: {…}, …}
[NEW] Explain Console errors by using Copilot in Edge: click

         to explain an error.
        Learn more
