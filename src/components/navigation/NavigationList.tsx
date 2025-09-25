import type { FC } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../store";
import { Link } from "react-router-dom";

interface Props {
  isMobile?: boolean;
  onItemClick?: () => void;
}

const NavigationList: FC<Props> = ({ isMobile, onItemClick }) => {
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const userRole = useSelector((state: RootState) => state.auth.userRole);

  return (
    <div className={`flex ${isMobile ? "flex-col space-y-2" : "space-x-6"}`}>
      <Link
        to="/"
        onClick={onItemClick}
        className="font-medium text-white transition-colors duration-200 hover:text-green-400"
      >
        Home
      </Link>
      {isLoggedIn && (
        <Link
          to="/dashboard"
          onClick={onItemClick}
          className="font-medium text-white transition-colors duration-200 hover:text-green-400"
        >
          Dashboard
        </Link>
      )}
      {userRole === "admin" && (
        <Link
          to="/admin"
          onClick={onItemClick}
          className="font-medium text-white transition-colors duration-200 hover:text-green-400"
        >
          Admin Panel
        </Link>
      )}
    </div>
  );
};

export default NavigationList;
