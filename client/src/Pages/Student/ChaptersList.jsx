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












// import { useEffect, useState } from "react";
// import { useParams,useNavigate } from "react-router-dom";
// import StudentNavbar from "./StudentNavbar";
// import StudentSidebar from "./StudentSidebar";
import { fetchChapters } from "../../apiServices/booksApi";
// import FlipbookPDFViewer from "../../Components/FlipbookPDFViewer";
// import { FaExpand, FaCompress,FaArrowLeft } from "react-icons/fa";

// const API_URL = import.meta.env.VITE_API_URL;

// // Build full URL for file or thumbnail
// const getCleanUrl = (path) =>
//   path ? `${API_URL}/${path.replaceAll("\\", "/")}` : "";

// // Detect type of resource from file extension
// const detectResourceType = (fileUrl) => {
//   if (!fileUrl) return null;
//   const ext = fileUrl.split(".").pop().toLowerCase();
//   if (ext === "pdf") return "pdf";
//   if (["mp4", "mkv", "avi"].includes(ext)) return "video";
//   if (["mp3", "wav"].includes(ext)) return "audio";
//   return null;
// };

// const ChaptersList = () => {
//   // Make sure param name matches your route: /books/:bookId/chapters
//   const { bookId } = useParams();

//   const [chapters, setChapters] = useState([]);
//   const [viewData, setViewData] = useState(null);
//   const [isFullscreen, setIsFullscreen] = useState(false);
//   const navigate = useNavigate()

//   console.log("bookId", bookId);
//   useEffect(() => {
//     async function loadChapters() {
//       if (!bookId) return;

//       try {
//         const data = await fetchChapters(bookId); // fetch from backend
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

//         <button
//                   onClick={() => navigate(-1)}
//                   className="flex items-center mb-6 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg shadow-md transition"
//                 >
//                   <FaArrowLeft className="mr-2" /> Back
//                 </button>
        
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
//                         src={
//     chapter.thumbnail.includes('/index.php/s/')
//       ? chapter.thumbnail + '/download' // 🔹 add /download
//       : `${API_URL}/books/proxy/thumbnail?url=${encodeURIComponent(chapter.thumbnail)}`
//   }
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
//                 <div className="flex items-center justify-between px-6 py-2 bg-white/5 border-b border-white/20">
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
//                      fileUrl={viewData.proxyUrl}  
//                       chapter={viewData}
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












// import { useState, useEffect, useRef } from "react";
// import { FiChevronRight, FiChevronLeft } from "react-icons/fi";
// import { FaExpand } from "react-icons/fa";
// import FlipbookPDFViewer from "../../Components/FlipbookPDFViewer";
// import { useParams } from "react-router-dom";

// const API_URL = import.meta.env.VITE_API_URL; 

// export default function ChaptersList() {
//   const [page, setPage] = useState(1);
//   const [filter, setFilter] = useState("All");
//   const [selectedChapter, setSelectedChapter] = useState(null);
//   const [chapters, setChapters] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const { bookId } = useParams();
//   const viewerRef = useRef(null);
//   const [isFullscreen, setIsFullscreen] = useState(false);
//   useEffect(() => {
//     const fetchChapters = async () => {
//       try {
//         setLoading(true);
//         const res = await fetch(`${API_URL}/books/${bookId}/chapters`);
//         if (!res.ok) throw new Error("Failed to fetch chapters");
//         const data = await res.json();

//         const formatted = data.map((item) => ({
//           id: item.id,
//           title: `Chapter ${item.chapterNumber}`,
//           file: item.proxyUrl || item.fileUrl,
//           thumbnail: item.thumbnailProxyUrl || item.thumbnail,
//           type: item.resourceType ? item.resourceType.toUpperCase() : "PDF",
//         }));

//         setChapters(formatted);
//         if (formatted.length > 0) {
//           setSelectedChapter(formatted[0]);
//         }
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (bookId) fetchChapters();
//   }, [bookId]);

//   const filtered =
//     filter === "All" ? chapters : chapters.filter((ch) => ch.type === filter);

//   const handlePrev = () => {
//     if (page > 1) setPage(page - 1);
//   };

