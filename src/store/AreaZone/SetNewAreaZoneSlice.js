import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    state: "",
    district: "",
    areaPinCode: "",
    startDate: "",
    endDate: "",
    isAvailable: false
}

const AreaZoneSlice = createSlice({
    name: "AreaZone",
    initialState,
    reducers: {
        setStateName: function (state, action) {
            return {
                ...state,
                state: action.payload
            }
        },

        setDistrictName: function (state, action) {
            return {
                ...state,
                district: action.payload
            }
        },

        setAreaPinCode: function (state, action) {
            return {
                ...state,
                areaPinCode: action.payload
            }
        },

        setStartDate: function (state, action) {
            return {
                ...state,
                startDate: action.payload
            }
        },

        setEndDate: function (state, action) {
            return {
                ...state,
                endDate: action.payload
            }
        },

        toggleIsAvailable: function (state, action) {
            return {
                ...state,
                isAvailable: state.isAvailable ? false : true
            }
        },
        setIsAvailable: function (state, action) {
            return {
                ...state,
                isAvailable: action.payload
            }
        }
    }
});

export default AreaZoneSlice.reducer
export const { setStateName, setDistrictName, setAreaPinCode, setStartDate, setEndDate, toggleIsAvailable, setIsAvailable } = AreaZoneSlice.actions; 
