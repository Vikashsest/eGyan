// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import StudentNavbar from "./StudentNavbar";
// import StudentSidebar from "./StudentSidebar";
// import { fetchBooks, fetchFavoriteBooks, toggleFavoriteBook } from "../../apiServices/booksApi";
// import { FaHeart, FaRegHeart } from "react-icons/fa";

// const API_URL = import.meta.env.VITE_API_URL;
// const getCleanUrl = (path) => (path ? `${API_URL}/${path.replaceAll("\\", "/")}` : "");

// const EpathshalaBooks = () => {
//   const [allBooks, setAllBooks] = useState([]);
//   const [books, setBooks] = useState([]);
//   const [filterOptions, setFilterOptions] = useState({
//     educationLevels: [],
//     subjects: [],
//     bookNames: [],
//   });

//   const [selectedEducationLevel, setSelectedEducationLevel] = useState("");
//   const [selectedSubject, setSelectedSubject] = useState("");
//   const [selectedBookName, setSelectedBookName] = useState("");

//   const navigate = useNavigate();

//   useEffect(() => {
//     async function loadBooks() {
//       try {
//         const [bookData, favoriteIds] = await Promise.all([fetchBooks(), fetchFavoriteBooks()]);
//         const booksWithFavorites = bookData.map((book) => ({
//           ...book,
//           isFavorite: favoriteIds.includes(book.id),
//         }));
//        console.log(booksWithFavorites)
//         setAllBooks(booksWithFavorites);
//         setBooks(booksWithFavorites);

//         // Populate educationLevels filter options from all books
//         const educationLevels = [...new Set(bookData.map((book) => book.educationLevel))];
//         setFilterOptions((prev) => ({ ...prev, educationLevels }));
//       } catch (error) {
//         console.error("Failed to load books or favorites:", error);
//       }
//     }

//     loadBooks();
//   }, []);

//   useEffect(() => {
//     if (selectedEducationLevel) {
//       const subjects = [
//         ...new Set(
//           allBooks
//             .filter((b) => b.educationLevel === selectedEducationLevel)
//             .map((b) => b.subject)
//         ),
//       ];
//       setFilterOptions((prev) => ({ ...prev, subjects }));
//       setSelectedSubject("");
//       setSelectedBookName("");
//     }
//   }, [selectedEducationLevel]);

//   useEffect(() => {
//     if (selectedSubject) {
//       const names = [
//         ...new Set(
//           allBooks
//             .filter(
//               (b) =>
//                 b.educationLevel === selectedEducationLevel &&
//                 b.subject === selectedSubject
//             )
//             .map((b) => b.bookName)
//         ),
//       ];
//       setFilterOptions((prev) => ({ ...prev, bookNames: names }));
//       setSelectedBookName("");
//     }
//   }, [selectedSubject]);

//   const handleGoClick = () => {
//     const filtered = allBooks.filter((b) => {
//       return (
//         (!selectedEducationLevel || b.educationLevel === selectedEducationLevel) &&
//         (!selectedSubject || b.subject === selectedSubject) &&
//         (!selectedBookName || b.bookName === selectedBookName)
//       );
//     });
//     setBooks(filtered);
//   };

//   const handleResetFilters = () => {
//     setSelectedEducationLevel("");
//     setSelectedSubject("");
//     setSelectedBookName("");
//     setBooks(allBooks);
//   };

//   const toggleFavorite = async (bookId) => {
//     try {
//       await toggleFavoriteBook(bookId);
//       setBooks((prevBooks) =>
//         prevBooks.map((b) => (b.id === bookId ? { ...b, isFavorite: !b.isFavorite } : b))
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
//         return "📁 Open";
//     }
//   };

//   return (
//     <div className="flex min-h-screen bg-[#1e1f2b] text-white">
//       <StudentSidebar />
//       <main className="pl-[280px] py-6 pr-5 w-full">
//         <StudentNavbar />
//         <div className="flex flex-wrap gap-4 justify-start mb-6">
//           <button
//             onClick={handleResetFilters}
//             className="bg-[#3b3c4e] text-white px-4 py-2 font-semibold rounded  transition-colors"
//           >
//             All
//           </button>

//           {/* Removed Category filter */}

//           <select
//             value={selectedEducationLevel}
//             onChange={(e) => setSelectedEducationLevel(e.target.value)}
//             className="bg-[#3b3c4e] text-white px-3 py-2 rounded focus:outline-none"
//           >
//             <option value="">Select Education Level</option>
//             {filterOptions.educationLevels.map((level, i) => (
//               <option key={i} value={level}>
//                 {level}
//               </option>
//             ))}
//           </select>

//           <select
//             value={selectedSubject}
//             onChange={(e) => setSelectedSubject(e.target.value)}
//             disabled={!selectedEducationLevel}
//             className="bg-[#3b3c4e] text-white px-3 py-2 rounded focus:outline-none"
//           >
//             <option value="">Select Subject</option>
//             {filterOptions.subjects.map((sub, i) => (
//               <option key={i} value={sub}>
//                 {sub}
//               </option>
//             ))}
//           </select>

