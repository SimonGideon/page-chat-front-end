import { ArrowRight, Search } from "react-feather";
const HeroSection = () => {
  return (
    <div className="relative flex size-full flex-col rounded-3xl bg-white group/design-root overflow-x-hidden shadow-[0_25px_120px_rgba(34,34,34,0.08)]">
      <div
        className="flex min-h-[460px] flex-col gap-6 rounded-3xl bg-cover bg-center bg-no-repeat px-4 pb-10 @[480px]:gap-8 @[480px]:px-10 items-start justify-end"
        style={{
          backgroundImage:
            'linear-gradient(110deg, rgba(255,255,255,0.95) 0%, rgba(250,243,225,0.65) 55%, rgba(34,34,34,0.35) 100%), url("https://cdn.usegalileo.ai/sdxl10/cabeef41-269a-4f3a-b790-892ff4c17c3a.png")',
        }}
      >
        <div className="inline-flex items-center gap-2 rounded-full bg-downy-lightest px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-downy-dark">
          Fresh Reads Daily
          <span className="h-2 w-2 rounded-full bg-downy" />
        </div>
        <div className="flex flex-col gap-3 text-left text-charcoal">
          <h1 className="text-4xl font-black leading-tight tracking-[-0.033em] @[480px]:text-5xl @[480px]:font-black @[480px]:leading-tight @[480px]:tracking-[-0.033em]">
            Welcome to Page Chat
          </h1>
          <h2 className="text-base font-normal leading-normal text-charcoal/80 @[480px]:text-lg">
            Discover inspiring, faith-rooted literature in a calm reading haven
            curated by your community librarians.
          </h2>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full bg-downy px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-downy-dark"
          >
            Start Reading
            <ArrowRight size={18} />
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full border border-downy/30 bg-white px-6 py-3 text-sm font-semibold text-downy-dark transition hover:border-downy hover:text-downy"
          >
            Browse Collections
          </button>
        </div>
        <label className="flex h-14 min-w-40 w-full max-w-[520px] flex-col @[480px]:h-16 ">
          <div className="flex w-full flex-1 items-stretch rounded-xl h-full">
            <input
              placeholder="Search for books, authors, or genres"
              className="form-input flex w-full min-w-0 flex-1 rounded-l-xl border border-[#f0d9b5] bg-white/90 px-4 text-sm font-normal text-charcoal placeholder:text-charcoal/60 shadow-[0_10px_40px_rgba(34,34,34,0.08)] focus:border-downy focus:outline-none focus:ring-0 @[480px]:text-base"
            />
            <div className="flex h-full cursor-pointer items-center justify-center rounded-r-xl border border-l-0 border-[#e4d5bb] bg-downy p-2 text-white transition hover:bg-downy-dark">
              <Search />
            </div>
          </div>
        </label>
        <div className="flex flex-wrap gap-4">
          {[
            { label: "New Arrivals", value: "48 titles" },
            { label: "Community Clubs", value: "12 active" },
            { label: "Reader Minutes", value: "24k this week" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col rounded-2xl border border-white/60 bg-white/80 px-4 py-3 text-sm shadow-sm backdrop-blur"
            >
              <span className="text-charcoal/60">{stat.label}</span>
              <span className="text-lg font-semibold text-charcoal">
                {stat.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
