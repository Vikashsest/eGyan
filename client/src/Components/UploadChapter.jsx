// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom"; 
// import { fetchChapters, addChapter, deleteChapter } from "../apiServices/booksApi";
// import { toast } from "react-toastify";

// export default function UploadChapter() {
//   const { bookId } = useParams();
//   const navigate = useNavigate(); 
//   const [chapterNumber, setChapterNumber] = useState("");
//   const [file, setFile] = useState(null);
//   const [thumbnail, setThumbnail] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [chapters, setChapters] = useState([]);

//   const API_URL = import.meta.env.VITE_API_URL;
//   // const getCleanUrl = (path) =>
//   //   path ? `${API_URL}/${path.replaceAll("\\", "/")}` : "";
//   const getCleanUrl = (path) => path || "";


//   // Load Chapters
//   useEffect(() => {
//     async function loadChapters() {
//       try {
//         setLoading(true);
//         const data = await fetchChapters(bookId);
//         console.log("book id",data);
        
//         setChapters(data || []);
//       } catch (err) {
//         toast.error("Error fetching chapters");
//       } finally {
//         setLoading(false);
//       }
//     }
//     loadChapters();
//   }, [bookId]);

//   // Add Chapter
//   const handleAddChapter = async () => {
//      if (!bookId) {
//     toast.error("Invalid book ID");
//     return;
//   }
//     if (!chapterNumber || !file || !thumbnail) {
//       toast.warning("Please enter a chapter number, select a file, and upload a thumbnail.");
//       return;
//     }
//     try {
//       setLoading(true);
//       const fd = new FormData();
//       fd.append("chapterNumber", chapterNumber);
//       fd.append("file", file);
//       fd.append("thumbnail", thumbnail);

//       const newChapter = await addChapter(bookId, fd);
//       setChapters((prev) => [...prev, newChapter]);
//       setChapterNumber("");
//       setFile(null);
//       setThumbnail(null);
//       toast.success("Chapter added successfully!");
//     } catch (err) {
//       toast.error("Error adding chapter");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Delete Chapter
//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this chapter?")) return;
//     try {
//       setLoading(true);
//       await deleteChapter(id);
//       setChapters((prev) => prev.filter((c) => c.id !== id));
//       toast.success("Chapter deleted successfully!");
//     } catch (err) {
//       toast.error("Error deleting chapter");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#2a2b39] flex flex-col items-center py-10 text-white">
//       <div className="bg-[#38394a] shadow-lg rounded-lg p-6 w-full max-w-2xl">
//         {/* Header with Back Button */}
//         <div className="flex justify-between items-center mb-6">
//           <h1 className="text-2xl font-bold text-center">📚 Manage Book Chapters</h1>
//           <button
//             onClick={() => navigate(-1)} // ✅ goes back to previous page
//             className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition"
//           >
//             ⬅ Back
//           </button>
//         </div>

//         {/* Form */}
//         <div className="flex flex-col gap-4 items-center">
//           {/* Chapter Number */}
//           <input
//             type="number"
//             placeholder="Enter Chapter Number"
//             className="bg-[#2a2b39] border border-gray-500 rounded-lg p-2 w-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
//             value={chapterNumber}
//             onChange={(e) => setChapterNumber(e.target.value)}
//           />

//           {/* File Upload */}
//           <div className="w-full">
//           <label>(Pdf/Videos/Audio)</label>
//           <input
//             type="file"
//             className="bg-[#2a2b39] border border-gray-500 rounded-lg p-2 mt-1 w-full text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
//             onChange={(e) => setFile(e.target.files[0])}
//           />
//           </div>

//           {/* Thumbnail Upload */}
//           <div className="w-full">
//           <label>Thumbnail Image</label>
//           <input
//             type="file"
//             accept="image/*"
//             className="bg-[#2a2b39] border border-gray-500 rounded-lg p-2 mt-1 w-full text-white focus:outline-none focus:ring-2 focus:ring-green-400"
//             onChange={(e) => setThumbnail(e.target.files[0])}
//           />
//           </div>

//           {/* Buttons */}
//           <div className="flex justify-end w-full gap-3 mt-2">
//             <button
//               type="button"
//               onClick={() => {
//                 setChapterNumber("");
//                 setFile(null);
//                 setThumbnail(null);
//                 toast.info("Form cleared");
//               }}
//               className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
//             >
//               Clear
//             </button>
//             <button
//               type="button"
//               onClick={handleAddChapter}
//               disabled={loading}
//               className={`px-4 py-2 rounded-lg transition ${
//                 loading
//                   ? "bg-blue-500 font-semibold"
//                   : " font-semibold bg-blue-500 hover:bg-blue-800"
//               } text-white`}
//             >
//               {loading ? "Uploading..." : "Upload"}
//             </button>
//           </div>
//         </div>

