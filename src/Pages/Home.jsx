import { NavBar, BooksList } from "@/components";
const Home = () => {
  return (
    <div>
      <NavBar />
      <div className="container">
        <div
          className="relative flex size-full min-h-screen flex-col bg-white group/design-root overflow-x-hidden"
          style={{ fontFamily: '"Noto Serif", "Noto Sans", sans-serif' }}
        >
          <div className="layout-container flex h-full grow flex-col">
            <div className="px-40 flex flex-1 justify-center py-5">
              <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
                <div className="@container">
                  <div className="@[480px]:p-4">
                    <div
                      className="flex min-h-[480px] flex-col gap-6 bg-cover bg-center bg-no-repeat @[480px]:gap-8 @[480px]:rounded-xl items-start justify-end px-4 pb-10 @[480px]:px-10"
                      style={{
                        backgroundImage:
                          'linear-gradient(rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.4) 100%), url("https://cdn.usegalileo.ai/sdxl10/cabeef41-269a-4f3a-b790-892ff4c17c3a.png")',
                      }}
                    >
                      <div className="flex flex-col gap-2 text-left">
                        <h1 className="text-white text-4xl font-black leading-tight tracking-[-0.033em] @[480px]:text-5xl @[480px]:font-black @[480px]:leading-tight @[480px]:tracking-[-0.033em]">
                          Welcome to Bookshelf
                        </h1>
                        <h2 className="text-white text-sm font-normal leading-normal @[480px]:text-base @[480px]:font-normal @[480px]:leading-normal">
                          Explore over 1,000,000 books and audiobooks. Borrow or
                          buy with ease.
                        </h2>
                      </div>
                      <label className="flex flex-col min-w-40 h-14 w-full max-w-[480px] @[480px]:h-16">
                        <div className="flex w-full flex-1 items-stretch rounded-xl h-full">
                          <div
                            className="text-[#636e88] flex border border-[#dcdfe5] bg-white items-center justify-center pl-[15px] rounded-l-xl border-r-0"
                            data-icon="MagnifyingGlass"
                            data-size="20px"
                            data-weight="regular"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="20px"
                              height="20px"
                              fill="currentColor"
                              viewBox="0 0 256 256"
                            >
                              <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></path>
                            </svg>
                          </div>
                          <input
                            placeholder="Search for books, authors, or genres"
                            className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#111318] focus:outline-0 focus:ring-0 border border-[#dcdfe5] bg-white focus:border-[#dcdfe5] h-full placeholder:text-[#636e88] px-[15px] rounded-r-none border-r-0 pr-2 rounded-l-none border-l-0 pl-2 text-sm font-normal leading-normal @[480px]:text-base @[480px]:font-normal @[480px]:leading-normal"
                            value=""
                          />
                          <div className="flex items-center justify-center rounded-r-xl border-l-0 border bg-[#4da1ff] h-full cursor-pointer">
                            <div
                              className="text-white"
                              data-icon="Search"
                              data-size="16px"
                              data-weight="regular"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16px"
                                height="16px"
                                fill="currentColor"
                                viewBox="0 0 256 256"
                              >
                                <path d="M166.18,171.65h-7.53l-2.68-2.66a74.8,74.8,0,0,0,13.71-45.21,76,76,0,1,0-76.1,76A74.79,74.79,0,0,0,135,128.1a76.14,76.14,0,0,0-13.72,45.21l2.68,2.66h-6.15l-35.68,35.68a8,8,0,0,0,11.32,11.31l35.67-35.67h7.47l2.68,2.66A96,96,0,1,1,166.18,171.65Z"></path>
                              </svg>
                            </div>
                          </div>
                        </div>
                      </label>
                    </div>
                  </div>
                  <div>
                    <BooksList />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
