import {Layer, Stage} from 'react-konva';
import {ReactReduxContext, Provider} from "react-redux";
import React from "react";
import {ElementType} from "./DataTypes";
import {useDispatch, useSelector} from 'react-redux'
import {append, deselect, present as presentElements, updateById} from "../slices/elementsSlice";
import {DrawPolygon, haveCollision, useWindowSize} from "../Helpers";
import {CanvasDimensions} from "./layout/CanvasDimensions";
import {ImageCollisionModal} from "./layout/ImageCollisionModal";
import {toggle} from "../slices/collisionModalSlice";
import {BaseElement} from "./layout/BaseElement";
import {Elements} from "./layout/Elements";

export const Canvas = ({stageRef, layerRef, dragElementRef}) => {
    const dispatch = useDispatch();
    const elements = useSelector(presentElements);
    const template = useSelector((state) => state.template.value);
    const windowSize = useWindowSize();
    const stageWrapperStyle = {
        background: 'whitesmoke',
        border: '3px solid gray',
        display: 'inline-block',
        width: `${windowSize.canvasDimensions.width + 15}px`,
        height: `${windowSize.canvasDimensions.height + 15}px`,
        overflow: 'hidden'
    };

    function DrawCanvasCrop(ctx) {
        if (template.canvas.width === '' || template.canvas.height === '') {
            return;
        }

        const minX = windowSize.clipDimensions.x[0];
        const maxX = windowSize.clipDimensions.x[1];
        const minY = windowSize.clipDimensions.y[0];
        const maxY = windowSize.clipDimensions.y[1];

        ctx.setLineDash([1,2,1]);
        ctx.lineWidth = 1;

        switch (template.canvas.crop.toLowerCase()) {
            case "rectangle":
                DrawPolygon(ctx, [[minX, minY], [maxX, minY], [maxX, maxY], [minX, maxY]], 0);
                break;
            case "ellipse":
                ctx.ellipse(maxX / 2.0, maxY / 2.0, maxX / 2.0, maxY / 2.0, Math.PI / 4, 0, 2 * Math.PI);
                ctx.closePath();
                break;
            case "triangle":
                DrawPolygon(ctx, [[maxX / 2.0, minY], [maxX, maxY], [minX, maxY]], 0);
                break;
            default:
                throw new Error(`Template not implemented: ${template.canvas.crop}`);
        }

        ctx.stroke();
    }

    return (
        <div>
            <div id='canvas-container'
                 style={stageWrapperStyle}
                 onDrop={(e) => {
                     e.preventDefault();

                     if (dragElementRef.current) {
                         // register event position
                         stageRef.current.setPointersPositions(e);

                         if (elements.some((element) => element.hasCollision)) {
                             dispatch(toggle());
                         } else {
                             dispatch(append({
                                 ...stageRef.current.getPointerPosition(), ...dragElementRef.current,
                                 id: elements.length,
                                 locked: false,
                                 hidden: false
                             }))
                         }
                     }
                 }}
                 onDragOver={(e) => {
                     e.preventDefault();

                     if (dragElementRef.current && dragElementRef.current.type !== ElementType.Text) {
                         // register event position
                         stageRef.current.setPointersPositions(e);

                         const targetRect = {
                             ...stageRef.current.getPointerPosition(),
                             width: 1,
                             height: 1
                         };

                         const images = layerRef.current.children
                             .slice(1)
                             .filter((child) => child.className === 'Image');

                         images.forEach((image) => {
                             const attributes = image.attrs;

                             if (haveCollision(image.getClientRect(), targetRect)) {
                                 if (!elements.some((element) => element.hasCollision)) {
                                     dispatch(updateById({
                                         id: Number(attributes.id),
                                         keyValuePairs: [{
                                             key: 'hasCollision',
                                             value: true
                                         }]
                                     }))
                                 }
                             } else {
                                 if (attributes.hasCollision) {
                                     dispatch(updateById({
                                         id: Number(attributes.id),
                                         keyValuePairs: [{
                                             key: 'hasCollision',
                                             value: false
                                         }]
                                     }))
                                 }
                             }
                         });
                     }
                 }}
            >
                <ReactReduxContext.Consumer>
                    {({store}) => (
                        <Stage
                            width={(windowSize.canvasDimensions.width | 0) + 5}
                            height={(windowSize.canvasDimensions.height | 0) + 5}
                            ref={stageRef}
                            onMouseDown={(e) => {
                                e.evt.stopPropagation(); // Needed to handle the onMouseDown on the App.jsx level
                                elements.some((element) => element.selected) && e.target._id < 3 && dispatch(deselect())
                            }}
                            container='canvas-container'
                        >
                            <Provider store={store}>
                                <Layer ref={layerRef} clipFunc={(ctx) => DrawCanvasCrop(ctx)}>
                                    <BaseElement/>
                                    <Elements/>
                                </Layer>
                            </Provider>
                        </Stage>
                    )}
                </ReactReduxContext.Consumer>
            </div>
            <CanvasDimensions/>
            <ImageCollisionModal stageRef={stageRef} dragElementRef={dragElementRef}/>
        </div>
    );
};