//         {/* Chapters List */}
//         <ul className="mt-6 divide-y divide-gray-600">
//           {chapters.length === 0 && !loading && (
//             <li className="py-3 text-center text-gray-400">No chapters found</li>
//           )}
//           {chapters.map((c) => (
//             <li key={c.id} className="flex justify-between items-center py-2">
//               <div className="flex items-center gap-3">
//                 {c.thumbnail && (
//                   <img
//                     src={getCleanUrl(c.thumbnail || c.fileUrl)}
//                     alt={c.chapterNumber}
//                     className="w-12 h-12 object-cover rounded"
//                   />
//                 )}
//                 <span>Chapter {c.chapterNumber}</span>
//               </div>
//               <button
//                 type="button"
//                 onClick={() => handleDelete(c.id)}
//                 className="bg-red-500 text-white font-semibold px-3 py-1 rounded-lg hover:bg-red-600 transition"
//               >
//                 Delete
//               </button>
//             </li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// }











// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom"; 
// import { fetchChapters, deleteChapter } from "../apiServices/booksApi";
// import { toast } from "react-toastify";

// export default function UploadChapter() {
//   const { bookId } = useParams();
//   const navigate = useNavigate(); 
//   const [chapterNumber, setChapterNumber] = useState("");
//   const [file, setFile] = useState(null);
//   const [thumbnail, setThumbnail] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [progress, setProgress] = useState(0);
//   const [chapters, setChapters] = useState([]);

//   const API_URL = import.meta.env.VITE_API_URL;
//   const getCleanUrl = (path) => path || "";

//   // Load Chapters
//   useEffect(() => {
//     async function loadChapters() {
//       try {
//         setLoading(true);
//         const data = await fetchChapters(bookId);
//         setChapters(data || []);
//       } catch (err) {
//         toast.error("Error fetching chapters");
//       } finally {
//         setLoading(false);
//       }
//     }
//     loadChapters();
//   }, [bookId]);

//   // ✅ Add Chapter with Progress
//   const handleAddChapter = async () => {
//     if (!bookId) {
//       toast.error("Invalid book ID");
//       return;
//     }
//     if (!chapterNumber || !file || !thumbnail) {
//       toast.warning("Please enter a chapter number, select a file, and upload a thumbnail.");
//       return;
//     }

//     try {
//       setLoading(true);
//       setProgress(0);

//       const fd = new FormData();
//       fd.append("chapterNumber", chapterNumber);
//       fd.append("file", file);
//       fd.append("thumbnail", thumbnail);

//       const xhr = new XMLHttpRequest();
//       xhr.open("POST", `${API_URL}/books/${bookId}/chapters`, true);

//       xhr.upload.onprogress = (event) => {
//         if (event.lengthComputable) {
//           const percent = Math.round((event.loaded * 100) / event.total);
//           setProgress(percent);
//         }
//       };

//       xhr.onload = () => {
//         if (xhr.status === 200) {
//           const newChapter = JSON.parse(xhr.responseText);
//           setChapters((prev) => [...prev, newChapter]);
//           setChapterNumber("");
//           setFile(null);
//           setThumbnail(null);
//           toast.success("Chapter added successfully!");
//         } else {
//           toast.error("Error adding chapter");
//         }
//         setLoading(false);
//         setProgress(0);
//       };

//       xhr.onerror = () => {
//         toast.error("Upload failed");
//         setLoading(false);
//         setProgress(0);
//       };

//       xhr.send(fd);
//     } catch (err) {
//       toast.error("Error adding chapter");
//       setLoading(false);
//     }
//   };

//   // Delete Chapter
//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this chapter?")) return;
//     try {
//       setLoading(true);
//       await deleteChapter(id);
//       setChapters((prev) => prev.filter((c) => c.id !== id));
//       toast.success("Chapter deleted successfully!");
//     } catch (err) {
//       toast.error("Error deleting chapter");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#2a2b39] flex flex-col items-center py-10 text-white">
//       <div className="bg-[#38394a] shadow-lg rounded-lg p-6 w-full max-w-2xl">
//         {/* Header with Back Button */}
//         <div className="flex justify-between items-center mb-6">
//           <h1 className="text-2xl font-bold text-center">📚 Manage Book Chapters</h1>
//           <button
//             onClick={() => navigate(-1)}
//             className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition"
//           >
//             ⬅ Back
//           </button>
//         </div>

