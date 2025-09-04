








// import { useState, useEffect, useRef } from "react";
// import { FiMenu, FiX } from "react-icons/fi";
// import { FaExpand, FaCompress } from "react-icons/fa";
// import FlipbookPDFViewer from "../../Components/FlipbookPDFViewer";
// import { useNavigate, useParams } from "react-router-dom";

// const API_URL = import.meta.env.VITE_API_URL;

// export default function ChaptersList() {
//   const [filter, setFilter] = useState("All");
//   const [selectedChapter, setSelectedChapter] = useState(null);
//   const [chapters, setChapters] = useState([]);
//   const [error, setError] = useState(null);
//   const { bookId } = useParams();
//   const [isFullscreen, setIsFullscreen] = useState(false);
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [viewMode, setViewMode] = useState("flip"); 
//   const viewerRef = useRef(null);
//   const navigate = useNavigate();

//   // Fetch chapters
//   useEffect(() => {
//     const fetchChapters = async () => {
//       try {
//         const res = await fetch(`${API_URL}/books/${bookId}/chapters/meta`, {
//           credentials: "include",
//         });
//         if (!res.ok) throw new Error("Failed to fetch chapters");
//         const data = await res.json();

//         const formatted = data.map((item) => {
//           const type = (item.resourceType || "pdf").toLowerCase();
//           let title = "";
//           if (type === "pdf") title = `Chapter ${item.chapterNumber}`;
//           else if (type === "video") title = `Video ${item.chapterNumber}`;
//           else if (type === "audio") title = `Audio ${item.chapterNumber}`;
//           else title = `Content ${item.chapterNumber}`;

//           return {
//             id: item.id,
//             chapterNumber: item.chapterNumber,
//             fileUrl: item.fileUrl,
//             proxyUrl: item.proxyUrl,
//             thumbnail: item.thumbnail,
//             thumbnailProxyUrl: item.thumbnailProxyUrl,
//             resourceType: type,
//             title,
//             file: item.proxyUrl || item.fileUrl,
//             typeUpper: type.toUpperCase(),
//           };
//         });

//         setChapters(formatted);
//         if (formatted.length > 0) setSelectedChapter(formatted[0]);
//       } catch (err) {
//         setError(err.message);
//       }
//     };

//     if (bookId) fetchChapters();
//   }, [bookId]);

//   const filtered =
//     filter === "All"
//       ? chapters
//       : chapters.filter((ch) => ch.typeUpper === filter);

//   const handleFullscreen = () => {
//     setIsFullscreen((prev) => !prev);
//   };

//   const getThumbSrc = (item) => {
//     if (item.thumbnailProxyUrl) return item.thumbnailProxyUrl;
//     if (item.thumbnail) {
//       return item.thumbnail.includes("/index.php/s/")
//         ? item.thumbnail + "/download"
//         : `${API_URL}/books/proxy/thumbnail?url=${encodeURIComponent(
//             item.thumbnail
//           )}`;
//     }
//     if (item.fileUrl) {
//       return `${API_URL}/books/proxy/thumbnail?url=${encodeURIComponent(
//         item.fileUrl
//       )}`;
//     }
//     return `data:image/svg+xml;utf8,${encodeURIComponent(
//       `<svg xmlns='http://www.w3.org/2000/svg' width='200' height='140'><rect width='100%' height='100%' fill='#e5e7eb'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='#9ca3af' font-family='Arial' font-size='14'>No Image</text></svg>`
//     )}`;
//   };

//   const handleImgError = (e, item) => {
//     const el = e.target;
//     if (el.dataset.tried === "1") return;
//     el.dataset.tried = "1";
//     if (item.thumbnail) {
//       el.src = item.thumbnail.includes("/index.php/s/")
//         ? item.thumbnail + "/download"
//         : `${API_URL}/books/proxy/thumbnail?url=${encodeURIComponent(
//             item.thumbnail
//           )}`;
//     } else if (item.fileUrl) {
//       el.src = `${API_URL}/books/proxy/thumbnail?url=${encodeURIComponent(
//         item.fileUrl
//       )}`;
//     }
//   };

