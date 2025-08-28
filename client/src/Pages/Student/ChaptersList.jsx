// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import StudentNavbar from "./StudentNavbar";
// import StudentSidebar from "./StudentSidebar";
// import { fetchChapters } from "../../apiServices/booksApi";
// import FlipbookPDFViewer from "../../Components/FlipbookPDFViewer";
// import { FaExpand, FaCompress } from "react-icons/fa";

// const API_URL = import.meta.env.VITE_API_URL;
// const getCleanUrl = (path) =>
//   path ? `${API_URL}/${path.replaceAll("\\", "/")}` : "";

// const detectResourceType = (fileUrl) => {
//   if (!fileUrl) return null;
//   const ext = fileUrl.split(".").pop().toLowerCase();
//   if (ext === "pdf") return "pdf";
//   if (["mp4", "mkv", "avi"].includes(ext)) return "video";
//   if (["mp3", "wav"].includes(ext)) return "audio";
//   return null;
// };

// const ChaptersList = () => {
//   const { bookId } = useParams()
//   const [chapters, setChapters] = useState([]);
//   const [viewData, setViewData] = useState(null);
//   const [isFullscreen, setIsFullscreen] = useState(false);
// console.log("bookId",bookId)
//   useEffect(() => {
//     async function loadChapters() {
      
//       try {
//         const data = await fetchChapters(bookId);
//         const withTypes = data.map((ch) => ({
//           ...ch,
//           resourceType: ch.resourceType || detectResourceType(ch.fileUrl),
//         }));
//         setChapters(withTypes);
//       } catch (error) {
//         console.error("Failed to load chapters:", error);
//       }
//     }
//     loadChapters();
//   }, [bookId]);

//   const getViewLabel = (type) => {
//     switch (type?.toLowerCase()) {
//       case "pdf":
//         return "📄 View";
//       case "video":
//         return "▶️ Play";
//       case "audio":
//         return "🔊 Listen";
//       default:
//         return "Open";
//     }
//   };

//   const handleFullscreenToggle = () => {
//     const viewer = document.querySelector(".view-modal-container");
//     if (!viewer) return;
//     if (!document.fullscreenElement) {
//       viewer.requestFullscreen().then(() => setIsFullscreen(true));
//     } else {
//       document.exitFullscreen().then(() => setIsFullscreen(false));
//     }
//   };

//   return (
//     <div className="flex min-h-screen bg-[#1e1f2b] text-white">
//       <StudentSidebar />
//       <main className="pl-[280px] py-6 pr-5 w-full">
//         <StudentNavbar />
//         <h2 className="text-2xl font-bold mb-6">📖 Chapters</h2>

//         {chapters.length > 0 ? (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
//             {chapters.map((chapter) => (
//               <div
//                 key={chapter.id}
//                 className="bg-white/10 border border-white/20 rounded-2xl shadow-md p-4 flex flex-col hover:shadow-xl hover:scale-105 transition-all duration-300"
//               >
//                 <div className="flex flex-col items-center gap-3">
//                   {/* Thumbnail */}
//                   <div className="relative w-full h-36 lg:h-44 bg-black/10 rounded-lg overflow-hidden">
//                     {chapter.thumbnail || chapter.fileUrl ? (
//                       <img
//                         src={getCleanUrl(chapter.thumbnail || chapter.fileUrl)}
//                         alt={`Chapter ${chapter.chapterNumber}`}
//                         className="w-full h-full object-contain p-2"
//                       />
//                     ) : (
//                       <p className="text-gray-300 flex items-center justify-center h-full">
//                         No Image
//                       </p>
//                     )}
//                     <span className="absolute top-2 right-2 bg-white/20 text-xs px-2 py-1 rounded-full text-white border border-white/30 backdrop-blur-sm">
//                       {chapter.resourceType}
//                     </span>
//                   </div>

//                   {/* Text Section */}
//                   <div className="text-center w-full break-words">
//                     <h3 className="text-base lg:text-lg font-bold mb-1">
//                       {chapter.chapterNumber
//                         ? `Chapter - ${chapter.chapterNumber}`
//                         : "Chapter - N/A"}
//                     </h3>
//                   </div>
//                 </div>

