
import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@/redux/hooks";

import type { Book } from "@/types";

import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

type BookDetailsProps = {
  book: Book;
  onClose: () => void;
};

const BookDetails = ({ book, onClose }: BookDetailsProps) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(2);
  const { user } = useAppSelector((state) => state.auth); // Get user
  const navigate = useNavigate(); // Get navigate

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const onLoadError = (error: Error) => {
    console.error("Error while loading document:", error.message);
  };

  const goToPrevPage = () => {
    setPageNumber((prevPageNumber) => Math.max(prevPageNumber - 1, 2));
  };

  const goToNextPage = () => {
    setPageNumber((prevPageNumber) => {
      if (!numPages) {
        return prevPageNumber;
      }
      return Math.min(prevPageNumber + 1, numPages + 1);
    });
  };

  const totalPages = numPages ?? 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 overflow-auto">
      <div className="doc-popup bg-white p-6 rounded-xl w-4/5 md:w-2/3 max-h-full overflow-y-auto mt-72 mb-20 scroll-m-2">
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-lg">{book.title}</h2>
          <button className="text-bunker-400" onClick={onClose}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <hr className="my-4" />
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex flex-col gap-4 md:w-1/2">
            <img
              src={book.cover_image_url}
              className="w-full h-1/2 md:w-full object-cover rounded-xl "
              alt={book.title}
            />
            <div>
              <p className="text-bunker-950 font-semibold">{book.title}</p>
              <p className="text-sm">by {book.author.name}</p>
              <p className="text-bunker-400">{book.description}</p>
            </div>
          </div>
          <div className="mt-4 md:w-3/4 flex flex-col items-center">
            <Document
              file={book.pdf_url}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={onLoadError}
              className="w-full overflow-hidden relative"
            >
              <Page 
                pageNumber={pageNumber} 
                className="pdf-page" 
                scale={1.5} 
                error={<div className="w-full h-[600px] bg-white flex items-center justify-center text-charcoal/10">Preview Content Placeholder</div>}
              />
              
              {/* Login Overlay for Limited Preview */}
              {!user && numPages && pageNumber === numPages + 1 && (
                <div className="absolute bottom-0 left-0 w-full h-[85%] z-20 flex flex-col justify-end">
                   {/* Gradient Blur Effect */}
                   <div className="absolute inset-0 bg-gradient-to-t from-white via-white/95 to-transparent backdrop-blur-[1px]" />
                   
                   <div className="relative z-30 p-6 pb-12 flex flex-col items-center text-center animate-in slide-in-from-bottom-10 duration-700">
                     <div className="w-12 h-12 bg-white shadow-md rounded-full flex items-center justify-center mb-4 text-downy border border-downy/10">
                       <BookOpen className="w-6 h-6" />
                     </div>
                     
                     <h3 className="text-xl font-serif font-bold text-charcoal mb-2">
                       Keep Reading
                     </h3>
                     
                     <p className="text-charcoal/60 text-sm mb-6 leading-relaxed">
                       Sign in to unlock the full story.
                     </p>
                     
                     <button 
                       onClick={() => navigate("/signin")}
                       className="w-full py-3 bg-charcoal text-white rounded-xl font-bold tracking-wide hover:bg-downy transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                     >
                       Login to Continue
                     </button>
                   </div>
                </div>
              )}
            </Document>
            <div className="flex justify-center mt-2 space-x-4 text-white">
              <button
                className="px-4 py-2 bg-downy rounded"
                onClick={goToPrevPage}
                disabled={pageNumber <= 2}
              >
                Previous
              </button>
              <button
                className="px-4 py-2 bg-downy rounded"
                onClick={goToNextPage}
                disabled={!numPages || pageNumber >= totalPages + 1}
              >
                Next
              </button>
            </div>
            <p className="text-center mt-2 ">
              Page {pageNumber - 1} of {numPages ?? "?"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;
