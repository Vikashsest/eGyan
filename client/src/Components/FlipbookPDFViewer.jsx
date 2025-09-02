// import { useEffect, useState, useRef } from "react";
// import { useParams } from "react-router-dom";
// import HTMLFlipBook from "react-pageflip";
// import * as pdfjsLib from "pdfjs-dist";

// pdfjsLib.GlobalWorkerOptions.workerSrc =
//   "https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js";

// export default function FlipbookPDF({ bookId: propBookId,chapter }) {
//   const { bookId: paramBookId } = useParams();
//   const bookId = propBookId || paramBookId;

//   const [bookUrl, setBookUrl] = useState(null);
//   const [fileType, setFileType] = useState(null);
//   const [pages, setPages] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [flipbookWidth, setFlipbookWidth] = useState(800);
//   const [flipbookHeight, setFlipbookHeight] = useState(700);
//   const [selectedChapter, setSelectedChapter] = useState(null);
//   const [currentPageIndex, setCurrentPageIndex] = useState(0);
//   const [touchStartX, setTouchStartX] = useState(null);
//   const [touchEndX, setTouchEndX] = useState(null);

//   const flipBookRef = useRef();
//   const startTimeRef = useRef(Date.now());
//  useEffect(() => {
//     if (chapter) {
//       let url = chapter.proxyUrl || chapter.fileUrl;

//       // If Nextcloud public share link, add /download
//       if (url.includes("/s/") && !url.endsWith("/download")) {
//         url = url.replace(/\/+$/, "") + "/download";
//       }

//       // If proxy URL, also fix inner `url` param
//       if (url.includes("/proxy/file")) {
//         try {
//           const urlObj = new URL(url, window.location.origin);
//           const targetUrl = urlObj.searchParams.get("url");
//           if (targetUrl?.includes("/s/") && !targetUrl.endsWith("/download")) {
//             urlObj.searchParams.set(
//               "url",
//               targetUrl.replace(/\/+$/, "") + "/download"
//             );
//             url = urlObj.toString();
//           }
//         } catch (err) {
//           console.error("❌ Proxy URL parse error:", err);
//         }
//       }

//       setBookUrl(url);
//       setFileType(chapter.resourceType || "pdf");
//       setSelectedChapter(chapter);
//     }
//   }, [chapter]);
//   // 📥 Fetch book chapters
//   useEffect(() => {
//     if (!bookId) return;

//     const fetchBook = async () => {
//       try {
//         const res = await fetch(
//           `${import.meta.env.VITE_API_URL}/books/${bookId}/chapters`,
//           { credentials: "include" }
//         );
//         const data = await res.json();

//         if (data && data.length > 0) {
//           const firstChapter = data[0];
//           setSelectedChapter(firstChapter);

//           const pdfUrl = `${import.meta.env.VITE_API_URL}/books/proxy/chapters/${bookId}/chapter-${firstChapter.chapterNumber}.pdf`;

//           setBookUrl(pdfUrl);
//           setFileType("pdf");
//         }
//       } catch (error) {
//         console.error("❌ Failed to fetch chapters:", error);
//       }
//     };

//     fetchBook();
//   }, [bookId]);

//   // 📖 Incremental PDF Loader
//   useEffect(() => {
//     if (!bookUrl || fileType !== "pdf") return;

//     const loadPdf = async () => {
//       try {
//         const loadingTask = pdfjsLib.getDocument(bookUrl);
//         const pdf = await loadingTask.promise;

//         setPages([]); // reset old pages
//         setLoading(false); // hide loader early, show first pages as they load

//         for (let i = 1; i <= pdf.numPages; i++) {
//           const page = await pdf.getPage(i);
//           const viewport = page.getViewport({ scale: 1.2 });

//           const canvas = document.createElement("canvas");
//           const context = canvas.getContext("2d");
//           canvas.width = viewport.width;
//           canvas.height = viewport.height;

//           await page.render({ canvasContext: context, viewport }).promise;
//           const imgData = canvas.toDataURL();
//           setPages((prev) => [...prev, imgData]);
//         }
//       } catch (error) {
//         console.error("❌ Error loading PDF:", error);
//       }
//     };

//     loadPdf();
//   }, [bookUrl, fileType]);

//   useEffect(() => {
//     const handleResize = () => {
//       const width = window.innerWidth;
//       const height = window.innerHeight;
//       setFlipbookWidth(width);
//       setFlipbookHeight(height * 0.9);
//     };

//     handleResize();
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   // 📱 Device check
//   const isMobileLandscape =
//     window.innerWidth > window.innerHeight && window.innerWidth <= 1024;
//   const isDesktop = window.innerWidth > 1024;

//   // ⌨️ Keyboard navigation
//   useEffect(() => {
//     if (!(isDesktop || isMobileLandscape)) return;

//     const handleKeyDown = (e) => {
//       if (!flipBookRef.current) return;

//       if (e.key === "ArrowRight") flipBookRef.current.pageFlip().flipNext();
//       else if (e.key === "ArrowLeft") flipBookRef.current.pageFlip().flipPrev();
//     };

//     window.addEventListener("keydown", handleKeyDown);
//     return () => window.removeEventListener("keydown", handleKeyDown);
//   }, [isDesktop, isMobileLandscape]);

//   // 📊 Track page flip
//   const handlePageFlip = (e) => {
//     if (!selectedChapter) return;
//     const pageIndex = e.data;
//     const role = localStorage.getItem("role");
//     if (role !== "student") return;

//     const currentPage = pageIndex + 1;

//     const payload = {
//       bookId: parseInt(bookId),
//       chapterId: selectedChapter.id,
//       timeSpent: Math.floor((Date.now() - startTimeRef.current) / 1000),
//       resourceType: fileType?.toUpperCase(),
//       pageNumber: currentPage,
//       isCompleted: currentPage === pages.length,
//     };

//     fetch(`${import.meta.env.VITE_API_URL}/students/activity`, {
//       method: "POST",
//       credentials: "include",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(payload),
//     })
//       .then((res) => res.json())
//       .then((data) => console.log("✅ Activity logged:", data))
//       .catch((err) => console.error("❌ Failed to log activity:", err));
//   };

//   // 📱 Swipe on Mobile
//   const handleSwipe = () => {
//     if (!touchStartX || !touchEndX) return;
//     const distance = touchStartX - touchEndX;
//     const swipeThreshold = 50;

//     if (distance > swipeThreshold && currentPageIndex < pages.length - 1) {
//       setCurrentPageIndex(currentPageIndex + 1); // Swipe Left
//     } else if (distance < -swipeThreshold && currentPageIndex > 0) {
//       setCurrentPageIndex(currentPageIndex - 1); // Swipe Right
//     }

//     setTouchStartX(null);
//     setTouchEndX(null);
//   };

//   return (
//     <div className="relative w-full h-[calc(100vh-60px)] flex flex-col items-center bg-gray-100 overflow-auto">
//       {loading && (
//         <div className="absolute inset-0 flex justify-center items-center bg-white z-50">
//           <div className="text-xl font-semibold text-gray-600 animate-pulse">
//             ⏳ Loading PDF...
//           </div>
//         </div>
//       )}

