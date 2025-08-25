// import { useEffect, useState } from "react";
// import FlipbookPDFViewer from "./FlipbookPDFViewer";
// import { FaEdit, FaTrash, FaExpand, FaCompress } from "react-icons/fa";
// import { toast } from "react-toastify";
// import {
//   fetchBooks,
//   uploadBook,
//   deleteBook,
//   updateBook,
// } from "../apiServices/booksApi";
// import { useNavigate } from "react-router-dom";

// const API_URL = import.meta.env.VITE_API_URL;
// const getCleanUrl = (path) =>
//   path ? `${API_URL}/${path.replaceAll("\\", "/")}` : "";

// export default function ManageBooksPage({ role, Navbar, Sidebar }) {
//   const navigate = useNavigate();
//   const [searchTerm, setSearchTerm] = useState("");
//   const [showUploadModal, setShowUploadModal] = useState(false);
//   const [viewData, setViewData] = useState(null);
//   const [isFullscreen, setIsFullscreen] = useState(false);
//   const [bookList, setBookList] = useState([]);
//   const [editData, setEditData] = useState(null);
//   const [formData, setFormData] = useState({
//     bookName: "",
//     // category: "",
//     subject: "",
//     educationLevel: "",
//     language: "",
//     // stateBoard: "",
//     resourceType: "",
//     file: null,
//     thumbnail: null,
//   });

//   useEffect(() => {
//     async function loadBooks() {
//       const books = await fetchBooks();
//       setBookList(books);
//     }
//     loadBooks();
//   }, []);

//   const handleDelete = async (id) => {
//     try {
//       await deleteBook(id);

//       setBookList((prev) => prev.filter((book) => book.id !== id));
//       toast.success("Deleted successfully ✅");
//     } catch (err) {
//       toast.error("Delete failed ❌");
//       console.error("Delete error:", err);
//     }
//   };

//   const handleUpload = async (e) => {
//     e.preventDefault();

//     const uploadData = new FormData();
//     uploadData.append("bookName", formData.bookName);
//     // uploadData.append("category", formData.category);
//     uploadData.append("subject", formData.subject);
//     uploadData.append("educationLevel", formData.educationLevel);
//     uploadData.append("language", formData.language);
//     // uploadData.append("stateBoard", formData.stateBoard);
//     uploadData.append("resourceType", formData.resourceType);
//     if (formData.file) uploadData.append("file", formData.file);
//     if (formData.thumbnail) uploadData.append("thumbnail", formData.thumbnail);

//     try {
//       const result = await uploadBook(uploadData);

//       if (result && result.id) {
//         setBookList((prev) => [...prev, result]);
//         setShowUploadModal(false);
//         setFormData({
//           bookName: "",
//           // category: "",
//           subject: "",
//           educationLevel: "",
//           language: "",
//           // stateBoard: "",
//           resourceType: "",
//           file: null,
//           thumbnail: null,
//         });
//         toast.success(" Upload successful");
//       } else {
//         toast.error("Upload failed ❌");
//       }
//     } catch (error) {
//       toast.error("Something went wrong during upload ❌");
//       console.error("Upload Error:", error);
//     }
//   };

//   const handleUpdate = async (e) => {
//     e.preventDefault();

//     const fd = new FormData();
//     Object.entries(editData).forEach(([key, value]) => {
//       if ((key === "file" || key === "thumbnail") && value instanceof File) {
//         fd.append(key, value);
//       } else {
//         fd.append(key, value);
//       }
//     });

