import {createSlice} from '@reduxjs/toolkit'

export const userContentSlice = createSlice({
    name: 'userContent',
    initialState: {
        value: [],
    },
    reducers: {
        append: (state, action) => {
            state.value = state.value.concat([action.payload])
        }
    },
})

// Action creators are generated for each case reducer function
export const {append} = userContentSlice.actions

export default userContentSlice.reducer