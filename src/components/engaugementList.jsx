import Engagements from "./engagements";

const EngagementList = () => {
  const deals = [
    {
      initials: "BJ",
      title: "Deal title would go here...",
      subtitle:
        "Deal for the property in Malibu with Casey Brother Real Estate",
      amount: "$2,232,342.32",
      timeAgo: "4 months ago",
      image: "https://via.placeholder.com/32",
      status: "Lost Deal",
    },
    {
      initials: "RO",
      title: "Deal title would go here...",
      subtitle:
        "Deal for the property in Malibu with Casey Brother Real Estate",
      amount: "$2,232,342.32",
      timeAgo: "4 months ago",
      image: "https://via.placeholder.com/32",
      status: "Won Deal",
    },
    {
      initials: "RJ",
      title: "Deal title would go here...",
      subtitle:
        "Deal for the property in Malibu with Casey Brother Real Estate",
      amount: "$2,232,342.32",
      timeAgo: "4 months ago",
      image: "https://via.placeholder.com/32",
      status: "Lost Deal",
    },
    {
      initials: "DJ",
      title: "Deal title would go here...",
      subtitle:
        "Deal for the property in Malibu with Casey Brother Real Estate",
      amount: "$2,232,342.32",
      timeAgo: "4 months ago",
      image: "https://via.placeholder.com/32",
      status: "Won Deal",
    },
  ];

  return (
    <div className="space-y-4">
      {deals.map(
        (deal, index) => (
          console.log(deal.initials),
          (
            <Engagements
              key={index}
              initials={deal.initials}
              title={deal.title}
              subtitle={deal.subtitle}
              amount={deal.amount}
              timeAgo={deal.timeAgo}
              image={deal.image}
              status={deal.status}
            />
          )
        )
      )}
    </div>
  );
};

export default EngagementList;