//     try {
//       const result = await updateBook(editData.id, fd); 
//       if (result) {
//         setBookList((prev) =>
//           prev.map((book) => (book.id === editData.id ? result : book))
//         );
//         setEditData(null);
//         toast.success("✅ Book updated");
//       }
//     } catch (err) {
//       toast.error("Update failed ❌");
//       console.error("Update error:", err);
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
//         return "📁 Open";
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
//       {Sidebar && <Sidebar />}
//       <main className="pl-[280px] py-6 pr-5 w-full">
//         {Navbar && (
//           <Navbar
//             searchTerm={searchTerm}
//             onSearchChange={setSearchTerm}
//             onAdd={() => setShowUploadModal(true)}
//             buttonLabel="+ Upload Book"
//             searchPlaceholder="Search Books..."
//           />
//         )}

//         <h1 className="text-2xl font-bold mb-4">📘 Manage Books</h1>

//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
//           {bookList
//             .filter((b) =>
//               b?.bookName?.toLowerCase().includes(searchTerm.toLowerCase())
//             )
//             .map((b) => (
//               <div
//                 key={b.id}
//                 className="bg-white/10 border border-white/20 rounded-2xl shadow-md p-4 flex flex-col hover:shadow-xl hover:scale-105 transition-all duration-300"
//               >
//                 <div className="flex flex-col items-center gap-3">
//                   {/* Thumbnail */}
//                   <div className="relative w-full h-36  lg:h-44 bg-black/10 rounded-lg overflow-hidden">
//                     <img
//                       src={getCleanUrl(b.thumbnail || b.fileUrl)}
//                       alt={b.bookName}
//                       className="w-full h-full object-contain p-2"
//                     />
//                     <span className="absolute top-2 right-2 bg-white/20 text-xs px-2 py-1 rounded-full text-white border border-white/30 backdrop-blur-sm">
//                       {b.resourceType}
//                     </span>
//                   </div>

//                   {/* Text Section */}
//                   <div className="text-center w-full break-words">
//                     <h3 className="text-base text-md lg:text-lg font-bold mb-1">
//                       {b.bookName}
//                     </h3>
//                     <p className="text-sm sm:text-base text-gray-300 mb-1">
//                       {b.subject}
//                     </p>
//                     <p className="text-xs sm:text-sm text-gray-400">
//                       🎓 {b.educationLevel}
//                     </p>
//                   </div>
//                 </div>

//                 {/* Actions */}
//                 <div className="flex flex-col mt-auto pt-2 border-t border-white/20">
//                   <button
//                     onClick={() => setViewData(b)}
//                     className="w-full text-sm sm:text-base text-blue-400 hover:text-blue-300 font-semibold "
//                   >
//                     {getViewLabel(b.resourceType)}
//                   </button>

//                   {role === "admin" && (
//                     <div className="flex justify-between">
//                       <button
//                         onClick={() => setEditData(b)}
//                         className="text-yellow-400 hover:text-yellow-300 text-lg"
//                       >
//                         <FaEdit />
//                       </button>
//                       <button
//                         onClick={() => handleDelete(b.id)}
//                         className="text-red-500 hover:text-red-400 text-lg"
//                       >
//                         <FaTrash />
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             ))}
//         </div>

//         {showUploadModal && (
//           <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center">
//             <div className="bg-white text-black rounded-lg w-[95%] max-w-xl max-h-[90vh] overflow-y-auto p-4 sm:p-6 shadow-lg">
//               <h2 className="text-2xl font-semibold mb-4 text-center">
//                 📤 Upload Book
//               </h2>

//               <form className="grid gap-4" onSubmit={handleUpload}>
//                 {[
//                   "bookName",
//                   // "category",
//                   "subject",
//                   "educationLevel",
//                   "language",
//                   // "stateBoard",
//                   "resourceType",
//                 ].map((field) => (
//                   <input
//                     key={field}
//                     type="text"
//                     name={field}
//                     placeholder={field}
//                     className="w-full border border-gray-300 p-2 rounded text-sm"
//                     onChange={(e) =>
//                       setFormData((prev) => ({
//                         ...prev,
//                         [field]: e.target.value,
//                       }))
//                     }
//                     required
//                   />
//                 ))}

