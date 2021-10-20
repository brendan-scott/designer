import {ElementType} from "../DataTypes";
import {Button, ButtonToolbar, ButtonGroup, Dropdown, DropdownButton, InputGroup, FormControl} from "react-bootstrap";
import {useDispatch, useSelector} from "react-redux";
import {
    removeById,
    bringToFront,
    bringForward,
    sendToBack,
    sendBackward,
    updateById,
    deselect,
    present as presentElements
} from "../../slices/elementsSlice";
import defaultFonts from '../../defaultFonts.json'
import {FaEye, FaEyeSlash, FaLock, FaLockOpen} from "react-icons/all";

export const ElementToolBar = () => {
    const dispatch = useDispatch();
    const elements = useSelector(presentElements);
    const element = elements.filter((element) => element.selected)[0];
    const selectedElementIndex = element && elements.indexOf(element);
    const dropDownItemStyle = {paddingRight: '5px'};

    return (
        <>
            {element &&
            <ButtonToolbar>
                {element.type === ElementType.Text &&
                <InputGroup size="lg">
                    <select
                        className='form-select-sm'
                        defaultValue={element.fontFamily}
                        onChange={(e) => dispatch(updateById({
                            id: element.id,
                            keyValuePairs: [{
                                key: 'fontFamily',
                                value: e.target.value
                            }]
                        }))}
                    >
                        {defaultFonts.map((font, index) => <option key={index}>{font}</option>)}
                    </select>
                    <FormControl
                        type="number"
                        min="0"
                        max="100"
                        step="1"
                        placeholder='Font Size'
                        defaultValue={element.fontSize}
                        onChange={(e) => dispatch(updateById({
                            id: element.id,
                            keyValuePairs: [{
                                key: 'fontSize',
                                value: Number(e.target.value) > 124 ? 124 : e.target.value
                            }]
                        }))}
                    />
                </InputGroup>}
                <ButtonGroup size="lg">
                    {elements.length > 1 &&
                    <DropdownButton variant='outline-info' as={ButtonGroup}
                                    title={<img src='https://d2gg.link/element-arrange'
                                                alt='Arrange'
                                                title='arrange'
                                    />}>
                        <Dropdown.Item
                            eventKey="1"
                            disabled={selectedElementIndex === elements.length - 1}
                            onClick={() => dispatch(bringToFront(selectedElementIndex))}
                        >
                            <img src='https://d2gg.link/element-arrange-front'
                                 alt='Bring to front'
                                 title='Bring to front'
                                 style={dropDownItemStyle}
                            />
                            <i>Bring to front</i>
                        </Dropdown.Item>
                        <Dropdown.Item
                            eventKey="2"
                            disabled={selectedElementIndex >= elements.length - 1}
                            onClick={() => dispatch(bringForward(selectedElementIndex))}
                        >
                            <img src='https://d2gg.link/element-arrange-forward'
                                 alt='Bring forward'
                                 title='Bring forward'
                                 style={dropDownItemStyle}
                            />
                            <i>Bring forward</i>
                        </Dropdown.Item>
                        <Dropdown.Item
                            eventKey="3"
                            disabled={selectedElementIndex <= 0}
                            onClick={() => dispatch(sendBackward(selectedElementIndex))}
                        >
                            <img src='https://d2gg.link/element-arrange-backward'
                                 alt='Send backward'
                                 title='Send backward'
                                 style={dropDownItemStyle}
                            />
                            <i>Send backward</i>
                        </Dropdown.Item>
                        <Dropdown.Item
                            eventKey="4"
                            disabled={selectedElementIndex === 0}
                            onClick={() => dispatch(sendToBack(selectedElementIndex))}
                        >
                            <img src='https://d2gg.link/element-arrange-back'
                                 alt='Send to back'
                                 title='Send to back'
                                 style={dropDownItemStyle}
                            />
                            <i>Send to back</i>
                        </Dropdown.Item>
                    </DropdownButton>}

                    <Button variant='outline-info' onClick={(e) => {
                        e.stopPropagation();
                        !element.locked && element.selected && dispatch(deselect())
                        dispatch(updateById({
                            id: Number(element.id),
                            keyValuePairs: [{key: 'locked', value: !element.locked}]
                        }));
                    }}>{element.locked ? <FaLock color="grey"/> : <FaLockOpen color="grey"/>}</Button>

                    <Button variant='outline-info' onClick={(e) => {
                        e.stopPropagation();
                        !element.hidden && element.selected && dispatch(deselect())
                        dispatch(updateById({
                            id: Number(element.id),
                            keyValuePairs: [{key: 'hidden', value: !element.hidden}]
                        }));
                    }}>{element.hidden ? <FaEyeSlash color="grey"/> : <FaEye color="grey"/>}</Button>

                    <Button variant='outline-info' onClick={(e) => {
                        e.stopPropagation();
                        dispatch(removeById(element.id))
                    }}>
                        <img src='https://d2gg.link/element-delete' alt='Delete' title='delete'/>
                    </Button>
                </ButtonGroup>
            </ButtonToolbar>}
        </>
    )
}