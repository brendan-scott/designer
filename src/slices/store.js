import {configureStore} from '@reduxjs/toolkit'
import {actionMiddleware} from "../middleware/actionMiddleware";
import undoable, {excludeAction} from 'redux-undo';
import elementsReducer from './elementsSlice'
import textFieldsReducer from './textFieldsSlice'
import userContentReducer from './userContentSlice'
import qrCodeReducer from './qrCodeSlice'
import layerReducer from './layersSlice'
import templateReducer from './templateSlice'
import collisionModalReducer from './collisionModalSlice'

export default configureStore({
    reducer: {
        elements: undoable(elementsReducer, {
            filter: excludeAction(['elements/select', 'elements/deselect'])
        }),
        textFields: textFieldsReducer,
        userContent: userContentReducer,
        qrCode: qrCodeReducer,
        layers: layerReducer,
        template: templateReducer,
        collisionModal: collisionModalReducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(actionMiddleware)
})