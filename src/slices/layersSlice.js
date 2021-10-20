import {createSlice} from '@reduxjs/toolkit'

export const layersSlice = createSlice({
    name: 'layers',
    initialState: {
        value: false,
    },
    reducers: {
        toggle: (state) => {
            state.value = !state.value;
        }
    },
})

// Action creators are generated for each case reducer function
export const {toggle} = layersSlice.actions

export default layersSlice.reducer