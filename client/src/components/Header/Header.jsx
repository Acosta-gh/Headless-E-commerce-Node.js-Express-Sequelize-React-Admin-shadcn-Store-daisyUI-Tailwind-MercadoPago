import HeaderLogo from "./HeaderLogo";
import HeaderNavDesktop from "./HeaderNavDesktop";
import HeaderNavMobile from "./HeaderNavMobile";

const Header = () => (
  <header className="md:bg-[var(--color-secondary)] md:fixed md:text-white sm:px-20 bg-[var(--color-background)] p-4 sm:p-2 top-0 z-50 w-full">
    <div className="flex flex-row justify-between items-center">
      <HeaderLogo />
      <HeaderNavDesktop />
    </div>
    <HeaderNavMobile />
  </header>
);

export default Header;