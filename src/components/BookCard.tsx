import { Book } from "@/types";
import { Heart } from "lucide-react";

interface BookCardProps {
  book: Book;
  onClick?: () => void;
  className?: string;
}

const BookCard = ({ book, onClick, className = "" }: BookCardProps) => {
  return (
    <div
      onClick={onClick}
      className={`group bg-white rounded-2xl p-3 shadow-sm border border-cream hover:shadow-lg hover:border-downy/30 transition-all duration-300 cursor-pointer ${className}`}
    >
      <div className="aspect-[3/4] rounded-xl overflow-hidden mb-3 bg-cream">
        <img
          src={book.cover_image_url}
          alt={book.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {book.is_favorited && (
          <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm p-1.5 rounded-full shadow-sm z-10 transition-transform duration-300">
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          </div>
        )}
      </div>
      <h3 className="font-medium text-charcoal text-sm line-clamp-2 mb-1 group-hover:text-downy transition-colors">
        {book.title}
      </h3>
      <p className="text-xs text-charcoal/60">{book.author?.name}</p>
    </div>
  );
};

export default BookCard;
