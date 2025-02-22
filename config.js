const _config = {
    BACKEND_URL: import.meta.env.VITE_BACKEND_URL,
    APP_URL: import.meta.env.VITE_APP_URL,
    IMAGE_CDN: import.meta.env.VITE_IMG_PATH
}
export { _config as config }