//         {/* Form */}
//         <div className="flex flex-col gap-4 items-center">
//           {/* Chapter Number */}
//           <input
//             type="number"
//             placeholder="Enter Chapter Number"
//             className="bg-[#2a2b39] border border-gray-500 rounded-lg p-2 w-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
//             value={chapterNumber}
//             onChange={(e) => setChapterNumber(e.target.value)}
//           />

//           {/* File Upload */}
//           <div className="w-full">
//             <label>(Pdf/Videos/Audio)</label>
//             <input
//               type="file"
//               className="bg-[#2a2b39] border border-gray-500 rounded-lg p-2 mt-1 w-full text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
//               onChange={(e) => setFile(e.target.files[0])}
//             />
//           </div>

//           {/* Thumbnail Upload */}
//           <div className="w-full">
//             <label>Thumbnail Image</label>
//             <input
//               type="file"
//               accept="image/*"
//               className="bg-[#2a2b39] border border-gray-500 rounded-lg p-2 mt-1 w-full text-white focus:outline-none focus:ring-2 focus:ring-green-400"
//               onChange={(e) => setThumbnail(e.target.files[0])}
//             />
//           </div>

//           {/* Progress Bar */}
//           {loading && progress > 0 && (
//             <div className="w-full bg-gray-700 rounded-full h-3 mt-2">
//               <div
//                 className="bg-blue-500 h-3 rounded-full text-xs text-center text-white"
//                 style={{ width: `${progress}%` }}
//               >
//                 {progress}%
//               </div>
//             </div>
//           )}

//           {/* Buttons */}
//           <div className="flex justify-end w-full gap-3 mt-2">
//             <button
//               type="button"
//               onClick={() => {
//                 setChapterNumber("");
//                 setFile(null);
//                 setThumbnail(null);
//                 toast.info("Form cleared");
//               }}
//               className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
//             >
//               Clear
//             </button>
//             <button
//               type="button"
//               onClick={handleAddChapter}
//               disabled={loading}
//               className={`px-4 py-2 rounded-lg transition ${
//                 loading
//                   ? "bg-blue-500 font-semibold"
//                   : " font-semibold bg-blue-500 hover:bg-blue-800"
//               } text-white`}
//             >
//               {loading ? "Uploading..." : "Upload"}
//             </button>
//           </div>
//         </div>

//         {/* Chapters List */}
//         <ul className="mt-6 divide-y divide-gray-600">
//           {chapters.length === 0 && !loading && (
//             <li className="py-3 text-center text-gray-400">No chapters found</li>
//           )}
//           {chapters.map((c) => (
//             <li key={c.id} className="flex justify-between items-center py-2">
//               <div className="flex items-center gap-3">
//                 {c.thumbnail && (
//                   <img
//                     src={`${API_URL}/books/proxy/thumbnail?url=${encodeURIComponent(c.thumbnail + '/download')}`} 
//                     alt={c.chapterNumber}
//                     className="w-12 h-12 object-cover rounded"
//                   />
//                 )}
//                 <span>Chapter {c.chapterNumber}</span>
//               </div>
//               <button
//                 type="button"
//                 onClick={() => handleDelete(c.id)}
//                 className="bg-red-500 text-white font-semibold px-3 py-1 rounded-lg hover:bg-red-600 transition"
//               >
//                 Delete
//               </button>
//             </li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// }










import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom"; 
import { fetchChapters, deleteChapter } from "../apiServices/booksApi";
import { toast } from "react-toastify";

