import {useDispatch, useSelector} from "react-redux";
import {toggle} from "../../slices/layersSlice";
import {ListGroup, Offcanvas} from "react-bootstrap";
import {FaEye, FaEyeSlash, FaLock, FaLockOpen, VscTrash} from "react-icons/all";
import {deselect, present as presentElements, removeById, select, updateById} from "../../slices/elementsSlice";
import {ElementType} from "../DataTypes";

export const Layers = () => {
    const dispatch = useDispatch()
    const toggleLayers = useSelector((state) => state.layers.value)
    const elements = useSelector(presentElements);
    const qrCodeValue = useSelector((state) => state.qrCode.value);
    const selectedElementId = elements.filter(x => x.selected)[0]?.id ?? -1;

    function GetLayerDescription(element) {
        switch (element.type) {
            case ElementType.StockContent:
            case ElementType.UserContent:
                return <>{element.type}: {element.alt}</>;
            case ElementType.QRCode:
                return <>{element.type}: {qrCodeValue}</>
            case ElementType.Text:
                return <>{element.type}: {element.value}</>
            default:
                throw new Error("Element type is not defined.")
        }
    }

    return (
        <>
            <Offcanvas show={toggleLayers} onHide={() => dispatch(toggle())} placement={'end'}>
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Layers</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <ListGroup style={{cursor: "pointer"}}>
                        {elements.map(element =>
                            <ListGroup.Item
                                style={{backgroundColor: element.id === selectedElementId ? "lightblue" : "white"}}
                                key={element.id}
                                onClick={() => !element.locked && dispatch(select(element.id))}
                            >{GetLayerDescription(element)}
                                <span style={{float: "right", paddingRight: "5px"}}>
                                    <span onClick={(e) => {
                                        e.stopPropagation()
                                        !element.locked && element.selected && dispatch(deselect())
                                        dispatch(updateById({
                                            id: Number(element.id),
                                            keyValuePairs: [{key: 'locked', value: !element.locked}]
                                        }));
                                    }}>{element.locked ? <FaLock color="grey"/> : <FaLockOpen color="grey"/>}</span>
                                    <span onClick={(e) => {
                                        e.stopPropagation()
                                        !element.hidden && element.selected && dispatch(deselect())
                                        dispatch(updateById({
                                            id: Number(element.id),
                                            keyValuePairs: [{key: 'hidden', value: !element.hidden}]
                                        }));
                                    }}>{element.hidden ? <FaEyeSlash color="grey"/> : <FaEye color="grey"/>}</span>
                                    <VscTrash onClick={(e) => {
                                        e.stopPropagation();
                                        dispatch(removeById(element.id));
                                    }} color="red"/>
                                </span>
                            </ListGroup.Item>)}
                    </ListGroup>
                </Offcanvas.Body>
            </Offcanvas>
        </>
    );
}