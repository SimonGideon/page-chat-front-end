import PropTypes from "prop-types";

const Engagements = ({
  initials,
  title,
  subtitle,
  amount,
  timeAgo,
  image,
  status,
}) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
      <div className="flex items-center space-x-4">
        <div
          className="w-24 h-12 md:w-12 rounded-full bg-gray-200 flex items-center justify-center text-white font-bold text-xs sm:text-base"
          style={{
            backgroundColor:
              status === "Lost Deal"
                ? "red"
                : status === "Won Deal"
                ? "green"
                : "gray",
          }}
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
            style={{ width: "2rem", height: "2rem" }}
          />
          <span
            className={`px-2 py-1 rounded-full text-xs sm:text-sm font-semibold ${
              status === "Lost Deal"
                ? "bg-red-100 text-red-500"
                : status === "Won Deal"
                ? "bg-green-100 text-green-500"
                : "bg-gray-100 text-gray-500"
            }`}
          >
            {status}
          </span>
        </div>
      </div>
    </div>
  );
};

// Prop types
Engagements.propTypes = {
  initials: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  amount: PropTypes.string.isRequired,
  timeAgo: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
};

export default Engagements;
