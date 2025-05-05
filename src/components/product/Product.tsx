import { useNavigate, useParams } from "react-router"
import { useEffect, useState } from "react";
import { Image, TData } from "../../types";
import LoadingScreen from "../LoadingScreen";
import { getCMAEntryByUid } from "../../api";

const Detail = ({ label, value }: { label: string, value: string }) => {
    return <div className="product-detail">
        <span style={{ color: "#a0a0a0", fontSize: "14px" }}>{label}</span>
        <span style={{ fontWeight: "600", fontSize: "16px" }}>{value}</span>
    </div>
}

const Product = () => {
    const { product, id } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const [entry, setEntry] = useState<TData | null>(null);

    useEffect(() => {
        try {
            const fetchProduct = async () => {
                const data = await getCMAEntryByUid(product as string, id as string);
                setEntry(data);
                setIsLoading(false);
            }

            if (product && id) {
                fetchProduct();
            }
        }
        catch (error) {
            console.log(error);
        }
    }, []);

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

    const image = Array.isArray(entry.image) ? entry.image[0] : entry.image;

    const { 
        uid, 
        image: {
            url,
            custom_metadata: {
                alttext,
                nutrition_information: {
                    energy,
                    protein,
                    fat,
                    sugar,
                    sodium,
                    carbohydrates
                }
            }
        }
    } = { ...entry, image };

    let relatedEntries: Image[] = [];

    if (Array.isArray(entry.image)) {
        relatedEntries = entry.image.slice(1, entry.image.length);
    }

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
                                    // onClick={() => navigate(`/${product === "beverages" ? "combos" : "beverages"}/${entry.custom_metadata.content_uid}`)}
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
                    <h1 className="product-title">{entry?.title}</h1>
                    <div className="product-price">${entry?.price}</div>
                    <p className="product-description">{entry?.description}</p>
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