//       {fileType === "pdf" ? (
//         isDesktop || isMobileLandscape ? (
//           <HTMLFlipBook
//             width={flipbookWidth}
//             height={flipbookHeight * 2.5}
//             size="stretch"
//             minWidth={300}
//             maxWidth={1000}
//             minHeight={400}
//             maxHeight={1500}
//             maxShadowOpacity={0.5}
//             showCover={true}
//             mobileScrollSupport={true}
//             ref={flipBookRef}
//             className="shadow-lg flipbook-container"
//             flippingTime={600}
//             drawShadow={true}
//             onFlip={handlePageFlip}
//           >
//             {pages.map((src, index) => (
//               <div
//                 key={index}
//                 className="w-full h-full flex justify-center items-center bg-white p-2 overflow-hidden"
//               >
//                 <img
//                   src={src}
//                   alt={`Page ${index + 1}`}
//                   style={{
//                     width: "100%",
//                     height: "100%",
//                     objectFit: "contain",
//                   }}
//                   className="transition-transform duration-300"
//                 />
//               </div>
//             ))}
//           </HTMLFlipBook>
//         ) : (
//           <div
//             className="w-full h-full flex items-center justify-center overflow-hidden relative bg-white"
//             onTouchStart={(e) => setTouchStartX(e.touches[0].clientX)}
//             onTouchMove={(e) => setTouchEndX(e.touches[0].clientX)}
//             onTouchEnd={() => handleSwipe()}
//           >
//             {pages.length > 0 && (
//               <img
//                 src={pages[currentPageIndex]}
//                 alt={`Page ${currentPageIndex + 1}`}
//                 style={{
//                   width: "100%",
//                   height: "auto",
//                   maxHeight: flipbookHeight,
//                   objectFit: "contain",
//                   transition: "transform 0.3s ease",
//                 }}
//                 className="rounded shadow"
//               />
//             )}

//             {/* Page indicator */}
//             <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm bg-black/50 px-3 py-1 rounded-full">
//               Page {currentPageIndex + 1} / {pages.length}
//             </div>
//           </div>
//         )
//       ) : (
//         <p>Unsupported file format</p>
//       )}
//     </div>
//   );
// }
















// import { useEffect, useState, useRef } from "react";
// import { useParams } from "react-router-dom";
// import HTMLFlipBook from "react-pageflip";
// import * as pdfjsLib from "pdfjs-dist";

// pdfjsLib.GlobalWorkerOptions.workerSrc =
//   "https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js";

// const API_URL = import.meta.env.VITE_API_URL;

// export default function FlipbookPDF({ bookId: propBookId, chapter }) {
//   const { bookId: paramBookId } = useParams();
//   const bookId = propBookId || paramBookId;

//   const [bookUrl, setBookUrl] = useState(null);
//   const [fileType, setFileType] = useState(null);
//   const [pages, setPages] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [flipbookWidth, setFlipbookWidth] = useState(800);
//   const [flipbookHeight, setFlipbookHeight] = useState(700);
//   const [selectedChapter, setSelectedChapter] = useState(null);
//   const [currentPageIndex, setCurrentPageIndex] = useState(0);
//   const [touchStartX, setTouchStartX] = useState(null);
//   const [touchEndX, setTouchEndX] = useState(null);

//   const flipBookRef = useRef();
//   const startTimeRef = useRef(Date.now());

//   // ✅ Fix: always enforce `/download` for Nextcloud share links
//   useEffect(() => {
//     if (chapter) {
//       let url = chapter.proxyUrl || chapter.fileUrl;

//       // If Nextcloud public share link, add /download
//       if (url.includes("/s/") && !url.endsWith("/download")) {
//         url = url.replace(/\/+$/, "") + "/download";
//       }

//       // If proxy URL, also fix inner `url` param
//       if (url.includes("/proxy/file")) {
//         try {
//           const urlObj = new URL(url, window.location.origin);
//           const targetUrl = urlObj.searchParams.get("url");
//           if (targetUrl?.includes("/s/") && !targetUrl.endsWith("/download")) {
//             urlObj.searchParams.set(
//               "url",
//               targetUrl.replace(/\/+$/, "") + "/download"
//             );
//             url = urlObj.toString();
//           }
//         } catch (err) {
//           console.error("❌ Proxy URL parse error:", err);
//         }
//       }

//       setBookUrl(url);
//       setFileType(chapter.resourceType || "pdf");
//       setSelectedChapter(chapter);
//     }
//   }, [chapter]);

//   // 📖 PDF Loader
//   useEffect(() => {
//     if (!bookUrl || fileType !== "pdf") return;

//     const loadPdf = async () => {
//       try {
//         const loadingTask = pdfjsLib.getDocument(bookUrl);
//         const pdf = await loadingTask.promise;

//         setPages([]);
//         setLoading(false);

//         for (let i = 1; i <= pdf.numPages; i++) {
//           const page = await pdf.getPage(i);
//           const viewport = page.getViewport({ scale: 1.2 });

//           const canvas = document.createElement("canvas");
//           const context = canvas.getContext("2d");
//           canvas.width = viewport.width;
//           canvas.height = viewport.height;

//           await page.render({ canvasContext: context, viewport }).promise;
//           setPages((prev) => [...prev, canvas.toDataURL()]);
//         }
//       } catch (error) {
//         console.error("❌ Error loading PDF:", error);
//       }
//     };

//     loadPdf();
//   }, [bookUrl, fileType]);

//   // 📏 Resize
//   useEffect(() => {
//     const handleResize = () => {
//       setFlipbookWidth(window.innerWidth);
//       setFlipbookHeight(window.innerHeight * 0.9);
//     };
//     handleResize();
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   // ⌨️ Keyboard nav
//   const isMobileLandscape =
//     window.innerWidth > window.innerHeight && window.innerWidth <= 1024;
//   const isDesktop = window.innerWidth > 1024;

//   useEffect(() => {
//     if (!(isDesktop || isMobileLandscape)) return;

//     const handleKeyDown = (e) => {
//       if (!flipBookRef.current) return;
//       if (e.key === "ArrowRight") flipBookRef.current.pageFlip().flipNext();
//       if (e.key === "ArrowLeft") flipBookRef.current.pageFlip().flipPrev();
//     };

//     window.addEventListener("keydown", handleKeyDown);
//     return () => window.removeEventListener("keydown", handleKeyDown);
//   }, [isDesktop, isMobileLandscape]);

//   // 📊 Page flip log
//   const handlePageFlip = (e) => {
//     if (!selectedChapter) return;
//     const pageIndex = e.data;
//     const role = localStorage.getItem("role");
//     if (role !== "student") return;

//     const payload = {
//       bookId: parseInt(bookId),
//       chapterId: selectedChapter.id,
//       timeSpent: Math.floor((Date.now() - startTimeRef.current) / 1000),
//       resourceType: fileType?.toUpperCase(),
//       pageNumber: pageIndex + 1,
//       isCompleted: pageIndex + 1 === pages.length,
//     };

//     fetch(`${API_URL}/students/activity`, {
//       method: "POST",
//       credentials: "include",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(payload),
//     }).catch((err) => console.error("❌ Activity log failed:", err));
//   };

//   // 📱 Swipe
//   const handleSwipe = () => {
//     if (!touchStartX || !touchEndX) return;
//     const distance = touchStartX - touchEndX;
//     const swipeThreshold = 50;

