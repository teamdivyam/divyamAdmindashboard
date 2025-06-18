import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    banners: [],
    productImages: []
};

const UploadImageSlice = createSlice({
    name: "UploadedImgOnServer",
    initialState,
    reducers: {
        uploadSingleImg: (state, action) => {
            //for-banner
            const newId = state.banners.length > 0
                ? state.banners[state.banners.length - 1].id + 1
                : 1;

            state.banners.push({
                id: newId,
                imgUrl: action.payload.imgUrl,
                filename: action.payload.fileName,
                fileSize: action.payload.fileSize,
                imageType: 'banner'
            });

        },

        removeSingleUploadedImg: (state, action) => {
            const imageType = action.payload.imageType;
            const imageId = action.payload.id;

            if (imageType == "banner") {
                state.banners = state.banners.filter((banner) => banner.id !== imageId);
            }
            else {
                state.productImages = state.productImages.filter((product) => product.id !== imageId);
            }

        },

        uploadSingleProductImg: (state, action) => {
            //for-product
            const newId = state.productImages.length > 0
                ? state.productImages[state.productImages.length - 1].id + 1
                : 1;

            state.productImages.push({
                id: newId,
                imgUrl: action.payload.imgUrl,
                filename: action.payload.fileName,
                fileSize: action.payload.fileSize,
                imageType: 'product'
            });
        },

        removeSingleProductImg: (state, action) => {
            state.productImages = state.productImages.filter((productImg) => productImg.id !== action.payload);
        },

        resetImageStore: (state, action) => {
            return initialState
        },
    }
});

export default UploadImageSlice.reducer;

export const {
    uploadSingleImg,
    removeSingleUploadedImg,
    uploadSingleProductImg,
    removeSingleProductImg,
    resetImageStore,
    getAllImages
} = UploadImageSlice.actions;