//   const handleNext = () => {
//     if (page < (selectedChapter?.totalPages || 50)) setPage(page + 1);
//   };

//   const handleFullscreen = () => {
//     if (!isFullscreen) {
//       if (viewerRef.current.requestFullscreen) {
//         viewerRef.current.requestFullscreen();
//       }
//       setIsFullscreen(true);
//     } else {
//       document.exitFullscreen?.();
//       setIsFullscreen(false);
//     }
//   };

//   return (
//     <div className="flex h-screen bg-[#fdf6f2] dark:bg-gray-900 transition-colors duration-300">
//       {/* Left Side - Book Viewer */}
//       <div
//         ref={viewerRef}
//         className="flex-1 flex flex-col items-center justify-center border-r dark:border-gray-700 p-4 relative"
//       >
//         {/* Page Controls */}
//         <div className="absolute top-2 right-2 flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 px-2 py-1 rounded shadow">
//           <button
//             onClick={handlePrev}
//             className="p-1 bg-white dark:bg-gray-800 dark:text-gray-200 shadow rounded"
//           >
//             <FiChevronLeft size={16} />
//           </button>
//           <span className="text-xs text-gray-700 dark:text-gray-200">
//             {page}
//           </span>
//           <button
//             onClick={handleNext}
//             className="p-1 bg-white dark:bg-gray-800 dark:text-gray-200 shadow rounded"
//           >
//             <FiChevronRight size={16} />
//           </button>
//         </div>

//         {/* Content Area */}
//         <div className="bg-[#d2dcf3] dark:bg-gray-700 w-[80%] h-[70%] flex flex-col items-center justify-center shadow-md relative rounded-lg p-6 text-center overflow-hidden">
//           {loading ? (
//             <p className="text-gray-600 dark:text-gray-300">Loading chapters...</p>
//           ) : error ? (
//             <p className="text-red-500">{error}</p>
//           ) : selectedChapter ? (
//             <>
//               {selectedChapter.type === "PDF" ? (
//  <FlipbookPDFViewer key={selectedChapter.id} chapter={selectedChapter} />
// ) : selectedChapter.type === "VIDEO" ? (
//   <video key={selectedChapter.id} controls className="w-full h-full rounded-lg">
//     <source src={selectedChapter.file} type="video/mp4" />
//   </video>
// ) : selectedChapter.type === "AUDIO" ? (
//   <audio key={selectedChapter.id} controls className="w-full">
//     <source src={selectedChapter.file} type="audio/mp3" />
//   </audio>
// ) : (
//   <p className="text-gray-700 dark:text-gray-200">Unsupported Content</p>
// )}

//             </>
//           ) : (
//             <p className="text-gray-700 dark:text-gray-200">Select a chapter</p>
//           )}
//         </div>

  
//         <div className="absolute bottom-3 right-3 flex gap-3">
//           <button
//             onClick={handleFullscreen}
//             className="p-2 bg-white dark:bg-gray-800 dark:text-gray-200 shadow rounded"
//           >
//             <FaExpand />
//           </button>
//         </div>
//       </div>

//       {/* Right Side - Filters & Chapters */}
//       <div className="w-[320px] bg-white dark:bg-gray-800 p-4 flex flex-col shadow-lg overflow-y-auto">
//         {/* Filters */}
//         <div className="flex justify-between mb-4">
//           {["All", "PDF", "VIDEO", "AUDIO"].map((tab) => (
//             <button
//               key={tab}
//               onClick={() => setFilter(tab)}
//               className={`px-3 py-1 rounded-lg text-sm font-medium ${
//                 filter === tab
//                   ? "bg-blue-500 text-white"
//                   : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200"
//               }`}
//             >
//               {tab}
//             </button>
//           ))}
//         </div>

