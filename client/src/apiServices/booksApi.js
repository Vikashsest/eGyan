import { getCookie } from "../utils/cookie";
const API_URL = import.meta.env.VITE_API_URL;

const access_token = getCookie("access_token");

export async function fetchBooks() {
  try {
    const res = await fetch(`${API_URL}/books`, {
      method: "GET",
      credentials: "include",
      headers: {
      Authorization: `Bearer ${access_token}`
    },
    });
    const data = await res.json();
    return Array.isArray(data) ? data : data.books || [];
  } catch (error) {
    console.error("Error fetching books:", error);
    throw error;
  }
}

/**
 * Upload a new book
 * @param {FormData} formData
 */
export async function uploadBook(formData) {
  try {
    const res = await fetch(`${API_URL}/books/upload`, {
      method: "POST",
      body: formData,
     credentials: "include",
     headers: {
      Authorization: `Bearer ${access_token}`
    },
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || "Upload failed");
    return result.book || result;
  } catch (error) {
    console.error("Error uploading book:", error);
    throw error;
  }
}

/**
 * Delete a book by ID
 * @param {string} id
 */
export async function deleteBook(id) {
  try {
    const res = await fetch(`${API_URL}/books/${id}`, {
      method: "DELETE",
      credentials: "include",
      headers: {
      Authorization: `Bearer ${access_token}`
    },
    });
    const result = await res.json();
    if (!res.ok) throw new Error("Delete failed");
    return result;
  } catch (error) {
    console.error("Error deleting book:", error);
    throw error;
  }
}

/**
 * Update a book by ID
 * @param {string} id
 * @param {FormData} formData
 */
export async function updateBook(id, formData) {
  try {
    const res = await fetch(`${API_URL}/books/${id}`, {
      method: "PATCH",
      body: formData,
      credentials: "include",
      headers: {
      Authorization: `Bearer ${access_token}`
    },
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || "Update failed");
    return result.book || result;
  } catch (error) {
    console.error("Error updating book:", error);
    throw error;
  }
}


// export const fetchBooks = async () => {
//   const res = await fetch(`${API_URL}/student/books`, {
//     credentials: 'include',
//   });
//   if (!res.ok) throw new Error("Failed to fetch books");
//   return res.json();
// };

export const fetchFavoriteBooks = async () => {
  const res = await fetch(`${API_URL}/students/favorites`, {
    credentials: 'include',
  });
  if (!res.ok) throw new Error("Failed to fetch favorites");
  return res.json(); 
};


export async function toggleFavoriteBook(bookId) {
 const response = await fetch(`${API_URL}/students/toggle-favorite/${bookId}`, {
    method: 'PATCH',
    credentials: 'include',
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Failed to toggle favorite');
  }

  return await response.json();
}



/**
 * Fetch chapters of a specific book
 * @param {string} bookId
 */
export async function fetchChapters(bookId) {
  try {
    const res = await fetch(`${API_URL}/books/${bookId}/chapters`, {
      method: "GET",
      credentials: "include",
      headers: { Authorization: `Bearer ${access_token}` },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to fetch chapters");
    return Array.isArray(data) ? data : data.chapters || [];
  } catch (error) {
    console.error("Error fetching chapters:", error);
    throw error;
  }
}

/**
 * Add a new chapter to a book
 * @param {string} bookId
 * @param {FormData} formData
 */
export async function addChapter(bookId, formData) {
  try {
    const res = await fetch(`${API_URL}/books/${bookId}/chapters`, {
      method: "POST",
      body: formData,
      credentials: "include",
      headers: { Authorization: `Bearer ${access_token}` },
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || "Failed to add chapter");
    return result.chapter || result;
  } catch (error) {
    console.error("Error adding chapter:", error);
    throw error;
  }
}

/**
 * Delete a chapter by ID
 * @param {string} chapterId
 */
export async function deleteChapter(chapterId) {
  try {
    const res = await fetch(`${API_URL}/books/chapter/${chapterId}`, {
      method: "DELETE",
      credentials: "include",
      headers: { Authorization: `Bearer ${access_token}` },
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || "Failed to delete chapter");
    return result;
  } catch (error) {
    console.error("Error deleting chapter:", error);
    throw error;
  }
}