//           <select
//             value={selectedBookName}
//             onChange={(e) => setSelectedBookName(e.target.value)}
//             disabled={!selectedSubject}
//             className="bg-[#3b3c4e] text-white px-3 py-2 rounded focus:outline-none"
//           >
//             <option value="">Select Book</option>
//             {filterOptions.bookNames.map((book, i) => (
//               <option key={i} value={book}>
//                 {book}
//               </option>
//             ))}
//           </select>

//           <button
//             onClick={handleGoClick}
//             className="bg-blue-500 text-white px-4 py-2 font-semibold rounded hover:bg-blue-600 transition-colors"
//           >
//             Go
//           </button>
//         </div>

//         {/* Book Cards */}
//         {books.length > 0 ? (
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
//             {books.map((b) => (
//               <div
//                 key={b.id}
//                 className="bg-white/10 border border-white/20 rounded-2xl shadow-md p-4 flex flex-col hover:shadow-xl hover:scale-105 transition-all duration-300"
//               >
//                 <div className="relative w-full h-36 bg-black/10 rounded-lg overflow-hidden">
//                   <img
//                     src={getCleanUrl(b.thumbnail || b.fileUrl)}
//                     alt={b.bookName}
//                     className="w-full h-full object-contain p-2"
//                   />
//                   <span className="absolute top-2 right-2 bg-white/20 text-xs px-2 py-1 rounded-full text-white border border-white/30 backdrop-blur-sm">
//                     {b.resourceType}
//                   </span>
//                   <button
//                     className="absolute top-2 left-2 text-red-400 hover:text-red-600 text-lg"
//                     onClick={() => toggleFavorite(b.id)}
//                   >
//                     {b.isFavorite ? <FaHeart /> : <FaRegHeart />}
//                   </button>
//                 </div>

//                 <div className="text-center w-full break-words">
//                   <h3 className="text-base font-bold mb-1">{b.bookName}</h3>
//                   <p className="text-sm text-gray-300 mb-1">{b.subject}</p>
//                   <p className="text-xs text-gray-400">🎓 {b.educationLevel}</p>
//                 </div>
//                 <div className="flex flex-col mt-auto pt-2 border-t border-white/20">
//                   <button
//                     onClick={() => navigate(`/books/${b.id}`)}
//                     className="w-full text-sm text-blue-400 hover:text-blue-300 font-semibold"
//                   >
//                     {getViewLabel(b.resourceType)}
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <p className="text-center mt-6 text-gray-400">No books found.</p>
//         )}
//       </main>
//     </div>
//   );
// };

// export default EpathshalaBooks;










import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import StudentNavbar from "./StudentNavbar";
import StudentSidebar from "./StudentSidebar";
import { fetchBooks } from "../../apiServices/booksApi";
import { FaBookReader } from "react-icons/fa";
import { FiMenu } from "react-icons/fi";

const Books = () => {
  const [categories, setCategories] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadCategories() {
      try {
        const bookData = await fetchBooks();

        // API se unique categories extract
        const uniqueCategories = [
          ...new Set(bookData.map((book) => book.category).filter(Boolean)),
        ];

        setCategories(uniqueCategories);
      } catch (error) {
        console.error("Failed to load categories:", error);
      }
    }

    loadCategories();
  }, []);

  return (
    <div className="flex min-h-screen bg-[#1e1f2b] text-white relative">
      {/* Sidebar */}
      <StudentSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Overlay for mobile when sidebar open */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <main className="flex-1 lg:pl-[280px] py-6 px-4 sm:px-6 w-full">
        {/* Mobile Menu Icon */}
        <div className="lg:hidden mb-4 flex items-center">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="text-white focus:outline-none"
          >
            <FiMenu size={28} />
          </button>
        </div>

        <StudentNavbar />

        <h2 className="text-2xl font-bold mb-6">📚 Category</h2>

        {categories.length > 0 ? (
          <div
            className="grid 
              grid-cols-1  
              md:grid-col-2 
              lg:grid-cols-4 
              gap-4 sm:gap-6"
          >
            {categories.map((cat, index) => (
              <div
                key={index}
                onClick={() => navigate(`/classes?category=${cat}`)}
                className="p-5 sm:p-6 rounded-2xl shadow-lg border border-gray-300 
                bg-[#3b3c4e] text-white flex flex-col items-center justify-center 
                hover:scale-105 transform transition-all duration-300 cursor-pointer"
              >
                <FaBookReader className="text-blue-400 text-4xl sm:text-5xl mb-3 sm:mb-4 drop-shadow-lg" />
                <h3 className="text-base sm:text-lg md:text-xl font-bold text-center">
                  {cat}
                </h3>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center mt-6 text-gray-400">No categories found.</p>
        )}
      </main>
    </div>
  );
};

export default Books;
