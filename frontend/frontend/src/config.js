const API_ORIGIN = import.meta.env.VITE_API_ORIGIN || (
    import.meta.env.DEV
        ? 'http://127.0.0.1:5000'
        : 'https://comrade-wallet-api.onrender.com'
);

export default API_ORIGIN;
