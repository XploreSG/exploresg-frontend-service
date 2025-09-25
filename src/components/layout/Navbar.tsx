import { APP_CONFIG } from "../../config/constants";
import { Logo } from "../ui/Logo";
import { HamburgerMenu } from "../ui/HamburgerMenu";
import NavigationList from "../navigation/NavigationList";
import { useMobileMenu } from "../../hooks/useMobileMenu";

const Navbar = () => {
  const { isOpen, toggle, close } = useMobileMenu();

  return (
    <nav className="bg-black px-4 py-3 text-white shadow-md">
      <div
        className={`mx-auto flex ${APP_CONFIG.maxWidth} items-center justify-between`}
      >
        {/* Logo */}
        <Logo />

        {/* Hamburger Menu */}
        <HamburgerMenu isOpen={isOpen} onClick={toggle} />

        {/* Desktop Navigation */}
        <div className="hidden md:block">
          <NavigationList onItemClick={close} />
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out md:hidden ${
          isOpen ? "max-h-96 pt-4 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="border-t border-gray-700 pt-4">
          <NavigationList isMobile onItemClick={close} />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
