// Canvas.js
import React, { useState } from "react";
import { Stage, Layer, Image, Text } from "react-konva";
import useImage from "use-image";
const Canvas = ({
  imageUrl,
  text,
  fontFamily,
  fontSize,
  fontStyle,
  fontVariant,
  stageRef,
  selectedColor,
  textPosition,
  setTextPosition,
  draggable = true,
  height,
  width,
  textRef,
}) => {
  const [image] = useImage(imageUrl, "anonymous");
  // if you want to calculate edge 
  // const initialTextPosition = { x: 100, y: 100 };
  // const [edgeReached, setEdgeReached] = useState(false);
  const handleDragMove = (e) => {
    const textNode = e.target;
    // const stageWidth = textNode.getStage().width();
    // const stageHeight = textNode.getStage().height();
    // const textWidth = textNode.width();
    // const textHeight = textNode.height();
    // const newX = Math.max(0, Math.min(textNode.x(), stageWidth - textWidth));
    // const newY = Math.max(0, Math.min(textNode.y(), stageHeight - textHeight));
    setTextPosition({ x: textNode.x(), y: textNode.y() });

    // if (
    //   newX === 0 ||
    //   newX === stageWidth - textWidth ||
    //   newY === 0 ||
    //   newY === stageHeight - textHeight
    // ) {
    //   setEdgeReached(true);
    // } else {
    //   setEdgeReached(false);
    // }
  };

  // const handleDragEnd = () => {
  //   if (edgeReached) {
  //     setTextPosition(initialTextPosition);
  //     setEdgeReached(false);
  //   }
  // };
console.log(textPosition)
  return (
    <div>
      <Stage
        preventDefault={false}
        width={window.innerWidth < 500 ? width / 2 : width}
        height={window.innerWidth < 500 ? height / 2 : height}
        ref={stageRef}
      >
        <Layer>
          <Image
            preventDefault={false}
            image={image}
            width={window.innerWidth < 500 ? width / 2 : width}
            height={window.innerWidth < 500 ? height / 2 : height}
          />

          <Text
            ref={textRef}
            fontFamily={fontFamily}
            fontSize={window.innerWidth < 500 ? fontSize/2 +2 : fontSize}
            fontStyle={fontStyle}
            fontVariant={fontVariant}
            fill={selectedColor}
            text={text}
            align="center"
            width={window.innerWidth < 500 ? width / 2 : width}
            height={window.innerWidth < 500 ? height / 2 : height}
            x={
              window.innerWidth < 500 ? textPosition?.x / 2.1 : textPosition?.x
            }
            y={window.innerWidth < 500 ? textPosition?.y / 2 : textPosition?.y}
            draggable={draggable}
            onDragMove={handleDragMove}
            // onDragEnd={handleDragEnd}
            onMouseEnter={() => {
              document.body.style.cursor = "grab";
            }}
            onMouseLeave={() => {
              document.body.style.cursor = "default";
            }}
          />
        </Layer>
      </Stage>
    </div>
  );
};

export default Canvas;
