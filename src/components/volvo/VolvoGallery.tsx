import { useEffect, useState } from "react";
import LoadingScreen from "../LoadingScreen";
import { fetchVolvoGalleryPageData, fetchVolvoPageData, fetchSpinsetImages } from "../../api";
import "./VolvoGallery.css";

interface VisualMarkup {
  title: string;
  description: string;
  type: number;
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

interface LocaleOption {
    code: string;
    label: string;
}

const localeOptions: LocaleOption[] = [
    { code: "en-us", label: "English" },
    { code: "fr-fr", label: "French" },
    { code: "es-es", label: "Spanish" }
];

const VolvoGallery = () => {
    const [images, setImages] = useState<GalleryImage[]>([]);
    const [spinsetImages, setSpinsetImages] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [hotspotsVisible, setHotspotsVisible] = useState(true);
    const [selectedHotspot, setSelectedHotspot] = useState<{hotspot: VisualMarkup, imageIndex: number} | null>(null);
    const [show360View, setShow360View] = useState(false);
    const [currentFrame, setCurrentFrame] = useState(1);
    const [isDragging, setIsDragging] = useState(false);
    const [dragStartX, setDragStartX] = useState(0);
    const [activeTab, setActiveTab] = useState('exterior');
    const [selectedLocale, setSelectedLocale] = useState<string>("en-us");
    
    // Use the 12 spinset images for 360-degree rotation
    const total360Frames = 80;
    const get360ImageUrl = (frame: number) => {
        if (spinsetImages.length === 0) {
            return '';
        }
        // Ensure frame is within bounds (1-12)
        const frameIndex = ((frame - 1) % spinsetImages.length);
        return spinsetImages[frameIndex];
    };

    useEffect(() => {
        const loadGalleryImages = async () => {
            try {
                const data = await fetchVolvoGalleryPageData(selectedLocale);
                
                // Fetch spinset images using the new API function
                try {
                    const spinsetData = await fetchSpinsetImages("xc90_1");
                    if (spinsetData?.assets && Array.isArray(spinsetData.assets)) {
                        const spinsetUrls = spinsetData.assets.map((asset: any) => asset.url);
                        setSpinsetImages(spinsetUrls);
                    }
                } catch (spinsetError) {
                    console.error("Error loading spinset images:", spinsetError);
                    // Fallback to original method if new API fails
                    if (data?.entry?.spinset?.spinsetimages) {
                        const spinsetUrls = data.entry.spinset.spinsetimages.map((image: any) => image.url);
                        setSpinsetImages(spinsetUrls);
                    }
                }
                
                if (data?.entry?.volvo_gallery?.volvo_gallery_images) {
                    const galleryImages = data.entry.volvo_gallery.volvo_gallery_images.map((imageData: any, index: number) => {
                        // Fallback data if visual_markups is empty
                        const fallbackMarkups: VisualMarkup[] = [
                            {
                                title: "Frame",
                                description: "The twin-spar type aluminum frame is 10% lighter and more compact that the prior generation GSX-R1000, with optimized rigidity for nimble handling and a high level of grip when cornering.",
                                type: 1,
                                coordinates: { x: 45, y: 25, height: 2, width: 2 }
                            },
                            {
                                title: "Engine",
                                description: "Advanced engine technology with superior performance and efficiency.",
                                type: 1,
                                coordinates: { x: 55, y: 45, height: 2, width: 2 }
                            },
                            {
                                title: "Wheels",
                                description: "High-performance wheels designed for optimal grip and handling.",
                                type: 1,
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
    }, [selectedLocale]);

    const handleLocaleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedLocale(event.target.value);
    };

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

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        setDragStartX(e.clientX);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return;
        
        const deltaX = e.clientX - dragStartX;
        const sensitivity = 5; // Adjust this value to change rotation sensitivity
        
        if (Math.abs(deltaX) > sensitivity) {
            if (deltaX > 0) {
                rotateNext();
            } else {
                rotatePrev();
            }
            setDragStartX(e.clientX);
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    return (
        <div className="gallery-page">
            <div className="gallery-header">
                <div className="gallery-header-content">
                    <div className="gallery-header-left">
                        <h1>XC 90</h1>
                    </div>
                    <div className="gallery-header-right">
                        <div className="locale-dropdown-container">
                            <select 
                                value={selectedLocale} 
                                onChange={handleLocaleChange}
                                className="locale-dropdown"
                            >
                                {localeOptions.map((option) => (
                                    <option key={option.code} value={option.code}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <button 
                            className={`hotspot-toggle-btn ${hotspotsVisible ? 'active' : ''}`}
                            onClick={toggleHotspots}
                        >
                            {hotspotsVisible ? 'Hide Hotspots' : 'Show Hotspots'}
                        </button>
                    </div>
                </div>
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
                <div className="view-360-modal">
                    <div className="view-360-content">
                        {/* Header */}
                        <div className="view-360-header">
                            <div className="view-360-header-left">
                                <button className="view-360-back-btn" onClick={close360View}>
                                    ← <span>Back to car details</span>
                                </button>
                                <div>
                                    <h2 className="view-360-title">All New Volvo XC90</h2>
                                    <p className="view-360-subtitle">Luxury SUV for the modern family</p>
                                </div>
                            </div>
 
                        </div>

                        {/* Main Image Area */}
                        <div className="view-360-main">
                            <div 
                                className={`view-360-image-container ${isDragging ? 'dragging' : ''}`}
                                onWheel={handleMouseWheel}
                                onMouseDown={handleMouseDown}
                                onMouseMove={handleMouseMove}
                                onMouseUp={handleMouseUp}
                                onMouseLeave={handleMouseUp}
                            >
                                <img 
                                    src={`${get360ImageUrl(currentFrame)}?environment=${process.env.REACT_APP_CONTENTSTACK_ENVIRONMENT}`}
                                    alt={`360° view frame ${currentFrame}`}
                                    className="view-360-image"
                                    draggable={false}
                                />
                            </div>

                            {/* Controls Overlay */}
                            <div className="view-360-controls-overlay">
                                <div className="view-360-zoom-controls">
                                    <button className="view-360-zoom-btn" title="Zoom Out">−</button>
                                    <button className="view-360-zoom-btn" title="Zoom In">+</button>
                                </div>
                                <button className="view-360-fullscreen-btn" title="Fullscreen">⛶</button>
                            </div>
                        </div>

                        {/* Bottom Navigation */}
                        <div className="view-360-bottom-nav">
                            <div className="view-360-nav-tabs">
                                <button 
                                    className={`view-360-nav-tab hotspots ${activeTab === 'hotspots' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('hotspots')}
                                >
                                    Hotspots
                                </button>
                                <button 
                                    className={`view-360-nav-tab exterior ${activeTab === 'exterior' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('exterior')}
                                >
                                    Exterior
                                </button>
                                <button 
                                    className={`view-360-nav-tab interior ${activeTab === 'interior' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('interior')}
                                >
                                    Interior
                                </button>
                                <button 
                                    className={`view-360-nav-tab gallery ${activeTab === 'gallery' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('gallery')}
                                >
                                    Gallery
                                </button>
                            </div>
                            <div className="view-360-frame-counter">
                                {currentFrame} / {total360Frames}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VolvoGallery; 