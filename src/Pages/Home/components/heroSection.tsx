import { Search } from "react-feather";
const HeroSection = () => {
  return (
    <div className="relative flex size-full flex-col rounded-3xl bg-[#faf3e1] group/design-root overflow-x-hidden">
      <div
        className="flex min-h-[460px] flex-col gap-6 rounded-3xl bg-cover bg-center bg-no-repeat px-4 pb-10 @[480px]:gap-8 @[480px]:px-10 items-start justify-end"
        style={{
          backgroundImage:
            'linear-gradient(120deg, rgba(250,243,225,0.95) 0%, rgba(245,231,198,0.75) 45%, rgba(34,34,34,0.65) 100%), url("https://cdn.usegalileo.ai/sdxl10/cabeef41-269a-4f3a-b790-892ff4c17c3a.png")',
        }}
      >
        <div className="flex flex-col gap-2 text-left text-charcoal">
          <h1 className="text-4xl font-black leading-tight tracking-[-0.033em] @[480px]:text-5xl @[480px]:font-black @[480px]:leading-tight @[480px]:tracking-[-0.033em]">
            Welcome to Page Chat
          </h1>
          <h2 className="text-sm font-normal leading-normal text-charcoal/80 @[480px]:text-base">
            Discover inspiring, faith-rooted literature in a calm reading haven.
          </h2>
        </div>
        <label className="flex h-14 min-w-40 w-full max-w-[480px] flex-col @[480px]:h-16 ">
          <div className="flex w-full flex-1 items-stretch rounded-xl h-full">
            <input
              placeholder="Search for books, authors, or genres"
              className="form-input flex w-full min-w-0 flex-1 rounded-l-xl border border-[#e4d5bb] bg-[#f5e7c6] px-4 text-sm font-normal text-charcoal placeholder:text-charcoal/50 focus:border-downy focus:outline-none focus:ring-0 @[480px]:text-base"
            />
            <div className="flex h-full cursor-pointer items-center justify-center rounded-r-xl border border-l-0 border-[#e4d5bb] bg-downy p-2 text-white transition hover:bg-downy-dark">
              <Search />
            </div>
          </div>
        </label>
      </div>
    </div>
  );
};

export default HeroSection;
