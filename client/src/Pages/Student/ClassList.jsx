// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import StudentNavbar from "./StudentNavbar";
// import StudentSidebar from "./StudentSidebar";
// import { fetchBooks } from "../../apiServices/booksApi";
// import { FaBookReader } from "react-icons/fa";
// import { FaArrowLeft } from "react-icons/fa";

// const ClassList = () => {
//   const [classes, setClasses] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     async function loadClasses() {
//       try {
//         const bookData = await fetchBooks();
//         const uniqueClasses = [
//           ...new Set(bookData.map((book) => book.educationLevel)),
//         ];
//         const classCards = uniqueClasses.map((className) => ({
//           name: className,
//         }));
//         setClasses(classCards);
//       } catch (error) {
//         console.error("Failed to load classes:", error);
//       }
//     }
//     loadClasses();
//   }, []);

//   return (
//     <div className="flex min-h-screen bg-[#1e1f2b] text-white">
//       <StudentSidebar />
//       <main className="pl-[280px] py-6 pr-5 w-full">
//         <StudentNavbar />

//         {/* Back Button */}
//         <button
//           onClick={() => navigate(-1)}
//           className="flex items-center gap-2 mb-6 px-4 py-2 bg-[#3b3c4e] border border-gray-500 rounded-lg hover:bg-[#2c2d3b] transition-all"
//         >
//           <FaArrowLeft /> Back
//         </button>

//         <h2 className="text-2xl font-bold mb-6">📚 Classes</h2>

//         {classes.length > 0 ? (
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
//             {classes.map((cls, index) => (
//               <div
//                 key={index}
//                 onClick={() =>
//                   navigate(`/subjects/${cls.name}`)
//                 }
//                 className="p-6 rounded-2xl shadow-lg border-2 border-white bg-[#3b3c4e] text-white flex flex-col items-center justify-center hover:scale-105 transform transition-all duration-300 cursor-pointer"
//               >
//                 <FaBookReader className="text-blue-400 text-5xl mb-4 drop-shadow-lg" />
//                 <h3 className="text-lg font-bold text-white tracking-wide text-center">
//                   {cls.name}
//                 </h3>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <p className="text-center mt-6 text-gray-400">No classes found.</p>
//         )}
//       </main>
//     </div>
//   );
// };

// export default ClassList;





// import { useEffect, useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import StudentNavbar from "./StudentNavbar";
// import StudentSidebar from "./StudentSidebar";
// import { fetchBooks } from "../../apiServices/booksApi";
// import { FaBookReader, FaArrowLeft } from "react-icons/fa";

// const ClassList = () => {
//   const [classes, setClasses] = useState([]);
//   const navigate = useNavigate();
//   const location = useLocation();

//   // URL se category nikaalna
//   const params = new URLSearchParams(location.search);
//   const category = params.get("category");

//   useEffect(() => {
//     async function loadClasses() {
//       try {
//         const bookData = await fetchBooks();

//         // ✅ Step 1: Category wise filter
//         const filteredBooks = bookData.filter(
//           (book) => book.category === category
//         );

//         // ✅ Step 2: Agar School/Higher Education hai → classes nikalo
//         if (category === "School Education" || category === "Higher Education") {
//           const uniqueClasses = [
//             ...new Set(filteredBooks.map((book) => book.educationLevel)),
//           ].filter(Boolean);

//           setClasses(uniqueClasses.map((cls) => ({ name: cls })));
//         } else {
//           // ✅ Career Development / Research ke liye direct books page
//           navigate(`/books?category=${category}`);
//         }
//       } catch (error) {
//         console.error("Failed to load classes:", error);
//       }
//     }
//     loadClasses();
//   }, [category, navigate]);

//   return (
//     <div className="flex min-h-screen bg-[#1e1f2b] text-white">
//       <StudentSidebar />
//       <main className="pl-[280px] py-6 pr-5 w-full">
//         <StudentNavbar />

