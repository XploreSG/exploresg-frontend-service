import { NAVIGATION_ITEMS } from "../../config/navigation";
import { NavLink } from "../ui/NavLink";
import { useAuth } from "../../hooks/useAuth";
import type { NavigationItem } from "../../config/navigation";

interface NavigationListProps {
  isMobile?: boolean;
  onItemClick?: () => void;
}

export const NavigationList = ({
  isMobile = false,
  onItemClick,
}: NavigationListProps) => {
  const { isAuthenticated, user } = useAuth();

  const getVisibleItems = (items: NavigationItem[]) => {
    return items.filter((item) => {
      if (item.requiresAuth) {
        return isAuthenticated;
      }
      return true;
    });
  };

  const getItemLabel = (item: NavigationItem) => {
    // For user profile, show actual user name if available
    if (item.variant === "user" && user?.name) {
      return user.name;
    }
    return item.label;
  };

  const visibleItems = getVisibleItems(NAVIGATION_ITEMS);

  return (
    <div
      className={
        isMobile
          ? "mt-2 space-y-2 px-4 text-sm font-medium md:hidden"
          : "hidden space-x-6 text-sm font-medium md:flex"
      }
    >
      {visibleItems.map((item, index) => (
        <div
          key={item.path}
          className={isMobile ? "animate-slideIn" : ""}
          style={
            isMobile
              ? { animationDelay: `${index * 100}ms` }
              : undefined
          }
        >
          <NavLink
            to={item.path}
            variant={item.variant}
            isMobile={isMobile}
            onClick={onItemClick}
          >
            {getItemLabel(item)}
          </NavLink>
        </div>
      ))}
    </div>
  );
};