//                 {/* Actions */}
//                 <div className="flex flex-col mt-auto pt-2 border-t border-white/20">
//                   {["pdf", "video", "audio"].includes(
//                     chapter.resourceType?.toLowerCase()
//                   ) && (
//                     <button
//                       onClick={() => setViewData(chapter)}
//                       className="w-full text-sm sm:text-base text-blue-400 hover:text-blue-300 font-semibold"
//                     >
//                       {getViewLabel(chapter.resourceType)}
//                     </button>
//                   )}
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <p className="text-gray-400 text-center mt-6">
//             No chapters found for this book.
//           </p>
//         )}

//         {/* Modal for View */}
//         {viewData && (
//           <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex justify-center items-center">
//             <div className="relative w-full h-full flex items-center justify-center">
//               <div className="relative bg-white/10 backdrop-blur-md shadow-2xl rounded-xl border border-white/20 w-[95%] h-[90%] max-w-6xl max-h-[95%] overflow-hidden flex flex-col view-modal-container">
//                 <div className="flex items-center justify-between px-6 py-4 bg-white/5 border-b border-white/20">
//                   <h2 className="text-xl font-bold text-white">
//                     {getViewLabel(viewData.resourceType)}
//                   </h2>
//                   <div className="flex items-center gap-4">
//                     {(viewData.resourceType?.toLowerCase() === "pdf" ||
//                       viewData.resourceType?.toLowerCase() === "audio") && (
//                       <button
//                         onClick={handleFullscreenToggle}
//                         className="text-white text-xl hover:text-green-400"
//                         title="Toggle Fullscreen"
//                       >
//                         {isFullscreen ? <FaCompress /> : <FaExpand />}
//                       </button>
//                     )}
//                     <button
//                       onClick={() => setViewData(null)}
//                       className="text-white text-2xl hover:text-red-500"
//                     >
//                       ✕
//                     </button>
//                   </div>
//                 </div>

//                 <div className="flex-1 overflow-hidden bg-black">
//                   {viewData?.resourceType?.toLowerCase() === "pdf" && (
//                     <FlipbookPDFViewer
//                       fileUrl={getCleanUrl(viewData.fileUrl)}
//                       bookId={viewData.id}
//                     />
//                   )}
//                   {viewData?.resourceType?.toLowerCase() === "video" && (
//                     <video controls className="w-full h-full object-contain">
//                       <source
//                         src={getCleanUrl(viewData.fileUrl)}
//                         type="video/mp4"
//                       />
//                     </video>
//                   )}
//                   {viewData?.resourceType?.toLowerCase() === "audio" && (
//                     <div className="flex flex-col items-center justify-center h-full gap-4 text-white">
//                       <img
//                         src={getCleanUrl(
//                           viewData.thumbnail || "default-audio-cover.jpg"
//                         )}
//                         alt="Thumbnail"
//                         className="w-60 h-60 object-cover rounded-lg shadow-lg"
//                       />
//                       <audio controls className="w-2/3">
//                         <source
//                           src={getCleanUrl(viewData.fileUrl)}
//                           type="audio/mpeg"
//                         />
//                       </audio>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </main>
//     </div>
//   );
// };

// export default ChaptersList;












import { useEffect, useState } from "react";
import { useParams,useNavigate } from "react-router-dom";
import StudentNavbar from "./StudentNavbar";
import StudentSidebar from "./StudentSidebar";
import { fetchChapters } from "../../apiServices/booksApi";
import FlipbookPDFViewer from "../../Components/FlipbookPDFViewer";
import { FaExpand, FaCompress,FaArrowLeft } from "react-icons/fa";

const API_URL = import.meta.env.VITE_API_URL;

// Build full URL for file or thumbnail
const getCleanUrl = (path) =>
  path ? `${API_URL}/${path.replaceAll("\\", "/")}` : "";

// Detect type of resource from file extension
const detectResourceType = (fileUrl) => {
  if (!fileUrl) return null;
  const ext = fileUrl.split(".").pop().toLowerCase();
  if (ext === "pdf") return "pdf";
  if (["mp4", "mkv", "avi"].includes(ext)) return "video";
  if (["mp3", "wav"].includes(ext)) return "audio";
  return null;
};

