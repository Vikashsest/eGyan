import { getCookie } from "../utils/cookie";
const API_URL = import.meta.env.VITE_API_URL;

const access_token = getCookie("access_token");

export async function fetchUploadedBooks() {
  try {
    const response = await fetch(`${API_URL}/books/uploaded-by`, {
      method: "GET",
      credentials:"include",
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch uploaded books: ${response.statusText}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error in fetchUploadedBooks:", error);
    throw error;
  }
}
