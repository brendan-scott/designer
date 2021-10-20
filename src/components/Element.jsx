import {URLImage} from "./URLImage";
import {CustomText} from "./CustomText";
import {useEffect, useRef} from "react";
import {useDispatch} from "react-redux";
import {Transformer} from "react-konva";
import {ElementType} from './DataTypes'
import {updateById} from "../slices/elementsSlice";

export const Element = ({element, setSelectedElement}) => {
    const konvaElementRef = useRef();
    const tranRef = useRef();
    const dispatch = useDispatch();
    useEffect(() => {
        if (element.selected) {
            tranRef.current.nodes([konvaElementRef.current]);
            tranRef.current.getLayer().batchDraw();
        }
    }, [element.selected])

    const handleTransformEnd = () => {
        if (element.selected) {
            const attributes = konvaElementRef.current.attrs;
            dispatch(updateById({
                id: Number(attributes.id),
                keyValuePairs: [{
                    key: 'x',
                    value: Number(attributes.x)
                }, {
                    key: 'y',
                    value: Number(attributes.y)
                }, {
                    key: 'scaleX',
                    value: Number(attributes.scaleX)
                }, {
                    key: 'scaleY',
                    value: Number(attributes.scaleY)
                }, {
                    key: 'rotation',
                    value: Number(attributes.rotation)
                }]
            }))
        }
    }

    const handleDragEnd = () => {
        if (konvaElementRef.current) {
            const attributes = konvaElementRef.current.attrs;

            if (attributes) {
                dispatch(updateById({
                    id: Number(attributes.id),
                    keyValuePairs: [{
                        key: 'x',
                        value: Number(attributes.x)
                    }, {
                        key: 'y',
                        value: Number(attributes.y)
                    }]
                }))
            }
        }
    }

    function RenderElement(element) {
        switch (element.type) {
            case ElementType.StockContent:
            case ElementType.UserContent:
            case ElementType.QRCode:
                return <URLImage image={element}
                                 konvaElementRef={konvaElementRef}
                                 setSelectedElement={setSelectedElement}
                                 handleTransformEnd={handleTransformEnd}
                                 handleDragEnd={handleDragEnd}/>
            case ElementType.Text:
                return <CustomText
                    text={element}
                    konvaElementRef={konvaElementRef}
                    setSelectedElement={setSelectedElement}
                    handleTransformEnd={handleTransformEnd}
                    handleDragEnd={handleDragEnd}/>
            default:
                throw new Error("Element type is not defined.")
        }
    }

    return (
        <>
            {RenderElement(element)}
            {element.selected && (
                <Transformer
                    ref={tranRef}
                    boundBoxFunc={(o, n) => n.width < 10 || n.height < 10 ? o : n}
                />
            )}
        </>
    )
}