//         {/* Chapters List */}
//         <div className="flex flex-col gap-3">
//           {filtered.length === 0 ? (
//             <p className="text-gray-400 text-sm dark:text-gray-300">
//               No {filter} content found
//             </p>
//           ) : (
//             filtered.map((item) => (
//               <div
//                 key={item.id}
//                onClick={() => { setSelectedChapter(item); setPage(1); }}
//                 className={`flex items-center w-[320px] h-[60px] rounded-lg shadow-sm cursor-pointer ${
//                   selectedChapter?.id === item.id
//                     ? "bg-blue-200 dark:bg-blue-600"
//                     : "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
//                 }`}
//               >
//                 <div className="w-14 h-14 flex items-center justify-center bg-gray-300 dark:bg-gray-600 rounded-l-lg overflow-hidden">
//                   {item.thumbnail ? (
//                     <img
//                       src={item.thumbnail}
//                       alt="thumb"
//                       className="w-full h-full object-cover"
//                     />
//                   ) : item.type === "PDF" ? (
//                     "📄"
//                   ) : item.type === "VIDEO" ? (
//                     "🎥"
//                   ) : (
//                     "🎧"
//                   )}
//                 </div>
//                 <p className="ml-3 text-sm font-medium text-gray-800 dark:text-gray-200">
//                   {item.title}
//                 </p>
//               </div>
//             ))
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }







// import { useState, useEffect, useRef } from "react";
// import { FiChevronRight, FiChevronLeft } from "react-icons/fi";
// import { FaExpand } from "react-icons/fa";
// import FlipbookPDFViewer from "../../Components/FlipbookPDFViewer";
// import { useParams } from "react-router-dom";

// const API_URL = import.meta.env.VITE_API_URL;

// export default function ChaptersList() {
//   const [page, setPage] = useState(1);
//   const [filter, setFilter] = useState("All");
//   const [selectedChapter, setSelectedChapter] = useState(null);
//   const [chapters, setChapters] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const { bookId } = useParams();
//   const viewerRef = useRef(null);
//   const [isFullscreen, setIsFullscreen] = useState(false);

//   useEffect(() => {
//     const fetchChapters = async () => {
//       try {
//         setLoading(true);
//         const res = await fetch(`${API_URL}/books/${bookId}/chapters`, {
//           credentials: "include",
//         });
//         if (!res.ok) throw new Error("Failed to fetch chapters");
//         const data = await res.json();
//         const formatted = data.map((item) => {
//           const type =
//             (item.resourceType || "pdf").toString().toLowerCase(); // normalize

//           return {
//             // original fields (FlipbookPDFViewer relies on these)
//             id: item.id,
//             chapterNumber: item.chapterNumber,
//             fileUrl: item.fileUrl,
//             proxyUrl: item.proxyUrl,
//             thumbnail: item.thumbnail, // raw (fallback)
//             thumbnailProxyUrl: item.thumbnailProxyUrl,
//             resourceType: type,
//             title: `Chapter ${item.chapterNumber}`,
//             file: item.proxyUrl || item.fileUrl, 
//             thumb: item.thumbnailProxyUrl || item.thumbnail,
//             typeUpper: type.toUpperCase(), 
//           };
//         });

//         setChapters(formatted);
//         if (formatted.length > 0) {
//           setSelectedChapter(formatted[0]);
//         }
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (bookId) fetchChapters();
//   }, [bookId]);

//   const filtered =
//     filter === "All"
//       ? chapters
//       : chapters.filter((ch) => ch.typeUpper === filter);

//   const handlePrev = () => {
//     if (page > 1) setPage(page - 1);
//   };

//   const handleNext = () => {
//     if (page < (selectedChapter?.totalPages || 50)) setPage(page + 1);
//   };

//   const handleFullscreen = () => {
//     if (!isFullscreen) {
//       if (viewerRef.current?.requestFullscreen) {
//         viewerRef.current.requestFullscreen();
//       }
//       setIsFullscreen(true);
//     } else {
//       document.exitFullscreen?.();
//       setIsFullscreen(false);
//     }
//   };

//   return (
//     <div className="flex h-screen bg-[#fdf6f2] dark:bg-gray-900 transition-colors duration-300">
//       <div
//         ref={viewerRef}
//         className="flex-1 flex flex-col items-center justify-center border-r dark:border-gray-700 p-4 relative"
//       >