//                 <div>
//                   <label className="text-sm font-medium">
//                     (Pdf/Videos/Audios)
//                   </label>
//                   <input
//                     type="file"
//                     accept=".pdf,video/*,audio/*"
//                     required
//                     className="w-full border p-2 rounded text-sm"
//                     onChange={(e) =>
//                       setFormData((prev) => ({
//                         ...prev,
//                         file: e.target.files[0],
//                       }))
//                     }
//                   />
//                 </div>

//                 <div>
//                   <label className="text-sm font-medium">Thumbnail Image</label>
//                   <input
//                     type="file"
//                     accept="image/*"
//                     className="w-full border p-2 rounded text-sm"
//                     onChange={(e) =>
//                       setFormData((prev) => ({
//                         ...prev,
//                         thumbnail: e.target.files[0],
//                       }))
//                     }
//                   />
//                 </div>

//                 <div className="flex justify-end gap-3 mt-4">
//                   <button
//                     type="button"
//                     onClick={() => setShowUploadModal(false)}
//                     className="px-4 py-1 border rounded hover:bg-gray-100"
//                   >
//                     ❌ Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
//                   >
//                     ✅ Upload
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         )}

//         {editData && (
//           <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center">
//             <div className="bg-white text-black rounded-lg w-[95%] max-w-xl max-h-[90vh] overflow-y-auto p-4 sm:p-6 shadow-lg">
//               <h2 className="text-2xl font-semibold mb-4 text-center">
//                 ✏️ Edit Book
//               </h2>

//               <form className="grid gap-4" onSubmit={handleUpdate}>
//                 {[
//                   "bookName",
//                   // "subject",
//                   "educationLevel",
//                   "language",
//                   "resourceType",
//                 ].map((field) => (
//                   <input
//                     key={field}
//                     type="text"
//                     name={field}
//                     value={editData[field] || ""}
//                     onChange={(e) =>
//                       setEditData((prev) => ({
//                         ...prev,
//                         [field]: e.target.value,
//                       }))
//                     }
//                     placeholder={field}
//                     className="w-full border border-gray-300 p-2 rounded text-sm"
//                     required
//                   />
//                 ))}

//                 <div>
//                   <label className="text-sm font-medium">
//                     (Pdf/Videos/Audios)
//                   </label>
//                   <input
//                     type="file"
//                     accept=".pdf,video/*,audio/*"
//                     className="w-full border p-2 rounded text-sm"
//                     onChange={(e) =>
//                       setEditData((prev) => ({
//                         ...prev,
//                         file: e.target.files[0],
//                       }))
//                     }
//                   />
//                 </div>

//                 <div>
//                   <label className="text-sm font-medium">Thumbnail Image</label>
//                   <input
//                     type="file"
//                     accept="image/*"
//                     className="w-full border p-2 rounded text-sm"
//                     onChange={(e) =>
//                       setEditData((prev) => ({
//                         ...prev,
//                         thumbnail: e.target.files[0],
//                       }))
//                     }
//                   />
//                 </div>

//                 <div className="flex justify-end gap-3 mt-4">
//                   <button
//                     type="button"
//                     onClick={() => setEditData(null)}
//                     className="px-4 py-1 border rounded hover:bg-gray-100"
//                   >
//                     ❌ Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
//                   >
//                     ✅ Update
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         )}
//         {viewData && (
//           <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex justify-center items-center">
//             <div className="relative w-full h-full flex items-center justify-center">
//               <div className="relative bg-white/10 backdrop-blur-md shadow-2xl rounded-xl border border-white/20 w-[95%] h-[90%] max-w-6xl max-h-[95%] overflow-hidden flex flex-col view-modal-container">
//                 <div className="flex items-center justify-between px-6 py-4 bg-white/5 border-b border-white/20">
//                   <h2 className="text-xl font-bold text-white">
//                     <button
//                       onClick={() => {
//                         navigate(`/books/${viewData.id}`);
//                       }}
//                       className="w-full text-sm text-blue-400 hover:text-blue-300 font-semibold"
//                     >
//                       {getViewLabel(viewData.resourceType)}
//                     </button>
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
//                   {viewData?.resourceType?.toLowerCase() === "pdf" &&
//                     viewData?.id && (
//                       <FlipbookPDFViewer
//                         fileUrl={getCleanUrl(viewData.fileUrl)}
//                         bookId={viewData.id}
//                       />
//                     )}
//                   {viewData.resourceType?.toLowerCase() === "video" && (
//                     <video controls className="w-full h-full object-contain">
//                       <source
//                         src={getCleanUrl(viewData.fileUrl)}
//                         type="video/mp4"
//                       />
//                     </video>
//                   )}

