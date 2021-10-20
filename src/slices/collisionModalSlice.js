import {createSlice} from '@reduxjs/toolkit'

export const collisionModalSlice = createSlice({
    name: 'collisionModal',
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
export const {toggle} = collisionModalSlice.actions

export default collisionModalSlice.reducer