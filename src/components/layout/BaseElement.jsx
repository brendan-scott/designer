import {Rect} from "react-konva";
import React from "react";
import {useWindowSize} from "../../Helpers";
import {useSelector} from "react-redux";

export const BaseElement = () => {
    const template = useSelector((state) => state.template.value);
    const windowSize = useWindowSize();

    return (
        <Rect x={0} y={0} width={windowSize.canvasDimensions.width | 0}
              height={windowSize.canvasDimensions.height | 0}
              fill={`${template.base.color}`}/>
    )
}