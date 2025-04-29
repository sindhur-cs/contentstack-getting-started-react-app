import { useEffect, useState } from "react";
import { TAsset, TDishes } from "../../types";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { useNavigate } from "react-router";
import { DAM_API } from "../../apiconfig";
import { setAssetMetadata } from "../../reducer";
import Spinner from '../Spinner';
import { getCMAEntry, getCMAEntryByUid } from "../../api";
import LoadingScreen from "../LoadingScreen";
import LoadingSkeleton from "../LoadingSkeleton";

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

const ImageComponent = ({ asset, isOpen, setIsOpen, isAlt, setIsAlt }: { asset: TAsset | null, isOpen: boolean, setIsOpen: React.Dispatch<React.SetStateAction<boolean>>, isAlt: boolean, setIsAlt: React.Dispatch<React.SetStateAction<boolean>> }) => {
    if(!asset) {
        return <div className="menu-item-image" style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
        }}>
            <Spinner/>
        </div>
    }

    const { url, custom_metadata: {
        alttext,
        nutrition_information: {
            energy,
            protein,
            carbohydrates,
            sugar,
            sodium,
            fat
        }
    } } = asset as TAsset;

    return (
        <div
            className="menu-item-image"
            style={{
                background: `url(${url}) lightgray 50% / cover no-repeat`
            }}
        >
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
                        gap: "8px",
                    }}>
                        <Detail label="Energy:" value={energy || "0 g"} />
                        <Detail label="Protein:" value={protein || "0 g"} />
                        <Detail label="Carbohydrates:" value={carbohydrates || "0 g"} />
                        <Detail label="Sugar:" value={sugar || "0 g"} />
                        <Detail label="Sodium:" value={sodium || "0 g"} />
                        <Detail label="Fat:" value={fat || "0 g"} />
                    </div>
                </div>
            )}
        </div>
    );
}

const MenuItem = ({ menuItemProp }: { menuItemProp: TDishes }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isAlt, setIsAlt] = useState(false);
    const globalAssets = useSelector((state: RootState) => state.main.assetMetadata);
    const [asset, setAsset] = useState<TAsset | null>(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    // const menuItem = menuItemProp;

    // CMA
    const [menuItem, setMenuItem] = useState<{
        uid: string;
        content_type_uid: string;
        price: number;
        title: string;
        description: string;
        $: {
            price: number[],
            description: string[],
            title: string[]
        }
    } | null>(null);

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

                const currAsset = assets.find((asset: any) => asset.custom_metadata.content_uid === menuItemProp.uid);

                setAsset(currAsset);

                dispatch(setAssetMetadata(currAsset));
            }
            catch (error) {
                console.log(error);
            }
        }

        const ifAssetPresent = globalAssets.find((asset: any) => asset?.custom_metadata.content_uid === menuItemProp.uid);

        if (!ifAssetPresent) {
            fetchData();
        }
        else {
            setAsset(ifAssetPresent);
        }
    }, []);

    useEffect(() => {
        // fetch the references as CMA does not allow includeReferences() or include_all
        const fetchReferences = async () => {
            const data = await getCMAEntryByUid(menuItemProp._content_type_uid, menuItemProp.uid);
            setMenuItem(data);
        }

        fetchReferences();
    }, []);

    return (
        <div id={menuItemProp?.uid} className="menu-card-item menu-item" onClick={() => navigate(`/${menuItemProp?._content_type_uid}/${menuItemProp?.uid}`)}>
            <ImageComponent asset={asset} isOpen={isOpen} setIsOpen={setIsOpen} isAlt={isAlt} setIsAlt={setIsAlt}/>
            {menuItem ? <div className="item-content">
                <div className="item-content-text">
                    <span {...menuItem?.$?.price} className="price">
                        ${menuItem?.price}
                    </span>
                    <p {...menuItem?.$?.title}>{menuItem?.title}</p>
                    <span {...menuItem?.$?.description} className="description">
                        {menuItem?.description}
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
            </div> : null}
        </div>
    )
}

export default MenuItem