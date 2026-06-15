import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAppSelector } from "@/redux/hooks";
import type { Book as BookType } from "@/types";

import BookDetails from "./bookDetailsPop";

type StyleProps = {
  containerClass?: string;
  imageClass?: string;
  textClass?: string;
  textTitle?: string;
  textAuthor?: string;
  indexClass?: string;
};

type BookProps = {
  book: BookType;
  onTitleLength: (title: string) => string;
  styleProps: StyleProps;
  index: number;
};

const Book = ({ book, onTitleLength, styleProps, index }: BookProps) => {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const [showBookDetails, setShowBookDetails] = useState(false);

  const handleBookClick = () => {
    if (user) {
      navigate(`/read/${book.id}`);
    } else {
      setShowBookDetails(true);
    }
  };

  return (
    <div>
      <div
        className={`cursor-pointer ${styleProps.containerClass ?? ""}`}
        onClick={handleBookClick}
      >
        <img
          src={book.cover_image_url}
          className={styleProps.imageClass ?? "w-full aspect-[2/3] object-cover rounded-xl"}
          alt={book.title}
        />
        <p
          className={index === 0 ? "hidden" : styleProps.indexClass ?? "block"}
        >
          {index}
        </p>
        <div className={styleProps.textClass ?? ""}>
          <p className={`font-semibold ${styleProps.textTitle ?? ""}`}>
            {onTitleLength(book.title)}
          </p>
          <p className={`text-sm ${styleProps.textAuthor ?? ""}`}>
            by {book.author.name}
          </p>
        </div>
      </div>
      {showBookDetails && (
        <BookDetails book={book} onClose={() => setShowBookDetails(false)} />
      )}
    </div>
  );
};

export default Book;
