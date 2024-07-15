import { User, BookOpen } from "react-feather";
const NavBar = () => {
  return (
    <header className="flex bg-white items-center sticky z-10  top-0 justify-between whitespace-nowrap border-b border-solid border-b-[#f0f2f4] px-10 py-3 h-16">
      <div className="flex items-center gap-4 text-banker-950">
        <div className="size-6">
          <BookOpen />
        </div>
        <h2 className="text-bunker-950 text-lg font-bold leading-tight tracking-[-0.015em]">
          FaithReads
        </h2>
      </div>
      <div className="flex flex-end justify-between items-center gap-8">
        <div className="flex gap-2">
          <span className="bg-bunker-100 rounded-full p-1">
            <User />
          </span>
        </div>
      </div>
    </header>
  );
};

export default NavBar;
