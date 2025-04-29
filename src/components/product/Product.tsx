import { redirect, useNavigate, useParams } from "react-router"
import { useEffect, useState } from "react";
import { TAsset, TDishes } from "../../types";
import LoadingScreen from "../LoadingScreen";
import { DAM_API } from "../../apiconfig";
import { getCMAEntry, getEntry } from "../../api";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

const Detail = ({ label, value }: { label: string, value: string }) => {
    return <div className="product-detail">
        <span style={{ color: "#a0a0a0", fontSize: "14px" }}>{label}</span>
        <span style={{ fontWeight: "600", fontSize: "16px" }}>{value}</span>
    </div>
}

const Product = () => {
    const { product, id } = useParams();
    const [entry, setEntry] = useState<TAsset | null>(null);
    const [menuItem, setMenuItem] = useState<TDishes | null>(null);
    const [relatedEntries, setRelatedEntries] = useState<TAsset[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // get the related combos based on media id
        async function getAllCombosInMedia(mediaId: string) {
            try {
                const response = await fetch(DAM_API.url, {
                    method: "POST",
                    headers: DAM_API.headers,
                    body: JSON.stringify({
                        ...DAM_API.payload,
                        parent_uid: mediaId
                    })
                });

                const responseData = await response.json();

                const relatedEntries = responseData.assets.filter((asset: TAsset) => asset.custom_metadata.content_uid !== id);

                setRelatedEntries(relatedEntries);
            }
            catch (error) {
                console.log(error);
            }
            finally {
                setIsLoading(false);
            }
        }

        // get the current asset from dam for the media id and custom metadata
        async function getCurrentAsset() {
            try {
                const response = await fetch(DAM_API.url, {
                    method: "POST",
                    headers: DAM_API.headers,
                    body: JSON.stringify(DAM_API.payload)
                });

                const responseData = await response.json();

                return responseData?.assets?.find((asset: TAsset) => asset.custom_metadata.content_uid === id);
            }
            catch (error) {
                console.log(error);
            }
        }

        // get asset content from the stack for price, description, etc
        async function getAssetContent(contentTypeUid: string, entryUrl: string) {
            // cda
            // const response: TDishes[][] = await getEntry(contentTypeUid);
            // return response?.[0]?.find((res: TDishes) => res.uid === entryUrl) || null;

            // cma
            const response = await getCMAEntry(contentTypeUid);
            if(Array.isArray(response)) {
                return response.find((res: TDishes) => res.uid === entryUrl) || null;
            }
        }

        async function initialiseAsset(product: string, id: string) {
            try {
                const content = await getAssetContent(product, id);
                setMenuItem(content);

                const ifAssetPresent = await getCurrentAsset();

                if (ifAssetPresent) {
                    setEntry(ifAssetPresent);
                    const mediaId = ifAssetPresent.custom_metadata.media_set_id;
                    if (mediaId && mediaId.length > 0) {
                        getAllCombosInMedia(mediaId);
                    }
                    else {
                        setRelatedEntries([]);
                        setIsLoading(false);
                    }
                }
            }
            catch (error) {
                console.log(error);
            }
        }

        if (product && id) {
            initialiseAsset(product, id);
        }
    }, [id]);

    if (isLoading) {
        return (
            <LoadingScreen />
        );
    }

    if (!entry) {
        return (
            <div className="menu-page">
                <div className="product-not-found">
                    No {product} found
                </div>
            </div>
        );
    }

    const { custom_metadata: { 
        alttext, 
        content_uid, 
        nutrition_information: {
            energy,
            protein,
            fat,
            sugar,
            sodium,
            carbohydrates
        }
    }, uid, url } = entry;

    return (
        <div className="menu-page">
            <div className="product-container">
                <div>
                    <div className="product-image-container">
                        <img
                            src={url}
                            alt={alttext}
                            className="product-image"
                        />
                    </div>

                    {relatedEntries && relatedEntries.length > 0 && (
                        <div className="product-image-grid">
                            {relatedEntries.map((entry, index) => (
                                <div
                                    key={uid || index}
                                    className="product-combo-container"
                                    onClick={() => navigate(`/combos/${entry.custom_metadata.content_uid}`)}
                                >
                                    <img
                                        src={entry.url}
                                        alt={entry.custom_metadata.alttext}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="product-details-container">
                    <h1 className="product-title">{menuItem?.title}</h1>
                    <div className="product-price">${menuItem?.price}</div>
                    <p className="product-description">{menuItem?.description}</p>
                    <h3 className="product-section-heading">Nutritional Information</h3>
                    <div className="product-details-grid">
                        <Detail
                            label="Energy"
                            value={energy || ""}
                        />
                        <Detail
                            label="Protein"
                            value={protein || ""}
                        />
                        <Detail
                            label="Fat"
                            value={fat || ""}
                        />
                        <Detail
                            label="Sugar"
                            value={sugar || ""}
                        />
                        <Detail
                            label="Sodium"
                            value={sodium || ""}
                        />
                        <Detail
                            label="Carbohydrates"
                            value={carbohydrates || ""}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Product