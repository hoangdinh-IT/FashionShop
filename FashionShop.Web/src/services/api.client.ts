import axios from "axios";

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 60000,
});

apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token'); // Lấy token từ LocalStorage
        if (token) {
            // Gắn token vào header Authorization theo chuẩn "Bearer <token>"
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// (Tùy chọn) Xử lý khi Token hết hạn (401) thì tự logout
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Token hết hạn hoặc không hợp lệ -> Xóa token và đá về login
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/auth/login';
        }
        return Promise.reject(error);
    }
);

export default apiClient;