//     if (distance > swipeThreshold && currentPageIndex < pages.length - 1) {
//       setCurrentPageIndex(currentPageIndex + 1);
//     } else if (distance < -swipeThreshold && currentPageIndex > 0) {
//       setCurrentPageIndex(currentPageIndex - 1);
//     }

//     setTouchStartX(null);
//     setTouchEndX(null);
//   };

//   return (
//     <div className="relative w-full h-[calc(100vh-60px)] flex flex-col items-center bg-gray-100 overflow-auto">
//       {loading && (
//         <div className="absolute inset-0 flex justify-center items-center bg-white z-50">
//           <div className="text-xl font-semibold text-gray-600 animate-pulse">
//             ⏳ Loading PDF...
//           </div>
//         </div>
//       )}

//       {fileType === "pdf" ? (
//         isDesktop || isMobileLandscape ? (
//           <HTMLFlipBook
//             width={flipbookWidth}
//             height={flipbookHeight * 2.5}
//             ref={flipBookRef}
//             onFlip={handlePageFlip}
//             className="shadow-lg"
//           >
//             {pages.map((src, i) => (
//               <div
//                 key={i}
//                 className="w-full h-full flex justify-center items-center bg-white p-2 overflow-hidden"
//               >
//                 <img
//                   src={src}
//                   alt={`Page ${i + 1}`}
//                   className="w-full h-full object-contain"
//                 />
//               </div>
//             ))}
//           </HTMLFlipBook>
//         ) : (
//           <div
//             className="w-full h-full flex items-center justify-center relative bg-white"
//             onTouchStart={(e) => setTouchStartX(e.touches[0].clientX)}
//             onTouchMove={(e) => setTouchEndX(e.touches[0].clientX)}
//             onTouchEnd={handleSwipe}
//           >
//             {pages.length > 0 && (
//               <img
//                 src={pages[currentPageIndex]}
//                 alt={`Page ${currentPageIndex + 1}`}
//                 className="w-full max-h-full object-contain"
//               />
//             )}
//             <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white bg-black/50 px-3 py-1 rounded-full">
//               Page {currentPageIndex + 1} / {pages.length}
//             </div>
//           </div>
//         )
//       ) : (
//         <p>Unsupported file format</p>
//       )}
//     </div>
//   );
// }





// import { useEffect, useState, useRef } from "react";
// import { useParams } from "react-router-dom";
// import HTMLFlipBook from "react-pageflip";
// import * as pdfjsLib from "pdfjs-dist";
// import { useMemo } from "react";
// pdfjsLib.GlobalWorkerOptions.workerSrc =
//   "https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js";

// export default function FlipbookPDF({ bookId: propBookId, chapter }) {
//   const { bookId: paramBookId } = useParams();
//   const bookId = propBookId || paramBookId;

//   const [bookUrl, setBookUrl] = useState(null);
//   const [fileType, setFileType] = useState(null);
//   const [pdf, setPdf] = useState(null);
//   const [pagesLoaded, setPagesLoaded] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [flipbookWidth, setFlipbookWidth] = useState(800);
//   const [flipbookHeight, setFlipbookHeight] = useState(700);
//   const [currentPageIndex, setCurrentPageIndex] = useState(0);

//   const flipBookRef = useRef();
//   const startTimeRef = useRef(Date.now());

//   // ✅ Set chapter and URL

// const chapterUrl = useMemo(() => {
//   if (!chapter) return null;
//   let url = chapter.proxyUrl || chapter.fileUrl;
//   if (url.includes("/s/") && !url.endsWith("/download")) {
//     url = url.replace(/\/+$/, "") + "/download";
//   }
//   return url;
// }, [chapter?.proxyUrl, chapter?.fileUrl]);

// useEffect(() => {
//   if (!chapterUrl) return;
//   setBookUrl(chapterUrl);
//   setFileType(chapter.resourceType || "pdf");
//   setPagesLoaded({});
//   setCurrentPageIndex(0);
//   setPdf(null);
//   setLoading(true);
// }, [chapterUrl, chapter?.resourceType]);

//   // 📖 Load PDF
//   useEffect(() => {
//     if (!bookUrl || fileType !== "pdf") return;

//     const loadPdf = async () => {
//       try {
//         const loadingTask = pdfjsLib.getDocument(bookUrl);
//         const loadedPdf = await loadingTask.promise;
//         setPdf(loadedPdf);
//         setLoading(false);

//         // Render first page immediately
//         renderPage(0, loadedPdf);
//       } catch (err) {
//         console.error("❌ PDF load error:", err);
//       }
//     };

//     loadPdf();
//   }, [bookUrl, fileType]);

//   // Render single page
//   const renderPage = async (pageIndex, pdfDoc = pdf) => {
//     if (!pdfDoc || pagesLoaded[pageIndex]) return;

//     const page = await pdfDoc.getPage(pageIndex + 1);
//     const viewport = page.getViewport({ scale: 1.2 });

//     const canvas = document.createElement("canvas");
//     const context = canvas.getContext("2d");
//     canvas.width = viewport.width;
//     canvas.height = viewport.height;

//     await page.render({ canvasContext: context, viewport }).promise;

//     setPagesLoaded((prev) => ({
//       ...prev,
//       [pageIndex]: canvas.toDataURL(),
//     }));
//   };

//   // Lazy load neighboring pages
//   useEffect(() => {
//     if (!pdf) return;
//     renderPage(currentPageIndex);
//     renderPage(currentPageIndex + 1);
//     renderPage(currentPageIndex - 1);
//   }, [currentPageIndex, pdf]);

//   // Resize
//   useEffect(() => {
//     const handleResize = () => {
//       setFlipbookWidth(window.innerWidth);
//       setFlipbookHeight(window.innerHeight * 0.9);
//     };
//     handleResize();
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   // Keyboard navigation
//   const isDesktop = window.innerWidth > 1024;
//   const isMobileLandscape =
//     window.innerWidth > window.innerHeight && window.innerWidth <= 1024;

//   useEffect(() => {
//     if (!(isDesktop || isMobileLandscape)) return;

//     const handleKeyDown = (e) => {
//       if (!flipBookRef.current) return;
//       if (e.key === "ArrowRight") flipBookRef.current.pageFlip().flipNext();
//       if (e.key === "ArrowLeft") flipBookRef.current.pageFlip().flipPrev();
//     };

//     window.addEventListener("keydown", handleKeyDown);
//     return () => window.removeEventListener("keydown", handleKeyDown);
//   }, [isDesktop, isMobileLandscape]);

//   // Page flip tracker
//   const handlePageFlip = (e) => {
//     const pageIndex = e.data;
//     setCurrentPageIndex(pageIndex);
//   };

//   return (
//     <div className="relative w-full h-[calc(100vh-60px)] flex flex-col items-center bg-gray-100 overflow-auto">
//       {loading && (
//         <div className="absolute inset-0 flex justify-center items-center bg-white z-50">
//           <div className="text-xl font-semibold text-gray-600 animate-pulse">
//             ⏳ Loading PDF...
//           </div>
//         </div>
//       )}

