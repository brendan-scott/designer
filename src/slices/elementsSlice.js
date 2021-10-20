import {createSlice} from '@reduxjs/toolkit'
import arrayMove from "array-move";
import DefaultGraphics from '../defaultGraphics.json'
import {ElementType} from "../components/DataTypes";

export const elementsSlice = createSlice({
    name: 'elements',
    initialState: {
        value: [],
    },
    reducers: {
        append: (state, action) => {
            state.value = state.value.concat([action.payload])
        },
        removeByRefId: (state, action) => {
            const refId = action.payload.refId;
            const type = action.payload.type;
            state.value = state.value.filter((x) => x.refId !== refId || x.type !== type)
        },
        removeById: (state, action) => {
            const id = action.payload;
            const array = [...state.value];
            const element = array.filter((element) => element.id === id)[0];
            const elementIndex = array.indexOf(element);
            array.splice(elementIndex, 1);
            state.value = array;
        },
        updateByRefId: (state, action) => {
            const elements = [...state.value];
            const refId = action.payload.refId;
            state.value = elements.map(x => {
                if (x.refId !== refId || x.type !== action.payload.type) return x;
                x.value = action.payload.value;
                x.src = action.payload.src;
                return x
            });
        },
        updateById: (state, action) => {
            const id = action.payload.id;
            const elements = [...state.value];
            const elementIndex = elements.indexOf(elements.filter((element) => element.id === id)[0]);
            action.payload.keyValuePairs.map((keyValuePair) => elements[elementIndex] = {
                ...elements[elementIndex],
                [keyValuePair.key]: keyValuePair.value
            });
            state.value = elements;
        },
        bringToFront: (state, action) => {
            const from = action.payload;
            const to = state.value.length - 1;
            const elements = arrayMove(state.value, from, to);
            state.value = elements;
        },
        sendToBack: (state, action) => {
            const from = action.payload;
            const elements = arrayMove(state.value, from, 0);
            state.value = elements;
        },
        bringForward: (state, action) => {
            const from = action.payload;
            const to = from + 1;
            const finalElementIndex = state.value.length - 1;

            if (to <= finalElementIndex) {
                const elements = arrayMove(state.value, from, to);
                state.value = elements;
            }
        },
        sendBackward: (state, action) => {
            const from = action.payload;
            const to = from - 1;

            if (to >= 0) {
                const elements = arrayMove(state.value, from, to);
                state.value = elements;
            }
        },
        select: (state, action) => {
            const id = action.payload;
            const elements = [...state.value].map((element) => element.id === id ?
                {
                    ...element,
                    selected: true
                } :
                {
                    ...element,
                    selected: false
                }
            );
            state.value = elements;
        },
        deselect: (state) => {
            const elements = [...state.value];
            elements.map((element) => element.selected = false);
            state.value = elements;
        },
        initializeByTemplate: (state, action) => {
            const elements = action.payload.children.map((child, index) => {
                switch (child.className) {
                    case 'Image':
                        switch (child.attrs.type) {
                            case ElementType.StockContent:
                                const graphic = DefaultGraphics.filter((graphic) => Number(graphic.id) === Number(child.attrs.refId))[0];
                                return {
                                    id: index,
                                    refId: child.attrs.refId,
                                    type: child.attrs.type,
                                    src: graphic.src,
                                    alt: graphic.alt,
                                    selected: false,
                                    x: child.attrs.x,
                                    y: child.attrs.y,
                                    scaleX: child.attrs.scaleX,
                                    scaleY: child.attrs.scaleY,
                                    offsetX: child.attrs.offsetX,
                                    offsetY: child.attrs.offsetY,
                                    width: child.attrs.offsetX && child.attrs.offsetX * 2,
                                    height: child.attrs.offsetY && child.attrs.offsetY * 2,
                                    isTemplateImage: true
                                };
                            default:
                                throw new Error('No case implemented for type: ' + child.attrs.type);
                        }
                    case 'Text':
                        return {
                            id: index,
                            refId: child.attrs.refId,
                            type: ElementType.Text,
                            selected: false,
                            value: child.attrs.text,
                            fill: child.attrs.fill,
                            fontSize: child.attrs.fontSize,
                            fontFamily: child.attrs.fontFamily,
                            x: child.attrs.x,
                            y: child.attrs.y,
                            scaleX: child.attrs.scaleX,
                            scaleY: child.attrs.scaleY,
                            offsetX: child.attrs.offsetX,
                            offsetY: child.attrs.offsetY,
                            width: child.attrs.offsetX && child.attrs.offsetX * 2,
                            height: child.attrs.offsetY && child.attrs.offsetY * 2
                        };
                    default:
                        throw new Error('No case implemented for type: ' + child.className);
                }
            });

            state.value = elements;
        },
        replaceById: (state, action) => {
            const array = [...state.value];
            const id = action.payload.id;
            const element = array.filter((element) => element.id === id)[0];
            const elementIndex = array.indexOf(element);
            array[elementIndex] = action.payload.target;
            state.value = array;
        },
    },
})

// Action creators are generated for each case reducer function
export const {
    append,
    removeByRefId,
    removeById,
    updateByRefId,
    updateById,
    bringToFront,
    bringForward,
    sendToBack,
    sendBackward,
    select,
    deselect,
    initializeByTemplate,
    replaceById
} = elementsSlice.actions

export const present = (state) => state.elements.present.value;

export default elementsSlice.reducer