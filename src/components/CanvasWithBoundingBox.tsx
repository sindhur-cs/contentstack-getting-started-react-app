import { useRef, useEffect, useState } from 'react';
import { Stage, Layer, Rect, Image, Text } from 'react-konva';
import { useDispatch, useSelector } from 'react-redux';
import useImage from 'use-image';
import { RootState } from '../store';
import { setBoundingBoxes } from '../reducer';
import { Html } from 'react-konva-utils';
import { Icon } from '@contentstack/venus-components';
import LoadingScreen from './LoadingScreen';

const CanvasWithBoundingBox = ({ img }: { img: string }) => {
    const boundingBoxes = useSelector((state: RootState) => state.main.boundingboxes);
    const dispatch = useDispatch();
    const [image] = useImage(img, 'anonymous');
    const imageRef = useRef(null);
    const [canvasDimensions, setCanvasDimensions] = useState({ width: 0, height: 0 });
    const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0, offsetX: 0, offsetY: 0 });
    const [dimensionsCalculated, setDimensionsCalculated] = useState(false);

    // Calculate dimensions maintaining aspect ratio
    useEffect(() => {
        if (image && image.width && image.height) {
            const minWidth = 700;
            const minHeight = 400;
            const imageAspectRatio = image.width / image.height;
            const minAspectRatio = minWidth / minHeight;

            let canvasWidth, canvasHeight;
            let imageWidth, imageHeight;
            let offsetX = 0, offsetY = 0;

            if (imageAspectRatio > minAspectRatio) {
                // Image is wider than min ratio - fit to height (ensure min height is met)
                canvasHeight = minHeight;
                canvasWidth = minHeight * imageAspectRatio;
                imageHeight = minHeight;
                imageWidth = minHeight * imageAspectRatio;
            } else {
                // Image is taller than min ratio - fit to width (ensure min width is met)
                canvasWidth = minWidth;
                canvasHeight = minWidth / imageAspectRatio;
                imageWidth = minWidth;
                imageHeight = minWidth / imageAspectRatio;
            }

            setCanvasDimensions({ width: canvasWidth, height: canvasHeight });
            setImageDimensions({ width: imageWidth, height: imageHeight, offsetX, offsetY });
            setDimensionsCalculated(true);
        } else {
            setDimensionsCalculated(false);
        }
    }, [image, img]);

    // original image dimensions to canvas - > current image (x or y or width or height) * scale 
    const scaleCoordinates = (box: any) => {
        if (!image) return box;
        
        const originalWidth = image.width;
        const originalHeight = image.height;

        // scale factors based on actual displayed image size
        const scaleX = imageDimensions.width / originalWidth;
        const scaleY = imageDimensions.height / originalHeight;

        return {
            x: (box.x * scaleX) + imageDimensions.offsetX,
            y: (box.y * scaleY) + imageDimensions.offsetY,
            width: box.width * scaleX,
            height: box.height * scaleY
        };
    };

    // Function to check if two bounding boxes overlap significantly
    const doBoxesOverlap = (box1: any, box2: any, threshold: number = 0.5) => {
        const x1 = Math.max(box1.x, box2.x);
        const y1 = Math.max(box1.y, box2.y);
        const x2 = Math.min(box1.x + box1.width, box2.x + box2.width);
        const y2 = Math.min(box1.y + box1.height, box2.y + box2.height);

        if (x1 < x2 && y1 < y2) {
            const intersectionArea = (x2 - x1) * (y2 - y1);
            const box1Area = box1.width * box1.height;
            const box2Area = box2.width * box2.height;
            const overlapRatio = intersectionArea / Math.min(box1Area, box2Area);
            
            return overlapRatio > threshold;
        }
        return false;
    };

    // Filter faces that don't overlap with celebrities
    const getFilteredFaces = () => {
        if (!boundingBoxes || !boundingBoxes.faces || !boundingBoxes.celebrities) {
            return boundingBoxes?.faces || [];
        }

        return boundingBoxes.faces.filter((face: any) => {
            return !boundingBoxes.celebrities.some((celebrity: any) => 
                doBoxesOverlap(face.bounding_box, celebrity.bounding_box)
            );
        });
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

    if (!dimensionsCalculated || !image || canvasDimensions.width === 0 || canvasDimensions.height === 0) {
        return <LoadingScreen />;
    }

    return (
        <Stage width={canvasDimensions.width} height={canvasDimensions.height}>
            <Layer>
                <Image
                    image={image}
                    x={imageDimensions.offsetX}
                    y={imageDimensions.offsetY}
                    width={imageDimensions.width}
                    height={imageDimensions.height}
                    ref={imageRef}
                />
                {
                    boundingBoxes && boundingBoxes.objects.length > 0 && boundingBoxes.objects.map((box: any, index: number) => {
                        const scaledBox = scaleCoordinates(box.bounding_box);
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
                                        <Icon icon="ContentModel" height={15} width={15} version='v2' stroke='black' withTooltip={true} tooltipContent={box.name} tooltipPosition='right'/>
                                    </div>
                                </Html>
                            </>
                        );
                    })
                }
                {
                    boundingBoxes && getFilteredFaces().length > 0 && getFilteredFaces().map((box: any, index: number) => {
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
                                        <Icon icon="Star" stroke="black" height={15} width={15} withTooltip={true} tooltipContent={box.name} version="v2" tooltipPosition='right'/>
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