const ChaptersList = () => {
  // Make sure param name matches your route: /books/:bookId/chapters
  const { bookId } = useParams();

  const [chapters, setChapters] = useState([]);
  const [viewData, setViewData] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const navigate = useNavigate()

  console.log("bookId", bookId);
  useEffect(() => {
    async function loadChapters() {
      if (!bookId) return;

      try {
        const data = await fetchChapters(bookId); // fetch from backend
        const withTypes = data.map((ch) => ({
          ...ch,
          resourceType: ch.resourceType || detectResourceType(ch.fileUrl),
        }));
        setChapters(withTypes);
      } catch (error) {
        console.error("Failed to load chapters:", error);
      }
    }

    loadChapters();
  }, [bookId]);

  const getViewLabel = (type) => {
    switch (type?.toLowerCase()) {
      case "pdf":
        return "📄 View";
      case "video":
        return "▶️ Play";
      case "audio":
        return "🔊 Listen";
      default:
        return "Open";
    }
  };

  const handleFullscreenToggle = () => {
    const viewer = document.querySelector(".view-modal-container");
    if (!viewer) return;
    if (!document.fullscreenElement) {
      viewer.requestFullscreen().then(() => setIsFullscreen(true));
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false));
    }
  };

  return (
    <div className="flex min-h-screen bg-[#1e1f2b] text-white">
      <StudentSidebar />
      <main className="pl-[280px] py-6 pr-5 w-full">
        <StudentNavbar />

        <button
                  onClick={() => navigate(-1)}
                  className="flex items-center mb-6 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg shadow-md transition"
                >
                  <FaArrowLeft className="mr-2" /> Back
                </button>
        
        <h2 className="text-2xl font-bold mb-6">📖 Chapters</h2>

        {chapters.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {chapters.map((chapter) => (
              <div
                key={chapter.id}
                className="bg-white/10 border border-white/20 rounded-2xl shadow-md p-4 flex flex-col hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                <div className="flex flex-col items-center gap-3">
                  {/* Thumbnail */}
                  <div className="relative w-full h-36 lg:h-44 bg-black/10 rounded-lg overflow-hidden">
                    {chapter.thumbnail || chapter.fileUrl ? (
                      <img
                        src={
    chapter.thumbnail.includes('/index.php/s/')
      ? chapter.thumbnail + '/download' // 🔹 add /download
      : `${API_URL}/books/proxy/thumbnail?url=${encodeURIComponent(chapter.thumbnail)}`
  }
                        alt={`Chapter ${chapter.chapterNumber}`}
                        className="w-full h-full object-contain p-2"
                      />
                    ) : (
                      <p className="text-gray-300 flex items-center justify-center h-full">
                        No Image
                      </p>
                    )}
                    <span className="absolute top-2 right-2 bg-white/20 text-xs px-2 py-1 rounded-full text-white border border-white/30 backdrop-blur-sm">
                      {chapter.resourceType}
                    </span>
                  </div>

                  {/* Text Section */}
                  <div className="text-center w-full break-words">
                    <h3 className="text-base lg:text-lg font-bold mb-1">
                      {chapter.chapterNumber
                        ? `Chapter - ${chapter.chapterNumber}`
                        : "Chapter - N/A"}
                    </h3>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col mt-auto pt-2 border-t border-white/20">
                  {["pdf", "video", "audio"].includes(
                    chapter.resourceType?.toLowerCase()
                  ) && (
                    <button
                      onClick={() => setViewData(chapter)}
                      className="w-full text-sm sm:text-base text-blue-400 hover:text-blue-300 font-semibold"
                    >
                      {getViewLabel(chapter.resourceType)}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-center mt-6">
            No chapters found for this book.
          </p>
        )}

        {/* Modal for View */}
        {viewData && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex justify-center items-center">
            <div className="relative w-full h-full flex items-center justify-center">
              <div className="relative bg-white/10 backdrop-blur-md shadow-2xl rounded-xl border border-white/20 w-[95%] h-[90%] max-w-6xl max-h-[95%] overflow-hidden flex flex-col view-modal-container">
                <div className="flex items-center justify-between px-6 py-2 bg-white/5 border-b border-white/20">
                  <h2 className="text-xl font-bold text-white">
                    {getViewLabel(viewData.resourceType)}
                  </h2>
                  <div className="flex items-center gap-4">
                    {(viewData.resourceType?.toLowerCase() === "pdf" ||
                      viewData.resourceType?.toLowerCase() === "audio") && (
                      <button
                        onClick={handleFullscreenToggle}
                        className="text-white text-xl hover:text-green-400"
                        title="Toggle Fullscreen"
                      >
                        {isFullscreen ? <FaCompress /> : <FaExpand />}
                      </button>
                    )}
                    <button
                      onClick={() => setViewData(null)}
                      className="text-white text-2xl hover:text-red-500"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                <div className="flex-1 overflow-hidden bg-black">
                  {viewData?.resourceType?.toLowerCase() === "pdf" && (
                    <FlipbookPDFViewer
                     fileUrl={viewData.proxyUrl}  
                      chapter={viewData}
                    />
                  )}
                  {viewData?.resourceType?.toLowerCase() === "video" && (
                    <video controls className="w-full h-full object-contain">
                      <source
                        src={getCleanUrl(viewData.fileUrl)}
                        type="video/mp4"
                      />
                    </video>
                  )}
                  {viewData?.resourceType?.toLowerCase() === "audio" && (
                    <div className="flex flex-col items-center justify-center h-full gap-4 text-white">
                      <img
                        src={getCleanUrl(
                          viewData.thumbnail || "default-audio-cover.jpg"
                        )}
                        alt="Thumbnail"
                        className="w-60 h-60 object-cover rounded-lg shadow-lg"
                      />
                      <audio controls className="w-2/3">
                        <source
                          src={getCleanUrl(viewData.fileUrl)}
                          type="audio/mpeg"
                        />
                      </audio>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ChaptersList;










// import { useEffect, useState } from "react";
// import { useParams,useNavigate } from "react-router-dom";
// import StudentNavbar from "./StudentNavbar";
// import StudentSidebar from "./StudentSidebar";
// import { fetchChapters, fetchFavoriteBooks, toggleFavoriteBook } from "../../apiServices/booksApi";
// import FlipbookPDFViewer from "../../Components/FlipbookPDFViewer";
// import { FaExpand, FaCompress, FaArrowLeft, FaHeart, FaRegHeart } from "react-icons/fa";

// const API_URL = import.meta.env.VITE_API_URL;
// const getCleanUrl = (path) =>
//   path ? `${API_URL}/${path.replaceAll("\\", "/")}` : "";

// // ✅ fileUrl se extension detect karne ka helper
// const detectResourceType = (fileUrl) => {
//   if (!fileUrl) return null;
//   const ext = fileUrl.split(".").pop().toLowerCase();
//   if (ext === "pdf") return "pdf";
//   if (["mp4", "mkv", "avi"].includes(ext)) return "video";
//   if (["mp3", "wav"].includes(ext)) return "audio";
//   return null;
// };

// const ChaptersList = () => {
//   const { bookId } = useParams();
//   const [chapters, setChapters] = useState([]);
//   const [viewData, setViewData] = useState(null);
//   const [isFullscreen, setIsFullscreen] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     async function loadChapters() {
//       try {
//         const data = await fetchChapters(bookId);
//         const favoriteIds = await fetchFavoriteBooks();

//         // ✅ Add resourceType and favorite status
//         const chaptersWithFavorites = data.map((ch) => ({
//           ...ch,
//           resourceType: ch.resourceType || detectResourceType(ch.fileUrl),
//           isFavorite: favoriteIds.includes(ch.id),
//         }));

//         setChapters(chaptersWithFavorites);
//       } catch (error) {
//         console.error("Failed to load chapters:", error);
//       }
//     }
//     loadChapters();
//   }, [bookId]);

//   const toggleFavorite = async (chapterId) => {
//     try {
//       await toggleFavoriteBook(chapterId);
//       setChapters((prev) =>
//         prev.map((ch) =>
//           ch.id === chapterId ? { ...ch, isFavorite: !ch.isFavorite } : ch
//         )
//       );
//     } catch (err) {
//       console.error("Failed to toggle favorite:", err);
//     }
//   };

//   const getViewLabel = (type) => {
//     switch (type?.toLowerCase()) {
//       case "pdf":
//         return "📄 View";
//       case "video":
//         return "▶️ Play";
//       case "audio":
//         return "🔊 Listen";
//       default:
//         return "Open";
//     }
//   };

//   const handleFullscreenToggle = () => {
//     const viewer = document.querySelector(".view-modal-container");
//     if (!viewer) return;
//     if (!document.fullscreenElement) {
//       viewer.requestFullscreen().then(() => setIsFullscreen(true));
//     } else {
//       document.exitFullscreen().then(() => setIsFullscreen(false));
//     }
//   };

//   return (
//     <div className="flex min-h-screen bg-[#1e1f2b] text-white">
//       <StudentSidebar />
//       <main className="pl-[280px] py-6 pr-5 w-full">
//         <StudentNavbar />

//         <button
//           onClick={() => navigate(-1)}
//           className="flex items-center mb-6 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg shadow-md transition"
//         >
//           <FaArrowLeft className="mr-2" /> Back
//         </button>

//         <h2 className="text-2xl font-bold mb-6">📖 Chapters</h2>

//         {chapters.length > 0 ? (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
//             {chapters.map((chapter) => (
//               <div
//                 key={chapter.id}
//                 className="bg-white/10 border border-white/20 rounded-2xl shadow-md p-4 flex flex-col hover:shadow-xl hover:scale-105 transition-all duration-300"
//               >
//                 <div className="flex flex-col items-center gap-3">
//                   {/* Thumbnail */}
//                   <div className="relative w-full h-36 lg:h-44 bg-black/10 rounded-lg overflow-hidden">
//                     {chapter.thumbnail || chapter.fileUrl ? (
//                       <img
//                         src={getCleanUrl(chapter.thumbnail || chapter.fileUrl)}
//                         alt={`Chapter ${chapter.chapterNumber}`}
//                         className="w-full h-full object-contain p-2"
//                       />
//                     ) : (
//                       <p className="text-gray-300 flex items-center justify-center h-full">
//                         No Image
//                       </p>
//                     )}
//                     <span className="absolute top-2 right-2 bg-white/20 text-xs px-2 py-1 rounded-full text-white border border-white/30 backdrop-blur-sm">
//                       {chapter.resourceType}
//                     </span>
//                     {/* Favorite Icon */}
//                     <button
//                       className="absolute top-2 left-2 text-red-400 hover:text-red-600 text-lg"
//                       onClick={() => toggleFavorite(chapter.id)}
//                     >
//                       {chapter.isFavorite ? <FaHeart /> : <FaRegHeart />}
//                     </button>
//                   </div>

//                   {/* Text Section */}
//                   <div className="text-center w-full break-words">
//                     <h3 className="text-base lg:text-lg font-bold mb-1">
//                       {chapter.chapterNumber
//                         ? `Chapter - ${chapter.chapterNumber}`
//                         : "Chapter - N/A"}
//                     </h3>
//                   </div>
//                 </div>

//                 {/* Actions */}
//                 <div className="flex flex-col mt-auto pt-2 border-t border-white/20">
//                   {["pdf", "video", "audio"].includes(
//                     chapter.resourceType?.toLowerCase()
//                   ) && (
//                     <button
//                       onClick={() => setViewData(chapter)}
//                       className="w-full text-sm sm:text-base text-blue-400 hover:text-blue-300 font-semibold"
//                     >
//                       {getViewLabel(chapter.resourceType)}
//                     </button>
//                   )}
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <p className="text-gray-400 text-center mt-6">
//             No chapters found for this book.
//           </p>
//         )}

//         {/* Modal for View */}
//         {viewData && (
//           <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex justify-center items-center">
//             <div className="relative w-full h-full flex items-center justify-center">
//               <div className="relative bg-white/10 backdrop-blur-md shadow-2xl rounded-xl border border-white/20 w-[95%] h-[90%] max-w-6xl max-h-[95%] overflow-hidden flex flex-col view-modal-container">
//                 <div className="flex items-center justify-between px-6 py-4 bg-white/5 border-b border-white/20">
//                   <h2 className="text-xl font-bold text-white">
//                     {getViewLabel(viewData.resourceType)}
//                   </h2>
//                   <div className="flex items-center gap-4">
//                     {(viewData.resourceType?.toLowerCase() === "pdf" ||
//                       viewData.resourceType?.toLowerCase() === "audio") && (
//                       <button
//                         onClick={handleFullscreenToggle}
//                         className="text-white text-xl hover:text-green-400"
//                         title="Toggle Fullscreen"
//                       >
//                         {isFullscreen ? <FaCompress /> : <FaExpand />}
//                       </button>
//                     )}
//                     <button
//                       onClick={() => setViewData(null)}
//                       className="text-white text-2xl hover:text-red-500"
//                     >
//                       ✕
//                     </button>
//                   </div>
//                 </div>

//                 <div className="flex-1 overflow-hidden bg-black">
//                   {viewData?.resourceType?.toLowerCase() === "pdf" && (
//                     <FlipbookPDFViewer
//                       fileUrl={getCleanUrl(viewData.fileUrl)}
//                       bookId={viewData.bookId}
//                     />
//                   )}
//                   {viewData?.resourceType?.toLowerCase() === "video" && (
//                     <video controls className="w-full h-full object-contain">
//                       <source
//                         src={getCleanUrl(viewData.fileUrl)}
//                         type="video/mp4"
//                       />
//                     </video>
//                   )}
//                   {viewData?.resourceType?.toLowerCase() === "audio" && (
//                     <div className="flex flex-col items-center justify-center h-full gap-4 text-white">
//                       <img
//                         src={getCleanUrl(
//                           viewData.thumbnail || "default-audio-cover.jpg"
//                         )}
//                         alt="Thumbnail"
//                         className="w-60 h-60 object-cover rounded-lg shadow-lg"
//                       />
//                       <audio controls className="w-2/3">
//                         <source
//                           src={getCleanUrl(viewData.fileUrl)}
//                           type="audio/mpeg"
//                         />
//                       </audio>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </main>
//     </div>
//   );
// };

// export default ChaptersList;









// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import StudentNavbar from "./StudentNavbar";
// import StudentSidebar from "./StudentSidebar";
// import { fetchChapters } from "../../apiServices/booksApi";
// import FlipbookPDFViewer from "../../Components/FlipbookPDFViewer";
// import { FaExpand, FaCompress, FaArrowLeft } from "react-icons/fa";

// const API_URL = import.meta.env.VITE_API_URL;

// const detectResourceType = (fileUrl) => {
//   if (!fileUrl) return null;
//   const ext = fileUrl.split(".").pop().toLowerCase();
//   if (ext === "pdf") return "pdf";
//   if (["mp4", "mkv", "avi"].includes(ext)) return "video";
//   if (["mp3", "wav"].includes(ext)) return "audio";
//   return null;
// };

// const ChaptersList = () => {
//   const { bookId } = useParams();
//   const [chapters, setChapters] = useState([]);
//   const [viewData, setViewData] = useState(null);
//   const [isFullscreen, setIsFullscreen] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     async function loadChapters() {
//       if (!bookId) return;

//       try {
//         const data = await fetchChapters(bookId);
//         setChapters(
//           data.map((ch) => ({
//             ...ch,
//             resourceType: ch.resourceType || detectResourceType(ch.fileUrl),
//           }))
//         );
//       } catch (err) {
//         console.error("Failed to load chapters:", err);
//       }
//     }

//     loadChapters();
//   }, [bookId]);

//   const handleFullscreenToggle = () => {
//     const viewer = document.querySelector(".view-modal-container");
//     if (!viewer) return;

//     if (!document.fullscreenElement) {
//       viewer.requestFullscreen().then(() => setIsFullscreen(true));
//     } else {
//       document.exitFullscreen().then(() => setIsFullscreen(false));
//     }
//   };

//   return (
//     <div className="flex min-h-screen bg-[#1e1f2b] text-white">
//       <StudentSidebar />
//       <main className="pl-[280px] py-6 pr-5 w-full">
//         <StudentNavbar />

//         <button
//           onClick={() => navigate(-1)}
//           className="flex items-center mb-6 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg shadow-md transition"
//         >
//           <FaArrowLeft className="mr-2" /> Back
//         </button>

//         <h2 className="text-2xl font-bold mb-6">📖 Chapters</h2>

//         {chapters.length > 0 ? (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
//             {chapters.map((chapter) => (
//               <div
//                 key={chapter.id}
//                 className="bg-white/10 border border-white/20 rounded-2xl shadow-md p-4 flex flex-col hover:shadow-xl hover:scale-105 transition-all duration-300"
//               >
//                 <div className="flex flex-col items-center gap-3">
//                   <div className="relative w-full h-36 lg:h-44 bg-black/10 rounded-lg overflow-hidden">
//                     {chapter.thumbnail || chapter.fileUrl ? (
//                       <img
//                         src={
//                           chapter.thumbnail?.includes("/index.php/s/")
//                             ? chapter.thumbnail + "/download"
//                             : `${API_URL}/books/proxy/thumbnail?url=${encodeURIComponent(
//                                 chapter.thumbnail
//                               )}`
//                         }
//                         alt={`Chapter ${chapter.chapterNumber}`}
//                         className="w-full h-full object-contain p-2"
//                       />
//                     ) : (
//                       <p className="text-gray-300 flex items-center justify-center h-full">
//                         No Image
//                       </p>
//                     )}
//                     <span className="absolute top-2 right-2 bg-white/20 text-xs px-2 py-1 rounded-full text-white border border-white/30 backdrop-blur-sm">
//                       {chapter.resourceType}
//                     </span>
//                   </div>

//                   <div className="text-center w-full break-words">
//                     <h3 className="text-base lg:text-lg font-bold mb-1">
//                       {chapter.chapterNumber
//                         ? `Chapter - ${chapter.chapterNumber}`
//                         : "Chapter - N/A"}
//                     </h3>
//                   </div>
//                 </div>

//                 <div className="flex flex-col mt-auto pt-2 border-t border-white/20">
//                   {["pdf", "video", "audio"].includes(
//                     chapter.resourceType?.toLowerCase()
//                   ) && (
//                     <button
//                       onClick={() => setViewData(chapter)}
//                       className="w-full text-sm sm:text-base text-blue-400 hover:text-blue-300 font-semibold"
//                     >
//                       {chapter.resourceType?.toLowerCase() === "pdf"
//                         ? "📄 View"
//                         : chapter.resourceType?.toLowerCase() === "video"
//                         ? "▶️ Play"
//                         : "🔊 Listen"}
//                     </button>
//                   )}
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <p className="text-gray-400 text-center mt-6">
//             No chapters found for this book.
//           </p>
//         )}

//         {viewData && (
//           <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex justify-center items-center">
//             <div className="relative w-full h-full flex items-center justify-center">
//               <div className="relative bg-white/10 backdrop-blur-md shadow-2xl rounded-xl border border-white/20 w-[95%] h-[90%] max-w-6xl max-h-[95%] overflow-hidden flex flex-col view-modal-container">
//                 <div className="flex items-center justify-between px-6 py-4 bg-white/5 border-b border-white/20">
//                   <h2 className="text-xl font-bold text-white">
//                     {viewData.resourceType?.toLowerCase() === "pdf"
//                       ? "📄 View"
//                       : viewData.resourceType?.toLowerCase() === "video"
//                       ? "▶️ Play"
//                       : "🔊 Listen"}
//                   </h2>
//                   <div className="flex items-center gap-4">
//                     {["pdf", "audio"].includes(
//                       viewData.resourceType?.toLowerCase()
//                     ) && (
//                       <button
//                         onClick={handleFullscreenToggle}
//                         className="text-white text-xl hover:text-green-400"
//                         title="Toggle Fullscreen"
//                       >
//                         {isFullscreen ? <FaCompress /> : <FaExpand />}
//                       </button>
//                     )}
//                     <button
//                       onClick={() => setViewData(null)}
//                       className="text-white text-2xl hover:text-red-500"
//                     >
//                       ✕
//                     </button>
//                   </div>
//                 </div>

//                 <div className="flex-1 overflow-hidden bg-black">
//                   {viewData.resourceType?.toLowerCase() === "pdf" && (
//                     <FlipbookPDFViewer
//                       fileUrl={viewData.proxyUrl}  
//                  chapter={viewData}
//                     />
//                   )}
//                   {viewData.resourceType?.toLowerCase() === "video" && (
//                     <video controls className="w-full h-full object-contain">
//                       <source
//                         src={viewData.fileUrl}
//                         type="video/mp4"
//                       />
//                     </video>
//                   )}
//                   {viewData.resourceType?.toLowerCase() === "audio" && (
//                     <div className="flex flex-col items-center justify-center h-full gap-4 text-white">
//                       <img
//                         src={viewData.thumbnail || "default-audio-cover.jpg"}
//                         alt="Thumbnail"
//                         className="w-60 h-60 object-cover rounded-lg shadow-lg"
//                       />
//                       <audio controls className="w-2/3">
//                         <source src={viewData.fileUrl} type="audio/mpeg" />
//                       </audio>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </main>
//     </div>
//   );
// };

// export default ChaptersList;
