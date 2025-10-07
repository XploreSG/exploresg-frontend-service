import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { RoleBanner } from "./components/RoleBanner";
import HomePage from "./pages/HomePage";
import AttractionsPage from "./pages/AttractionsPage";
import FoodPage from "./pages/FoodPage";
import EventsPage from "./pages/EventsPage";
import AboutPage from "./pages/AboutPage";
import FleetPage from "./pages/FleetPage";
import SignInPage from "./pages/SignInPage";
import YourDayPage from "./pages/YourDayPage";
import TestPage from "./pages/TestPage";
import SignUpForm from "./components/Auth/SignUpForm";
import type { SignupDetails } from "./components/Auth/SignUpForm";
import ProfilePage from "./pages/ProfilePage";
import ExplorePage from "./pages/ExplorePage";
import ProtectedRoleRoute from "./components/Auth/ProtectedRoleRoute";
import FleetManagerDashboard from "./pages/FleetManagerDashboard";
import AdminConsole from "./pages/AdminConsole";
import AccessDeniedPage from "./pages/AccessDeniedPage";
import BookingFlow from "./pages/BookingFlow";
// import { BookingProvider } from "./contexts/BookingContext";

const App = () => {
  return (
    // <BookingProvider>
    <Router>
      <div className="flex min-h-screen flex-col">
        <RoleBanner />
        <Navbar />
        <main className="flex-1">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/rentals" element={<FleetPage />} />
            <Route path="/attractions" element={<AttractionsPage />} />
            <Route path="/food" element={<FoodPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/login" element={<SignInPage />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route
              path="/signup"
              element={
                <SignUpForm
                  onSubmit={(data: SignupDetails) => {
                    // TODO: handle sign up form submission
                    console.log("Sign up data:", data);
                  }}
                />
              }
            />
            <Route path="/test" element={<TestPage />} />

            {/* Protected Routes - Only for USER role */}
            <Route element={<ProtectedRoleRoute allowedRoles={["USER"]} />}>
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/yourday" element={<YourDayPage />} />
              <Route path="/booking/:carId/*" element={<BookingFlow />} />
            </Route>

            {/* Role-Specific Routes (Admin and Fleet Manager) */}
            <Route
              element={
                <ProtectedRoleRoute allowedRoles={["ADMIN", "MANAGER"]} />
              }
            >
              <Route
                path="/manager/dashboard"
                element={<FleetManagerDashboard />}
              />
            </Route>

            {/* Role-Specific Routes (Admin only) */}
            <Route element={<ProtectedRoleRoute allowedRoles={["ADMIN"]} />}>
              <Route path="/admin/console" element={<AdminConsole />} />
            </Route>

            {/* Fallback route for unauthorized access */}
            <Route path="/access-denied" element={<AccessDeniedPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
    // </BookingProvider>
  );
};

export default App;