//         <div className="absolute top-2 right-2 flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 px-2 py-1 rounded shadow">
//           <button
//             onClick={handlePrev}
//             className="p-1 bg-white dark:bg-gray-800 dark:text-gray-200 shadow rounded"
//           >
//             <FiChevronLeft size={16} />
//           </button>
//           <span className="text-xs text-gray-700 dark:text-gray-200">
//             {page}
//           </span>
//           <button
//             onClick={handleNext}
//             className="p-1 bg-white dark:bg-gray-800 dark:text-gray-200 shadow rounded"
//           >
//             <FiChevronRight size={16} />
//           </button>
//         </div>


//         <div className="bg-[#d2dcf3] dark:bg-gray-700 w-[80%] h-[70%] flex flex-col items-center justify-center shadow-md relative rounded-lg p-6 text-center overflow-hidden">
//           {loading ? (
//             <p className="text-gray-600 dark:text-gray-300">
//               Loading chapters...
//             </p>
//           ) : error ? (
//             <p className="text-red-500">{error}</p>
//           ) : selectedChapter ? (
//             <>
//               {selectedChapter.resourceType === "pdf" ? (
//                 <FlipbookPDFViewer
//                   key={selectedChapter.id}
//                   chapter={selectedChapter}
//                 />
//               ) : selectedChapter.resourceType === "video" ? (
//                 <video key={selectedChapter.id} controls className="w-full h-full rounded-lg">
//                   <source src={selectedChapter.file} type="video/mp4" />
//                 </video>
//               ) : selectedChapter.resourceType === "audio" ? (
//                 <audio key={selectedChapter.id} controls className="w-full">
//                   <source src={selectedChapter.file} type="audio/mpeg" />
//                 </audio>
//               ) : (
//                 <p className="text-gray-700 dark:text-gray-200">
//                   Unsupported Content
//                 </p>
//               )}
//             </>
//           ) : (
//             <p className="text-gray-700 dark:text-gray-200">Select a chapter</p>
//           )}
//         </div>

//         <div className="absolute bottom-3 right-3 flex gap-3">
//           <button
//             onClick={handleFullscreen}
//             className="p-2 bg-white dark:bg-gray-800 dark:text-gray-200 shadow rounded"
//           >
//             <FaExpand />
//           </button>
//         </div>
//       </div>

//       {/* Right Side - Filters & Chapters */}
//       <div className="w-[320px] bg-white dark:bg-gray-800 p-4 flex flex-col shadow-lg overflow-y-auto">
//         {/* Filters */}
//         <div className="flex justify-between mb-4">
//           {["All", "PDF", "VIDEO", "AUDIO"].map((tab) => (
//             <button
//               key={tab}
//               onClick={() => setFilter(tab)}
//               className={`px-3 py-1 rounded-lg text-sm font-medium ${
//                 filter === tab
//                   ? "bg-blue-500 text-white"
//                   : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200"
//               }`}
//             >
//               {tab}
//             </button>
//           ))}
//         </div>

//         {/* Chapters List */}
//         <div className="flex flex-col gap-3">
//           {filtered.length === 0 ? (
//             <p className="text-gray-400 text-sm dark:text-gray-300">
//               No {filter} content found
//             </p>
//           ) : (
//             filtered.map((item) => (
//               <div
//                 key={item.id}
//                 onClick={() => {
//                   setSelectedChapter(item);
//                   setPage(1);
//                 }}
//                 className={`flex items-center w-[320px] h-[60px] rounded-lg shadow-sm cursor-pointer ${
//                   selectedChapter?.id === item.id
//                     ? "bg-blue-200 dark:bg-blue-600"
//                     : "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
//                 }`}
//               >
//                 <div className="w-14 h-14 flex items-center justify-center bg-gray-300 dark:bg-gray-600 rounded-l-lg overflow-hidden">
//                   {item.thumb ? (
//                     <img
//                       src={item.thumb}
//                       alt="thumb"
//                       className="w-full h-full object-cover"
//                     />
//                   ) : item.typeUpper === "PDF" ? (
//                     "📄"
//                   ) : item.typeUpper === "VIDEO" ? (
//                     "🎥"
//                   ) : (
//                     "🎧"
//                   )}
//                 </div>
//                 <p className="ml-3 text-sm font-medium text-gray-800 dark:text-gray-200">
//                   {item.title}
//                 </p>
//               </div>
//             ))
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }





