import { useRef, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Document, Page, pdfjs } from "react-pdf";
import { ChevronLeft, ChevronRight, BookOpen, Clock, Heart } from "lucide-react";
import { NavBar } from "@/components";
import type { Book } from "@/types";
import { apiClient } from "@/services/api";
import DiscussionPanel from "./components/DiscussionPanel"; // Import DiscussionPanel
import { useAppSelector } from "@/redux/hooks"; // Import Redux hooks

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
  const [book, setBook] = useState<Book | undefined>(state?.book);
  const { width } = useWindowSize();
  const { user } = useAppSelector((state) => state.auth); // Get user from Redux
  
  const [containerWidth, setContainerWidth] = useState<number | null>(null);
  const pdfContainerRef = useRef<HTMLDivElement>(null);

  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [isInteractive, setIsInteractive] = useState(() => {
    return localStorage.getItem("isInteractive") === "true";
  });
  const scrollRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
     localStorage.setItem("isInteractive", String(isInteractive));
  }, [isInteractive]);

  useEffect(() => {
    if (book?.id) {
       apiClient.getBook(String(book.id))
         .then(res => {
            if (res.data) setBook(prev => ({ ...prev, ...res.data }));
         })
         .catch(err => console.error("Failed to refresh book data", err));
    }
  }, [book?.id]);

  useEffect(() => {
    if (!pdfContainerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentBoxSize) {
           // Use contentBoxSize for precise content width
           const contentBoxSize = Array.isArray(entry.contentBoxSize)
             ? entry.contentBoxSize[0]
             : entry.contentBoxSize;
           setContainerWidth(contentBoxSize.inlineSize);
        } else {
           // Fallback
           setContainerWidth(entry.contentRect.width);
        }
      }
    });

    resizeObserver.observe(pdfContainerRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [pdfContainerRef.current]);

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
  
  const handleToggleFavorite = async () => {
     if (!book) return;
     try {
       if (book.is_favorited && book.favorite_id) {
          await apiClient.removeFromFavorites(book.favorite_id);
          setBook({ ...book, is_favorited: false, favorite_id: null });
       } else {
          const res = await apiClient.addToFavorites(String(book.id));
          // Assuming backend returns the favorite object with ID
          setBook({ ...book, is_favorited: true, favorite_id: res.data.id });
       }
     } catch (err) {
       console.error("Failed to toggle favorite", err);
     }
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
                <div className="flex items-center gap-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-cream shadow-sm text-sm font-medium text-charcoal/70">
                    <BookOpen className="w-4 h-4 text-downy" />
                    <span>{book.category?.name || "Uncategorized"}</span>
                  </div>
                  
                  <button
                     onClick={handleToggleFavorite}
                     className={`p-2 rounded-full border transition-all ${book.is_favorited ? "bg-red-50 border-red-200 text-red-500" : "bg-white border-cream text-charcoal/40 hover:text-red-400"}`}
                  >
                     <Heart className={`w-5 h-5 ${book.is_favorited ? "fill-current" : ""}`} />
                  </button>
                </div>
                
                <h1 className="text-3xl sm:text-4xl md:text-6xl font-serif font-bold text-charcoal leading-tight">
                  {book.title}
                </h1>
                
                <p className="text-lg sm:text-xl md:text-2xl text-charcoal/60 italic font-serif">
                  by {book.author?.name}
                </p>
                
                <p className="text-base sm:text-lg text-charcoal/80 max-w-xl leading-relaxed line-clamp-4">
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
          <div className={`mx-auto transition-all duration-500 ${isInteractive ? 'max-w-[1600px]' : 'max-w-5xl'}`}>
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

               {/* Interaction Toggle */}
               <div className="flex items-center gap-3 pl-4 border-l border-cream/50">
                <span className="text-sm font-medium text-charcoal hidden sm:block">Interactive Mode</span>
                <button
                  onClick={() => setIsInteractive(!isInteractive)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-downy focus:ring-offset-2 ${
                    isInteractive ? 'bg-downy' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`${
                      isInteractive ? 'translate-x-6' : 'translate-x-1'
                    } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                  />
                </button>
              </div>
            </div>

            <div className={`flex flex-col lg:flex-row gap-6 transition-all duration-500`}>
              {/* PDF Canvas */}
              <div 
                ref={pdfContainerRef}
                className={`flex justify-center bg-cream/30 rounded-2xl md:rounded-3xl p-2 md:p-8 min-h-[50vh] md:min-h-[800px] shadow-inner overflow-hidden transition-all duration-500 ${isInteractive ? 'lg:w-[65%]' : 'w-full'}`}
              >
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
                    width={containerWidth ? Math.min(containerWidth - 40, isInteractive ? 1200 : 1000) : 600} // Dynamic width using container size
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                    scale={width < 768 ? 1 : 1.2}
                    error={<div className="w-full h-[800px] bg-white flex items-center justify-center text-charcoal/10">Preview Content Placeholder</div>}
                  />
                </Document>

                 {/* Login Overlay for Limited Preview */}
                 {/* Login Overlay for Limited Preview */}
                 {/* Login Overlay for Limited Preview */}
                 {!user && numPages && pageNumber === numPages && (
                   <div className="absolute bottom-0 left-0 w-full h-[85%] z-20 flex flex-col justify-end">
                     {/* Gradient Blur Effect */}
                     <div className="absolute inset-0 bg-gradient-to-t from-white via-white/95 to-transparent backdrop-blur-[2px]" />
                     
                     <div className="relative z-30 p-8 pb-20 flex flex-col items-center text-center animate-in slide-in-from-bottom-10 duration-700">
                       <div className="w-16 h-16 bg-white shadow-lg rounded-full flex items-center justify-center mb-6 text-downy border border-downy/10">
                         <BookOpen className="w-8 h-8" />
                       </div>
                       
                       <h3 className="text-3xl font-serif font-bold text-charcoal mb-3">
                         Keep Reading
                       </h3>
                       
                       <p className="text-charcoal/60 mb-8 max-w-md font-medium leading-relaxed">
                         You've reached the end of the free preview. <br/>
                         Sign in to unlock the full story and interactive features.
                       </p>
                       
                       <button 
                         onClick={() => navigate("/signin")}
                         className="px-10 py-4 bg-charcoal text-white rounded-full font-bold tracking-wide hover:bg-downy transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1"
                       >
                         Login to Continue
                       </button>
                     </div>
                   </div>
                 )}
              </div>

               {/* Discussion Panel Side View */}
               {isInteractive && (
                <div className="lg:w-[35%] h-[600px] lg:h-[800px] sticky top-24 animate-in slide-in-from-right duration-500">
                  <DiscussionPanel 
                    bookId={book.id} 
                    className="rounded-2xl shadow-lg border border-cream h-full"
                    onClose={() => setIsInteractive(false)}
                   />
                </div>
               )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ReadBook;