//   return (
//     <div className="flex h-screen bg-[#fdf6f2] dark:bg-gray-900 transition-colors duration-300">
//       {/* Main Viewer */}
//       <div className="flex-1 flex flex-col relative">
//         {/* Back button */}
//         {!isFullscreen && (
//           <div className="absolute top-3 left-3 flex items-center gap-3 z-50">
//             <button
//               onClick={() => navigate(-1)}
//               className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 dark:text-white shadow hover:bg-gray-300 dark:hover:bg-gray-600 transition"
//             >
//               ⬅ Back
//             </button>
//           </div>
//         )}

//         {/* Mobile menu */}
//         {!isFullscreen && (
//           <div className="absolute top-3 right-3 flex items-center gap-2 z-40 lg:hidden">
//             <button
//               onClick={() => setIsSidebarOpen(true)}
//               className="p-2 rounded bg-gray-200 dark:bg-gray-700 dark:text-white shadow hover:bg-gray-300 dark:hover:bg-gray-600"
//             >
//               <FiMenu size={20} />
//             </button>
//           </div>
//         )}

//         {/* Viewer */}
//         {selectedChapter ? (
//           <div
//             ref={viewerRef}
//             className={`flex-1 flex justify-center items-center w-full h-full p-4 relative transition-all duration-300 ${
//               isFullscreen ? "fixed inset-0 z-50 bg-black p-2" : ""
//             }`}
//           >
//             {selectedChapter.resourceType === "pdf" && (
//               <>
//                 <div
//                   className={`flex-1 flex justify-center items-center w-full h-full bg-[#d2dcf3] dark:bg-gray-700 rounded-lg shadow-md relative transition-all duration-300 ${
//                     isFullscreen ? "w-full h-full p-0 bg-black" : "p-4"
//                   }`}
//                 >
//                   {/* Flipbook / Scrollable PDF */}
//                   <FlipbookPDFViewer
//                     chapter={selectedChapter}
//                     isFullscreen={isFullscreen}
//                     viewMode={viewMode} 
//                     className="w-full h-full"
//                   />

//                   {/* Fullscreen Toggle */}
//                   <button
//                     onClick={handleFullscreen}
//                     className={`absolute bottom-3 right-3 p-2 ${
//                       isFullscreen
//                         ? "hidden"
//                         : "bg-white dark:bg-gray-800 dark:text-gray-200 shadow rounded z-20"
//                     }`}
//                   >
//                     <FaExpand />
//                   </button>
//                 </div>

//                 {isFullscreen && (
//                   <button
//                     onClick={handleFullscreen}
//                     className="fixed bottom-4 right-4 p-3 rounded-full bg-gray-700 text-white hover:bg-gray-600 z-50 shadow-lg"
//                   >
//                     <FaCompress size={15} />
//                   </button>
//                 )}
//               </>
//             )}

//             {selectedChapter.resourceType === "video" && (
//               <video
//                 key={selectedChapter.id}
//                 controls
//                 className="w-full h-full object-contain"
//                 src={selectedChapter.file}
//               />
//             )}

//             {selectedChapter.resourceType === "audio" && (
//               <div className="flex flex-col items-center justify-center w-full h-full gap-4 text-white">
//                 <img
//                   src={
//                     selectedChapter.thumbnailProxyUrl ||
//                     selectedChapter.thumbnail
//                   }
//                   alt="Thumbnail"
//                   className="w-60 h-60 object-cover rounded-lg shadow-lg"
//                 />
//                 <audio key={selectedChapter.id} controls className="w-2/3">
//                   <source src={selectedChapter.file} type="audio/mpeg" />
//                 </audio>
//               </div>
//             )}
//           </div>
//         ) : error ? (
//           <p className="text-red-500">{error}</p>
//         ) : (
//           <p className="text-gray-700 dark:text-gray-200">Select a chapter</p>
//         )}
//       </div>

