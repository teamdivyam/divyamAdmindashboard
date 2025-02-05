import themeSlice from "./Theme/themeSlice.js";
import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./Auth/Authentication.js"
import AreaZoneSlice from "./AreaZone/SetNewAreaZoneSlice.js"

const store = configureStore({
    reducer: {
        theme: themeSlice,
        Auth: authSlice,
        AreaZone: AreaZoneSlice
    },
});


export default store;