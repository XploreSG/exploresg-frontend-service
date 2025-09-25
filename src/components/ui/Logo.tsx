import { Link } from "react-router-dom";
import { APP_CONFIG, ROUTES } from "../../config/constants";

export const Logo = () => {
  return (
    <Link to={ROUTES.home} className="flex items-center space-x-2">
      <div className="flex h-8 w-8 items-center justify-center rounded bg-green-600">
        {APP_CONFIG.logo}
      </div>
      <div>
        <div className="text-lg font-bold">{APP_CONFIG.name}</div>
        <div className="text-xs text-gray-300">{APP_CONFIG.tagline}</div>
      </div>
    </Link>
  );
};
