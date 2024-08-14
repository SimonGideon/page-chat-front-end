import { useState } from "react";
import PropTypes from "prop-types";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

// Set worker path to the local copy in public directory
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const BookDetails = ({ book, onClose }) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(2);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const onLoadError = (error) => {
    console.error("Error while loading document:", error.message);
  };

  const goToPrevPage = () => {
    setPageNumber((prevPageNumber) => Math.max(prevPageNumber - 1, 2));
  };

  const goToNextPage = () => {
    setPageNumber((prevPageNumber) =>
      Math.min(prevPageNumber + 1, numPages + 1)
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 overflow-auto">
      <div className="doc-popup bg-white p-6 rounded-xl w-4/5 md:w-2/3 max-h-full overflow-y-auto mt-72 mb-20 scroll-m-2">
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-lg">{book.title}</h2>
          <button className="text-bunker-400" onClick={() => onClose(false)}>
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
              className="w-full overflow-hidden"
            >
              <Page pageNumber={pageNumber} className="pdf-page" scale={1.5} />
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
                disabled={pageNumber >= numPages + 1}
              >
                Next
              </button>
            </div>
            <p className="text-center mt-2 ">
              Page {pageNumber - 1} of {numPages}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

BookDetails.propTypes = {
  book: PropTypes.shape({
    title: PropTypes.string.isRequired,
    cover_image_url: PropTypes.string.isRequired,
    pdf_url: PropTypes.string.isRequired,
    author: PropTypes.shape({
      name: PropTypes.string.isRequired,
    }).isRequired,
    description: PropTypes.string.isRequired,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default BookDetails;