//         {/* Back Button */}
//         <button
//           onClick={() => navigate(-1)}
//           className="flex items-center gap-2 mb-6 px-4 py-2 bg-[#3b3c4e] border border-gray-500 rounded-lg hover:bg-[#2c2d3b] transition-all"
//         >
//           <FaArrowLeft /> Back
//         </button>

//         <h2 className="text-2xl font-bold mb-6">📚 {category}</h2>

//         {classes.length > 0 ? (
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
//             {classes.map((cls, index) => (
//               <div
//                 key={index}
//                 onClick={() =>
//                   navigate(`/subjects/${cls.name}?category=${category}`)
//                 }
//                 className="p-6 rounded-2xl shadow-lg border-2 border-white bg-[#3b3c4e] text-white flex flex-col items-center justify-center hover:scale-105 transform transition-all duration-300 cursor-pointer"
//               >
//                 <FaBookReader className="text-blue-400 text-5xl mb-4 drop-shadow-lg" />
//                 <h3 className="text-lg font-bold text-white tracking-wide text-center">
//                   {cls.name}
//                 </h3>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <p className="text-center mt-6 text-gray-400">
//             {category === "School Education" || category === "Higher Education"
//               ? "No classes found."
//               : "Redirecting to books..."}
//           </p>
//         )}
//       </main>
//     </div>
//   );
// };

// export default ClassList;







import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import StudentNavbar from "./StudentNavbar";
import StudentSidebar from "./StudentSidebar";
import { fetchBooks } from "../../apiServices/booksApi";
import { FaBookReader, FaArrowLeft } from "react-icons/fa";

const ClassList = () => {
  const [classes, setClasses] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  // URL se category nikaalna
  const params = new URLSearchParams(location.search);
  const category = params.get("category");

  useEffect(() => {
    async function loadClasses() {
      try {
        const bookData = await fetchBooks();

        // ✅ Step 1: Category wise filter
        const filteredBooks = bookData.filter(
          (book) => book.category === category
        );

        // ✅ Step 2: Agar School/Higher Education hai → classes nikalo
        if (category === "School Education" || category === "Higher Education") {
          const uniqueClasses = [
            ...new Set(filteredBooks.map((book) => book.educationLevel)),
          ].filter(Boolean);

          setClasses(uniqueClasses.map((cls) => ({ name: cls })));
        } else {
          // ✅ Career Development / Research ke liye ek hi card dikhao
          setClasses([{ name: category }]);
        }
      } catch (error) {
        console.error("Failed to load classes:", error);
      }
    }
    loadClasses();
  }, [category, navigate]);

  return (
    <div className="flex min-h-screen bg-[#1e1f2b] text-white">
      <StudentSidebar />
      <main className="pl-[280px] py-6 pr-5 w-full">
        <StudentNavbar />

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 mb-6 px-4 py-2 bg-[#3b3c4e] border border-gray-500 rounded-lg hover:bg-[#2c2d3b] transition-all"
        >
          <FaArrowLeft /> Back
        </button>

        <h2 className="text-2xl font-bold mb-6">📚 {category}</h2>

        {classes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {classes.map((cls, index) => (
              <div
                key={index}
                onClick={() => {
                  if (category === "Career Development" || category === "Research") {
                    navigate(`/books?category=${category}`);
                  } else {
                    navigate(`/subjects/${cls.name}?category=${category}`);
                  }
                }}
                className="p-6 rounded-2xl shadow-lg border-2 border-white bg-[#3b3c4e] text-white flex flex-col items-center justify-center hover:scale-105 transform transition-all duration-300 cursor-pointer"
              >
                <FaBookReader className="text-blue-400 text-5xl mb-4 drop-shadow-lg" />
                <h3 className="text-lg font-bold text-white tracking-wide text-center">
                  {cls.name}
                </h3>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center mt-6 text-gray-400">
            {category === "School Education" || category === "Higher Education"
              ? "No classes found."
              : "No resources found."}
          </p>
        )}
      </main>
    </div>
  );
};

export default ClassList;

