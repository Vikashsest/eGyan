// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import StudentNavbar from "./StudentNavbar";
// import StudentSidebar from "./StudentSidebar";
// import { fetchBooks, fetchFavoriteBooks, toggleFavoriteBook } from "../../apiServices/booksApi";
// import { FaArrowLeft, FaHeart, FaRegHeart } from "react-icons/fa";

// const API_URL = import.meta.env.VITE_API_URL;

// const BooksList = () => {
//   const { className, subject } = useParams();
//   const [books, setBooks] = useState([]);
//   const navigate = useNavigate();

//   const getCleanUrl = (path) => (path ? `${API_URL}/${path.replaceAll("\\", "/")}` : "");
//   const normalizeClass = (name) => {
//     if (!name) return "";
//     return name
//       .toLowerCase()
//       .replace(/\s+/g, "") 
//       .replace(/i+/g, "1") 
//       .replace(/ii/g, "2")
//       .replace(/iii/g, "3")
//       .replace(/iv/g, "4")
//       .replace(/v/g, "5");
//   };

//   useEffect(() => {
//     async function loadBooks() {
//       try {
//         const [allBooks, favoriteIds] = await Promise.all([fetchBooks(), fetchFavoriteBooks()]);
//         const decodedSubject = decodeURIComponent(subject);

//         const filteredBooks = allBooks.filter((b) => {
//           return (
//             b.educationLevel &&
//             b.subject &&
//             normalizeClass(b.educationLevel) === normalizeClass(className) &&
//             b.subject.toLowerCase() === decodedSubject.toLowerCase()
//           );
//         });

//         // Make unique by bookName
//         const uniqueBooksMap = {};
//         filteredBooks.forEach(book => {
//           const key = book.bookName.toLowerCase().trim();
//           if (!uniqueBooksMap[key]) uniqueBooksMap[key] = book;
//         });
//         const uniqueBooks = Object.values(uniqueBooksMap);

//         // Mark favorites
//         const booksWithFavorites = uniqueBooks.map((b) => ({
//           ...b,
//           isFavorite: favoriteIds.includes(b.id),
//         }));

//         setBooks(booksWithFavorites);
//       } catch (error) {
//         console.error("Failed to load books or favorites:", error);
//       }
//     }
//     loadBooks();
//   }, [className, subject]);

//   const handleBookClick = (bookId) => {
//    console.log("bookId",bookId);
 

//     navigate(`/student/books/${bookId}/chapters`);

// };

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

//         <h2 className="text-2xl font-bold mb-6">
//           📚 Books for {subject} ({className})
//         </h2>

//         {books.length > 0 ? (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//             {books.map((book) => (
//               <div
//                 key={book.id}
//                 className="p-4 rounded-2xl shadow-lg border-2 border-white bg-[#3b3c4e] hover:scale-105 transform transition-all duration-300 cursor-pointer"
//               >
//                 <div className="relative w-full h-48 overflow-hidden rounded-lg bg-gray-700 flex items-center justify-center">
//                   {book.thumbnail ? (
//                     <img
//                       src={getCleanUrl(book.thumbnail || book.fileUrl)}
//                       alt={book.bookName}
//                       className="w-full h-full object-cover"
//                       onClick={() => handleBookClick(book.id)}
//                     />
//                   ) : (
//                     <p className="text-gray-300">No Image</p>
//                   )}
//                   <button
//                     className="absolute top-2 right-2 text-red-400 hover:text-red-600 text-lg"
//                     onClick={() => toggleFavorite(book.id)}
//                   >
//                     {book.isFavorite ? <FaHeart /> : <FaRegHeart />}
//                   </button>
//                 </div>
//                 <div className="mt-4 text-center">
//                   <h3 className="text-lg font-bold">{book.bookName}</h3>
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <p className="text-gray-400 text-center mt-6">
//             No books found for this subject.
//           </p>
//         )}
//       </main>
//     </div>
//   );
// };

// export default BooksList;














