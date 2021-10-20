import {createSlice} from '@reduxjs/toolkit'

export const qrCodeSlice = createSlice({
    name: 'qrCode',
    initialState: {
        value: null,
    },
    reducers: {
        update: (state, action) => {
            state.value = action.payload;
        }
    },
})

// Action creators are generated for each case reducer function
export const {update} = qrCodeSlice.actions

export default qrCodeSlice.reducer