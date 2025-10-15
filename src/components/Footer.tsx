import React from "react";
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
  return (
    <footer className="bg-transparent">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-white p-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            {/* Brand */}
            <div className="col-span-1 md:col-span-2">
              <div className="justify-center-center flex">
                <img
                  className="h-10 pr-2"
                  src="/icon_s.png"
                  alt="ExploreSG logo"
                />
                <h1 className="pb-4 text-4xl font-bold text-red-600">
                  ExploreSG
                </h1>
              </div>

              <p className="mt-2 text-gray-700">
                <span className="font-">Discover</span> the best of Beautiful{" "}
                <span className="font-bold text-red-500">Singapore</span>. From
                iconic attractions to hidden neighbourhood gems, great food, and
                local experiences.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                Quick Links
              </h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <a href="#" className="text-gray-600 hover:text-teal-600">
                    Home
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-teal-600">
                    Attractions
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-teal-600">
                    Food & Dining
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-teal-600">
                    Events
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Contact</h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <Link
                    to="/about"
                    className="text-gray-600 hover:text-teal-600"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-teal-600">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-teal-600">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-teal-600">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 border-t border-gray-100 pt-8">
            <p className="text-center text-gray-500">
              © 2025 ExploreSG. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