import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import StudentNavbar from "./StudentNavbar";
import StudentSidebar from "./StudentSidebar";
import { fetchBooks, fetchFavoriteBooks, toggleFavoriteBook } from "../../apiServices/booksApi";
import { FaArrowLeft, FaHeart, FaRegHeart } from "react-icons/fa";
import { FiMenu } from "react-icons/fi";

const API_URL = import.meta.env.VITE_API_URL;

const BooksList = () => {
  const { className, subject } = useParams();
  const location = useLocation();
  const [books, setBooks] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const category = queryParams.get("category");

  const normalizeClass = (name) => {
    if (!name) return "";
    return name
      .toLowerCase()
      .replace(/\s+/g, "")
      .replace(/i+/g, "1")
      .replace(/ii/g, "2")
      .replace(/iii/g, "3")
      .replace(/iv/g, "4")
      .replace(/v/g, "5");
  };

  useEffect(() => {
    async function loadBooks() {
      try {
        const [allBooks, favoriteIds] = await Promise.all([fetchBooks(), fetchFavoriteBooks()]);
        let filteredBooks = [];

        if (category) {
          filteredBooks = allBooks.filter((b) => b.category === category);
        } else if (className && subject) {
          const decodedSubject = decodeURIComponent(subject);
          filteredBooks = allBooks.filter(
            (b) =>
              b.educationLevel &&
              b.subject &&
              normalizeClass(b.educationLevel) === normalizeClass(className) &&
              b.subject.toLowerCase() === decodedSubject.toLowerCase()
          );
        }

        // Unique books by name
        const uniqueBooksMap = {};
        filteredBooks.forEach((book) => {
          const key = book.bookName.toLowerCase().trim();
          if (!uniqueBooksMap[key]) uniqueBooksMap[key] = book;
        });

        const booksWithFavorites = Object.values(uniqueBooksMap).map((b) => ({
          ...b,
          isFavorite: favoriteIds.includes(b.id),
        }));

        setBooks(booksWithFavorites);
      } catch (error) {
        console.error("Failed to load books or favorites:", error);
      }
    }

    loadBooks();
  }, [className, subject, category]);

  const handleBookClick = (bookId) => {
    navigate(`/student/books/${bookId}/chapters`);
  };

  const toggleFavorite = async (bookId) => {
    try {
      await toggleFavoriteBook(bookId);
      setBooks((prevBooks) =>
        prevBooks.map((b) => (b.id === bookId ? { ...b, isFavorite: !b.isFavorite } : b))
      );
    } catch (err) {
      console.error("Failed to toggle favorite:", err);
    }
  };

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


        <button
          onClick={() => navigate(-1)}
          className="flex items-center mb-6 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg shadow-md transition"
        >
          <FaArrowLeft className="mr-2" /> Back
        </button>

        <h2 className="text-2xl font-bold mb-6">
          📚 {category ? `${category} Books` : `Books for ${subject} (${className})`}
        </h2>

        {books.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {books.map((book) => (
              <div
                key={book.id}
                className="p-4 rounded-2xl shadow-lg border-2 border-white bg-[#3b3c4e] hover:scale-105 transform transition-all duration-300 cursor-pointer"
              >
                <div className="relative w-full h-48 overflow-hidden rounded-lg bg-gray-700 flex items-center justify-center">
                  {book.thumbnail ? (
                    <img
         src={
    book.thumbnail.includes('/index.php/s/')
      ? book.thumbnail + '/download' // 🔹 add /download
      : `${API_URL}/books/proxy/thumbnail?url=${encodeURIComponent(book.thumbnail)}`
  }
                      alt={book.bookName}
                      className="w-full h-full object-cover"
                      onClick={() => handleBookClick(book.id)}
                    />
                  ) : (
                    <p className="text-gray-300">No Image</p>
                  )}
                  <button
                    className="absolute top-2 right-2 text-red-400 hover:text-red-600 text-lg"
                    onClick={() => toggleFavorite(book.id)}
                  >
                    {book.isFavorite ? <FaHeart /> : <FaRegHeart />}
                  </button>
                </div>
                <div className="mt-4 text-center">
                  <h3 className="text-lg font-bold">{book.bookName}</h3>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-center mt-6">No books found.</p>
        )}
      </main>
    </div>
  );
};

export default BooksList;
