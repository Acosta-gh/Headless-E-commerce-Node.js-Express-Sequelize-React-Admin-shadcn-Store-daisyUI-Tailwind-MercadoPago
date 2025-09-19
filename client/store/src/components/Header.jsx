import ThemeToggle from "@/components/ui/ThemeToggle";
import Logo from "@/components/ui/Logo";
import CartDropdown from "@/components/CartDropdown";
import AvatarDropdown from "@/components/AvatarDropdown";

function Header() {
  return (
    <div className="navbar bg-base-100 shadow-sm gap-4 sm:px-12 fixed top-0 z-10">
      <div className="flex-1">
        <Logo />
      </div>
      <div className="relative bottom-[1px]">
        <ThemeToggle />
      </div>
      <div className="flex-none flex gap-2">
        <CartDropdown />
        <div className="relative top-[2px]">
          <AvatarDropdown />
        </div>
      </div>
    </div>
  );
}

export default Header;
