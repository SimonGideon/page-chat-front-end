type EngagementsProps = {
  initials: string;
  title: string;
  subtitle: string;
  amount: string;
  timeAgo: string;
  image: string;
  status: string;
};

const getStatusStyles = (status: string) => {
  if (status === "Lost Deal") {
    return {
      badge: "bg-red-100 text-red-500",
      avatar: "red",
    };
  }
  if (status === "Won Deal") {
    return {
      badge: "bg-green-100 text-green-500",
      avatar: "green",
    };
  }
  return {
    badge: "bg-gray-100 text-gray-500",
    avatar: "gray",
  };
};

const Engagements = ({
  initials,
  title,
  subtitle,
  amount,
  timeAgo,
  image,
  status,
}: EngagementsProps) => {
  const { badge, avatar } = getStatusStyles(status);

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
      <div className="flex items-center space-x-4">
        <div
          className="w-24 h-12 md:w-12 rounded-full flex items-center justify-center text-white font-bold text-xs sm:text-base"
          style={{ backgroundColor: avatar }}
        >
          {initials}
        </div>
        <div>
          <h3 className="font-bold text-base sm:text-lg text-gray-900">
            {title}
          </h3>
          <p className="text-xs sm:text-sm text-gray-600">{subtitle}</p>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between sm:space-x-4">
        <div className="text-xs sm:text-sm">
          <p className="text-gray-900 font-semibold">{amount}</p>
          <p className="text-gray-400">{timeAgo}</p>
        </div>
        <div className="flex items-center space-x-2 mt-2 sm:mt-0">
          <img
            src={image}
            alt="Profile"
            className="w-8 h-8 rounded-full object-cover"
          />
          <span
            className={`px-2 py-1 rounded-full text-xs sm:text-sm font-semibold ${badge}`}
          >
            {status}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Engagements;
