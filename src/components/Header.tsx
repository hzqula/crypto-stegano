import { Link, NavLink } from "react-router-dom";

const Header = () => {
  return (
    <header className="top-2 flex-col md:flex-row border-primary border-2 right-2 left-2 z-[40] items-center md:justify-around md:px-24 h-24 flex justify-center m-4 bg-transparent">
      <div className="px-4 py-2">
        <h1 className="text-2xl font-bold text-primary font-code">
          <Link to={"/"}>CryptoStegano</Link>
        </h1>
      </div>
      <nav className="flex justify-between h-auto">
        <ul className="flex items-center justify-center gap-4 text-xs font-bold md:text-sm font-text">
          <li>
            <NavLink
              to="/cryptography"
              className={({ isActive }: { isActive: boolean }) =>
                `inline-block py-2 text-secBlue transition-all duration-300 relative text-center
      ${
        isActive
          ? "after:content[''] after:inline-block after:w-full after:h-0.5 after:absolute after:bottom-0 after:left-0 after:bg-secBlue"
          : ""
      }`
              }
            >
              Cryptography
            </NavLink>
          </li>
          <li className="relative">
            <NavLink
              to="/steganography"
              className={({ isActive }: { isActive: boolean }) =>
                `inline-block relative top-0 left-0 py-2 transition-all duration-100 text-secPurple
              ${
                isActive
                  ? "after:content[''] after:inline-block after:w-full after:h-0.5 after:absolute after:bottom-0 after:left-0 after:bg-secPurple"
                  : ""
              }`
              }
            >
              Steganography
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