// import { useState, useEffect, useRef } from "react";
// import { FiChevronRight, FiChevronLeft } from "react-icons/fi";
// import { FaExpand } from "react-icons/fa";
// import FlipbookPDFViewer from "../../Components/FlipbookPDFViewer";
// import { useNavigate, useParams } from "react-router-dom";

// const API_URL = import.meta.env.VITE_API_URL;

// export default function ChaptersList() {
//   const [page, setPage] = useState(1);
//   const [filter, setFilter] = useState("All");
//   const [selectedChapter, setSelectedChapter] = useState(null);
//   const [chapters, setChapters] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const { bookId } = useParams();
//   const viewerRef = useRef(null);
//   const [isFullscreen, setIsFullscreen] = useState(false);
//   const navigate = useNavigate()

//   useEffect(() => {
//     const fetchChapters = async () => {
//       try {
//         setLoading(true);
//         const res = await fetch(`${API_URL}/books/${bookId}/chapters`, {
//           credentials: "include",
//         });
//         if (!res.ok) throw new Error("Failed to fetch chapters");
//         const data = await res.json();
//         const formatted = data.map((item) => {
//           const type = (item.resourceType || "pdf").toString().toLowerCase();

//           return {
//             id: item.id,
//             chapterNumber: item.chapterNumber,
//             fileUrl: item.fileUrl,
//             proxyUrl: item.proxyUrl,
//   thumbnail: item.thumbnail,
//   thumbnailProxyUrl: item.thumbnailProxyUrl,
//        totalPages:item.totalPages,
//        thumb: item.thumbnail
//               ? item.thumbnail.includes("/index.php/s/")
//                 ? item.thumbnail + "/download"
//                 : `${API_URL}/books/proxy/thumbnail?url=${encodeURIComponent(item.thumbnail)}`
//               : null,

//             resourceType: type,

//             // convenience for UI
//             title: `Chapter ${item.chapterNumber}`,
//             file: item.proxyUrl || item.fileUrl,
//             typeUpper: type.toUpperCase(),
//           };
//         });

//         setChapters(formatted);
//         if (formatted.length > 0) {
//           setSelectedChapter(formatted[0]);
//         }
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (bookId) fetchChapters();
//   }, [bookId]);

//   const filtered =
//     filter === "All" ? chapters : chapters.filter((ch) => ch.typeUpper === filter);

//   const handlePrev = () => {
//     if (page > 1) {
//     setPage((prev) => prev - 1);
//   }
//   };

//   const handleNext = () => {
//    if (page < (selectedChapter?.totalPages || 50)) {
//     setPage((prev) => prev + 1);
//   }

//   };

//   const handleFullscreen = () => {
//     if (!isFullscreen) {
//       if (viewerRef.current?.requestFullscreen) {
//         viewerRef.current.requestFullscreen();
//       }
//       setIsFullscreen(true);
//     } else {
//       document.exitFullscreen?.();
//       setIsFullscreen(false);
//     }
//   };

//   const getThumbSrc = (item) => {
//     if (item.thumbnailProxyUrl) return item.thumbnailProxyUrl;

//     if (item.thumbnail) {
//       return item.thumbnail.includes("/index.php/s/")
//         ? item.thumbnail + "/download"
//         : `${API_URL}/books/proxy/thumbnail?url=${encodeURIComponent(item.thumbnail)}`;
//     }

//     if (item.fileUrl) {
//       return `${API_URL}/books/proxy/thumbnail?url=${encodeURIComponent(item.fileUrl)}`;
//     }
//     return `data:image/svg+xml;utf8,${encodeURIComponent(
//       `<svg xmlns='http://www.w3.org/2000/svg' width='200' height='140'><rect width='100%' height='100%' fill='#e5e7eb'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='#9ca3af' font-family='Arial' font-size='14'>No Image</text></svg>`
//     )}`;
//   };

//   const handleImgError = (e, item) => {
//     const el = e.target;
//     const tried = el.dataset.tried === "1";

