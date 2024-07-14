const NavBar = () => {
  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#f0f2f4] px-10 py-3">
      <div className="flex items-center gap-4 text-[#111318]">
        <div className="size-6">
          <img
            width="90"
            height="90"
            className="w-8"
            src="https://img.icons8.com/ios-glyphs/90/book.png"
            alt="book"
          />
        </div>
        <h2 className="text-[#111318] text-lg font-bold leading-tight tracking-[-0.015em]">
          FaithReads
        </h2>
      </div>
      <div className="flex flex-1 justify-end gap-8">
        <label className="hidden md:flex flex-col min-w-40 !h-10 max-w-64 ">
          <div className="flex w-full flex-1 items-stretch rounded-xl h-full">
            <div
              className="text-[#636e88] flex border-none bg-[#f0f2f4] items-center justify-center pl-4 rounded-l-xl border-r-0"
              data-icon="MagnifyingGlass"
              data-size="24px"
              data-weight="regular"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24px"
                height="24px"
                fill="currentColor"
                viewBox="0 0 256 256"
              >
                <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></path>
              </svg>
            </div>
            <input
              placeholder="Search"
              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#111318] focus:outline-0 focus:ring-0 border-none bg-[#f0f2f4] focus:border-none h-full placeholder:text-[#636e88] px-4 rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal"
              value=""
            />
          </div>
        </label>
        <div className="flex gap-2">
          <img
            width="50"
            height="50"
            className="size-8"
            src="https://img.icons8.com/material-outlined/50/gender-neutral-user.png"
            alt="gender-neutral-user"
          />
        </div>
      </div>
    </header>
  );
};

export default NavBar;