export default function UploadChapter() {
  const { bookId } = useParams();
  const navigate = useNavigate(); 
  const [chapterNumber, setChapterNumber] = useState("");
  const [file, setFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [chapters, setChapters] = useState([]);

  const API_URL = import.meta.env.VITE_API_URL;
  const progressIntervalRef = useRef(null);

  // Load Chapters
  useEffect(() => {
    async function loadChapters() {
      try {
        setLoading(true);
        const data = await fetchChapters(bookId);
        setChapters(data || []);
      } catch (err) {
        toast.error("Error fetching chapters");
      } finally {
        setLoading(false);
      }
    }
    loadChapters();
  }, [bookId]);

  // ✅ Add Chapter with fetch and simulated progress
  const handleAddChapter = async () => {
    if (!bookId) {
      toast.error("Invalid book ID");
      return;
    }
    if (!chapterNumber || !file || !thumbnail) {
      toast.warning("Please enter chapter number, select a file, and upload a thumbnail.");
      return;
    }

    try {
      setLoading(true);
      setProgress(0);

      // Simulate incremental progress
      progressIntervalRef.current = setInterval(() => {
        setProgress((prev) => {
          if (prev < 95) return prev + Math.random() * 5;
          return prev;
        });
      }, 200);

      const fd = new FormData();
      fd.append("chapterNumber", chapterNumber);
      fd.append("file", file);
      fd.append("thumbnail", thumbnail);

      const res = await fetch(`${API_URL}/books/${bookId}/chapters`, {
        method: "POST",
        body: fd,
        credentials: "include",
      });

      clearInterval(progressIntervalRef.current);

      if (!res.ok) {
        setProgress(0);
        toast.error("Error adding chapter");
        setLoading(false);
        return;
      }

      const newChapter = await res.json();
      setChapters((prev) => [...prev, newChapter]);
      setChapterNumber("");
      setFile(null);
      setThumbnail(null);
      setProgress(100);
      toast.success("Chapter added successfully!");
    } catch (err) {
      clearInterval(progressIntervalRef.current);
      setProgress(0);
      toast.error("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  // Delete Chapter
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this chapter?")) return;
    try {
      setLoading(true);
      await deleteChapter(id);
      setChapters((prev) => prev.filter((c) => c.id !== id));
      toast.success("Chapter deleted successfully!");
    } catch (err) {
      toast.error("Error deleting chapter");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#2a2b39] flex flex-col items-center py-10 text-white">
      <div className="bg-[#38394a] shadow-lg rounded-lg p-6 w-full max-w-2xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-center">📚 Manage Book Chapters</h1>
          <button
            onClick={() => navigate(-1)}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition"
          >
            ⬅ Back
          </button>
        </div>

        {/* Form */}
        <div className="flex flex-col gap-4 items-center">
          <input
            type="number"
            placeholder="Enter Chapter Number"
            className="bg-[#2a2b39] border border-gray-500 rounded-lg p-2 w-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={chapterNumber}
            onChange={(e) => setChapterNumber(e.target.value)}
          />

          <div className="w-full">
            <label>(Pdf/Videos/Audio)</label>
            <input
              type="file"
              className="bg-[#2a2b39] border border-gray-500 rounded-lg p-2 mt-1 w-full text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </div>

          <div className="w-full">
            <label>Thumbnail Image</label>
            <input
              type="file"
              accept="image/*"
              className="bg-[#2a2b39] border border-gray-500 rounded-lg p-2 mt-1 w-full text-white focus:outline-none focus:ring-2 focus:ring-green-400"
              onChange={(e) => setThumbnail(e.target.files[0])}
            />
          </div>

          {/* Progress Bar */}
          {loading && (
            <div className="w-full bg-gray-700 rounded-full h-3 mt-2">
              <div
                className="bg-blue-500 h-3 rounded-full text-xs text-center text-white transition-all duration-150"
                style={{ width: `${progress}%` }}
              >
                {Math.floor(progress)}%
              </div>
            </div>
          )}

          <div className="flex justify-end w-full gap-3 mt-2">
            <button
              type="button"
              onClick={() => {
                setChapterNumber("");
                setFile(null);
                setThumbnail(null);
                toast.info("Form cleared");
              }}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={handleAddChapter}
              disabled={loading}
              className={`px-4 py-2 rounded-lg transition ${
                loading
                  ? "bg-blue-500 font-semibold"
                  : "font-semibold bg-blue-500 hover:bg-blue-800"
              } text-white`}
            >
              {loading ? "Uploading..." : "Upload"}
            </button>
          </div>
        </div>

        {/* Chapters List */}
        <ul className="mt-6 divide-y divide-gray-600">
          {chapters.length === 0 && !loading && (
            <li className="py-3 text-center text-gray-400">No chapters found</li>
          )}
          {chapters.map((c) => (
            <li key={c.id} className="flex justify-between items-center py-2">
              <div className="flex items-center gap-3">
                {c.thumbnail && (
                  <img
                    src={`${API_URL}/books/proxy/thumbnail?url=${encodeURIComponent(c.thumbnail + '/download')}`} 
                    alt={c.chapterNumber}
                    className="w-12 h-12 object-cover rounded"
                  />
                )}
                <span>Chapter {c.chapterNumber}</span>
              </div>
              <button
                type="button"
                onClick={() => handleDelete(c.id)}
                className="bg-red-500 text-white font-semibold px-3 py-1 rounded-lg hover:bg-red-600 transition"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
