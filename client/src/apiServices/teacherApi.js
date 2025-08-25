import { getCookie } from "../utils/cookie";
const API_URL = import.meta.env.VITE_API_URL;

const access_token = getCookie("access_token");

export const teacherApi = {
  async fetchAll() {
    const res = await fetch(`${API_URL}/user/filter?role=teacher`, {
      method:'GET',
      credentials:'include',
      headers: {
      Authorization: `Bearer ${access_token}`
    },
    });
    return res.json();
  },

  async deleteTeacher(id) {
    return fetch(`${API_URL}/user/${id}`, {
      method: "DELETE",
      credentials: "include",
      headers: {
      Authorization: `Bearer ${access_token}`
    },
    });
  },

  async saveTeacher(data) {
    return fetch(`${API_URL}/user`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`
      },
      body: JSON.stringify(data),
    });
  },

  async updateTeacher(id, data) {
    return fetch(`${API_URL}/user/${id}`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`
      },
      body: JSON.stringify(data),
    });
  },
};