//     if (!tried) {
//       el.dataset.tried = "1";
//       if (item.thumbnail) {
//         el.src = item.thumbnail.includes("/index.php/s/")
//           ? item.thumbnail + "/download"
//           : `${API_URL}/books/proxy/thumbnail?url=${encodeURIComponent(item.thumbnail)}`;
//         return;
//       }
//       if (item.fileUrl) {
//         el.src = `${API_URL}/books/proxy/thumbnail?url=${encodeURIComponent(item.fileUrl)}`;
//         return;
//       }
//     }
//     el.src = `data:image/svg+xml;utf8,${encodeURIComponent(
//       `<svg xmlns='http://www.w3.org/2000/svg' width='200' height='140'><rect width='100%' height='100%' fill='#e5e7eb'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='#9ca3af' font-family='Arial' font-size='14'>No Image</text></svg>`
//     )}`;
//   };

//   return (
//     <div className="flex h-screen bg-[#fdf6f2] dark:bg-gray-900 transition-colors duration-300">

//       <div
//         ref={viewerRef}
//         className="flex-1 flex flex-col items-center justify-center border-r dark:border-gray-700 p-4 relative"
//       >
//          <div className="absolute top-2 left-2">
//           <button
//             onClick={() => navigate(-1)} 
//             className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 dark:text-white shadow hover:bg-gray-300 dark:hover:bg-gray-600 transition"
//           >
//             ⬅ Back
//           </button>
//         </div>

//         <div className="absolute top-2 right-2 flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 px-2 py-1 rounded shadow">
//           <button
//             onClick={handlePrev}
//             className="p-1 bg-white dark:bg-gray-800 dark:text-gray-200 shadow rounded"
//           >
//             <FiChevronLeft size={16} />
//           </button>
//           <span className="text-xs text-gray-700 dark:text-gray-200">{page}</span>
//           <button
//             onClick={handleNext}
//             className="p-1 bg-white dark:bg-gray-800 dark:text-gray-200 shadow rounded"
//           >
//             <FiChevronRight size={16} />
//           </button>
//         </div>

//         <div className="bg-[#d2dcf3] dark:bg-gray-700 w-[85%] h-[75%] flex flex-col items-center justify-center shadow-md relative rounded-lg p-6 text-center overflow-hidden">
//           {loading ? (
//             <p className="text-gray-600 dark:text-gray-300">Loading chapters...</p>
//           ) : error ? (
//             <p className="text-red-500">{error}</p>
//           ) : selectedChapter ? (
//             <>
//               {selectedChapter.resourceType === "pdf" ? (
//                 <FlipbookPDFViewer key={selectedChapter.id} chapter={selectedChapter} page={page}
//     setPage={setPage} />
//               ) : selectedChapter.resourceType === "video" ? (
//                 <video key={selectedChapter.id} controls className="w-full h-full rounded-lg">
//                   <source src={selectedChapter.file} type="video/mp4" />
//                 </video>
//               ) : selectedChapter.resourceType === "audio" ? (
//                 <audio key={selectedChapter.id} controls className="w-full">
//                   <source src={selectedChapter.file} type="audio/mpeg" />
//                 </audio>
//               ) : (
//                 <p className="text-gray-700 dark:text-gray-200">Unsupported Content</p>
//               )}
//             </>
//           ) : (
//             <p className="text-gray-700 dark:text-gray-200">Select a chapter</p>
//           )}
//         </div>

//         <div className="absolute bottom-3 right-3 flex gap-3">
//           <button onClick={handleFullscreen} className="p-2 bg-white dark:bg-gray-800 dark:text-gray-200 shadow rounded">
//             <FaExpand />
//           </button>
//         </div>
//       </div>

//       {/* Right Side - Filters & Chapters */}
//       <div className="w-[320px] bg-white dark:bg-gray-800 p-4 flex flex-col shadow-lg overflow-y-auto">
//         <div className="flex justify-between mb-4">
//           {["All", "PDF", "VIDEO", "AUDIO"].map((tab) => (
//             <button
//               key={tab}
//               onClick={() => setFilter(tab)}
//               className={`px-3 py-1 rounded-lg text-sm font-medium ${
//                 filter === tab
//                   ? "bg-blue-500 text-white"
//                   : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200"
//               }`}
//             >
//               {tab}
//             </button>
//           ))}
//         </div>

