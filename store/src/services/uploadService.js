import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/upload`;

export function uploadImage(formData, token) {
  return axios.post(API_URL, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`
    }
  });
}

export function deleteImage(imageUrl, token) {
  return axios.delete(API_URL, {
    data: { url: imageUrl },
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}