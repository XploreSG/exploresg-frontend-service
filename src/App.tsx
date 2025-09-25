import { Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import LandingPage from "./pages/LandingPage";
import Home from "./pages/Home";
import BookBike from "./pages/BookBike";
import Dashboard from "./pages/Dashboard";
import LoginPage from "./pages/LoginPage";

const App = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/vehicles" element={<LandingPage />} />
          <Route path="/book-bike" element={<BookBike />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;
