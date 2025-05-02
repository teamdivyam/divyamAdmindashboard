import themeSlice from "./Theme/themeSlice.js";
import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./Auth/Authentication.js"
import AreaZoneSlice from "./AreaZone/SetNewAreaZoneSlice.js"
import UploadedBanner from './UploadImages/uploadImageSlice.js'

const store = configureStore({
    reducer: {
        theme: themeSlice,
        Auth: authSlice,
        AreaZone: AreaZoneSlice,
        UploadedImgs: UploadedBanner
    },
});


export default store;