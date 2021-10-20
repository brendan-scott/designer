import {Text} from "react-konva";

export const CustomText = ({text, konvaElementRef, setSelectedElement, handleTransformEnd, handleDragEnd}) => {
    return (
        <Text id={text.id.toString()}
              refId={text.refId}
              key={text.id}
              ref={konvaElementRef}
              text={text.value}
              x={text.x}
              y={text.y}
              scaleX={text.scaleX}
              scaleY={text.scaleY}
              rotation={text.rotation}
              align="center"
              fontSize={text.fontSize}
              fontFamily={text.fontFamily}
              onClick={setSelectedElement}
              onTap={setSelectedElement}
              onTransformEnd={handleTransformEnd}
              onDragEnd={handleDragEnd}
              visible={!text.hidden}
              draggable={!text.locked}/>
    );
}