import { useParams } from "react-router"
import { useEffect, useState } from "react";
import LoadingScreen from "../LoadingScreen";
import Sidebar from "../Sidebar";
import CanvasWithBoundingBox from "../CanvasWithBoundingBox";
import { fetchVolvoPageData } from "../../api";

interface LocaleOption {
    code: string;
    label: string;
}

const localeOptions: LocaleOption[] = [
    { code: "en-us", label: "English (US)" },
    { code: "fr-fr", label: "Français (FR)" },
    { code: "es-es", label: "Español (ES)" }
];

const VolvoProduct = () => {
    const { id } = useParams(); 
    const [section, setSection] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [selectedLocale, setSelectedLocale] = useState<string>("en-us");

    useEffect(() => {
        const displaySections = async () => {
            setLoading(true);
            try {
                const data = await fetchVolvoPageData(selectedLocale);
                setSection(data.entry.volvo_images.find((section: any) => section._metadata.uid === id) || null);
            }
            catch (error) {
                setSection(null);
            }
            finally {
                setLoading(false);
            }
        }

        displaySections();
    }, [id, selectedLocale]);

    const handleLocaleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedLocale(event.target.value);
    };

    
    if(loading) {
        return <LoadingScreen/>
    }
    
    if((!id || !section) && !loading) {
        return (
            <div className="menu-page product-page">
                <div className="campaign-header">
                    <h2>Product Not Found</h2>
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
                </div>
                <div className="product-not-found">
                    No {id} found
                </div>
            </div>
        );
    }

    return (
        <div className="menu-page product-page">
 
            
            <div className="product-container">
            <Sidebar url={section.image.url} />
                <div className="product-image-container">
                    {/* <CanvasWithBoundingBox img={"https://dev9-dam-api.csnonprod.com/api/spaces/am7972de584c4e0397/assets/am7e18362214a6803c/f32c2d2fe77c6ba1a5bd354c/banana.png"}/> */}
                    {/* <CanvasWithBoundingBox img={"/pineapple.png"}/> */}
                    <CanvasWithBoundingBox 
                        img={`${section.image.url}?environment=${process.env.REACT_APP_CONTENTSTACK_ENVIRONMENT}`} 
                        visualMarkups={section.image.visual_markups || []}
                    />
                </div>

                <div className="product-details-container">
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                        <h1 className="product-title">{section.image_title}</h1>
                    </div>
                    <p className="product-description">{section.description}</p>
                </div>
            </div>
        </div>
    )
}

export default VolvoProduct;