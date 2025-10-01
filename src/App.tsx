import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import AttractionsPage from "./pages/AttractionsPage";
import FoodPage from "./pages/FoodPage";
import EventsPage from "./pages/EventsPage";
import AboutPage from "./pages/AboutPage";
import FleetPage from "./pages/FleetPage";
import RentalAddOnPage from "./components/Rentals/RentalAddOn";
import DriverDetailsPage from "./components/Rentals/DriverDetailsPage";
import PaymentPage from "./pages/PaymentPage";
import SignInPage from "./pages/SignInPage";
import YourDayPage from "./pages/YourDayPage";
import TestPage from "./pages/TestPage";
import SignUpForm from "./components/Auth/SignUpForm";
// import { BookingProvider } from "./contexts/BookingContext";

const App = () => {
  return (
    // <BookingProvider>
    <Router>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/rentals" element={<FleetPage />} />
            <Route path="/attractions" element={<AttractionsPage />} />
            <Route path="/food" element={<FoodPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/login" element={<SignInPage />} />
            <Route path="/yourday" element={<YourDayPage />} />
            <Route
              path="/signup"
              element={
                <SignUpForm
                  onSubmit={(data) => {
                    // TODO: handle sign up form submission
                    console.log("Sign up data:", data);
                  }}
                />
              }
            />
            <Route path="/test" element={<TestPage />} />
            {/* Booking Flow Routes */}
            <Route
              path="/booking/:carId/addons"
              element={<RentalAddOnPage />}
            />
            <Route
              path="/booking/:carId/driver-details"
              element={<DriverDetailsPage />}
            />
            <Route path="/booking/:carId/payment" element={<PaymentPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
    // </BookingProvider>
  );
};

export default App;
