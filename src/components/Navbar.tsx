import Link from "next/link";

const Navbar = () => {
  return (
    <header className="w-full bg-white">
      <div className="flex items-center justify-between px-[72px] py-4">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="text-[12px] leading-[14px] tracking-[-0.02em] uppercase text-[#1A1B1C] font-semibold"
          >
            SKINSTRIC
          </Link>

          <span className="text-[12px] leading-[14px] tracking-[-0.02em] uppercase text-[#8A8C90] font-semibold">
            [ INTRO ]
          </span>
        </div>

        <button
          className="inline-flex items-center justify-center bg-[#1A1B1C] text-[#FCFCFC]
             h-[32px] px-3 text-[10px] tracking-[0.08em] uppercase font-semibold 
             whitespace-nowrap rounded-none"
        >
          ENTER CODE
        </button>
      </div>
    </header>
  );
};

export default Navbar;
