import axios from 'axios';

// Base API instance targeting local JSON Server or Vite Proxy
const API_BASE_URL = '/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000,
});

// Fallback in-memory/localStorage data provider for resilience if json-server is not running
const LOCAL_STORAGE_KEY_POSTS = 'redux_dashboard_posts';
const LOCAL_STORAGE_KEY_PLATFORMS = 'redux_dashboard_platforms';

const getInitialDataFromStorage = (key, defaultData) => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : defaultData;
  } catch (e) {
    return defaultData;
  }
};

const saveDataToStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.warn('LocalStorage save error:', e);
  }
};

// Response Interceptor for Graceful Mock Fallback
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    // If request fails (e.g., Network Error or json-server offline), process fallback mock logic
    const { config } = error;
    if (!config) return Promise.reject(error);

    console.warn(`[API Fallback] Network request to ${config.url} encountered an issue. Using mock storage fallback.`);

    const url = config.url || '';
    const method = (config.method || 'get').toLowerCase();

    // Handling Posts Endpoint Fallback
    if (url.includes('/posts')) {
      let posts = getInitialDataFromStorage(LOCAL_STORAGE_KEY_POSTS, null);
      if (!posts) {
        // Import db.json fallback dynamically or default array
        const defaultDb = await import('../../db.json');
        posts = defaultDb.posts || [];
        saveDataToStorage(LOCAL_STORAGE_KEY_POSTS, posts);
      }

      if (method === 'get') {
        const idMatch = url.match(/\/posts\/([^\/]+)/);
        if (idMatch) {
          const item = posts.find((p) => String(p.id) === idMatch[1]);
          return item ? { data: item } : Promise.reject({ response: { status: 404 } });
        }
        return { data: posts };
      }

      if (method === 'post') {
        const newPost = JSON.parse(config.data || '{}');
        if (!newPost.id) newPost.id = `post-${Date.now()}`;
        if (!newPost.createdAt) newPost.createdAt = new Date().toISOString();
        posts.unshift(newPost);
        saveDataToStorage(LOCAL_STORAGE_KEY_POSTS, posts);
        return { data: newPost };
      }

      if (method === 'put' || method === 'patch') {
        const idMatch = url.match(/\/posts\/([^\/]+)/);
        const updateData = JSON.parse(config.data || '{}');
        const id = idMatch ? idMatch[1] : updateData.id;
        const index = posts.findIndex((p) => String(p.id) === String(id));
        if (index !== -1) {
          posts[index] = { ...posts[index], ...updateData };
          saveDataToStorage(LOCAL_STORAGE_KEY_POSTS, posts);
          return { data: posts[index] };
        }
      }

      if (method === 'delete') {
        const idMatch = url.match(/\/posts\/([^\/]+)/);
        if (idMatch) {
          posts = posts.filter((p) => String(p.id) !== String(idMatch[1]));
          saveDataToStorage(LOCAL_STORAGE_KEY_POSTS, posts);
          return { data: { id: idMatch[1] } };
        }
      }
    }

    // Handling Platforms Endpoint Fallback
    if (url.includes('/platforms')) {
      let platforms = getInitialDataFromStorage(LOCAL_STORAGE_KEY_PLATFORMS, null);
      if (!platforms) {
        const defaultDb = await import('../../db.json');
        platforms = defaultDb.platforms || [];
        saveDataToStorage(LOCAL_STORAGE_KEY_PLATFORMS, platforms);
      }

      if (method === 'get') {
        return { data: platforms };
      }

      if (method === 'put' || method === 'patch') {
        const idMatch = url.match(/\/platforms\/([^\/]+)/);
        const updateData = JSON.parse(config.data || '{}');
        const id = idMatch ? idMatch[1] : updateData.id;
        const index = platforms.findIndex((p) => String(p.id) === String(id));
        if (index !== -1) {
          platforms[index] = { ...platforms[index], ...updateData };
          saveDataToStorage(LOCAL_STORAGE_KEY_PLATFORMS, platforms);
          return { data: platforms[index] };
        }
      }
    }

    return Promise.reject(error);
  }
);
