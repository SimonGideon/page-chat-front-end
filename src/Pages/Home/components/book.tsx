import { useState } from "react";

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
  const [showBookDetails, setShowBookDetails] = useState(false);

  return (
    <div>
      <div
        className={`cursor-pointer ${styleProps.containerClass ?? ""}`}
        onClick={() => setShowBookDetails(true)}
      >
        <img
          src={book.cover_image_url}
          className={`object-cover ${styleProps.imageClass ?? ""}`}
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
