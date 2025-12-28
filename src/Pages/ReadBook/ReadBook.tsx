import { useRef, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Document, Page, pdfjs } from "react-pdf";
import { ChevronLeft, ChevronRight, BookOpen, Clock } from "lucide-react";
import { NavBar } from "@/components";
import type { Book } from "@/types";

// Setup PDF worker
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

// Hook for window size
function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize;
}

const ReadBook = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const book = state?.book as Book | undefined;
  const { width } = useWindowSize();
  
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const scrollRef = useRef<HTMLDivElement>(null);

  if (!book) {
    navigate("/dashboard");
    return null;
  }

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const goToPrevPage = () => {
    setPageNumber((prev) => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setPageNumber((prev) => Math.min(prev + 1, numPages || prev));
  };

  const handleStartReading = () => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-white">
      <NavBar />
      
      {/* Cover Section */}
      <section className="relative min-h-[85vh] flex items-center bg-[#f8f5f0] overflow-hidden py-10 lg:py-0">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 right-0 w-2/3 h-full bg-[#f1e7d2] rounded-l-[100px] transform translate-x-1/4 hidden md:block" />
        <div className="absolute top-0 right-0 w-full h-1/2 bg-[#f1e7d2] rounded-b-[50px] md:hidden" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-downy/10 rounded-full blur-3xl opacity-50" />

        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col-reverse md:flex-row items-center gap-8 md:gap-12 lg:gap-20">
            {/* Book Info */}
            <div className="flex-1 w-full space-y-6 md:space-y-8 animate-in slide-in-from-left duration-700">
              <button 
                onClick={() => navigate(-1)} 
                className="group flex items-center gap-2 text-charcoal/60 hover:text-downy transition-colors"
              >
                <div className="p-2 rounded-full bg-white group-hover:bg-downy/10 transition-colors shadow-sm">
                  <ChevronLeft className="w-5 h-5" />
                </div>
                <span className="font-medium">Back to Library</span>
              </button>

              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-cream shadow-sm text-sm font-medium text-charcoal/70">
                  <BookOpen className="w-4 h-4 text-downy" />
                  <span>{book.category?.name || "Uncategorized"}</span>
                </div>
                
                <h1 className="text-3xl sm:text-4xl md:text-6xl font-serif font-bold text-charcoal leading-tight">
                  {book.title}
                </h1>
                
                <p className="text-lg sm:text-xl md:text-2xl text-charcoal/60 italic font-serif">
                  by {book.author?.name}
                </p>
                
                <p className="text-base sm:text-lg text-charcoal/80 max-w-xl leading-relaxed">
                  {book.description || "No description available for this book."}
                </p>

                {/* reading stats row */}
                <div className="flex flex-wrap items-center gap-6 md:gap-8 py-6 border-y border-charcoal/10">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 md:p-3 rounded-full bg-white shadow-sm text-downy">
                      <BookOpen className="w-5 h-5 md:w-6 md:h-6" />
                    </div>
                    <div>
                      <p className="text-xs md:text-sm text-charcoal/50 uppercase tracking-wide font-medium">Pages</p>
                      <p className="text-base md:text-lg font-bold text-charcoal">{book.pages || "Unknown"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                     <div className="p-2.5 md:p-3 rounded-full bg-white shadow-sm text-amber-500">
                      <Clock className="w-5 h-5 md:w-6 md:h-6" />
                    </div>
                    <div>
                      <p className="text-xs md:text-sm text-charcoal/50 uppercase tracking-wide font-medium">Read Time</p>
                      <p className="text-base md:text-lg font-bold text-charcoal">~2-3 hours</p>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={handleStartReading}
                className="w-full sm:w-auto justify-center group relative inline-flex items-center gap-3 px-8 py-4 bg-charcoal text-white rounded-full text-lg font-medium overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <span className="relative z-10">Start Reading</span>
                <ChevronRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                <div className="absolute inset-0 bg-downy transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500 rounded-full" />
              </button>
            </div>

            {/* Book Cover */}
            <div className="flex-1 w-full max-w-[280px] sm:max-w-sm md:max-w-xl relative animate-in slide-in-from-right duration-700 delay-100 mx-auto md:mx-0">
              <div className="relative aspect-[3/4] rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.3)] bg-white p-2 md:p-4 rotate-3 hover:rotate-0 transition-transform duration-500 ease-out">
                <img
                  src={book.cover_image_url}
                  alt={book.title}
                  className="w-full h-full object-cover rounded-xl shadow-inner border border-black/5"
                />
                
                {/* Decorative Elements around cover */}
                <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-downy/20 to-transparent rounded-full blur-3xl" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reader Section */}
      <section ref={scrollRef} className="py-12 md:py-20 bg-white min-h-screen">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            {/* Controls */}
            <div className="sticky top-20 z-10 flex items-center justify-between p-3 md:p-4 bg-white/80 backdrop-blur-md rounded-2xl shadow-sm border border-cream mb-6 md:mb-8 transition-all">
               <span className="font-medium text-sm md:text-base text-charcoal">
                Page {pageNumber} <span className="text-charcoal/40">of {numPages || "--"}</span>
              </span>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={goToPrevPage}
                  disabled={pageNumber <= 1}
                  className="p-2 md:p-2.5 rounded-xl hover:bg-cream disabled:opacity-30 disabled:hover:bg-transparent transition-colors text-charcoal"
                >
                   <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={goToNextPage}
                  disabled={!numPages || pageNumber >= (numPages || 0)}
                   className="p-2 md:p-2.5 rounded-xl hover:bg-cream disabled:opacity-30 disabled:hover:bg-transparent transition-colors text-charcoal"
                >
                   <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* PDF Canvas */}
            <div className="flex justify-center bg-cream/30 rounded-2xl md:rounded-3xl p-2 md:p-12 min-h-[50vh] md:min-h-[800px] shadow-inner overflow-hidden">
               <Document
                file={book.pdf_url}
                onLoadSuccess={onDocumentLoadSuccess}
                className="shadow-xl md:shadow-2xl rounded-sm overflow-hidden bg-white"
                loading={
                  <div className="h-[50vh] md:h-[800px] flex items-center justify-center text-charcoal/40">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-8 h-8 border-4 border-downy border-t-transparent rounded-full animate-spin" />
                      <p>Loading book content...</p>
                    </div>
                  </div>
                }
              >
                <Page 
                  pageNumber={pageNumber} 
                  className="max-w-full"
                  width={Math.min(width * 0.9, 800)} // Responsive width using hook
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                  scale={width < 768 ? 1 : 1.2}
                />
              </Document>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ReadBook;
