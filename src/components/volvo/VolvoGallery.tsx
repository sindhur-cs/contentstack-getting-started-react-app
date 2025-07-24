import { useEffect, useState } from "react";
import LoadingScreen from "../LoadingScreen";
import { fetchVolvoPageData } from "../../api";
import "./VolvoGallery.css";

interface VisualMarkup {
  title: string;
  description: string;
  type: string;
  coordinates: {
    x: number;
    y: number;
    height: number;
    width: number;
  };
}

interface GalleryImage {
  url: string;
  title?: string;
  description?: string;
  visual_markups?: VisualMarkup[];
}

const VolvoGallery = () => {
    const [images, setImages] = useState<GalleryImage[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [hotspotsVisible, setHotspotsVisible] = useState(true);
    const [selectedHotspot, setSelectedHotspot] = useState<{hotspot: VisualMarkup, imageIndex: number} | null>(null);
    const [show360View, setShow360View] = useState(false);
    const [currentFrame, setCurrentFrame] = useState(1);
    
    // Generate 360 view images from volvo-car1.jpg to volvo-car2.jpg (assuming 36 frames for smooth rotation)
    const total360Frames = 36;
    const get360ImageUrl = (frame: number) => {
        // For demo purposes, we'll cycle between volvo-car1.jpg and volvo-car2.jpg
        // In real scenario, you'd have volvo-car1.jpg, volvo-car2.jpg, volvo-car3.jpg, etc.
        const imageNumber = frame <= 10 ? 11 : 19;
        //return `${process.env.REACT_APP_CONTENTSTACK_ENVIRONMENT || ''}/volvo-car${imageNumber}.jpg`;
        return `https://www.divi-pixel.com/wp-content/uploads/2023/06/tesla-${frame}a.jpg`;
        
    };

    useEffect(() => {
        const loadGalleryImages = async () => {
            try {
                const data = await fetchVolvoPageData();
                
                if (data?.entry?.volvo_gallery?.volvo_image) {
                    const galleryImages = data.entry.volvo_gallery.volvo_image.map((imageData: any, index: number) => {
                        // Fallback data if visual_markups is empty
                        const fallbackMarkups: VisualMarkup[] = [
                            {
                                title: "Frame",
                                description: "The twin-spar type aluminum frame is 10% lighter and more compact that the prior generation GSX-R1000, with optimized rigidity for nimble handling and a high level of grip when cornering.",
                                type: "Hotspot",
                                coordinates: { x: 45, y: 25, height: 2, width: 2 }
                            },
                            {
                                title: "Engine",
                                description: "Advanced engine technology with superior performance and efficiency.",
                                type: "Hotspot",
                                coordinates: { x: 55, y: 45, height: 2, width: 2 }
                            },
                            {
                                title: "Wheels",
                                description: "High-performance wheels designed for optimal grip and handling.",
                                type: "Hotspot",
                                coordinates: { x: 15, y: 65, height: 2, width: 2 }
                            }
                        ];

                        return {
                            url: imageData.url,
                            title: imageData.title || '',
                            description: imageData.description || '',
                            visual_markups: imageData.visual_markups && imageData.visual_markups.length > 0 
                                ? imageData.visual_markups 
                                : fallbackMarkups
                        };
                    });
                    setImages(galleryImages);
                } else {
                    setError("No gallery images found");
                }
            } catch (error) {
                console.error("Error loading gallery:", error);
                setError("Failed to load gallery images");
            } finally {
                setLoading(false);
            }
        };

        loadGalleryImages();
    }, []);

    if (loading) {
        return <LoadingScreen />;
    }

    if (error) {
        return (
            <div className="gallery-page">
                <div className="gallery-error">
                    <h2>Error Loading Gallery</h2>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    if (images.length === 0) {
        return (
            <div className="gallery-page">
                <div className="gallery-empty">
                    <h2>No Images Available</h2>
                    <p>The gallery is currently empty.</p>
                </div>
            </div>
        );
    }

    const toggleHotspots = () => {
        setHotspotsVisible(!hotspotsVisible);
        setSelectedHotspot(null);
    };

    const handleHotspotClick = (hotspot: VisualMarkup, imageIndex: number) => {
        setSelectedHotspot(
            selectedHotspot?.hotspot.title === hotspot.title ? null : {hotspot, imageIndex}
        );
    };

    const open360View = () => {
        setShow360View(true);
        setCurrentFrame(1);
    };

    const close360View = () => {
        setShow360View(false);
    };

    const handleMouseWheel = (e: React.WheelEvent) => {
        e.preventDefault();
        const delta = e.deltaY > 0 ? 1 : -1;
        setCurrentFrame(prev => {
            let newFrame = prev + delta;
            if (newFrame > total360Frames) newFrame = 1;
            if (newFrame < 1) newFrame = total360Frames;
            return newFrame;
        });
    };

    const rotateNext = () => {
        setCurrentFrame(prev => prev >= total360Frames ? 1 : prev + 1);
    };

    const rotatePrev = () => {
        setCurrentFrame(prev => prev <= 1 ? total360Frames : prev - 1);
    };

    return (
        <div className="gallery-page">
            <div className="gallery-header">
                <h1>XC 90</h1>
                <p>Explore our collection of stunning images</p>
                <button 
                    className={`hotspot-toggle-btn ${hotspotsVisible ? 'active' : ''}`}
                    onClick={toggleHotspots}
                >
                    {hotspotsVisible ? 'Hide Hotspots' : 'Show Hotspots'}
                </button>
            </div>
            
            <div className="gallery-container">
                {images.map((image, index) => (
                    <div key={index} className="gallery-item">
                        <div className="gallery-image-container">
                            <img 
                                src={`${image.url}?environment=${process.env.REACT_APP_CONTENTSTACK_ENVIRONMENT}`}
                                alt={image.title || `Gallery image ${index + 1}`}
                                className="gallery-image"
                                loading="lazy"
                            />
                            
                            {/* 360 View Button - Only for first image */}
                            {index === 0 && (
                                <button 
                                    className="view-360-btn"
                                    onClick={open360View}
                                    title="View 360°"
                                >
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                                        <path d="M8 12a4 4 0 018 0" stroke="currentColor" strokeWidth="2"/>
                                        <path d="M8 12a4 4 0 00-2.5 3.5" stroke="currentColor" strokeWidth="1"/>
                                        <path d="M16 12a4 4 0 012.5 3.5" stroke="currentColor" strokeWidth="1"/>
                                    </svg>
                                    360°
                                </button>
                            )}
                            
                            {/* Hotspots */}
                            {hotspotsVisible && image.visual_markups && (
                                <div className="hotspots-container">
                                    {image.visual_markups.map((markup, markupIndex) => (
                                        <div
                                            key={markupIndex}
                                            className="hotspot"
                                            style={{
                                                left: `${markup.coordinates.x}%`,
                                                top: `${markup.coordinates.y}%`,
                                            }}
                                            onClick={() => handleHotspotClick(markup, index)}
                                        >
                                            <div className="hotspot-pulse"></div>
                                            <div className="hotspot-dot"></div>
                                        </div>
                                    ))}
                                </div>
                            )}
                            
                            {/* Selected Hotspot Info */}
                            {selectedHotspot && selectedHotspot.imageIndex === index && (
                                <div 
                                    className="hotspot-info"
                                    style={{
                                        left: `${selectedHotspot.hotspot.coordinates.x}%`,
                                        top: `${selectedHotspot.hotspot.coordinates.y}%`,
                                    }}
                                >
                                    <button 
                                        className="hotspot-info-close"
                                        onClick={() => setSelectedHotspot(null)}
                                    >
                                        ×
                                    </button>
                                    <h3 className="hotspot-info-title">{selectedHotspot.hotspot.title}</h3>
                                    <p className="hotspot-info-description">{selectedHotspot.hotspot.description}</p>
                                </div>
                            )}
                        </div>
                        
                        {(image.title || image.description) && (
                            <div className="gallery-item-overlay">
                                {image.title && <h3 className="gallery-item-title">{image.title}</h3>}
                                {image.description && <p className="gallery-item-description">{image.description}</p>}
                            </div>
                        )}
                    </div>
                ))}
            </div>
            
            {/* 360 View Modal */}
            {show360View && (
                <div className="view-360-modal" onClick={close360View}>
                    <div className="view-360-content" onClick={(e) => e.stopPropagation()}>
                        <button className="view-360-close" onClick={close360View}>×</button>
                        
                        <div className="view-360-header">
                            <h3>360° View</h3>
                            <p>Use mouse wheel or buttons to rotate</p>
                        </div>
                        
                        <div 
                            className="view-360-image-container"
                            onWheel={handleMouseWheel}
                        >
                            <img 
                                src={get360ImageUrl(currentFrame)}
                                alt={`360° view frame ${currentFrame}`}
                                className="view-360-image"
                                draggable={false}
                            />
                            
                            <div className="view-360-controls">
                                <button className="view-360-control-btn" onClick={rotatePrev}>
                                    ← Rotate Left
                                </button>
                                <span className="view-360-frame-counter">
                                    {currentFrame} / {total360Frames}
                                </span>
                                <button className="view-360-control-btn" onClick={rotateNext}>
                                    Rotate Right →
                                </button>
                            </div>
                        </div>
                        
                        <div className="view-360-instructions">
                            <p>💡 Scroll with mouse wheel or use rotation buttons</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VolvoGallery; 