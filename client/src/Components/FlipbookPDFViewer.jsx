import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import HTMLFlipBook from "react-pageflip";
import * as pdfjsLib from "pdfjs-dist";

pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js";

export default function FlipbookPDF({ bookId: propBookId }) {
  const { bookId: paramBookId } = useParams();
  const bookId = propBookId || paramBookId;

  const [bookUrl, setBookUrl] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [flipbookWidth, setFlipbookWidth] = useState(800);
  const [flipbookHeight, setFlipbookHeight] = useState(700);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState(null);
  const [touchEndX, setTouchEndX] = useState(null);

  const flipBookRef = useRef();
  const startTimeRef = useRef(Date.now());

  // 📥 Fetch book chapters
  useEffect(() => {
    if (!bookId) return;

    const fetchBook = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/books/${bookId}/chapters`,
          { credentials: "include" }
        );
        const data = await res.json();

        if (data && data.length > 0) {
          const firstChapter = data[0];
          setSelectedChapter(firstChapter);

          const pdfUrl = `${import.meta.env.VITE_API_URL}/books/proxy/chapters/${bookId}/chapter-${firstChapter.chapterNumber}.pdf`;

          setBookUrl(pdfUrl);
          setFileType("pdf");
        }
      } catch (error) {
        console.error("❌ Failed to fetch chapters:", error);
      }
    };

    fetchBook();
  }, [bookId]);

  // 📖 Incremental PDF Loader
  useEffect(() => {
    if (!bookUrl || fileType !== "pdf") return;

    const loadPdf = async () => {
      try {
        const loadingTask = pdfjsLib.getDocument(bookUrl);
        const pdf = await loadingTask.promise;

        setPages([]); // reset old pages
        setLoading(false); // hide loader early, show first pages as they load

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale: 1.2 });

          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");
          canvas.width = viewport.width;
          canvas.height = viewport.height;

          await page.render({ canvasContext: context, viewport }).promise;
          const imgData = canvas.toDataURL();
          setPages((prev) => [...prev, imgData]);
        }
      } catch (error) {
        console.error("❌ Error loading PDF:", error);
      }
    };

    loadPdf();
  }, [bookUrl, fileType]);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      setFlipbookWidth(width);
      setFlipbookHeight(height * 0.9);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 📱 Device check
  const isMobileLandscape =
    window.innerWidth > window.innerHeight && window.innerWidth <= 1024;
  const isDesktop = window.innerWidth > 1024;

  // ⌨️ Keyboard navigation
  useEffect(() => {
    if (!(isDesktop || isMobileLandscape)) return;

    const handleKeyDown = (e) => {
      if (!flipBookRef.current) return;

      if (e.key === "ArrowRight") flipBookRef.current.pageFlip().flipNext();
      else if (e.key === "ArrowLeft") flipBookRef.current.pageFlip().flipPrev();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isDesktop, isMobileLandscape]);

  // 📊 Track page flip
  const handlePageFlip = (e) => {
    if (!selectedChapter) return;
    const pageIndex = e.data;
    const role = localStorage.getItem("role");
    if (role !== "student") return;

    const currentPage = pageIndex + 1;

    const payload = {
      bookId: parseInt(bookId),
      chapterId: selectedChapter.id,
      timeSpent: Math.floor((Date.now() - startTimeRef.current) / 1000),
      resourceType: fileType?.toUpperCase(),
      pageNumber: currentPage,
      isCompleted: currentPage === pages.length,
    };

    fetch(`${import.meta.env.VITE_API_URL}/students/activity`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((data) => console.log("✅ Activity logged:", data))
      .catch((err) => console.error("❌ Failed to log activity:", err));
  };

  // 📱 Swipe on Mobile
  const handleSwipe = () => {
    if (!touchStartX || !touchEndX) return;
    const distance = touchStartX - touchEndX;
    const swipeThreshold = 50;

    if (distance > swipeThreshold && currentPageIndex < pages.length - 1) {
      setCurrentPageIndex(currentPageIndex + 1); // Swipe Left
    } else if (distance < -swipeThreshold && currentPageIndex > 0) {
      setCurrentPageIndex(currentPageIndex - 1); // Swipe Right
    }

    setTouchStartX(null);
    setTouchEndX(null);
  };

  return (
    <div className="relative w-full h-[calc(100vh-60px)] flex flex-col items-center bg-gray-100 overflow-auto">
      {loading && (
        <div className="absolute inset-0 flex justify-center items-center bg-white z-50">
          <div className="text-xl font-semibold text-gray-600 animate-pulse">
            ⏳ Loading PDF...
          </div>
        </div>
      )}

      {fileType === "pdf" ? (
        isDesktop || isMobileLandscape ? (
          <HTMLFlipBook
            width={flipbookWidth}
            height={flipbookHeight * 2.5}
            size="stretch"
            minWidth={300}
            maxWidth={1000}
            minHeight={400}
            maxHeight={1500}
            maxShadowOpacity={0.5}
            showCover={true}
            mobileScrollSupport={true}
            ref={flipBookRef}
            className="shadow-lg flipbook-container"
            flippingTime={600}
            drawShadow={true}
            onFlip={handlePageFlip}
          >
            {pages.map((src, index) => (
              <div
                key={index}
                className="w-full h-full flex justify-center items-center bg-white p-2 overflow-hidden"
              >
                <img
                  src={src}
                  alt={`Page ${index + 1}`}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                  className="transition-transform duration-300"
                />
              </div>
            ))}
          </HTMLFlipBook>
        ) : (
          <div
            className="w-full h-full flex items-center justify-center overflow-hidden relative bg-white"
            onTouchStart={(e) => setTouchStartX(e.touches[0].clientX)}
            onTouchMove={(e) => setTouchEndX(e.touches[0].clientX)}
            onTouchEnd={() => handleSwipe()}
          >
            {pages.length > 0 && (
              <img
                src={pages[currentPageIndex]}
                alt={`Page ${currentPageIndex + 1}`}
                style={{
                  width: "100%",
                  height: "auto",
                  maxHeight: flipbookHeight,
                  objectFit: "contain",
                  transition: "transform 0.3s ease",
                }}
                className="rounded shadow"
              />
            )}

            {/* Page indicator */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm bg-black/50 px-3 py-1 rounded-full">
              Page {currentPageIndex + 1} / {pages.length}
            </div>
          </div>
        )
      ) : (
        <p>Unsupported file format</p>
      )}
    </div>
  );
}

