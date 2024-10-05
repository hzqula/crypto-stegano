const Header = () => {
  return (
    <header className="top-2 border-primary border-2 right-2 left-2 z-[40] items-center justify-around px-24 h-24 md:flex m-4 bg-transparent hidden">
      <div className="px-4 py-2">
        <h1 className="text-2xl font-bold text-primary font-code">
          <a href="#">CryptoStegano</a>
        </h1>
      </div>
      <nav className="flex justify-between h-auto">
        <ul className="flex items-center justify-center gap-4 text-sm font-bold font-text">
          <li>
            <a
              className="inline-block py-2 px-4 transition-all duration-300 relative text-center bg-secBlue text-background
              hover:translate-x-[-2px] hover:translate-y-[-2px]
              after:content-[''] after:absolute after:border-secBlue after:-z-10 after:border-2 after:h-full after:w-full after:transition-all after:duration-300 after:top-0 after:left-0 
              hover:after:translate-x-[4px] hover:after:translate-y-[4px]"
              href="#"
            >
              Cryptography
            </a>
          </li>
          <li className="relative">
            <a
              href="#"
              className="inline-block px-3 relative top-0 left-0 py-2 transition-all duration-100 border-2 border-secPurple bg-background text-secPurple
              hover:top-[-2px] hover:left-[-2px]
              after:content-[''] after:absolute after:border-secPurple after:-z-10 after:border-2 after:h-full after:w-full after:transition-all after:duration-300 after:top-0 after:left-0 
              hover:after:translate-x-[6px] hover:after:translate-y-[6px]"
            >
              Steganography
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