//                   {viewData.resourceType?.toLowerCase() === "audio" && (
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
// }









import { useEffect, useState } from "react";
import FlipbookPDFViewer from "./FlipbookPDFViewer";
import { FaEdit, FaTrash, FaExpand, FaCompress } from "react-icons/fa";
import { toast } from "react-toastify";
import {
  fetchBooks,
  uploadBook,
  deleteBook,
  updateBook,
} from "../apiServices/booksApi";
import { useNavigate } from "react-router-dom";


const API_URL = import.meta.env.VITE_API_URL;
const getCleanUrl = (path) =>
  path ? path.replaceAll("\\", "/") : "";




export default function ManageBooksPage({ role, Navbar, Sidebar }) {
const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [viewData, setViewData] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [bookList, setBookList] = useState([]);
  const [editData, setEditData] = useState(null);
  const [formData, setFormData] = useState({
    bookName: "",
    // chapter: "",
     category:"",
    subject: "",
    educationLevel: "",
    language: "",
    // stateBoard: "",
    resourceType: "",
    file: null,
    thumbnail: null,
  });
 
  useEffect(() => {
    async function loadBooks() {
      const books = await fetchBooks();
     console.log(books[0].fileUrl);

      
      setBookList(books);
    }
    loadBooks();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteBook(id);

      setBookList((prev) => prev.filter((book) => book.id !== id));
      toast.success("Deleted successfully ✅");
    } catch (err) {
      toast.error("Delete failed ❌");
      console.error("Delete error:", err);
    }
  };

const handleUpload = async (e) => {
  e.preventDefault();

  const uploadData = new FormData();
  uploadData.append("bookName", formData.bookName);
  uploadData.append("category", formData.category);
  uploadData.append("subject", formData.subject);
  uploadData.append("educationLevel", formData.educationLevel);
  uploadData.append("language", formData.language);
  uploadData.append("resourceType", formData.resourceType);
  if (formData.file) uploadData.append("file", formData.file);
  if (formData.thumbnail) uploadData.append("thumbnail", formData.thumbnail);

  try {
    const result = await uploadBook(uploadData);

    if (result && result.id) {
      setBookList((prev) => [...prev, result]);
      setShowUploadModal(false);
      setFormData({
        bookName: "",
        subject: "",
        category: "",
        educationLevel: "",
        language: "",
        resourceType: "",
        file: null,
        thumbnail: null,
      });
navigate(`/books/${result.id}/chapters`);


      toast.success("Book uploaded successfully ✅");
    } else {
      toast.error("Upload failed ❌");
    }
  } catch (error) {
    toast.error("Something went wrong during upload ❌");
    console.error("Upload Error:", error);
  }
};

   const getViewLabel = (type) => {
    switch (type?.toLowerCase()) {
      case "pdf":
        return "📄 View";
      case "video":
        return "▶️ Play";
      case "audio":
        return "🔊 Listen";
      default:
        return "📁 Open";
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
      {Sidebar && <Sidebar />}
      <main className="pl-[280px] py-6 pr-5 w-full">
        {Navbar && (
          <Navbar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onAdd={() => setShowUploadModal(true)}
            buttonLabel="+ Upload Book"
            searchPlaceholder="Search Books..."
          />
        )}

        <h1 className="text-2xl font-bold mb-4">📘 Manage Books</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {bookList
            .filter((b) =>
              b?.bookName?.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((b) => (
              <div
                key={b.id}
                className="bg-white/10 border border-white/20 rounded-2xl shadow-md p-4 flex flex-col hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                <div className="flex flex-col items-center gap-3">
                  {/* Thumbnail */}
                  <div className="relative w-full h-36  lg:h-44 bg-black/10 rounded-lg overflow-hidden">
                    <img
                         src={`${API_URL}/books/proxy/thumbnail?url=${encodeURIComponent(b.thumbnail + '/download')}`} 
                      alt={b.bookName}
                      className="w-full h-full object-contain p-2"
                    />
                    <span className="absolute top-2 right-2 bg-white/20 text-xs px-2 py-1 rounded-full text-white border border-white/30 backdrop-blur-sm">
                      {b.resourceType}
                    </span>
                  </div>

                  {/* Text Section */}
                  <div className="text-center w-full break-words">
                    <h3 className="text-base text-md lg:text-lg font-bold mb-1">
                      {b.bookName}
                    </h3>
                    <p className="text-sm sm:text-base text-gray-300 mb-1">
                      {b.subject}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-400">
                      🎓 {b.educationLevel}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col mt-auto pt-2 border-t border-white/20">
                  <button
                    onClick={() => setViewData(b)}
                    className="w-full text-sm sm:text-base text-blue-400 hover:text-blue-300 font-semibold "
                  >
                    {getViewLabel(b.resourceType)}
                  </button>

                  {role === "admin" && (
                    <div className="flex justify-between">
                      <button
                        onClick={() => setEditData(b)}
                        className="text-yellow-400 hover:text-yellow-300 text-lg"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(b.id)}
                        className="text-red-500 hover:text-red-400 text-lg"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
        </div>

        {showUploadModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center">
            <div className="bg-white text-black rounded-lg w-[95%] max-w-xl max-h-[90vh] overflow-y-auto p-4 sm:p-6 shadow-lg">
              <h2 className="text-2xl font-semibold mb-4 text-center">
                📤 Upload Book
              </h2>

              <form className="grid gap-4" onSubmit={handleUpload}>
                {[
                  "bookName",
                  // "chapter",
                  "subject",
                  "category",
                  "educationLevel",
                  "language",
                  // "stateBoard",
                  "resourceType",
                ].map((field) => (
                  <input
                    key={field}
                    type="text"
                    name={field}
                    placeholder={field}
                    className="w-full border border-gray-300 p-2 rounded text-sm"
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        [field]: e.target.value,
                      }))
                    }
                    // required/
                  />
                ))}

                <div>
                  <label className="text-sm font-medium">
                    (Pdf/Videos/Audios)
                  </label>
                  <input
                    type="file"
                    accept=".pdf,video/*,audio/*"
                    // required
                    className="w-full border p-2 rounded text-sm"
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        file: e.target.files[0],
                      }))
                    }
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Thumbnail Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    className="w-full border p-2 rounded text-sm"
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        thumbnail: e.target.files[0],
                      }))
                    }
                  />
                </div>

                <div className="flex justify-end gap-3 mt-4">
                  <button
                    type="button"
                    onClick={() => setShowUploadModal(false)}
                    className="px-4 py-1 border rounded hover:bg-gray-100"
                  >
                    ❌ Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    ✅ Upload
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {editData && (
          <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center">
            <div className="bg-white text-black rounded-lg w-[95%] max-w-xl max-h-[90vh] overflow-y-auto p-4 sm:p-6 shadow-lg">
              <h2 className="text-2xl font-semibold mb-4 text-center">
                ✏️ Edit Book
              </h2>

              <form
                className="grid gap-4"
          onSubmit={async (e) => {
  e.preventDefault();

  const allowedFields = [
    "bookName",
    "category",
    "subject",
    "educationLevel",
    "language",
    // "stateBoard",
    "resourceType",
    // "chapter",
    "file",       
    "thumbnail",  
    "totalPages"  
  ];

  const fd = new FormData();

  allowedFields.forEach((key) => {
    if (editData[key] !== undefined && editData[key] !== null) {
      fd.append(key, editData[key]);
    }
  });

  try {
    const res = await fetch(`${API_URL}/books/${editData.id}`, {
      method: "PATCH",
      body: fd,
      credentials: "include",
    });

    const result = await res.json();
    if (res.ok) {
    setBookList((prev) =>
  prev.map((book) =>
    book.id === editData.id ? result.book || result : book
  )
);
      setEditData(null);
      toast.success("✅ Book updated");
    } else {
      toast.error(result.message || "Update failed ❌");
    }
  } catch (err) {
    console.error("Update error:", err);
    toast.error("Something went wrong ❗");
  }
}}

              >
                {[
                  "bookName",
                  // "chapter",
                  "subject",
                  "category",
                  "educationLevel",
                  "language",
                  // "stateBoard",
                  "resourceType",
                ].map((key) => (
                  <input
                    key={key}
                    type="text"
                    name={key}
                    value={editData[key] || ""}
                    onChange={(e) =>
                      setEditData((prev) => ({
                        ...prev,
                        [key]: e.target.value,
                      }))
                    }
                    placeholder={key}
                    className="w-full border border-gray-300 p-2 rounded text-sm"
                    // required
                  />
                ))}

                <div>
                  <label className="text-sm font-medium">
                    Main File (PDF / Video / Audio)
                  </label>
                  <input
                    type="file"
                    accept=".pdf,video/*,audio/*"
                    className="w-full border p-2 rounded text-sm"
                    onChange={(e) =>
                      setEditData((prev) => ({
                        ...prev,
                        file: e.target.files[0],
                      }))
                    }
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Thumbnail Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    className="w-full border p-2 rounded text-sm"
                    onChange={(e) =>
                      setEditData((prev) => ({
                        ...prev,
                        thumbnail: e.target.files[0],
                      }))
                    }
                  />
                </div>

                <div className="flex justify-end gap-3 mt-4">
                  <button
                    type="button"
                    onClick={() => setEditData(null)}
                    className="px-4 py-1 border rounded hover:bg-gray-100"
                  >
                    ❌ Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    ✅ Update
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {viewData && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex justify-center items-center">
            <div className="relative w-full h-full flex items-center justify-center">
              <div className="relative bg-white/10 backdrop-blur-md shadow-2xl rounded-xl border border-white/20 w-[95%] h-[90%] max-w-6xl max-h-[95%] overflow-hidden flex flex-col view-modal-container">
                <div className="flex items-center justify-between px-6 py-4 bg-white/5 border-b border-white/20">
                  <h2 className="text-xl font-bold text-white">
                   <button
               onClick={() => {  navigate(`/books/${viewData.id}`);}}
                    className="w-full text-sm text-blue-400 hover:text-blue-300 font-semibold"
                  >
                    {getViewLabel(viewData.resourceType)}
                  </button>
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
                 {viewData?.resourceType?.toLowerCase() === "pdf" && viewData?.id && (
  <FlipbookPDFViewer
    fileUrl={viewData.chapters[0].fileUrl}
  bookId={viewData.id} 

  />
)}
                  {viewData.resourceType?.toLowerCase() === "video" && (
                    <video controls className="w-full h-full object-contain">
                      <source
                        src={getCleanUrl(viewData.fileUrl)}
                        type="video/mp4"
                      />
                    </video>
                  )}

                  {viewData.resourceType?.toLowerCase() === "audio" && (
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
}