//       {/* Sidebar (Desktop & Mobile) */}
//       {!isFullscreen && (
//         <>
//           {/* Desktop Sidebar */}
//           <div className="hidden lg:flex w-[320px] bg-white dark:bg-gray-800 p-4 flex-col shadow-lg overflow-y-auto">
//             {/* Filter Tabs */}
//             <div className="flex justify-between mb-4">
//               {["All", "PDF", "VIDEO", "AUDIO"].map((tab) => (
//                 <button
//                   key={tab}
//                   onClick={() => setFilter(tab)}
//                   className={`px-3 py-1 rounded-lg text-sm font-medium ${
//                     filter === tab
//                       ? "bg-blue-500 text-white"
//                       : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200"
//                   }`}
//                 >
//                   {tab}
//                 </button>
//               ))}
//             </div>
//             {/* Chapter List */}
//             <div className="flex flex-col gap-3">
//               {filtered.length === 0 ? (
//                 <p className="text-gray-400 text-sm dark:text-gray-300">
//                   No {filter} content found
//                 </p>
//               ) : (
//                 filtered.map((item) => {
//                   const thumbSrc = getThumbSrc(item);
//                   return (
//                     <div
//                       key={item.id}
//                       onClick={() => {
//                         setSelectedChapter(item);
//                       }}
//                       className={`flex items-center w-[320px] h-[60px] rounded-lg shadow-sm cursor-pointer ${
//                         selectedChapter?.id === item.id
//                           ? "bg-blue-200 dark:bg-blue-600"
//                           : "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
//                       }`}
//                     >
//                       <div className="w-14 h-14 flex items-center justify-center bg-gray-300 dark:bg-gray-600 rounded-l-lg overflow-hidden">
//                         <img
//                           src={thumbSrc}
//                           alt={`thumb-${item.id}`}
//                           loading="lazy"
//                           data-tried="0"
//                           onError={(e) => handleImgError(e, item)}
//                           className="w-full h-full object-cover"
//                         />
//                       </div>
//                       <p className="ml-3 text-sm font-medium text-gray-800 dark:text-gray-200">
//                         {item.title}
//                       </p>
//                     </div>
//                   );
//                 })
//               )}
//             </div>
//           </div>

//           {/* Mobile Sidebar */}
//           {isSidebarOpen && (
//             <div className="fixed inset-0 z-50 flex">
//               <div
//                 className="flex-1 bg-black/50"
//                 onClick={() => setIsSidebarOpen(false)}
//               ></div>
//               <div className="w-[280px] bg-white dark:bg-gray-800 p-4 flex flex-col shadow-lg overflow-y-auto">
//                 <div className="flex justify-end mb-4">
//                   <button
//                     onClick={() => setIsSidebarOpen(false)}
//                     className="p-2 rounded bg-gray-200 dark:bg-gray-700 dark:text-white shadow hover:bg-gray-300 dark:hover:bg-gray-600"
//                   >
//                     <FiX size={20} />
//                   </button>
//                 </div>
//                 <div className="flex justify-between mb-4">
//                   {["All", "PDF", "VIDEO", "AUDIO"].map((tab) => (
//                     <button
//                       key={tab}
//                       onClick={() => setFilter(tab)}
//                       className={`px-3 py-1 rounded-lg text-sm font-medium ${
//                         filter === tab
//                           ? "bg-blue-500 text-white"
//                           : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200"
//                       }`}
//                     >
//                       {tab}
//                     </button>
//                   ))}
//                 </div>
//                 <div className="flex flex-col gap-3">
//                   {filtered.length === 0 ? (
//                     <p className="text-gray-400 text-sm dark:text-gray-300">
//                       No {filter} content found
//                     </p>
//                   ) : (
//                     filtered.map((item) => {
//                       const thumbSrc = getThumbSrc(item);
//                       return (
//                         <div
//                           key={item.id}
//                           onClick={() => {
//                             setSelectedChapter(item);
//                             setIsSidebarOpen(false);
//                           }}
//                           className={`flex items-center w-full h-[60px] rounded-lg shadow-sm cursor-pointer ${
//                             selectedChapter?.id === item.id
//                               ? "bg-blue-200 dark:bg-blue-600"
//                               : "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
//                           }`}
//                         >
//                           <div className="w-14 h-14 flex items-center justify-center bg-gray-300 dark:bg-gray-600 rounded-l-lg overflow-hidden">
//                             <img
//                               src={thumbSrc}
//                               alt={`thumb-${item.id}`}
//                               loading="lazy"
//                               data-tried="0"
//                               onError={(e) => handleImgError(e, item)}
//                               className="w-full h-full object-cover"
//                             />
//                           </div>
//                           <p className="ml-3 text-sm font-medium text-gray-800 dark:text-gray-200">
//                             {item.title}
//                           </p>
//                         </div>
//                       );
//                     })
//                   )}
//                 </div>
//               </div>
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// }










