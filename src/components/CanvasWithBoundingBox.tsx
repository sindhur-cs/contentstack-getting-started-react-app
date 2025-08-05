import React, { useRef, useEffect, useState } from 'react';
import { Stage, Layer, Rect, Image, Circle } from 'react-konva';
import Konva from 'konva';
import { useDispatch, useSelector } from 'react-redux';
import useImage from 'use-image';
import { RootState } from '../store';
import { setBoundingBoxes } from '../reducer';
import { Html } from 'react-konva-utils';
import { Icon } from '@contentstack/venus-components';
import LoadingScreen from './LoadingScreen';

interface VisualMarkup {
    id: string;
    type: number; // 1 = hotspot, 2 = bounding box
    title: string;
    description: string;
    url: string;
    coordinates: {
        x: number;
        y: number;
        height?: number; // only for type 2
        width?: number;  // only for type 2
    };
}

const CanvasWithBoundingBox = ({ img, visualMarkups = [] }: { img: string; visualMarkups?: VisualMarkup[] }) => {
    const boundingBoxes = useSelector((state: RootState) => state.main.boundingboxes);
    const dispatch = useDispatch();
    const [image] = useImage(img, 'anonymous');
    const imageRef = useRef(null);
    const [canvasDimensions, setCanvasDimensions] = useState({ width: 0, height: 0 });
    const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0, offsetX: 0, offsetY: 0 });
    const [dimensionsCalculated, setDimensionsCalculated] = useState(false);
    const [selectedMarkup, setSelectedMarkup] = useState<VisualMarkup | null>(null);
    const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });

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

    // Scale visual markup coordinates
    const scaleMarkupCoordinates = (markup: VisualMarkup) => {
        if (!image) return markup.coordinates;
        
        const originalWidth = image.width;
        const originalHeight = image.height;

        const scaleX = imageDimensions.width / originalWidth;
        const scaleY = imageDimensions.height / originalHeight;

        return {
            x: (markup.coordinates.x * scaleX) + imageDimensions.offsetX,
            y: (markup.coordinates.y * scaleY) + imageDimensions.offsetY,
            width: markup.coordinates.width ? markup.coordinates.width * scaleX : undefined,
            height: markup.coordinates.height ? markup.coordinates.height * scaleY : undefined
        };
    };

    // Handle markup click
    const handleMarkupClick = (markup: VisualMarkup, e: any) => {
        const scaledCoords = scaleMarkupCoordinates(markup);
        setSelectedMarkup(selectedMarkup?.id === markup.id ? null : markup);
        setPopupPosition({ x: scaledCoords.x, y: scaledCoords.y });
    };

    // Pulsating Hotspot Component
    const PulsatingHotspot = ({ x, y, markup }: { x: number; y: number; markup: VisualMarkup }) => {
        const outerCircleRef = useRef<any>(null);
        const innerCircleRef = useRef<any>(null);

        useEffect(() => {
            // Outer pulse animation
            const outerAnim = new Konva.Animation((frame) => {
                if (outerCircleRef.current && frame) {
                    const scale = 1 + 0.3 * Math.sin((frame.time * 0.003) % (2 * Math.PI));
                    const opacity = 0.6 - 0.3 * Math.sin((frame.time * 0.003) % (2 * Math.PI));
                    outerCircleRef.current.scaleX(scale);
                    outerCircleRef.current.scaleY(scale);
                    outerCircleRef.current.opacity(opacity);
                }
            }, outerCircleRef.current?.getLayer());

            // Inner pulse animation
            const innerAnim = new Konva.Animation((frame) => {
                if (innerCircleRef.current && frame) {
                    const scale = 1 + 0.1 * Math.sin((frame.time * 0.004) % (2 * Math.PI));
                    innerCircleRef.current.scaleX(scale);
                    innerCircleRef.current.scaleY(scale);
                }
            }, innerCircleRef.current?.getLayer());

            outerAnim.start();
            innerAnim.start();

            return () => {
                outerAnim.stop();
                innerAnim.stop();
            };
        }, []);

        return (
            <React.Fragment>
                {/* Outer pulse circle */}
                <Circle
                    ref={outerCircleRef}
                    x={x}
                    y={y}
                    radius={20}
                    fill="rgba(255, 255, 255, 0.4)"
                    stroke="white"
                    strokeWidth={2}
                />
                {/* Inner dot */}
                <Circle
                    ref={innerCircleRef}
                    x={x}
                    y={y}
                    radius={8}
                    fill="white"
                    stroke="black"
                    strokeWidth={2}
                    onClick={(e) => handleMarkupClick(markup, e)}
                    onMouseEnter={(e) => {
                        e.target.getStage()!.container().style.cursor = 'pointer';
                    }}
                    onMouseLeave={(e) => {
                        e.target.getStage()!.container().style.cursor = 'default';
                    }}
                />
            </React.Fragment>
        );
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
        <div style={{ position: 'relative', display: 'inline-block' }}>
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
                {/* Visual Markups */}
                {
                    visualMarkups.map((markup, index) => {
                        const scaledCoords = scaleMarkupCoordinates(markup);
                        
                        if (markup.type === 1) {
                            // Type 1: Hotspot (circular point) with pulsating animation
                            return (
                                <PulsatingHotspot
                                    key={markup.id}
                                    x={scaledCoords.x}
                                    y={scaledCoords.y}
                                    markup={markup}
                                />
                            );
                        } else if (markup.type === 2 && scaledCoords.width && scaledCoords.height) {
                            // Type 2: Bounding box (rectangle)
                            return (
                                <React.Fragment key={markup.id}>
                                    <Rect
                                        x={scaledCoords.x}
                                        y={scaledCoords.y}
                                        width={scaledCoords.width}
                                        height={scaledCoords.height}
                                        stroke="#00AAFF"
                                        fill="rgba(0, 170, 255, 0.1)"
                                        strokeWidth={2}
                                        cornerRadius={4}
                                        onClick={(e) => handleMarkupClick(markup, e)}
                                        onMouseEnter={(e) => {
                                            e.target.getStage()!.container().style.cursor = 'pointer';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.getStage()!.container().style.cursor = 'default';
                                        }}
                                    />
                                    {/* Corner indicator */}
                                    <Rect
                                        x={scaledCoords.x + scaledCoords.width - 25}
                                        y={scaledCoords.y + scaledCoords.height - 25}
                                        width={25}
                                        height={25}
                                        fill="#00AAFF"
                                        cornerRadius={[4, 0, 0, 0]}
                                    />
                                    <Html groupProps={{ x: scaledCoords.x + scaledCoords.width - 25, y: scaledCoords.y + scaledCoords.height - 25 }}>
                                        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: 25, height: 25, marginTop: 1.5 }}>
                                            <Icon icon="ShoppingBag" height={15} width={15} version='v2' stroke="white" />
                                        </div>
                                    </Html>
                                </React.Fragment>
                            );
                        }
                        return null;
                    })
                }
            </Layer>
        </Stage>
        
        {/* Popup for selected visual markup */}
        {selectedMarkup && (
            <div 
                style={{
                    position: 'absolute',
                    left: `${popupPosition.x + 30}px`,
                    top: `${popupPosition.y - 10}px`,
                    background: 'white',
                    border: '2px solid #00AAFF',
                    borderRadius: '8px',
                    padding: '16px',
                    maxWidth: '300px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                    zIndex: 1000,
                    fontFamily: 'Arial, sans-serif'
                }}
            >
                <button 
                    onClick={() => setSelectedMarkup(null)}
                    style={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        background: 'none',
                        border: 'none',
                        fontSize: '18px',
                        cursor: 'pointer',
                        color: '#666'
                    }}
                >
                    ×
                </button>
                
                <div style={{ marginBottom: '12px' }}>
                    <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: 'bold', color: '#333' }}>
                        {selectedMarkup.title}
                    </h3>
                    <p style={{ margin: '0', fontSize: '14px', color: '#666', lineHeight: '1.4' }}>
                        {selectedMarkup.description}
                    </p>
                </div>
                
                {selectedMarkup.url && (
                    <div style={{ marginTop: '12px' }}>
                        <img 
                            src={selectedMarkup.url} 
                            alt={selectedMarkup.title}
                            style={{
                                width: '100%',
                                maxWidth: '200px',
                                height: 'auto',
                                borderRadius: '4px',
                                border: '1px solid #ddd'
                            }}
                            onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                            }}
                        />
                        <a 
                            href={selectedMarkup.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            style={{
                                display: 'inline-block',
                                marginTop: '8px',
                                color: '#00AAFF',
                                textDecoration: 'none',
                                fontSize: '14px',
                                fontWeight: 'bold'
                            }}
                        >
                            View Product →
                        </a>
                    </div>
                )}
            </div>
        )}
    </div>
    );
};

export default CanvasWithBoundingBox;