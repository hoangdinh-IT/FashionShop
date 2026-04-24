import axios from "axios";
import qs from 'qs';

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 60000,
    paramsSerializer: {
        // Sử dụng thư viện qs để ép kiểu mảng "phẳng" (không có dấu [])
        serialize: (params) => qs.stringify(params, { arrayFormat: 'repeat' }) 
    }
});

apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken'); // Lấy token từ LocalStorage
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

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

// 2. Response Interceptor: Xử lý lỗi 401 và tự động Refresh Token
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Nếu lỗi 401 và chưa từng retry cái request này
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            
            // Bỏ qua nếu API bị lỗi 401 chính là API login hoặc refresh-token (tránh lặp vô tận)
            if (originalRequest.url.includes('/login') || originalRequest.url.includes('/refresh-token')) {
                return Promise.reject(error);
            }

            // Nếu ĐANG trong quá trình refresh token rồi, thì các API khác bị lỗi 401 cứ xếp hàng chờ
            if (isRefreshing) {
                return new Promise(function(resolve, reject) {
                    failedQueue.push({ resolve, reject });
                }).then(token => {
                    originalRequest.headers['Authorization'] = 'Bearer ' + token;
                    return apiClient(originalRequest);
                }).catch(err => {
                    return Promise.reject(err);
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            const accessToken = localStorage.getItem('accessToken');
            const refreshToken = localStorage.getItem('refreshToken');

            if (!refreshToken) {
                // Không có refresh token -> Hết cứu -> Đá ra Login
                localStorage.clear();
                window.location.href = '/auth/login';
                return Promise.reject(error);
            }

            try {
                // LƯU Ý ĐẶC BIỆT: Phải dùng axios thuần (không dùng apiClient) để gọi API refresh
                // Nếu dùng apiClient nó sẽ lại bị interceptor bắt 401 tạo thành vòng lặp vô tận
                const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/refresh-token`, {
                    accessToken: accessToken,
                    refreshToken: refreshToken
                });

                // Lấy Token mới từ Backend trả về (Bạn nhớ check lại cây JSON của bạn xem đúng response.data.data không nhé)
                // Dựa vào postman của bạn, có vẻ data nằm trong: response.data.data.accessToken
                const newAccessToken = response.data.data?.accessToken || response.data.accessToken; 
                const newRefreshToken = response.data.data?.refreshToken || response.data.refreshToken;

                if (newAccessToken) {
                    // 1. Cập nhật LocalStorage
                    localStorage.setItem('accessToken', newAccessToken);
                    if (newRefreshToken) {
                        localStorage.setItem('refreshToken', newRefreshToken);
                    }

                    // 2. Cập nhật Header cho request hiện tại
                    apiClient.defaults.headers.common['Authorization'] = 'Bearer ' + newAccessToken;
                    originalRequest.headers['Authorization'] = 'Bearer ' + newAccessToken;

                    // 3. Giải phóng hàng đợi (Cho phép các API đang chờ tiếp tục chạy)
                    processQueue(null, newAccessToken);
                    
                    // 4. Gọi lại cái API vừa bị lỗi ban đầu
                    return apiClient(originalRequest); 
                }
            } catch (refreshError) {
                // Nếu gọi API Refresh Token mà CŨNG LỖI NỮA (Ví dụ: Refresh token hết hạn, hoặc bị lỗi 500 từ Backend)
                processQueue(refreshError, null);
                localStorage.clear();
                window.location.href = '/auth/login';
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default apiClient;