//         <div className="flex flex-col gap-3">
//           {filtered.length === 0 ? (
//             <p className="text-gray-400 text-sm dark:text-gray-300">No {filter} content found</p>
//           ) : (
//             filtered.map((item) => {
//               const thumbSrc = getThumbSrc({
//                 thumbnailProxyUrl: item.thumbnailProxyUrl,
//                 thumbnail: item.thumbnail,
//                 fileUrl: item.fileUrl,
//               });

//               return (
//                 <div
//                   key={item.id}
//                   onClick={() => {
//                     setSelectedChapter(item);
//                     setPage(1);
//                   }}
//                   className={`flex items-center w-[320px] h-[60px] rounded-lg shadow-sm cursor-pointer ${
//                     selectedChapter?.id === item.id
//                       ? "bg-blue-200 dark:bg-blue-600"
//                       : "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
//                   }`}
//                 >
//                   <div className="w-14 h-14 flex items-center justify-center bg-gray-300 dark:bg-gray-600 rounded-l-lg overflow-hidden">
//                     <img
//                       src={thumbSrc}
//                       alt={`thumb-${item.id}`}
//                       loading="lazy"
//                       data-tried="0"
//                       onError={(e) => handleImgError(e, item)}
//                       className="w-full h-full object-cover"
//                     />
//                   </div>
//                   <p className="ml-3 text-sm font-medium text-gray-800 dark:text-gray-200">{item.title}</p>
//                 </div>
//               );
//             })
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }










import { useState, useEffect, useRef } from "react";
import { FiChevronRight, FiChevronLeft } from "react-icons/fi";
import { FaExpand, FaCompress } from "react-icons/fa";
import FlipbookPDFViewer from "../../Components/FlipbookPDFViewer";
import { useNavigate, useParams } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

