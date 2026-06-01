import axios from 'axios';

// Create a configured instance of axios
const api = axios.create({
    baseURL: 'https://focusflow-backend-mgig.onrender.com',
    withCredentials: true, // Sends cookies if you choose to use them later
});

// Variables to manage the token refresh state and queue
let isRefreshing = false;
let failedQueue = [];

// Helper function to process the queue of waiting requests
const processQueue = (error, token = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

/* =====================================================================
   1. REQUEST INTERCEPTOR: Inject the access token into every request
   ===================================================================== */
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

/* =====================================================================
   2. RESPONSE INTERCEPTOR: Catch 401s and refresh token seamlessly
   ===================================================================== */
api.interceptors.response.use(
    (response) => response, // Directly pass through successful responses
    async (error) => {
        const originalRequest = error.config;

        // If the server returns a 401 and this request hasn't been retried yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            
            // If a refresh is already happening, add this request to the waiting list
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                .then((token) => {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return api(originalRequest); // Retry the request
                })
                .catch((err) => Promise.reject(err));
            }

            // Mark this request as retried so we don't end up in an infinite loop
            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const currentRefreshToken = localStorage.getItem('refresh_token');
                
                // Fire a completely independent axios call to the refresh route
                // Send withCredentials: true so that the HTTP-only refresh_token cookie is attached!
                const response = await axios.post('https://focusflow-backend-mgig.onrender.com/api/refresh', {
                    refresh_token: currentRefreshToken || ''
                }, {
                    withCredentials: true
                });

                const { access_token } = response.data;

                // 1. Save the new working access token
                localStorage.setItem('token', access_token);

                // 2. Update the header of the original request that failed
                originalRequest.headers.Authorization = `Bearer ${access_token}`;

                // 3. Release any queued up requests with the new working token
                processQueue(null, access_token);
                isRefreshing = false;

                // 4. Retry and return the original request execution
                return api(originalRequest);

            } catch (refreshError) {
                // If the refresh token itself is expired or tampered with
                processQueue(refreshError, null);
                isRefreshing = false;

                // Wipe local storage and kick them out to the login screen
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                localStorage.removeItem('refresh_token');
                window.location.href = '/login'; 
                
                return Promise.reject(refreshError);
            }
        }

        // Return any error that wasn't a 401 (e.g., 400, 404, 500) directly to the component
        return Promise.reject(error);
    }
);

export default api;