import { useNavigate } from 'react-router';
import './CampaignCard.css';
import { useEffect, useState } from 'react';
import { Detail } from '../menu/ImageComponent';

const VolvoCard = ({ description, image, title, id, healthBenefits, version }: { description: string, image: any, title: string, id: string, healthBenefits?: any, version?: string }) => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [isAlt, setIsAlt] = useState(false);
    const [alttext, setAltText] = useState("");

    let currImage: any = image;

    console.log(image);

    if (!image) {
        currImage = {
            url: "",
        }
    }

    useEffect(() => {
        const fetchAIData = async () => {
            try {
                const index = image.url.split("/").length - 2;
                const imageUid = index >= 0 ? image.url.split("/")[index] : null;
                const data = await fetch(`https://dev9-dam-api.csnonprod.com/api/bff/asset_metadata/${imageUid}`, {
                    method: "GET",
                    headers: {
                        "access_token": process.env.REACT_APP_DAM_ACCESS_TOKEN || "",
                        "organization_uid": process.env.REACT_APP_DAM_ORG_UID || "",
                        "x-cs-api-version": "4",
                        "Content-Type": "application/json"
                    },
                });
                const result = await data.json();
                setAltText(result.image_data.metadata.alt_text.descriptions[0].text);
                return result;
            }
            catch(error) {
                console.log(error);
                return null;
            }
        }

        fetchAIData();
    }, []);

    return (
        <div className="card" onClick={() => navigate(version === "volvo" ? `/volvo/${id}` : `/campaign/${id}`)}>
            <div className="imageContainer">
                <div style={{ position: "relative" }}>
                    <img
                        src={currImage.url}
                        // src={"/pineapple.png"}
                        alt="Campaign"
                        className="image"
                        onLoad={() => console.log('Image loaded')}
                        onError={(e) => console.log(e, "Image Failed")}
                    />

                    {/* info icon */}
                    <div
                        className="info-icon"
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsOpen(!isOpen);
                        }}
                    >
                        {!isOpen ? <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="16" x2="12" y2="12"></line>
                            <line x1="12" y1="8" x2="12.01" y2="8"></line>
                        </svg>
                            :
                            <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        }
                    </div>

                    {/* hover alt text icon */}
                    <div
                        className="alt-text-icon"
                        onMouseOver={() => setIsAlt(true)}
                        onMouseOut={() => setIsAlt(false)}
                        title={alttext || "Image description"}
                    >
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                            <circle cx="8.5" cy="8.5" r="1.5"></circle>
                            <polyline points="21 15 16 10 5 21"></polyline>
                        </svg>
                    </div>

                    {/* alt text */}
                    {isAlt && <div className="alt-text">
                        {alttext || "No description available"}
                    </div>}

                    {/* product details */}
                    {isOpen && (
                        <div
                            className="menu-product-details"
                        >
                            <div style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "14px",
                            }}>
                                <Detail label="Fiber:" value={healthBenefits.fiber || "Default"} />
                                <Detail label="Anti-oxidants:" value={healthBenefits.anti_oxidants_property || "Default"} />
                                <Detail label="Electrolytes:" value={healthBenefits.electrolytes_property || "Default"} />
                                <Detail label="Vitamins:" value={healthBenefits.vitamins_property || "Default"} />
                                <Detail label="Calories:" value={healthBenefits.calories_property || "Default"} />
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <div className="content">
                <p className="imageTitle">{title}</p>
                <p className="imageDescription">
                    {description}
                </p>
            </div>
        </div>
    )
}

export default VolvoCard