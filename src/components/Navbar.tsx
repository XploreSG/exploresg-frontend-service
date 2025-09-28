import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/useAuth";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Rentals", href: "/rentals" },
  { name: "Projects", href: "/projects" },
  { name: "Calendar", href: "/calendar" },
];

const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const isActive = (href: string) => location.pathname === href;

  const handleSignIn = () => {
    navigate("/login");
  };

  const handleSignOut = () => {
    logout();
    setProfileOpen(false);
    navigate("/");
  };

  return (
    <nav className="relative bg-white text-gray-900 shadow-md">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          {/* Mobile menu button */}
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen((open) => !open)}
              className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-700 transition hover:bg-gray-100 focus:outline-2 focus:-outline-offset-1 focus:outline-indigo-500"
              aria-controls="mobile-menu"
              aria-expanded={mobileMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              {!mobileMenuOpen ? (
                <svg
                  className="h-6 w-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </button>
          </div>
          {/* Logo and desktop nav */}
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex shrink-0 items-center">
              <h1 className="text-xl font-bold text-red-600 md:text-3xl">
                ExploreSG
              </h1>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`relative rounded-md px-3 py-2 text-sm font-semibold transition-all duration-200 ${
                    isActive(item.href)
                      ? "bg-indigo-50 text-indigo-700 shadow-sm"
                      : "text-gray-700 hover:bg-indigo-100 hover:text-indigo-700"
                  } `}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  style={{
                    transitionProperty:
                      "background, color, box-shadow, transform",
                  }}
                >
                  <span
                    className={`transition-transform duration-200 ${
                      isActive(item.href)
                        ? "scale-105"
                        : "group-hover:scale-105"
                    }`}
                  >
                    {item.name}
                  </span>
                  {isActive(item.href) && (
                    <span className="absolute -bottom-1.5 left-1/2 block h-1 w-6 -translate-x-1/2 rounded-full bg-indigo-400 opacity-80 transition-all duration-300"></span>
                  )}
                </Link>
              ))}
            </div>
          </div>
          {/* Right side: notification and profile */}
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            {user && (
              <button
                type="button"
                className="relative rounded-full p-1 text-gray-500 transition hover:text-indigo-600 focus:outline-2 focus:outline-offset-2 focus:outline-indigo-500"
              >
                <span className="sr-only">View notifications</span>
                <svg
                  className="h-6 w-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
                  />
                </svg>
              </button>
            )}
            {/* Auth logic: show Sign In or Profile */}
            {user ? (
              <div className="relative ml-3">
                <button
                  className="relative flex rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                  onClick={() => setProfileOpen((open) => !open)}
                  aria-haspopup="true"
                  aria-expanded={profileOpen}
                >
                  <span className="sr-only">Open user menu</span>
                  <img
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    alt=""
                    className="h-8 w-8 rounded-full bg-gray-200 outline-1 outline-indigo-100"
                  />
                </button>
                {/* Dropdown */}
                {profileOpen && (
                  <div className="absolute right-0 z-20 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-none">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700"
                      onClick={() => setProfileOpen(false)}
                    >
                      Your profile
                    </Link>
                    <Link
                      to="/settings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700"
                      onClick={() => setProfileOpen(false)}
                    >
                      Settings
                    </Link>
                    <button
                      className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700"
                      onClick={handleSignOut}
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                className="ml-4 rounded-md px-4 py-2 text-sm font-semibold text-gray-700 hover:scale-105 hover:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                onClick={handleSignIn}
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden" id="mobile-menu">
          <div className="space-y-1 px-2 pt-2 pb-3">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`block rounded-md px-3 py-2 text-base font-semibold transition-all duration-200 ${
                  isActive(item.href)
                    ? "bg-indigo-50 text-indigo-700 shadow-sm"
                    : "text-gray-700 hover:bg-indigo-100 hover:text-indigo-700"
                }`}
                aria-current={isActive(item.href) ? "page" : undefined}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