import { useState, useEffect, useRef } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { FaExpand, FaCompress } from "react-icons/fa";
import FlipbookPDFViewer from "../../Components/FlipbookPDFViewer";
import { useNavigate, useParams } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

export default function ChaptersList() {
  const [filter, setFilter] = useState("All");
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [error, setError] = useState(null);
  const { bookId } = useParams();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState("flip"); 
  const viewerRef = useRef(null);
  const navigate = useNavigate();

  // Fetch chapters
  useEffect(() => {
    const fetchChapters = async () => {
      try {
        const res = await fetch(`${API_URL}/books/${bookId}/chapters/meta`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch chapters");
        const data = await res.json();

        const formatted = data.map((item) => {
          const type = (item.resourceType || "pdf").toLowerCase();
          let title = "";
          if (type === "pdf") title = `Chapter ${item.chapterNumber}`;
          else if (type === "video") title = `Lecture ${item.chapterNumber}`;
          else if (type === "audio") title = `Audio ${item.chapterNumber}`;
          else title = `Content ${item.chapterNumber}`;

          return {
            id: item.id,
            chapterNumber: item.chapterNumber,
            fileUrl: item.fileUrl,
            proxyUrl: item.proxyUrl,
            thumbnail: item.thumbnail,
            thumbnailProxyUrl: item.thumbnailProxyUrl,
            resourceType: type,
            title,
            file: item.proxyUrl || item.fileUrl,
            typeUpper: type.toUpperCase(),
          };
        });

        setChapters(formatted);
        if (formatted.length > 0) setSelectedChapter(formatted[0]);
      } catch (err) {
        setError(err.message);
      }
    };

    if (bookId) fetchChapters();
  }, [bookId]);

  const filtered =
    filter === "All"
      ? chapters
      : chapters.filter((ch) => ch.typeUpper === filter);

  const handleFullscreen = () => {
    setIsFullscreen((prev) => !prev);
  };

  const getThumbSrc = (item) => {
    if (item.thumbnailProxyUrl) return item.thumbnailProxyUrl;
    if (item.thumbnail) {
      return item.thumbnail.includes("/index.php/s/")
        ? item.thumbnail + "/download"
        : `${API_URL}/books/proxy/thumbnail?url=${encodeURIComponent(
            item.thumbnail
          )}`;
    }
    if (item.fileUrl) {
      return `${API_URL}/books/proxy/thumbnail?url=${encodeURIComponent(
        item.fileUrl
      )}`;
    }
    return `data:image/svg+xml;utf8,${encodeURIComponent(
      `<svg xmlns='http://www.w3.org/2000/svg' width='200' height='140'><rect width='100%' height='100%' fill='#e5e7eb'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='#9ca3af' font-family='Arial' font-size='14'>No Image</text></svg>`
    )}`;
  };

  const handleImgError = (e, item) => {
    const el = e.target;
    if (el.dataset.tried === "1") return;
    el.dataset.tried = "1";
    if (item.thumbnail) {
      el.src = item.thumbnail.includes("/index.php/s/")
        ? item.thumbnail + "/download"
        : `${API_URL}/books/proxy/thumbnail?url=${encodeURIComponent(
            item.thumbnail
          )}`;
    } else if (item.fileUrl) {
      el.src = `${API_URL}/books/proxy/thumbnail?url=${encodeURIComponent(
        item.fileUrl
      )}`;
    }
  };


    
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);


  return (
    <div className="flex h-screen bg-[#fdf6f2] dark:bg-gray-900 transition-colors duration-300">
      {/* Main Viewer */}
      <div className="flex-1 flex flex-col relative">
        {/* Back button */}
        {!isFullscreen && (
          <div className="absolute top-3 left-3 flex items-center gap-3 z-50">
            <button
              onClick={() => navigate(-1)}
              className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 dark:text-white shadow hover:bg-gray-300 dark:hover:bg-gray-600 transition"
            >
              ⬅ Back
            </button>
          </div>
        )}

        {/* Mobile menu */}
        {!isFullscreen && (
          <div className="absolute top-3 right-3 flex items-center gap-2 z-40 lg:hidden">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 rounded bg-gray-200 dark:bg-gray-700 dark:text-white shadow hover:bg-gray-300 dark:hover:bg-gray-600"
            >
              <FiMenu size={20} />
            </button>
          </div>
        )}

        {/* Viewer */}
        {selectedChapter ? (
          <div
            ref={viewerRef}
            className={`flex-1 flex justify-center items-center w-full h-full p-4 relative transition-all duration-300 ${
              isFullscreen ? "fixed inset-0 z-50 bg-black p-2" : ""
            }`}
          >
            {selectedChapter.resourceType === "pdf" && (
              <>
                <div
                  className={`flex-1 flex justify-center items-center w-full h-full bg-[#d2dcf3] dark:bg-gray-700 rounded-lg shadow-md relative transition-all duration-300 ${
                    isFullscreen ? "w-full h-full p-0 bg-black" : "p-4"
                  }`}
                >
                  {/* Flipbook / Scrollable PDF */}
                  <FlipbookPDFViewer
                    chapter={selectedChapter}
                    isFullscreen={isFullscreen}
                    viewMode={viewMode} 
                    className="w-full h-full"
                  />

                  {/* Fullscreen Toggle */}
                  <button
                    onClick={handleFullscreen}
                    className={`absolute bottom-3 right-3 p-2 ${
                      isFullscreen
                        ? "hidden"
                        : "bg-white dark:bg-gray-800 dark:text-gray-200 shadow rounded z-20"
                    }`}
                  >
                    <FaExpand />
                  </button>
                </div>

                {isFullscreen && (
                  <button
                    onClick={handleFullscreen}
                    className="fixed bottom-4 right-4 p-3 rounded-full bg-gray-700 text-white hover:bg-gray-600 z-50 shadow-lg"
                  >
                    <FaCompress size={15} />
                  </button>
                )}
              </>
            )}

            {selectedChapter.resourceType === "video" && (
              <video
                key={selectedChapter.id}
                controls
                className="w-full h-full object-contain"
                src={selectedChapter.file}
              />
            )}

            {selectedChapter.resourceType === "audio" && (
              <div className="flex flex-col items-center justify-center w-full h-full gap-4 text-white">
                <img
                  src={
                    selectedChapter.thumbnailProxyUrl ||
                    selectedChapter.thumbnail
                  }
                  alt="Thumbnail"
                  className="w-60 h-60 object-cover rounded-lg shadow-lg"
                />
                <audio key={selectedChapter.id} controls className="w-2/3">
                  <source src={selectedChapter.file} type="audio/mpeg" />
                </audio>
              </div>
            )}
          </div>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <p className="text-gray-700 dark:text-gray-200">Select a chapter</p>
        )}
      </div>

      {/* Sidebar (Desktop & Mobile) */}
      {!isFullscreen && (
        <>
          {/* Desktop Sidebar */}
          <div className="hidden lg:flex w-[320px] bg-white dark:bg-gray-800 p-4 flex-col shadow-lg overflow-y-auto">
            {/* Filter Tabs */}
            <div className="flex justify-between mb-4">
              {["All", "PDF", "VIDEO", "AUDIO"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFilter(tab)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium ${
                    filter === tab
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            {/* Chapter List */}
            <div className="flex flex-col gap-3">
              {filtered.length === 0 ? (
                <p className="text-gray-400 text-sm dark:text-gray-300">
                  No {filter} content found
                </p>
              ) : (
                filtered.map((item) => {
                  const thumbSrc = getThumbSrc(item);
                  return (
                    <div
                      key={item.id}
                      onClick={() => {
                        setSelectedChapter(item);
                      }}
                      className={`flex items-center w-[320px] h-[60px] rounded-lg shadow-sm cursor-pointer ${
                        selectedChapter?.id === item.id
                          ? "bg-blue-200 dark:bg-blue-600"
                          : "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
                      }`}
                    >
                      <div className="w-14 h-14 flex items-center justify-center bg-gray-300 dark:bg-gray-600 rounded-l-lg overflow-hidden">
                        <img
                          src={thumbSrc}
                          alt={`thumb-${item.id}`}
                          loading="lazy"
                          data-tried="0"
                          onError={(e) => handleImgError(e, item)}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p className="ml-3 text-sm font-medium text-gray-800 dark:text-gray-200">
                        {item.title}
                      </p>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Mobile Sidebar */}
          {isSidebarOpen && (
            <div className="fixed inset-0 z-50 flex">
              <div
                className="flex-1 bg-black/50"
                onClick={() => setIsSidebarOpen(false)}
              ></div>
              <div className="w-[280px] bg-white dark:bg-gray-800 p-4 flex flex-col shadow-lg overflow-y-auto">
                <div className="flex justify-end mb-4">
                  <button
                    onClick={() => setIsSidebarOpen(false)}
                    className="p-2 rounded bg-gray-200 dark:bg-gray-700 dark:text-white shadow hover:bg-gray-300 dark:hover:bg-gray-600"
                  >
                    <FiX size={20} />
                  </button>
                </div>
                <div className="flex justify-between mb-4">
                  {["All", "PDF", "VIDEO", "AUDIO"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setFilter(tab)}
                      className={`px-3 py-1 rounded-lg text-sm font-medium ${
                        filter === tab
                          ? "bg-blue-500 text-white"
                          : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
                <div className="flex flex-col gap-3">
                  {filtered.length === 0 ? (
                    <p className="text-gray-400 text-sm dark:text-gray-300">
                      No {filter} content found
                    </p>
                  ) : (
                    filtered.map((item) => {
                      const thumbSrc = getThumbSrc(item);
                      return (
                        <div
                          key={item.id}
                          onClick={() => {
                            setSelectedChapter(item);
                            setIsSidebarOpen(false);
                          }}
                          className={`flex items-center w-full h-[60px] rounded-lg shadow-sm cursor-pointer ${
                            selectedChapter?.id === item.id
                              ? "bg-blue-200 dark:bg-blue-600"
                              : "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
                          }`}
                        >
                          <div className="w-14 h-14 flex items-center justify-center bg-gray-300 dark:bg-gray-600 rounded-l-lg overflow-hidden">
                            <img
                              src={thumbSrc}
                              alt={`thumb-${item.id}`}
                              loading="lazy"
                              data-tried="0"
                              onError={(e) => handleImgError(e, item)}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <p className="ml-3 text-sm font-medium text-gray-800 dark:text-gray-200">
                            {item.title}
                          </p>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}