//       {fileType === "pdf" ? (
//         isDesktop || isMobileLandscape ? (
//           <HTMLFlipBook
//             width={flipbookWidth}
//             height={flipbookHeight * 2}
//             ref={flipBookRef}
//             onFlip={handlePageFlip}
//             className="shadow-lg"
//             showCover
//             mobileScrollSupport
//           >
//             {Array.from({ length: pdf?.numPages || 1 }).map((_, i) => (
//               <div
//                 key={i}
//                 className="w-full h-full flex justify-center items-center bg-white p-2 overflow-hidden"
//               >
//                 {pagesLoaded[i] ? (
//                   <img
//                     src={pagesLoaded[i]}
//                     alt={`Page ${i + 1}`}
//                     className="w-full h-full object-contain"
//                   />
//                 ) : (
//                   <div className="flex justify-center items-center w-full h-full text-gray-400">
//                     Loading page...
//                   </div>
//                 )}
//               </div>
//             ))}
//           </HTMLFlipBook>
//         ) : (
//           <div className="w-full h-full flex justify-center items-center overflow-hidden bg-white">
//             {pagesLoaded[currentPageIndex] ? (
//               <img
//                 src={pagesLoaded[currentPageIndex]}
//                 alt={`Page ${currentPageIndex + 1}`}
//                 className="w-full max-h-full object-contain"
//               />
//             ) : (
//               <div className="text-gray-500">Loading page...</div>
//             )}
//           </div>
//         )
//       ) : (
//         <p>Unsupported file format</p>
//       )}
//     </div>
//   );
// }





//deplyed code

// import { useEffect, useState, useRef, useMemo } from "react";
// import { useParams } from "react-router-dom";
// import HTMLFlipBook from "react-pageflip";
// import * as pdfjsLib from "pdfjs-dist";

// pdfjsLib.GlobalWorkerOptions.workerSrc =
//   "https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js";

// export default function FlipbookPDF({ bookId: propBookId, chapter }) {
//   const { bookId: paramBookId } = useParams();
//   const bookId = propBookId || paramBookId;

//   const [bookUrl, setBookUrl] = useState(null);
//   const [fileType, setFileType] = useState(null);
//   const [pages, setPages] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [flipbookWidth, setFlipbookWidth] = useState(800);
//   const [flipbookHeight, setFlipbookHeight] = useState(700);
//   const [selectedChapter, setSelectedChapter] = useState(null);
//   const [currentPageIndex, setCurrentPageIndex] = useState(0);
//   const [touchStartX, setTouchStartX] = useState(null);
//   const [touchEndX, setTouchEndX] = useState(null);

//   const flipBookRef = useRef();
//   const startTimeRef = useRef(Date.now());

//   // ✅ Compute correct PDF URL with /download for Nextcloud
//   const chapterUrl = useMemo(() => {
//     if (!chapter) return null;
//     let url = chapter.proxyUrl || chapter.fileUrl;
//     if (url.includes("/s/") && !url.endsWith("/download")) {
//       url = url.replace(/\/+$/, "") + "/download";
//     }
//     return url;
//   }, [chapter?.proxyUrl, chapter?.fileUrl]);

//   // Set chapter URL and fileType
//   useEffect(() => {
//     if (!chapterUrl) return;
//     setBookUrl(chapterUrl);
//     setFileType(chapter.resourceType || "pdf");
//     setPages([]);
//     setCurrentPageIndex(0);
//     setLoading(true);
//   }, [chapterUrl, chapter?.resourceType]);

//   // 📥 Fetch book chapters if chapter not provided
//   useEffect(() => {
//     if (!bookId || chapter) return;

//     const fetchBook = async () => {
//       try {
//         const res = await fetch(
//           `${import.meta.env.VITE_API_URL}/books/${bookId}/chapters`,
//           { credentials: "include" }
//         );
//         const data = await res.json();
//         if (data && data.length > 0) {
//           const firstChapter = data[0];
//           setSelectedChapter(firstChapter);
//           const pdfUrl = `${import.meta.env.VITE_API_URL}/books/proxy/chapters/${bookId}/chapter-${firstChapter.chapterNumber}.pdf`;
//           setBookUrl(pdfUrl);
//           setFileType("pdf");
//         }
//       } catch (error) {
//         console.error("❌ Failed to fetch chapters:", error);
//       }
//     };

//     fetchBook();
//   }, [bookId, chapter]);

//   // 📖 Incremental PDF loader
//   useEffect(() => {
//     if (!bookUrl || fileType !== "pdf") return;

//     const loadPdf = async () => {
//       setLoading(true);
//       setPages([]);
//       try {
//         const loadingTask = pdfjsLib.getDocument(bookUrl);
//         const pdf = await loadingTask.promise;

//         for (let i = 1; i <= pdf.numPages; i++) {
//           const page = await pdf.getPage(i);
//           const viewport = page.getViewport({ scale: 1.2 });

//           const canvas = document.createElement("canvas");
//           const context = canvas.getContext("2d");
//           canvas.width = viewport.width;
//           canvas.height = viewport.height;

//           await page.render({ canvasContext: context, viewport }).promise;
//           const imgData = canvas.toDataURL();
//           setPages((prev) => [...prev, imgData]);
//         }
//       } catch (error) {
//         console.error("❌ Error loading PDF:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadPdf();
//   }, [bookUrl, fileType]);

//   // 🔧 Handle responsive flipbook size
//   useEffect(() => {
//     const handleResize = () => {
//       setFlipbookWidth(window.innerWidth);
//       setFlipbookHeight(window.innerHeight * 2.2);
//     };
//     handleResize();
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   // ⌨️ Keyboard navigation
//   useEffect(() => {
//     const handleKeyDown = (e) => {
//       if (!flipBookRef.current) return;
//       if (e.key === "ArrowRight") flipBookRef.current.pageFlip().flipNext();
//       else if (e.key === "ArrowLeft") flipBookRef.current.pageFlip().flipPrev();
//     };
//     window.addEventListener("keydown", handleKeyDown);
//     return () => window.removeEventListener("keydown", handleKeyDown);
//   }, []);

//   // 📊 Track page flips
//   // const handlePageFlip = (e) => {
//   //   if (!selectedChapter) return;
//   //   const pageIndex = e.data;
//   //   const role = localStorage.getItem("role");
//   //   if (role !== "student") return;

//   //   const currentPage = pageIndex + 1;
//   //   const payload = {
//   //     bookId: parseInt(bookId),
//   //     chapterId: selectedChapter.id,
//   //     timeSpent: Math.floor((Date.now() - startTimeRef.current) / 1000),
//   //     resourceType: fileType?.toUpperCase(),
//   //     pageNumber: currentPage,
//   //     isCompleted: currentPage === pages.length,
//   //   };

//   //   fetch(`${import.meta.env.VITE_API_URL}/students/activity`, {
//   //     method: "POST",
//   //     credentials: "include",
//   //     headers: { "Content-Type": "application/json" },
//   //     body: JSON.stringify(payload),
//   //   })
//   //     .then((res) => res.json())
//   //     .then((data) => console.log("✅ Activity logged:", data))
//   //     .catch((err) => console.error("❌ Failed to log activity:", err));
//   // };
// const handlePageFlip = (e) => {
//   const pageIndex = e.data;
//   setCurrentPageIndex(pageIndex);

//   const chapterData = chapter || selectedChapter;
//   if (!chapterData) return;

//   const role = localStorage.getItem("role");
//   if (role !== "student") return;

