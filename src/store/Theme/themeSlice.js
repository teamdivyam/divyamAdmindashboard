import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    darkMode: localStorage.getItem('theme') || 'light',
};

const themeSlice = createSlice({
    name: "light",
    initialState,
    reducers: {
        toggleDarkMode(state) {
            state.darkMode = state.darkMode === "light" ? "dark" : "light";
            localStorage.setItem('theme', state.darkMode);

            if (state.darkMode === "light") {
                document.documentElement.classList.add("light");
                document.documentElement.classList.remove("dark");
                localStorage.setItem("theme", "light")
            } else {
                localStorage.setItem("theme", "dark")
                document.documentElement.classList.remove("light");
                document.documentElement.classList.add("dark");
            }
        },

        setInitialTheme(state, action) {
            state.darkMode = action.payload;
        },

    },
});

export default themeSlice.reducer;
export const { toggleDarkMode, setInitialTheme } = themeSlice.actions; 
