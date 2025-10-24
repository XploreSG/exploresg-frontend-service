import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { useEffect } from "react";
import { RoleBanner } from "./components/RoleBanner";
import HomePage from "./pages/HomePage";
import AttractionsPage from "./pages/AttractionsPage";
import FoodPage from "./pages/FoodPage";
import EventsPage from "./pages/EventsPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import TermsOfServicePage from "./pages/TermsOfServicePage";
import UserVehicleBrowsePage from "./pages/UserVehicleBrowsePage";
import SignInPage from "./pages/SignInPage";
import YourDayPage from "./pages/YourDayPage";
import TestPage from "./pages/TestPage";
import SignUpForm from "./components/Auth/SignUpForm";
import type { SignupDetails } from "./components/Auth/SignUpForm";
import ProfilePage from "./pages/ProfilePage";
import ExplorePage from "./pages/ExplorePage";
import CollectionsPage from "./pages/CollectionsPage";
import ProtectedRoleRoute from "./components/Auth/ProtectedRoleRoute";
import FleetAdminDashboardPage from "./pages/FleetAdminDashboardPage";
import FleetAdminListPage from "./pages/FleetAdminListPage";
import FleetDetailPage from "./pages/FleetDetailPage";
import AdminConsole from "./pages/AdminConsole";
import AccessDeniedPage from "./pages/AccessDeniedPage";
import BookingFlow from "./pages/BookingFlow";
import EagleViewPage from "./pages/EagleViewPage";
import { BookingProvider } from "./contexts/BookingProvider";
import { ConfirmedBookingsProvider } from "./contexts/ConfirmedBookingsContext";
import ChatWidget from "./components/ChatWidget";

const App = () => {
  return (
    <BookingProvider>
      <ConfirmedBookingsProvider>
        <Router>
          {/* RouteChangeHandler must be inside Router so useLocation() is valid */}
          <RouteChangeHandler />
          <div className="flex min-h-screen flex-col">
            <RoleBanner />
            <Navbar />
            <main className="relative flex-1">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/rentals" element={<UserVehicleBrowsePage />} />
                <Route path="/attractions" element={<AttractionsPage />} />
                <Route path="/food" element={<FoodPage />} />
                <Route path="/events" element={<EventsPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                <Route
                  path="/terms-of-service"
                  element={<TermsOfServicePage />}
                />
                <Route path="/login" element={<SignInPage />} />
                <Route path="/explore" element={<ExplorePage />} />
                <Route path="/collections" element={<CollectionsPage />} />
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
                    <ProtectedRoleRoute
                      allowedRoles={["ADMIN", "MANAGER", "FLEET_MANAGER"]}
                    />
                  }
                >
                  <Route
                    path="/manager/dashboard"
                    element={<FleetAdminDashboardPage />}
                  />
                  <Route
                    path="/manager/fleet"
                    element={<FleetAdminListPage />}
                  />
                  <Route
                    path="/manager/fleet/:id"
                    element={<FleetDetailPage />}
                  />
                </Route>

                {/* Fleet Admin + Fleet Manager Eagle View */}
                <Route
                  element={
                    <ProtectedRoleRoute
                      allowedRoles={["FLEET_ADMIN", "FLEET_MANAGER"]}
                    />
                  }
                >
                  <Route
                    path="/manager/eagle-view"
                    element={<EagleViewPage />}
                  />
                </Route>

                {/* Role-Specific Routes (Admin only) */}
                <Route
                  element={<ProtectedRoleRoute allowedRoles={["ADMIN"]} />}
                >
                  <Route path="/admin/console" element={<AdminConsole />} />
                </Route>

                {/* Fallback route for unauthorized access */}
                <Route path="/access-denied" element={<AccessDeniedPage />} />
              </Routes>
            </main>
            <Footer />
            <ChatWidget />
          </div>
        </Router>
      </ConfirmedBookingsProvider>
    </BookingProvider>
  );
};

export default App;

function RouteChangeHandler() {
  // No global loader in use; keep handler for future needs (e.g., analytics) and to ensure Router usage
  const location = useLocation();

  useEffect(() => {
    // placeholder side-effect when route changes
  }, [location.pathname]);

  return null;
}
