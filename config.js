const _config = {
    BACKEND_URL: import.meta.env.VITE_BACKEND_URL,
    APP_URL: import.meta.env.VITE_APP_URL,
    IMAGE_CDN: import.meta.env.VITE_IMG_PATH,
    REACPTCAH_KEY: import.meta.env.VITE_RECAPTCHA_SITE_KEY
}
export { _config as config }