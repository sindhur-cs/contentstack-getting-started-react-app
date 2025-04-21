import { useNavigate, useParams } from "react-router"
import { useEffect, useState } from "react";
import { TDishes } from "../../types";
import { getEntryByUid } from "../../api";
import LoadingScreen from "../LoadingScreen";

const Detail = ({ label, value }: { label: string, value: string }) => {
    return <div className="product-detail">
        <span style={{ color: "#a0a0a0", fontSize: "14px" }}>{label}</span>
        <span style={{ fontWeight: "600", fontSize: "16px" }}>{value}</span>
    </div>
}

const Product = () => {
    const { product, id } = useParams();
    const [entry, setEntry] = useState<TDishes | null>(null);
    const [isLoading, setIsLoading] =  useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if(product && id) {
            getEntryByUid({ contentTypeUid: product, entryUid: id, include: true })
            .then(data => {
                console.log(data, product, id);
                setEntry(data);
            })
            .catch(error => {
                console.log(error);
                setEntry(null);
            })
            .finally(() => {
                setIsLoading(false);
            })
        }
    }, [id]);

    if(isLoading) {
        return (
            <LoadingScreen/>
        );
    }

    return (
        <div className="menu-page">
            {entry ? (
                <div className="product-container">
                    <div>
                        <div className="product-image-container">
                            <img 
                                src={entry.product_image_reference?.[0]?.image.url} 
                                alt={entry.product_image_reference?.[0]?.alt_text} 
                                className="product-image"
                            />
                        </div>
                        
                        {entry.combos && entry.combos.length > 0 && (
                            <div className="product-image-grid">
                                {entry.combos.map((combo, index) => (
                                    <div 
                                        key={combo.uid || index}
                                        className="product-combo-container"
                                        onClick={() => navigate(`/${combo._content_type_uid}/${combo.uid}`)}
                                    >
                                        <img 
                                            src={combo.product_image_reference?.[0].image.url} 
                                            alt={combo.product_image_reference?.[0].alt_text} 
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="product-details-container">
                        <h1 className="product-title">{entry.title}</h1>
                        <div className="product-price">${entry.price}</div>
                        <p className="product-description">{entry.description}</p>
                        <h3 className="product-section-heading">Nutritionary Information</h3>
                        <div className="product-details-grid">
                            <Detail 
                                label="Dietary Preference" 
                                value={entry.product_image_reference?.[0]?.product_details.dietary_preference || ""} 
                            />
                            <Detail 
                                label="Protein" 
                                value={entry.product_image_reference?.[0]?.product_details.protein || ""} 
                            />
                            <Detail 
                                label="Serving Temperature" 
                                value={entry.product_image_reference?.[0]?.product_details.serving_temperature || ""} 
                            />
                        </div>
                    </div>
                </div>
            ) : (
                <div className="product-not-found">
                    No {product} found
                </div>
            )}
        </div>
    )
}

export default Product