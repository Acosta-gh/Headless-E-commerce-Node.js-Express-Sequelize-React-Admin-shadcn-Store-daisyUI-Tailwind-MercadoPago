import HeaderLogo from "./HeaderLogo";
import HeaderNavDesktop from "./HeaderNavDesktop";
import HeaderNavMobile from "./HeaderNavMobile";

const Header = () => (
  <header className="md:bg-[var(--color-secondary)] md:fixed md:text-white md:px-20 bg-[var(--color-background)] p-4 top-0 z-50 w-full shadow-[0_4px_10px_rgba(0,0,0,0.2)]">
    <div className="flex flex-row justify-between items-center">
      <HeaderLogo />
      <HeaderNavDesktop />
    </div>
    <HeaderNavMobile />
  </header>
);

export default Header;