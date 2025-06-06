import { useParams } from "react-router"
import { useEffect, useState } from "react";
import LoadingScreen from "../LoadingScreen";
import Sidebar from "../Sidebar";
import CanvasWithBoundingBox from "../CanvasWithBoundingBox";
import { fetchCampaignPageData } from "../../api";

const Detail = ({ label, value }: { label: string, value: string }) => {
    return <div className="product-detail">
        <span style={{ color: "#a0a0a0", fontSize: "14px" }}>{label}</span>
        <span style={{ fontWeight: "600", fontSize: "16px" }}>{value}</span>
    </div>
}

const CampaignProduct = () => {
    const { id } = useParams(); 
    const [section, setSection] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const displaySections = async () => {
            try {
                const data = await fetchCampaignPageData();
                setSection(data.entry.sections.find((section: any) => section[id || ""]) || null);
            }
            catch (error) {
                setSection(null);
            }
            finally {
                setLoading(false);
            }
        }

        displaySections();
    }, []);

    
    if(loading) {
        return <LoadingScreen/>
    }
    
    if((!id || !section) && !loading) {
        return (
            <div className="menu-page">
                <div className="product-not-found">
                    No {id} found
                </div>
            </div>
        );
    }

    let currImage: any = section[id as string].image;

    if(!section[id as string].image) {
        currImage = {
            url: "",
            custom_metadata: {
                campaign_name: "Default",
                health_benefits: {
                    fiber: "Default",
                    anti_oxidants_property: "Default",
                    vitamins_property: "Default",
                    electrolytes_property: "Default",
                    calories_property: "Default"
                }
            }
        }
    }

    const {
        url,
        custom_metadata: {
            campaign_name,
            health_benefits: {
                fiber,
                anti_oxidants_property,
                vitamins_property,
                electrolytes_property,
                calories_property
            }
        }
    } = currImage;

    return (
        <div className="menu-page">
            <div className="product-container">
                <Sidebar url={url}/>
                    <div className="product-image-container">
                        {/* <CanvasWithBoundingBox img={"https://dev9-dam-api.csnonprod.com/api/spaces/am7972de584c4e0397/assets/am7e18362214a6803c/f32c2d2fe77c6ba1a5bd354c/banana.png"}/> */}
                        {/* <CanvasWithBoundingBox img={"/pineapple.png"}/> */}
                        <CanvasWithBoundingBox img={url}/>
                    </div>

                <div className="product-details-container">
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                        <h1 className="product-title">Benefits of {id}</h1>
                    </div>
                    <p className="product-description">{section[id as string].description}</p>
                    <h3 className="product-section-heading">Nutritional Information</h3>
                    <div className="product-details-grid">
                        <Detail
                            label="Fiber"
                            value={fiber}
                        />
                        <Detail
                            label="Anti-oxidants"
                            value={anti_oxidants_property}
                        />
                        <Detail
                            label="Electrolytes"
                            value={electrolytes_property}
                        />
                        <Detail
                            label="Vitamins"
                            value={vitamins_property}
                        />
                        <Detail
                            label="Calories"
                            value={calories_property}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CampaignProduct;