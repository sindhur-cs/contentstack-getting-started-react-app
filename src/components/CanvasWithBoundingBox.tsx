import { useRef, useEffect } from 'react';
import { Stage, Layer, Rect, Image, Text } from 'react-konva';
import { useDispatch, useSelector } from 'react-redux';
import useImage from 'use-image';
import { RootState } from '../store';
import { setBoundingBoxes } from '../reducer';
import { Html } from 'react-konva-utils';
import { Icon } from '@contentstack/venus-components';

const CanvasWithBoundingBox = ({ img }: { img: string }) => {
    const boundingBoxes = useSelector((state: RootState) => state.main.boundingboxes);
    const dispatch = useDispatch();
    const [image] = useImage(img, 'anonymous');
    const imageRef = useRef(null);

    // original image dimensions to canvas - > current image (x or y or width or height) * scale 
    const scaleCoordinates = (box: any) => {
        if (!image) return box;
        
        const originalWidth = image.width;
        const originalHeight = image.height;
        const canvasWidth = 500;
        const canvasHeight = 500;

        const scaleX = canvasWidth / originalWidth;
        const scaleY = canvasHeight / originalHeight;

        return {
            x: box.x * scaleX,
            y: box.y * scaleY,
            width: box.width * scaleX,
            height: box.height * scaleY
        };
    };

    useEffect(() => {
        if (image && imageRef.current) {
            //@ts-ignore
            imageRef.current.cache();
            //@ts-ignore
            imageRef.current.getLayer().batchDraw(); // draw the bounding box and add it into the layer
        }

        return () => {
            dispatch(setBoundingBoxes(null));
        }
    }, [image]);

    return (
        <Stage width={500} height={500}>
            <Layer>
                <Image
                    image={image}
                    x={0}
                    y={0}
                    width={500}
                    height={500}
                    ref={imageRef}
                />
                {
                    boundingBoxes && boundingBoxes.objects.length > 0 && boundingBoxes.objects.map((box: any, index: number) => {
                        const scaledBox = scaleCoordinates(box.bounding_box);
                        console.log(JSON.stringify(scaledBox));
                        // const scaledBox = box.bounding_box;
                        return (
                            <>
                                <Rect
                                    x={scaledBox.x}
                                    y={scaledBox.y}
                                    width={scaledBox.width}
                                    height={scaledBox.height}
                                    stroke="#FFEB13"
                                    fill="transparent"
                                    strokeWidth={1.5}
                                    cornerRadius={2}
                                />
                                <Rect
                                    x={scaledBox.x + scaledBox.width - 20}
                                    y={scaledBox.y + scaledBox.height - 20}
                                    width={20}
                                    height={20}
                                    fill="#FFEB13"
                                    cornerRadius={[2, 0, 0, 0]}
                                />
                                <Html groupProps={{ x: scaledBox.x + scaledBox.width - 20, y: scaledBox.y + scaledBox.height - 20 }}>
                                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: 20, height: 20, marginTop: 1.5 }}>
                                        <Icon icon="ContentModel" height={15} width={15} version='v2' stroke='black' withTooltip={true} tooltipContent={`Object #${index + 1}`} tooltipPosition='right'/>
                                    </div>
                                </Html>
                            </>
                        );
                    })
                }
                {
                    boundingBoxes && boundingBoxes.faces.length > 0 && boundingBoxes.faces.map((box: any, index: number) => {
                        const scaledBox = scaleCoordinates(box.bounding_box);
                        // const scaledBox = box.bounding_box;
                        return (
                            <>
                                <Rect
                                    x={scaledBox.x}
                                    y={scaledBox.y}
                                    width={scaledBox.width}
                                    height={scaledBox.height}
                                    stroke="#FF008C"
                                    fill="transparent"
                                    strokeWidth={1.5}
                                    cornerRadius={2}
                                />
                                <Rect
                                    x={scaledBox.x + scaledBox.width - 20}
                                    y={scaledBox.y + scaledBox.height - 20}
                                    width={20}
                                    height={20}
                                    fill="#FF008C"
                                    cornerRadius={[2, 0, 0, 0]}
                                />
                                <Html groupProps={{ x: scaledBox.x + scaledBox.width - 20, y: scaledBox.y + scaledBox.height - 20 }}>
                                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: 20, height: 20, marginTop: 1.5 }}>
                                        <Icon icon="User" height={15} width={15} version='v2' stroke="black" withTooltip={true} tooltipContent={`Face #${index + 1}`} tooltipPosition='right'/>
                                    </div>
                                </Html>
                            </>
                        );
                    })
                }
                {
                    boundingBoxes && boundingBoxes.celebrities.length > 0 && boundingBoxes.celebrities.map((box: any, index: number) => {
                        const scaledBox = scaleCoordinates(box.bounding_box);
                        // const scaledBox = box.bounding_box;
                        return (
                            <>
                                <Rect
                                    x={scaledBox.x}
                                    y={scaledBox.y}
                                    width={scaledBox.width}
                                    height={scaledBox.height}
                                    stroke="#00AAFF"
                                    fill="transparent"
                                    strokeWidth={1.5}
                                    cornerRadius={2}
                                />
                                <Rect
                                    x={scaledBox.x + scaledBox.width - 20}
                                    y={scaledBox.y + scaledBox.height - 20}
                                    width={20}
                                    height={20}
                                    fill="#00AAFF"
                                    cornerRadius={[2, 0, 0, 0]}
                                />
                                <Html groupProps={{ x: scaledBox.x + scaledBox.width - 20, y: scaledBox.y + scaledBox.height - 20 }}>
                                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: 20, height: 20,  marginTop: 1.5 }}>
                                        <Icon icon="Star" stroke="black" height={15} width={15} withTooltip={true} tooltipContent={`Star #${index + 1}`} version="v2" tooltipPosition='right'/>
                                    </div>
                                </Html>
                            </>
                        );
                    })
                }
            </Layer>
        </Stage>
    );
};

export default CanvasWithBoundingBox;