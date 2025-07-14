import axios from 'axios';

const API_URL = 'http://localhost:3000/api/upload';

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