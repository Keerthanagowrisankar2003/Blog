import axios from 'axios';

// Creating a default Axios instance with a base URL
const instance = axios.create({
  baseURL: 'http://localhost:3000/', // Adjust the base URL according to your server
});
const token = localStorage.getItem('token');

if (token) {
  instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export default instance;