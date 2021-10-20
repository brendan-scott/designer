import {createSlice} from '@reduxjs/toolkit'

export const textFieldsSlice = createSlice({
    name: 'textFields',
    initialState: {
        value: [],
    },
    reducers: {
        append: (state, action) => {
            state.value = [...state.value].concat({
                id: state.value.length,
                value: action.payload ?? ""
            })
        },
        remove: (state, action) => {
            const index = action.payload;
            state.value = state.value.filter((x) => x.id !== index)
        },
        update: (state, action) => {
            const fields = [...state.value];
            const index = action.payload.id;
            if (fields.length - 1 >= index) {
                fields[index] = action.payload;
                state.value = fields;
            }
        },
        initializeByTemplate: (state, action) => {
            const textFields = action.payload.children
                .filter((child) => child.className === "Text")
                .map((child, index) => {
                    return {
                        id: index,
                        value: child.attrs.text
                    };
                });

            state.value = textFields;
        }
    },
})

// Action creators are generated for each case reducer function
export const {append, remove, update, initializeByTemplate} = textFieldsSlice.actions

export default textFieldsSlice.reducer