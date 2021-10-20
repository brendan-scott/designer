import {createSlice} from '@reduxjs/toolkit'
import DefaultTemplates from '../defaultTemplates.json'

export const templateSlice = createSlice({
    name: 'template',
    initialState: {
        value: DefaultTemplates.filter((template) => template.id === 1)[0],
    },
    reducers: {
        switchTemplate: (state, action) => {
            state.value = DefaultTemplates.filter((template) => template.id === action.payload)[0];
        },
        updateCanvas: (state, action) => {
            let canvas = {...state.value}.canvas;
            action.payload.keyValuePairs.map((keyValuePair) => canvas = {
                ...canvas,
                [keyValuePair.key]: keyValuePair.value
            });
            state.value.canvas = canvas;
        },
        updateBase: (state, action) => {
            let base = {...state.value}.base;
            action.payload.keyValuePairs.map((keyValuePair) => base = {
                ...base,
                [keyValuePair.key]: keyValuePair.value
            });
            state.value.base = base;
        }
    },
})

// Action creators are generated for each case reducer function
export const {switchTemplate, updateCanvas, updateBase} = templateSlice.actions

export default templateSlice.reducer