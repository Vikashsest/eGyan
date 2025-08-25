// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import StudentNavbar from "./StudentNavbar";
// import StudentSidebar from "./StudentSidebar";
// import { fetchBooks } from "../../apiServices/booksApi";
// import { FaBookOpen, FaArrowLeft } from "react-icons/fa";

// const ClassSubjects = () => {
//   const { className } = useParams();
//   const [subjects, setSubjects] = useState([]);
//   const navigate = useNavigate();
// console.log("classname",className)
//   useEffect(() => {
//     async function loadSubjects() {
//       try {
//         const books = await fetchBooks();
//         const uniqueSubjects = [
//           ...new Set(books.map((b) => b.subject).filter(Boolean)),
//         ];

//         setSubjects(uniqueSubjects);
//       } catch (error) {
//         console.error("Failed to load subjects:", error);
//       }
//     }
//     loadSubjects();
//   }, []);

//   const handleSubjectClick = (sub) => {
//     navigate(`/books/${className}/${encodeURIComponent(sub)}`);
//   };

//   const handleBack = () => {
//     navigate(-1); 
//   };

//   return (
//     <div className="flex min-h-screen bg-[#1e1f2b] text-white">
//       <StudentSidebar />
//       <main className="pl-[280px] py-6 pr-5 w-full">
//         <StudentNavbar />


//         <button
//           onClick={handleBack}
//           className="flex items-center gap-2 mb-6 px-4 py-2 bg-[#3b3c4e] hover:bg-[#4a4b61] text-white rounded-xl shadow-md transition"
//         >
//           <FaArrowLeft /> Back
//         </button>

//         <h2 className="text-2xl font-bold mb-6">📖 Subjects in {className}</h2>

//         {subjects.length > 0 ? (
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
//             {subjects.map((sub, index) => (
//               <div
//                 key={index}
//                 onClick={() => handleSubjectClick(sub)}
//                 className="p-6 rounded-2xl shadow-lg border-2 border-white bg-[#3b3c4e] text-white
//                 flex flex-col items-center justify-center hover:scale-105 transform transition-all duration-300 cursor-pointer"
//               >
//                 <FaBookOpen className="text-yellow-400 text-4xl mb-4 drop-shadow-lg" />
//                 <h3 className="text-lg font-bold">{sub}</h3>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <p className="text-gray-400 text-center mt-6">
//             No subjects found for this class.
//           </p>
//         )}
//       </main>
//     </div>
//   );
// };

// export default ClassSubjects;

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import StudentNavbar from "./StudentNavbar";
import StudentSidebar from "./StudentSidebar";
import { fetchBooks } from "../../apiServices/booksApi";
import { FaBookOpen, FaArrowLeft } from "react-icons/fa";

// Helper function to normalize class names
const normalizeClassName = (str) => {
  if (!str) return "";
  return str
    .toLowerCase()
    .replace(/\s+/g, "") // remove spaces
    .replace(/[^a-z0-9]/g, ""); // remove special chars
};

const ClassSubjects = () => {
  const { className } = useParams();
  const [subjects, setSubjects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadSubjects() {
      try {
        const books = await fetchBooks();

        // filter books of this class
        const filteredBooks = books.filter(
          (b) =>
            b.educationLevel &&
            normalizeClassName(b.educationLevel) ===
              normalizeClassName(className)
        );

        // extract unique subjects
        const uniqueSubjects = [
          ...new Set(filteredBooks.map((b) => b.subject).filter(Boolean)),
        ];

        setSubjects(uniqueSubjects);
      } catch (error) {
        console.error("Failed to load subjects:", error);
      }
    }
    loadSubjects();
  }, [className]);

  const handleSubjectClick = (sub) => {
    navigate(`/books/${className}/${encodeURIComponent(sub)}`);
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="flex min-h-screen bg-[#1e1f2b] text-white">
      <StudentSidebar />
      <main className="pl-[280px] py-6 pr-5 w-full">
        <StudentNavbar />

        <button
          onClick={handleBack}
          className="flex items-center gap-2 mb-6 px-4 py-2 bg-[#3b3c4e] hover:bg-[#4a4b61] text-white rounded-xl shadow-md transition"
        >
          <FaArrowLeft /> Back
        </button>

        <h2 className="text-2xl font-bold mb-6">
          📖 Subjects in {className}
        </h2>

        {subjects.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {subjects.map((sub, index) => (
              <div
                key={index}
                onClick={() => handleSubjectClick(sub)}
                className="p-6 rounded-2xl shadow-lg border-2 border-white bg-[#3b3c4e] text-white
                flex flex-col items-center justify-center hover:scale-105 transform transition-all duration-300 cursor-pointer"
              >
                <FaBookOpen className="text-yellow-400 text-4xl mb-4 drop-shadow-lg" />
                <h3 className="text-lg font-bold">{sub}</h3>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-center mt-6">
            No subjects found for this class.
          </p>
        )}
      </main>
    </div>
  );
};

export default ClassSubjects;