//   const currentPage = pageIndex + 1;
//   const payload = {
//     bookId: parseInt(bookId),
//     chapterId: chapterData.id,
//     timeSpent: Math.floor((Date.now() - startTimeRef.current) / 1000),
//     resourceType: fileType?.toUpperCase(),
//     pageNumber: currentPage,
//     isCompleted: currentPage === pages.length,
//   };

//   fetch(`${import.meta.env.VITE_API_URL}/students/activity`, {
//     method: "POST",
//     credentials: "include",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(payload),
//   })
//     .then((res) => res.json())
//     .then((data) => console.log("✅ Activity logged:", data))
//     .catch((err) => console.error("❌ Failed to log activity:", err));
// };

//   // 📱 Swipe navigation
//   const handleSwipe = () => {
//     if (touchStartX === null || touchEndX === null) return;
//     const distance = touchStartX - touchEndX;
//     const swipeThreshold = 50;

//     if (distance > swipeThreshold && currentPageIndex < pages.length - 1)
//       setCurrentPageIndex(currentPageIndex + 1);
//     else if (distance < -swipeThreshold && currentPageIndex > 0)
//       setCurrentPageIndex(currentPageIndex - 1);

//     setTouchStartX(null);
//     setTouchEndX(null);
//   };

//   return (
//     <div className="relative w-full h-[calc(100vh-60px)] flex flex-col items-center bg-gray-100 overflow-auto">
//       {loading && (
//         <div className="absolute inset-0 flex justify-center items-center bg-white z-50">
//           <div className="text-xl font-semibold text-gray-600 animate-pulse">
//             ⏳ Loading PDF...
//           </div>
//         </div>
//       )}

//       {fileType === "pdf" ? (
//         <HTMLFlipBook
//           width={flipbookWidth}
//           height={flipbookHeight}
//           size="stretch"
//           minWidth={300}
//           maxWidth={1000}
//           minHeight={400}
//           maxHeight={1500}
//           maxShadowOpacity={0.5}
//           showCover={true}
//           mobileScrollSupport={true}
//           ref={flipBookRef}
//           className="shadow-lg flipbook-container"
//           flippingTime={600}
//           drawShadow={true}
//           onFlip={handlePageFlip}
//         >
//           {pages.map((src, index) => (
//             <div
//               key={index}
//               className="w-full h-full flex justify-center items-center bg-white p-2 overflow-hidden"
//             >
//               <img
//                 src={src}
//                 alt={`Page ${index + 1}`}
//                 style={{ width: "100%", height: "100%", objectFit: "contain" }}
//               />
//             </div>
//           ))}
//         </HTMLFlipBook>
//       ) : (
//         <p>Unsupported file format</p>
//       )}
//     </div>
//   );
// }






// import { useEffect, useState, useRef, useMemo } from "react";
// import { useParams } from "react-router-dom";
// import HTMLFlipBook from "react-pageflip";
// import * as pdfjsLib from "pdfjs-dist";

// pdfjsLib.GlobalWorkerOptions.workerSrc =
//   "https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js";

// export default function FlipbookPDF({ bookId: propBookId, chapter, page, setPage }) {
//   const { bookId: paramBookId } = useParams();
//   const bookId = propBookId || paramBookId;

//   const [bookUrl, setBookUrl] = useState(null);
//   const [fileType, setFileType] = useState(null);
//   const [pages, setPages] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [flipbookWidth, setFlipbookWidth] = useState(800);
//   const [flipbookHeight, setFlipbookHeight] = useState(700);

//   const flipBookRef = useRef();

//   // ✅ Resolve chapter URL safely:
//   //  - Prefer proxyUrl (no tampering)
//   //  - Else use fileUrl or chapter.file
//   //  - Only add "/download" for direct Nextcloud public links (NOT proxy)
//   const chapterUrl = useMemo(() => {
//     if (!chapter) return null;

//     const raw =
//       chapter.proxyUrl ||
//       chapter.fileUrl ||
//       chapter.file ||
//       "";

//     if (!raw) return null;
//     if (raw.includes("/books/proxy/")) return raw;
//     try {
//       const u = new URL(raw);
//       const isNextcloudShare =
//         u.hostname.includes("cloud.ptgn.in") &&
//         u.pathname.includes("/index.php/s/");
//       if (isNextcloudShare && !u.pathname.endsWith("/download")) {
//         u.pathname = u.pathname.replace(/\/+$/, "") + "/download";
//         return u.toString();
//       }
//       return raw;
//     } catch {
//       return raw;
//     }
//   }, [chapter]);

//   useEffect(() => {
//     if (!chapterUrl) return;

//     setBookUrl(chapterUrl);

//     let type = "other";
//     const explicit =
//       (chapter?.resourceType || chapter?.type || "").toString().toLowerCase();

//     if (explicit) {
//       type = explicit;
//     } else {
//       const lower = chapterUrl.toLowerCase();
//       if (lower.endsWith(".pdf")) type = "pdf";
//       else if (lower.endsWith(".mp3") || lower.endsWith(".wav")) type = "audio";
//       else if (lower.endsWith(".mp4") || lower.endsWith(".webm")) type = "video";
//     }

//     setFileType(type);
//     setPages([]);
//     setLoading(true);
//   }, [chapterUrl, chapter?.resourceType, chapter?.type]);
//   useEffect(() => {
//     if (!bookUrl || fileType !== "pdf") {
//       setLoading(false);
//       return;
//     }

//     const loadPdf = async () => {
//       setLoading(true);
//       setPages([]);
//       try {
//         const loadingTask = pdfjsLib.getDocument(bookUrl);
//         const pdf = await loadingTask.promise;

//         for (let i = 1; i <= pdf.numPages; i++) {
//           const page = await pdf.getPage(i);
//           const viewport = page.getViewport({ scale: 1.2 });

//           const canvas = document.createElement("canvas");
//           const context = canvas.getContext("2d");
//           canvas.width = viewport.width;
//           canvas.height = viewport.height;

