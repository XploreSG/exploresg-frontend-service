import type { FC } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../store";
import { Link } from "react-router-dom";
import { NAVIGATION_ITEMS } from "../../config/navigation";

interface Props {
  isMobile?: boolean;
  onItemClick?: () => void;
}

const NavigationList: FC<Props> = ({ isMobile, onItemClick }) => {
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);

  // Helper function to get the appropriate CSS classes based on variant
  const getLinkClasses = (variant?: string) => {
    const baseClasses = "font-medium transition-colors duration-200";

    switch (variant) {
      case "danger":
        return `${baseClasses} text-red-300 hover:text-red-100`;
      case "user":
        return `${baseClasses} text-green-300 hover:text-green-100`;
      default:
        return `${baseClasses} text-white hover:text-green-400`;
    }
  };

  // Filter navigation items based on authentication state
  const visibleItems = NAVIGATION_ITEMS.filter((item) => {
    // Special handling for login - only show when NOT logged in
    if (item.path === "/login") {
      return !isLoggedIn;
    }

    // If item requires auth but user is not logged in, don't show it
    if (item.requiresAuth && !isLoggedIn) {
      return false;
    }

    // If item doesn't require auth or user is logged in, show it
    return true;
  });

  return (
    <div className={`flex ${isMobile ? "flex-col space-y-2" : "space-x-6"}`}>
      {visibleItems.map((item, index) => (
        <Link
          key={`${item.path}-${index}`}
          to={item.path}
          onClick={onItemClick}
          className={getLinkClasses(item.variant)}
        >
          {item.label}
        </Link>
      ))}
    </div>
  );
};

export default NavigationList;
