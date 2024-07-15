import { User, BookOpen, Search } from "react-feather";
const NavBar = () => {
  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#f0f2f4] px-10 py-3">
      <div className="flex items-center gap-4 text-banker-950">
        <div className="size-6">
          <BookOpen />
        </div>
        <h2 className="text-bunker-950 text-lg font-bold leading-tight tracking-[-0.015em]">
          FaithReads
        </h2>
      </div>
      <div className="flex md:flex-1 justify-between items-center gap-8">
        <label className="hidden md:flex flex-col !h-10 flex-1 px-32 ">
          <div className="flex w-full flex-1 items-stretch rounded-xl h-full">
            <div className="text-bunker-950 flex border-none bg-bunker-100 items-center justify-center pl-4 rounded-l-xl border-r-0">
              <Search className="w-5" />
            </div>
            <input
              placeholder="Search favorite book .... "
              className="focus:border form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-bunker-950 focus:outline-0 focus:ring-0 border-none bg-bunker-100 focus:border-none h-full placeholder:text-[#636e88] px-8 rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal"
              value=""
            />
          </div>
        </label>
        <div className="flex gap-2">
          <User />
        </div>
      </div>
    </header>
  );
};

export default NavBar;
