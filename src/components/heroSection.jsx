import { Search } from "react-feather";
const HeroSection = () => {
  return (
    <div className="relative flex size-full flex-col bg-white group/design-root overflow-x-hidden">
      <div
        className="border-black flex hero-layout min-h-[480px] flex-col gap-6 bg-cover bg-center bg-no-repeat @[480px]:gap-8 items-start justify-end px-4 pb-10 @[480px]:px-10 rounded "
        style={{
          backgroundImage:
            'linear-gradient(rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.4) 100%), url("https://cdn.usegalileo.ai/sdxl10/cabeef41-269a-4f3a-b790-892ff4c17c3a.png")',
        }}
      >
        <div className="flex flex-col gap-2 text-left">
          <h1 className="text-white text-4xl font-black leading-tight tracking-[-0.033em] @[480px]:text-5xl @[480px]:font-black @[480px]:leading-tight @[480px]:tracking-[-0.033em]">
            Welcome to Faith Reads
          </h1>
          <h2 className="text-white text-sm font-normal leading-normal @[480px]:text-base @[480px]:font-normal @[480px]:leading-normal">
            Discover Inspiring Faith-Based Literature
          </h2>
        </div>
        <label className="flex flex-col min-w-40 h-14 w-full max-w-[480px] @[480px]:h-16">
          <div className="flex w-full flex-1 items-stretch rounded-xl h-full">
            <div className="text-[#636e88] flex border border-[#dcdfe5] bg-white items-center justify-center pl-[15px] rounded-l-xl border-r-0">
              <Search />
            </div>
            <input
              placeholder="Search for books, authors, or genres"
              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#111318] focus:outline-0 focus:ring-0 border border-[#dcdfe5] bg-white focus:border-[#dcdfe5] h-full placeholder:text-[#636e88] px-[15px] rounded-r-none border-r-0 pr-2 rounded-l-none border-l-0 pl-2 text-sm font-normal leading-normal @[480px]:text-base @[480px]:font-normal @[480px]:leading-normal"
              value=""
            />
            <div className="flex items-center justify-center rounded-r-xl border-l-0 border bg-[#4da1ff] h-full cursor-pointer p-2">
              <div className="text-white">
                <Search />
              </div>
            </div>
          </div>
        </label>
      </div>
    </div>
  );
};

export default HeroSection;