export default function ChaptersList() {
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("All");
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { bookId } = useParams();
  const viewerRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChapters = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/books/${bookId}/chapters`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch chapters");
        const data = await res.json();
        // const formatted = data.map((item) => {
        //   const type = (item.resourceType || "pdf").toLowerCase();
        //   return {
        //     id: item.id,
        //     chapterNumber: item.chapterNumber,
        //     fileUrl: item.fileUrl,
        //     proxyUrl: item.proxyUrl,
        //     thumbnail: item.thumbnail,
        //     thumbnailProxyUrl: item.thumbnailProxyUrl,
        //     totalPages: item.totalPages,
        //     resourceType: type,
        //     title: `Chapter ${item.chapterNumber}`,
        //     file: item.proxyUrl || item.fileUrl,
        //     typeUpper: type.toUpperCase(),
        //   };
        // });
        const formatted = data.map((item) => {
  const type = (item.resourceType || "pdf").toLowerCase();

  // Title logic
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
    resourceType: type,
    title,             // ✅ dynamically set title
    file: item.proxyUrl || item.fileUrl,
    typeUpper: type.toUpperCase(),
  };
});


        setChapters(formatted);
        if (formatted.length > 0) setSelectedChapter(formatted[0]);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (bookId) fetchChapters();
  }, [bookId]);

  const filtered =
    filter === "All" ? chapters : chapters.filter((ch) => ch.typeUpper === filter);

  const handlePrev = () => {
    if (page > 1) setPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (page < (selectedChapter?.totalPages || 50)) setPage((prev) => prev + 1);
  };

  const handleFullscreen = () => {
    setIsFullscreen((prev) => !prev);
  };

  const getThumbSrc = (item) => {
    if (item.thumbnailProxyUrl) return item.thumbnailProxyUrl;
    if (item.thumbnail) {
      return item.thumbnail.includes("/index.php/s/")
        ? item.thumbnail + "/download"
        : `${API_URL}/books/proxy/thumbnail?url=${encodeURIComponent(item.thumbnail)}`;
    }
    if (item.fileUrl) {
      return `${API_URL}/books/proxy/thumbnail?url=${encodeURIComponent(item.fileUrl)}`;
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
        : `${API_URL}/books/proxy/thumbnail?url=${encodeURIComponent(item.thumbnail)}`;
    } else if (item.fileUrl) {
      el.src = `${API_URL}/books/proxy/thumbnail?url=${encodeURIComponent(item.fileUrl)}`;
    }
  };

  return (
    <div
      className={`flex h-screen bg-[#fdf6f2] dark:bg-gray-900 transition-colors duration-300 ${
        isFullscreen ? "overflow-hidden" : ""
      }`}
    >
      {/* Viewer */}
      <div
        ref={viewerRef}
        className={`flex-1 flex flex-col items-center justify-center relative transition-all duration-300 ${
          isFullscreen ? "fixed top-0 left-0 w-full h-full z-50 p-4 bg-[#fdf6f2] dark:bg-gray-900" : "border-r dark:border-gray-700 p-4"
        }`}
      >
        {/* Page Controls */}
        <div className="absolute top-2 right-2 flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 px-2 py-1 rounded shadow z-50">
          <button
            onClick={handlePrev}
            className="p-1 bg-white dark:bg-gray-800 dark:text-gray-200 shadow rounded"
          >
            <FiChevronLeft size={16} />
          </button>
          <span className="text-xs text-gray-700 dark:text-gray-200">{page}</span>
          <button
            onClick={handleNext}
            className="p-1 bg-white dark:bg-gray-800 dark:text-gray-200 shadow rounded"
          >
            <FiChevronRight size={16} />
          </button>
        </div>

        {/* Flipbook / media viewer */}
        <div
          className={`flex flex-col items-center justify-center shadow-md rounded-lg text-center overflow-hidden transition-all duration-300 ${
            isFullscreen ? "w-full h-full" : "w-[85%] h-[75%] p-6 bg-[#d2dcf3] dark:bg-gray-700"
          }`}
        >
          {loading ? (
            <p className="text-gray-600 dark:text-gray-300">Loading chapters...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : selectedChapter ? (
            <>
              {selectedChapter.resourceType === "pdf" ? (
                <FlipbookPDFViewer
                  key={selectedChapter.id}
                  chapter={selectedChapter}
                  page={page}
                  setPage={setPage}
                  isFullscreen={isFullscreen}
                />
              ) : selectedChapter.resourceType === "video" ? (
                <video key={selectedChapter.id} controls className="w-full h-full object-contain">
                  <source src={selectedChapter.file} type="video/mp4" />
                </video>
              ) : selectedChapter.resourceType === "audio" ? (
                <audio key={selectedChapter.id} controls className="w-full">
                  <source src={selectedChapter.file} type="audio/mpeg" />
                </audio>
              ) : (
                <p className="text-gray-700 dark:text-gray-200">Unsupported Content</p>
              )}
            </>
          ) : (
            <p className="text-gray-700 dark:text-gray-200">Select a chapter</p>
          )}
        </div>

        {/* Fullscreen toggle */}
        <div className="absolute bottom-3 right-3 z-50">
          <button
            onClick={handleFullscreen}
            className="p-2 bg-white dark:bg-gray-800 dark:text-gray-200 shadow rounded"
          >
            {isFullscreen ? <FaCompress /> : <FaExpand />}
          </button>
        </div>
      </div>

      {/* Right panel - hide in fullscreen */}
      {!isFullscreen && (
        <div className="w-[320px] bg-white dark:bg-gray-800 p-4 flex flex-col shadow-lg overflow-y-auto">
          {/* Back button outside fullscreen */}
          <div className="mb-4">
            <button
              onClick={() => navigate(-1)}
              className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 dark:text-white shadow hover:bg-gray-300 dark:hover:bg-gray-600 transition"
            >
              ⬅ Back
            </button>
          </div>

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
              <p className="text-gray-400 text-sm dark:text-gray-300">No {filter} content found</p>
            ) : (
              filtered.map((item) => {
                const thumbSrc = getThumbSrc({
                  thumbnailProxyUrl: item.thumbnailProxyUrl,
                  thumbnail: item.thumbnail,
                  fileUrl: item.fileUrl,
                });
                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      setSelectedChapter(item);
                      setPage(1);
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
                    <p className="ml-3 text-sm font-medium text-gray-800 dark:text-gray-200">{item.title}</p>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
