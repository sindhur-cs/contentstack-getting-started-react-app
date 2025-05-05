import { useParams } from "react-router"
import { useEffect, useState } from "react";
import { Image, TData } from "../../types";
import LoadingScreen from "../LoadingScreen";
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
    const [isLoading, setIsLoading] = useState(true);
    const [entry, setEntry] = useState<TData | null>(null);
    const data = useSelector((state: RootState) => state.main.beverages);

    useEffect(() => {
        const currEntry = data.find((data) => data.uid === id) || null;
        setEntry(currEntry);
        setIsLoading(false);
    }, [data, id]);

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

    let image: Image | Image[] | null = entry.image;

    if(Array.isArray(entry.image)) {
        image = entry.image.find((image) => image.custom_metadata.combo_menu_flag === (entry.content_type_uid === "beverages" ? "No" : "Yes")) || null;
    }

    if(!image) {
        return null;
    }

    const {
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
    } = image as Image;

    let relatedEntries: Image[] = [];

    if (Array.isArray(entry.image)) {
        relatedEntries = entry.image.filter((image) => image.custom_metadata.combo_menu_flag === "Yes");
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

                    {entry?.content_type_uid !== "combos" &&relatedEntries && relatedEntries.length > 0 && (
                        <div className="product-image-grid">
                            {relatedEntries.map((relatedEntry, index) => (
                                <div
                                    key={index}
                                    className="product-combo-container"
                                    onClick={(e) => {
                                        setEntry({
                                            uid: "",
                                            content_type_uid: "combos",
                                            price: entry.price,
                                            title: entry.title,
                                            description: relatedEntry.custom_metadata.alttext,
                                            image: relatedEntry,
                                            $: entry.$
                                        });
                                    }}
                                >
                                    <div className="combo-ribbon">Combo</div>
                                    <img
                                        src={relatedEntry.url}
                                        alt={relatedEntry.custom_metadata.alttext}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="product-details-container">
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                        <h1 className="product-title">{entry?.title}</h1>
                        {entry?.content_type_uid === "combos" && <span className="product-sub-title">Save more with combo</span>}
                    </div>
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