//           await page.render({ canvasContext: context, viewport }).promise;
//           const imgData = canvas.toDataURL();
//           setPages((prev) => [...prev, imgData]);
//         }
//       } catch (error) {
//         console.error("❌ Error loading PDF:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadPdf();
//   }, [bookUrl, fileType]);
//   useEffect(() => {
//     const handleResize = () => {
//       setFlipbookWidth(window.innerWidth);
//       setFlipbookHeight(window.innerHeight * 2.2);
//     };
//     handleResize();
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   return (
//     <div className="relative w-full h-[calc(100vh-60px)] flex flex-col items-center bg-gray-100 overflow-auto">
//       {loading && (
//         <div className="absolute inset-0 flex justify-center items-center bg-white z-50">
//           <div className="text-xl font-semibold text-gray-600 animate-pulse">
//             ⏳ Loading File...
//           </div>
//         </div>
//       )}

//       {fileType === "pdf" ? (
//         <HTMLFlipBook
//           width={flipbookWidth}
//           height={flipbookHeight}
//           size="stretch"
//           minWidth={300}
//           maxWidth={1000}
//           minHeight={400}
//           maxHeight={1500}
//           showCover={true}
//           mobileScrollSupport={true}
//           ref={flipBookRef}
//              onFlip={(e) => setPage?.(e.data + 1)} 
//           className="shadow-lg flipbook-container"
//         >
//           {pages.map((src, index) => (
//             <div
//               key={index}
//               className="w-full h-full flex justify-center items-center bg-white p-2 overflow-hidden"
//             >
//               <img
//                 src={src}
//                 alt={`Page ${index + 1}`}
//                 style={{ width: "100%", height: "100%", objectFit: "contain" }}
//               />
//             </div>
//           ))}
//         </HTMLFlipBook>
//       ) : fileType === "audio" ? (
//         <audio controls className="mt-10 w-2/3">
//           <source src={bookUrl} type="audio/mpeg" />
//           Your browser does not support audio playback.
//         </audio>
//       ) : fileType === "video" ? (
//         <video controls className="mt-10 w-2/3">
//           <source src={bookUrl} type="video/mp4" />
//           Your browser does not support video playback.
//         </video>
//       ) : (
//         <p className="mt-10 text-gray-600">⚠ Unsupported file format</p>
//       )}
//     </div>
//   );
// }





// PDFVIewer

// import { useEffect, useState, useRef, useMemo } from "react";
// import { useParams } from "react-router-dom";
// import HTMLFlipBook from "react-pageflip";

// import * as pdfjsLib from "pdfjs-dist";
// import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

// pdfjsLib.GlobalWorkerOptions.workerSrc =
//   "https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js";

// export default function FlipbookPDFViewer({
//   bookId: propBookId,
//   chapter,
//   page,
//   setPage,
//   setTotalPages,
//   isFullscreen,
// }) {
//   const { bookId: paramBookId } = useParams();
//   const bookId = propBookId || paramBookId;

//   const [bookUrl, setBookUrl] = useState(null);
//   const [fileType, setFileType] = useState(null);
//   const [pages, setPages] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [pageSize, setPageSize] = useState({ width: 800, height: 1000 });
//   const [pdfDoc, setPdfDoc] = useState(null);
//   const [isMobile, setIsMobile] = useState(false);

//   const flipBookRef = useRef();

//   // Device check
//   useEffect(() => {
//     const checkDevice = () => setIsMobile(window.innerWidth < 1024);
//     checkDevice();
//     window.addEventListener("resize", checkDevice);
//     return () => window.removeEventListener("resize", checkDevice);
//   }, []);

//   // Resolve chapter URL
//   const chapterUrl = useMemo(() => {
//     if (!chapter) return null;
//     const raw = chapter.file || chapter.proxyUrl || chapter.fileUrl || "";
//     if (!raw) return null;

//     if (raw.includes("/books/proxy/")) return raw;

//     try {
//       const u = new URL(raw);
//       const isNextcloudShare =
//         u.hostname.includes("cloud.ptgn.in") && u.pathname.includes("/index.php/s/");
//       if (isNextcloudShare && !u.pathname.endsWith("/download")) {
//         u.pathname = u.pathname.replace(/\/+$/, "") + "/download";
//         return u.toString();
//       }
//       return raw;
//     } catch {
//       return raw;
//     }
//   }, [chapter]);

//   // Detect file type
//   useEffect(() => {
//     if (!chapterUrl) return;
//     setBookUrl(chapterUrl);

//     let type = "other";
//     const explicit = (chapter?.resourceType || chapter?.type || "").toString().toLowerCase();
//     if (explicit) type = explicit;
//     else {
//       const lower = chapterUrl.toLowerCase();
//       if (lower.endsWith(".pdf")) type = "pdf";
//       else if (lower.endsWith(".mp3") || lower.endsWith(".wav")) type = "audio";
//       else if (lower.endsWith(".mp4") || lower.endsWith(".webm")) type = "video";
//     }

//     setFileType(type);
//     setPages([]);
//     setPdfDoc(null);
//     setLoading(true);
//   }, [chapterUrl, chapter?.resourceType, chapter?.type]);

//   // Load PDF document (but not all pages)
//   useEffect(() => {
//     if (!bookUrl || fileType !== "pdf") {
//       setLoading(false);
//       return;
//     }

//     let cancelled = false;
//     const loadPdfDoc = async () => {
//       setLoading(true);
//       try {
//         const loadingTask = pdfjsLib.getDocument(bookUrl);
//         const pdf = await loadingTask.promise;
//         if (cancelled) return;

//         setPdfDoc(pdf);
//         setTotalPages?.(pdf.numPages);

//         // Lazy loading: initialize first page as null array
//         const emptyPages = Array(pdf.numPages).fill(null);
//         setPages(emptyPages);

//         // Load first page immediately
//         await loadPage(0, pdf);
//       } catch (err) {
//         console.error("Error loading PDF:", err);
//       } finally {
//         if (!cancelled) setLoading(false);
//       }
//     };

//     loadPdfDoc();
//     return () => (cancelled = true);
//   }, [bookUrl, fileType]);

//   // Function to load a single page
//   const loadPage = async (pageIndex, pdf = pdfDoc) => {
//     if (!pdf || pages[pageIndex]) return; // already loaded
//     try {
//       const pageObj = await pdf.getPage(pageIndex + 1);
//       const viewport = pageObj.getViewport({ scale: 1.5 });
//       const canvas = document.createElement("canvas");
//       const context = canvas.getContext("2d");
//       canvas.width = viewport.width;
//       canvas.height = viewport.height;
//       await pageObj.render({ canvasContext: context, viewport }).promise;

//       if (pageIndex === 0) setPageSize({ width: viewport.width, height: viewport.height });

//       setPages((prev) => {
//         const newPages = [...prev];
//         newPages[pageIndex] = canvas.toDataURL();
//         return newPages;
//       });
//     } catch (err) {
//       console.error("Error loading page", pageIndex + 1, err);
//     }
//   };

//   // Keyboard navigation
//   useEffect(() => {
//     const handleKeyDown = (e) => {
//       if (!flipBookRef.current) return;
//       const pageFlip = flipBookRef.current.pageFlip();
//       if (e.key === "ArrowRight") pageFlip.flipNext();
//       else if (e.key === "ArrowLeft") pageFlip.flipPrev();
//     };
//     window.addEventListener("keydown", handleKeyDown);
//     return () => window.removeEventListener("keydown", handleKeyDown);
//   }, []);

//   useEffect(() => {
//     console.log("pages loaded:", pages.filter(Boolean).length, "total:", pages.length);
//   }, [pages]);

//   const handlePrev = () => flipBookRef.current?.pageFlip().flipPrev();
//   const handleNext = () => flipBookRef.current?.pageFlip().flipNext();

//   const isSinglePage = isMobile;
//   const initialPageRef = useRef(page ? page - 1 : 0);

//   // Flip event to lazy load next/prev pages
//   // const handleFlip = async (e) => {
//   //   const index = e.data;
//   //   setPage?.(index + 1);
//   //   // Load current + adjacent pages
//   //   await loadPage(index);
//   //   if (index + 1 < pages.length) loadPage(index + 1);
//   //   if (index - 1 >= 0) loadPage(index - 1);
//   // };
// // Flip event to lazy load next/prev pages + log activity
// const handleFlip = async (e) => {
//   const index = e.data;
//   const currentPage = index + 1;

//   setPage?.(currentPage);

//   // Lazy load pages
//   await loadPage(index);
//   if (index + 1 < pages.length) loadPage(index + 1);
//   if (index - 1 >= 0) loadPage(index - 1);

//   // ✅ Student activity API call
//   try {
//     const role = localStorage.getItem("role");
//     if (role === "student" && chapter?.id) {
//       const payload = {
//         bookId: parseInt(bookId),
//         chapterId: chapter.id,
//         timeSpent: 0, // optional: add timer if needed
//         resourceType: fileType?.toUpperCase(),
//         pageNumber: currentPage,
//         isCompleted: currentPage === pages.length,
//       };

//       await fetch(`${import.meta.env.VITE_API_URL}/students/activity`, {
//         method: "POST",
//         credentials: "include",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       console.log("✅ Activity logged:", payload);
//     }
//   } catch (err) {
//     console.error("❌ Failed to log activity:", err);
//   }
// };

//   return (
//     <div className="relative w-full h-full flex flex-col items-center bg-gray-100 overflow-auto">
//       {loading && pages.filter(Boolean).length === 0 && (
//         <div className="absolute inset-0 flex justify-center items-center bg-white z-50">
//           <div className="text-xl font-semibold text-gray-600 animate-pulse">
//             ⏳ Loading File...
//           </div>
//         </div>
//       )}

//       {fileType === "pdf" && pages.length > 0 ? (
//         <div className="relative flex items-center justify-center w-full h-full">
//           <HTMLFlipBook
//             width={isFullscreen ? pageSize.width : isMobile ? pageSize.width : pageSize.width * 0.9}
//             height={isFullscreen ? pageSize.height : isMobile ? pageSize.height : pageSize.height * 0.9}
//             size="stretch"
//             minWidth={200}
//             maxWidth={3000}
//             minHeight={300}
//             maxHeight={4000}
//             showCover={!isMobile}
//             mobileScrollSupport={true}
//             useMouseEvents={!isMobile}
//             ref={flipBookRef}
//             onFlip={handleFlip}
//             className="shadow-lg flipbook-container"
//             singlePage={isSinglePage}
//             usePortrait={isSinglePage}
//             startPage={initialPageRef.current}
//             drawShadow={!isMobile}
//             maxShadowOpacity={0.3}
//           >
//             {pages.map((src, index) => (
//               <div
//                 key={index}
//                 className="w-full h-full flex justify-center items-center bg-white p-0 overflow-hidden"
//               >
//                 {src ? (
//                   <img
//                     src={src}
//                     alt={`Page ${index + 1}`}
//                     style={{ width: "100%", height: "100%", objectFit: "contain" }}
//                   />
//                 ) : (
//                   <div className="flex justify-center items-center w-full h-full">
//                     <div className="text-gray-400 animate-pulse">⏳ Loading...</div>
//                   </div>
//                 )}
//               </div>
//             ))}
//           </HTMLFlipBook>

//           {/* Navigation Buttons */}
//           <button
//             onClick={handlePrev}
//             className="absolute left-0 top-1/2 -translate-y-1/2 p-3 rounded-full bg-transparent hover:bg-black/20 transition"
//           >
//             <FiChevronLeft className="w-8 h-8 text-gray-800 dark:text-gray-200" />
//           </button>
//           <button
//             onClick={handleNext}
//             className="absolute right-0 top-1/2 -translate-y-1/2 p-3 rounded-full bg-transparent hover:bg-black/20 transition"
//           >
//             <FiChevronRight className="w-8 h-8 text-gray-800 dark:text-gray-200" />
//           </button>
//         </div>
//       ) : fileType === "audio" ? (
//         <audio controls className="mt-10 w-2/3">
//           <source src={bookUrl} type="audio/mpeg" />
//         </audio>
//       ) : fileType === "video" ? (
//         <video controls className="mt-10 w-2/3">
//           <source src={bookUrl} type="video/mp4" />
//         </video>
//       ) : (
//         <p className="mt-10 text-gray-600">⚠ Unsupported file format</p>
//       )}
//     </div>
//   );
// }





//updaed code

import { useEffect, useState, useRef, useMemo } from "react";
import { useParams } from "react-router-dom";
import HTMLFlipBook from "react-pageflip";
import * as pdfjsLib from "pdfjs-dist";
import {
  FiChevronLeft,
  FiChevronRight,
  FiZoomIn,
  FiZoomOut,
} from "react-icons/fi";
import { FaBookOpen, FaFilePdf } from "react-icons/fa";

pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js";

export default function FlipbookPDFViewer({
  bookId: propBookId,
  chapter,
  page,
  setPage,
  setTotalPages,
  isFullscreen,
}) {
  const { bookId: paramBookId } = useParams();
  const bookId = propBookId || paramBookId;

  const [bookUrl, setBookUrl] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageSize, setPageSize] = useState({ width: 800, height: 1000 });

  const [isPortrait, setIsPortrait] = useState(true);
  const [viewMode, setViewMode] = useState("flipbook"); 

  const [pdfZoom, setPdfZoom] = useState(1.0);
  const [flipbookZoom, setFlipbookZoom] = useState(1.8);

  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);

  const flipBookRef = useRef();
  const scrollContainerRef = useRef();

  // ✅ Orientation
  useEffect(() => {
    const checkOrientation = () => {
      setIsPortrait(window.innerHeight >= window.innerWidth);
    };
    checkOrientation();
    window.addEventListener("resize", checkOrientation);
    return () => window.removeEventListener("resize", checkOrientation);
  }, []);

  // ✅ Chapter URL resolver
  const chapterUrl = useMemo(() => {
    if (!chapter) return null;
    // const raw = chapter.proxyUrl || chapter.fileUrl || chapter.file || "";
    const raw = chapter.proxyUrl || "";

    if (!raw) return null;
    if (raw.includes("/books/proxy/")) return raw;
    try {
      const u = new URL(raw);
      const isNextcloudShare =
        u.hostname.includes("cloud.ptgn.in") &&
        u.pathname.includes("/index.php/s/");
      if (isNextcloudShare && !u.pathname.endsWith("/download")) {
        u.pathname = u.pathname.replace(/\/+$/, "") + "/download";
        return u.toString();
      }
      return raw;
    } catch {
      return raw;
    }
  }, [chapter]);

  // ✅ Detect file type
  useEffect(() => {
    if (!chapterUrl) return;
    setBookUrl(chapterUrl);

    let type = "other";
    const explicit = (
      chapter?.resourceType || chapter?.type || ""
    ).toString().toLowerCase();
    if (explicit) type = explicit;
    else {
      const lower = chapterUrl.toLowerCase();
      if (lower.endsWith(".pdf")) type = "pdf";
      else if (lower.endsWith(".mp3") || lower.endsWith(".wav")) type = "audio";
      else if (lower.endsWith(".mp4") || lower.endsWith(".webm"))
        type = "video";
    }

    setFileType(type);
    setPages([]);
    setLoading(true);
    setPdfZoom(1.0);
    setFlipbookZoom(1.8);
    setCurrentPage(1);
  }, [chapterUrl, chapter?.resourceType, chapter?.type]);

  // ✅ Load PDF pages
  useEffect(() => {
    if (!bookUrl || fileType !== "pdf") {
      setLoading(false);
      return;
    }

    let cancelled = false;
    const loadPdf = async () => {
      setLoading(true);
      try {
        const loadingTask = pdfjsLib.getDocument(bookUrl);
        const pdf = await loadingTask.promise;

        setTotalPages?.(pdf.numPages);
        setTotal(pdf.numPages);

        const pageImages = [];
        for (let i = 1; i <= pdf.numPages; i++) {
          if (cancelled) break;
          const pageObj = await pdf.getPage(i);
          const viewport = pageObj.getViewport({ scale: 1.5 });
          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          await pageObj.render({ canvasContext: context, viewport }).promise;

          if (i === 1) {
            setPageSize({ width: viewport.width, height: viewport.height });
          }
          pageImages.push(canvas.toDataURL());
        }

        if (!cancelled) setPages(pageImages);
      } catch (err) {
        console.error("Error loading PDF:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    loadPdf();
    return () => (cancelled = true);
  }, [bookUrl, fileType]);

  // ✅ Flipbook Keyboard nav
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!flipBookRef.current || !isFullscreen) return;
      const pageFlip = flipBookRef.current.pageFlip();
      if (e.key === "ArrowRight") pageFlip.flipNext();
      else if (e.key === "ArrowLeft") pageFlip.flipPrev();
      else if (e.key === "+") setFlipbookZoom((z) => Math.min(z + 0.2, 3));
      else if (e.key === "-") setFlipbookZoom((z) => Math.max(z - 0.2, 0.5));
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreen]);

  // ✅ Scroll Mode Page Counter
  useEffect(() => {
    if (viewMode !== "scroll" || !scrollContainerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          const index = parseInt(visible[0].target.dataset.index, 10);
          setCurrentPage(index + 1);
          setPage?.(index + 1);
        }
      },
      { root: scrollContainerRef.current, threshold: 0.6 }
    );

    const imgs = scrollContainerRef.current.querySelectorAll("img[data-index]");
    imgs.forEach((img) => observer.observe(img));

    return () => observer.disconnect();
  }, [viewMode, pages]);

  const handlePrev = () => flipBookRef.current?.pageFlip().flipPrev();
  const handleNext = () => flipBookRef.current?.pageFlip().flipNext();

  const isSmallScreen = window.innerWidth <= 1024;
  const isSinglePage = isPortrait || isFullscreen || isSmallScreen;

  return (
    <div className="relative w-full h-full flex flex-col items-center bg-gray-100 overflow-hidden">
      {/* Loading */}
      {loading && (
        <div className="absolute inset-0 flex justify-center items-center bg-white z-50">
          <div className="text-xl font-semibold text-gray-600 animate-pulse">
            ⏳ Loading File...
          </div>
        </div>
      )}

      {/* Top Controls + Page Counter */}
      {fileType === "pdf" && pages.length > 0 && (
        <div
          className={`absolute top-2 left-1/2 -translate-x-1/2 flex gap-4 items-center z-50 ${
            isFullscreen ? "text-white" : "text-white"
          }`}
        >
          {/* Mode Switch */}
          <button
            onClick={() => setViewMode("flipbook")}
            className={`p-1 ${
              viewMode === "flipbook"
                ? "text-blue-500 "
                : "text-gray-700"
            }`}
            title="Flipbook View"
          >
            <FaBookOpen />
          </button>
          <button
            onClick={() => setViewMode("scroll")}
            className={`p-1 ${
              viewMode === "scroll"
                ? "text-blue-500 "
                : "text-gray-700"
            }`}
            title="Scrollable PDF"
          >
            <FaFilePdf />
          </button>

          {/* Zoom Controls */}
          {viewMode === "flipbook" ? (
            <>
              <button
                onClick={() => setFlipbookZoom((z) => Math.max(z - 0.2, 0.5))}
                className="p-1 text-gray-800"
                title="Zoom Out Flipbook"
              >
                <FiZoomOut />
              </button>
              <button
                onClick={() => setFlipbookZoom((z) => Math.min(z + 0.2, 3))}
                className="p-1 text-gray-800"
                title="Zoom In Flipbook"
              >
                <FiZoomIn />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setPdfZoom((z) => Math.max(z - 0.2, 0.5))}
                className="p-1 text-gray-800"
                title="Zoom Out PDF"
              >
                <FiZoomOut />
              </button>
              <button
                onClick={() => setPdfZoom((z) => Math.min(z + 0.2, 3))}
                className="p-1 text-gray-800"
                title="Zoom In PDF"
              >
                <FiZoomIn />
              </button>
            </>
          )}
        </div>
      )}

      {/* PDF Rendering */}
      {fileType === "pdf" && pages.length > 0 ? (
        viewMode === "flipbook" ? (
          // ✅ Flipbook
          <div className="relative flex items-center justify-center w-full h-full overflow-hidden">
            <div
              className="transition-transform duration-200 ease-in-out"
              style={{
                transform: `scale(${flipbookZoom})`,
                transformOrigin: "center",
              }}
            >
              <HTMLFlipBook
                width={pageSize.width}
                height={pageSize.height}
                size="stretch"
                minWidth={200}
                maxWidth={3000}
                minHeight={300}
                maxHeight={4000}
                showCover={!isSinglePage}
                mobileScrollSupport={true}
                useMouseEvents={!isSinglePage}
                ref={flipBookRef}
                onFlip={(e) => {
                  setCurrentPage(e.data + 1);
                  setPage?.(e.data + 1);
                }}
                className="shadow-lg flipbook-container"
                singlePage={isSinglePage}
                usePortrait={isSinglePage}
                startPage={page ? page - 1 : 0}
                drawShadow={!isSinglePage}
                maxShadowOpacity={0.3}
              >
                {pages.map((src, index) => (
                  <div
                    key={index}
                    className="w-full h-full flex justify-center items-center bg-white p-0 overflow-hidden"
                  >
                    <img
                      src={src}
                      alt={`Page ${index + 1}`}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                      }}
                    />
                  </div>
                ))}
              </HTMLFlipBook>
            </div>

            {/* Nav */}
            <button
              onClick={handlePrev}
              className="absolute left-0 top-1/2 -translate-y-1/2 p-3 rounded-full hover:bg-white/20"
            >
              <FiChevronLeft
                className={`w-8 h-8 ${
                  isFullscreen ? "text-white" : "text-gray-800"
                }`}
              />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 p-3 rounded-full hover:bg-white/20"
            >
              <FiChevronRight
                className={`w-8 h-8 ${
                  isFullscreen ? "text-white" : "text-gray-800"
                }`}
              />
            </button>
          </div>
        ) : (
          // ✅ Scrollable
          <div
            ref={scrollContainerRef}
            className="w-full h-full overflow-y-auto bg-gray-50 p-4 flex flex-col items-center gap-6"
          >
            {pages.map((src, index) => (
              <img
                key={index}
                data-index={index}
                src={src}
                alt={`Page ${index + 1}`}
                className="w-auto max-w-full object-contain shadow-lg rounded-lg transition-transform duration-200"
                style={{ transform: `scale(${pdfZoom})` }}
              />
            ))}
          </div>
        )
      ) : fileType === "audio" ? (
        <audio controls className="mt-10 w-2/3">
          <source src={bookUrl} type="audio/mpeg" />
        </audio>
      ) : fileType === "video" ? (
        <video controls className="mt-10 w-2/3">
          <source src={bookUrl} type="video/mp4" />
        </video>
      ) : (
        !loading && (
          <p className="mt-10 text-gray-600">⚠ Unsupported file format</p>
        )
      )}
      <div className="font-semibold text-gray-800">Pages:-
          <span className="font-semibold text-gray-800 ml-1">
            {currentPage} / {total}
          </span>
          </div>
    </div>
  );
}
