import { useEffect, useState } from "react";
import { TAsset, TDishes } from "../../types";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { useNavigate } from "react-router";
import { DAM_API } from "../../apiconfig";
import { setAssetMetadata } from "../../reducer";

const Detail = ({ label, value }: { label: string, value: string }) => {
    return <div style={{
        display: "flex",
        flexDirection: "column",
        gap: "8px"
    }}>
        <span style={{ color: "#a0a0a0", fontSize: "14px" }}>{label}</span>
        <span style={{ fontWeight: "bolder", fontSize: "14px" }}>{value}</span>
    </div>
}

const MenuItem = ({ menuItem }: { menuItem: TDishes }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isAlt, setIsAlt] = useState(false);
    const globalAssets = useSelector((state: RootState) => state.main.assetMetadata);
    const [asset, setAsset] = useState<TAsset | null>(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        // fetch image info using DAM call
        const fetchData = async () => {
            try {
                // fetch asset
                // store in global state
                // currently cors issue
                const response = await fetch(DAM_API.url, {
                    method: 'POST',
                    headers: DAM_API.headers,
                    body: JSON.stringify(DAM_API.payload)
                  });

                const responseData = await response.json();

                const { assets } = responseData;

                const currAsset = assets.find((asset: any) => asset.custom_metadata.content_uid === menuItem.uid);

                setAsset(currAsset);

                dispatch(setAssetMetadata(currAsset));
            }
            catch (error) {
                console.log(error);
            }
        }

        const ifAssetPresent = globalAssets.find((asset: any) => asset?.custom_metadata.content_uid === menuItem.uid);

        if(!ifAssetPresent) {
            fetchData();
        }
        else {
            setAsset(ifAssetPresent);
        }
    }, []);

    console.log(asset);

    return (
        <div id={menuItem.uid} className="menu-card-item menu-item" onClick={() => navigate(`/${menuItem._content_type_uid}/${menuItem?.uid}`)}>
            <div
                className="menu-item-image"
                style={{
                    background: `url(${asset?.url}) lightgray 50% / cover no-repeat`
                }}
            >
                {/* info icon */}
                {<div
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
                }

                {/* hover alt text icon */}
                <div
                    className="alt-text-icon"
                    onMouseOver={() => setIsAlt(true)}
                    onMouseOut={() => setIsAlt(false)}
                    title={asset?.custom_metadata.alttext || "Image description"}
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
                    {asset?.custom_metadata.alttext || "No description available"}
                </div>}

                {/* product details */}
                {isOpen && (
                    <div
                        className="menu-product-details"
                    >
                        <div style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "8px",
                        }}>
                            <Detail label="Energy:" value={asset?.custom_metadata?.nutrition_information?.energy || "0 g"} />
                            <Detail label="Protein:" value={asset?.custom_metadata?.nutrition_information?.protein || "0 g"} />
                            <Detail label="Carbohydrates:" value={asset?.custom_metadata?.nutrition_information?.carbohydrates || "0 g"} />
                            <Detail label="Sugar:" value={asset?.custom_metadata?.nutrition_information?.sugar || "0 g"} />
                            <Detail label="Sodium:" value={asset?.custom_metadata?.nutrition_information?.sodium || "0 g"} />
                            <Detail label="Fat:" value={asset?.custom_metadata?.nutrition_information?.fat || "0 g"} />
                        </div>
                    </div>
                )}
            </div>
            <div className="item-content">
                <div className="item-content-text">
                    <span {...menuItem.$.price} className="price">
                        ${menuItem.price}
                    </span>
                    <p {...menuItem.$.title}>{menuItem.title}</p>
                    <span {...menuItem.$.description} className="description">
                        {menuItem.description}
                    </span>
                </div>
                <hr
                    style={{
                        width: "80px",
                        height: "2px",
                        backgroundColor: "#2D00FF",
                        border: "none",
                    }}
                />
            </div>
        </div>
    )
}

export default MenuItem