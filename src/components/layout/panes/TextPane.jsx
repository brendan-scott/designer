import {Button, Tab} from "react-bootstrap";
import {ElementType} from "../../DataTypes";
import {VscTrash} from "react-icons/all";
import {useDispatch, useSelector} from "react-redux";
import {removeByRefId, updateByRefId} from "../../../slices/elementsSlice";
import {
    append as textFieldAppend,
    remove as textFieldRemove,
    update as textFieldUpdate
} from "../../../slices/textFieldsSlice";

export const TextPane = ({dragElementRef}) => {
    const dispatch = useDispatch();
    const textFields = useSelector((state) => state.textFields.value)

    function handleTextChanged(e) {
        const index = Number(e.target.id.replace('custom-text-field-', ''));
        dispatch(textFieldUpdate({id: index, value: e.target.value}));
        dispatch(updateByRefId({refId: index, value: e.target.value, type: ElementType.Text}));
    }

    function deleteTextFieldsAndReferences(textFieldId) {
        dispatch(textFieldRemove(textFieldId));
        dispatch(removeByRefId({refId: textFieldId, type: ElementType.Text}));
    }

    return (
        <Tab.Pane eventKey="text">
            <Button onClick={() => dispatch(textFieldAppend())} variant="outline-primary">Add New Text
                Field</Button>
            {textFields.map((field, index) =>
                <div key={index}>
                    <input draggable="true"
                           id={`custom-text-field-${index}`}
                           onChange={handleTextChanged}
                           placeholder="Enter your text"
                           value={field.value}
                           style={{fontFamily: 'Poppins'}}
                           onDragStart={(e) => {
                               dragElementRef.current = {
                                   value: e.target.value,
                                   type: ElementType.Text,
                                   refId: index,
                                   fontSize: 48,
                                   fontFamily: 'Poppins',
                                   scaleX: 1,
                                   scaleY: 1,
                                   selected: false
                               };
                           }}
                    />
                    <VscTrash onClick={() => deleteTextFieldsAndReferences(field.id)} color="red"/>
                </div>)}
        </Tab.Pane>
    )
}