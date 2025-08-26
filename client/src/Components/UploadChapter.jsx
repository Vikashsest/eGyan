import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; 
import { fetchChapters, addChapter, deleteChapter } from "../apiServices/booksApi";
import { toast } from "react-toastify";

export default function UploadChapter() {
  const { bookId } = useParams();
  const navigate = useNavigate(); 
  const [chapterNumber, setChapterNumber] = useState("");
  const [file, setFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [chapters, setChapters] = useState([]);

  const API_URL = import.meta.env.VITE_API_URL;
  // const getCleanUrl = (path) =>
  //   path ? `${API_URL}/${path.replaceAll("\\", "/")}` : "";
  const getCleanUrl = (path) => path || "";


  // Load Chapters
  useEffect(() => {
    async function loadChapters() {
      try {
        setLoading(true);
        const data = await fetchChapters(bookId);
        console.log("book id",data);
        
        setChapters(data || []);
      } catch (err) {
        toast.error("Error fetching chapters");
      } finally {
        setLoading(false);
      }
    }
    loadChapters();
  }, [bookId]);

  // Add Chapter
  const handleAddChapter = async () => {
     if (!bookId) {
    toast.error("Invalid book ID");
    return;
  }
    if (!chapterNumber || !file || !thumbnail) {
      toast.warning("Please enter a chapter number, select a file, and upload a thumbnail.");
      return;
    }
    try {
      setLoading(true);
      const fd = new FormData();
      fd.append("chapterNumber", chapterNumber);
      fd.append("file", file);
      fd.append("thumbnail", thumbnail);

      const newChapter = await addChapter(bookId, fd);
      setChapters((prev) => [...prev, newChapter]);
      setChapterNumber("");
      setFile(null);
      setThumbnail(null);
      toast.success("Chapter added successfully!");
    } catch (err) {
      toast.error("Error adding chapter");
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
        {/* Header with Back Button */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-center">📚 Manage Book Chapters</h1>
          <button
            onClick={() => navigate(-1)} // ✅ goes back to previous page
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition"
          >
            ⬅ Back
          </button>
        </div>

        {/* Form */}
        <div className="flex flex-col gap-4 items-center">
          {/* Chapter Number */}
          <input
            type="number"
            placeholder="Enter Chapter Number"
            className="bg-[#2a2b39] border border-gray-500 rounded-lg p-2 w-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={chapterNumber}
            onChange={(e) => setChapterNumber(e.target.value)}
          />

          {/* File Upload */}
          <div className="w-full">
          <label>(Pdf/Videos/Audio)</label>
          <input
            type="file"
            className="bg-[#2a2b39] border border-gray-500 rounded-lg p-2 mt-1 w-full text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            onChange={(e) => setFile(e.target.files[0])}
          />
          </div>

          {/* Thumbnail Upload */}
          <div className="w-full">
          <label>Thumbnail Image</label>
          <input
            type="file"
            accept="image/*"
            className="bg-[#2a2b39] border border-gray-500 rounded-lg p-2 mt-1 w-full text-white focus:outline-none focus:ring-2 focus:ring-green-400"
            onChange={(e) => setThumbnail(e.target.files[0])}
          />
          </div>

          {/* Buttons */}
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
                  : " font-semibold bg-blue-500 hover:bg-blue-800"
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
                    src={getCleanUrl(c.thumbnail || c.fileUrl)}
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
