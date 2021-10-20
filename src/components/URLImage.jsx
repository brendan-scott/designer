import {Image} from "react-konva";
import useImage from "use-image";
import Konva from "konva";
import {useEffect} from "react";

export const URLImage = ({image, konvaElementRef, setSelectedElement, handleTransformEnd, handleDragEnd}) => {
    const konvaImage = useImage(image.src, 'anonymous')[0];

    useEffect(() => {
        if (konvaImage) {
            konvaElementRef.current.cache();
        }
    }, [konvaImage, konvaElementRef])

    return (
        <Image
            id={image.id.toString()}
            key={image.id}
            ref={konvaElementRef}
            image={konvaImage}
            x={image.x}
            y={image.y}
            offsetX={image.width / 2}
            offsetY={image.height / 2}
            scaleX={image.scaleX}
            scaleY={image.scaleY}
            rotation={image.rotation}
            onClick={setSelectedElement}
            onTap={setSelectedElement}
            onTransformEnd={handleTransformEnd}
            onDragEnd={handleDragEnd}
            type={image.type}
            refId={image.id}
            isTemplateImage={image.isTemplateImage}
            hasCollision={image.hasCollision}
            filters={image.hasCollision && [Konva.Filters.Invert]}
            draggable={!image.locked}
            visible={!image.hidden}
        />
    );
};