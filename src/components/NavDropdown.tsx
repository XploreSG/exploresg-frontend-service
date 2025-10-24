import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

interface DropdownLink {
  name: string;
  href: string;
}

interface NavDropdownProps {
  title: string;
  items: DropdownLink[];
  isActive: (href: string) => boolean;
  closeMobileMenu?: () => void;
}

const NavDropdown: React.FC<NavDropdownProps> = ({
  title,
  items,
  isActive,
  closeMobileMenu,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleMobileLinkClick = () => {
    setIsOpen(false);
    if (closeMobileMenu) {
      closeMobileMenu();
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const isParentActive = items.some((item) => isActive(item.href));

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Desktop Dropdown Trigger */}
      <div className="hidden sm:block">
        <button
          onClick={handleToggle}
          className={`relative rounded-md px-3 py-2 text-sm font-semibold transition-all duration-200 ${
            isParentActive
              ? "bg-indigo-50 text-indigo-700 shadow-sm"
              : "text-gray-700 hover:bg-indigo-100 hover:text-indigo-700"
          }`}
        >
          {title}
          <svg
            className={`ml-1 inline-block h-4 w-4 transform transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
          {isParentActive && (
            <span className="absolute -bottom-1.5 left-1/2 block h-1 w-6 -translate-x-1/2 rounded-full bg-indigo-400 opacity-80 transition-all duration-300"></span>
          )}
        </button>
        {isOpen && (
          <div className="absolute right-0 z-20 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-none">
            {items.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`block px-4 py-2 text-sm ${
                  isActive(item.href)
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-gray-700 hover:bg-indigo-50 hover:text-indigo-700"
                }`}
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Mobile Accordion */}
      <div className="sm:hidden">
        <button
          onClick={handleToggle}
          className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-base font-semibold transition-all duration-200 ${
            isParentActive
              ? "bg-indigo-50 text-indigo-700 shadow-sm"
              : "text-gray-700 hover:bg-indigo-100 hover:text-indigo-700"
          }`}
        >
          <span>{title}</span>
          <svg
            className={`h-5 w-5 transform transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        {isOpen && (
          <div className="pl-4">
            {items.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`block rounded-md px-3 py-2 text-base font-semibold transition-all duration-200 ${
                  isActive(item.href)
                    ? "bg-indigo-50 text-indigo-700 shadow-sm"
                    : "text-gray-700 hover:bg-indigo-100 hover:text-indigo-700"
                }`}
                onClick={handleMobileLinkClick}
              >
                {item.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NavDropdown;
