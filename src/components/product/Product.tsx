import { useNavigate, useParams } from "react-router"
import { useEffect, useState } from "react";
import { ProductImage, TDishes } from "../../types";
import LoadingScreen from "../LoadingScreen";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { convertToProductImage } from "../../lib/utils";

const Detail = ({ label, value }: { label: string, value: string }) => {
    return <div className="product-detail">
        <span style={{ color: "#a0a0a0", fontSize: "14px" }}>{label}</span>
        <span style={{ fontWeight: "600", fontSize: "16px" }}>{value}</span>
    </div>
}

const Product = () => {
    const { product, id } = useParams();
    const [entry, setEntry] = useState<TDishes | null>(null);
    const [productDetails, setProductDetails] = useState<ProductImage | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [combos, setCombos] = useState<TDishes[]>([]);
    const dishesData = useSelector((state: RootState) => state.main.dishesData);
    const productDetailsData = useSelector((state: RootState) => state.main.productsDetailsData);
    const navigate = useNavigate();

    const findProductDetails = (uid: string) => {
        return productDetailsData.find((product) => product.uid === uid) || null;
    };

    const processCombos = (dish: TDishes) => {
        setCombos([]);
        dish?.combos?.forEach((combo) => {
            const comboDetails = dishesData.find((dish) => dish.uid === combo.uid) || null;
            const comboProductDetails = findProductDetails(comboDetails?.product_image_reference?.[0]?.uid || '');
            
            if (comboDetails && comboProductDetails) {
                setCombos((prev) => [...prev, {
                    ...comboDetails,
                    product_image_reference: [convertToProductImage(comboProductDetails)]
                }]);
            }
        });
    };

    useEffect(() => {
        const dish = dishesData.find((dish) => dish.uid === id) || null;
        if (dish) {
            const details = findProductDetails(dish.product_image_reference?.[0]?.uid || '');
            setEntry(dish);
            setProductDetails(details ? convertToProductImage(details) : null);
            processCombos(dish);
        }
        setIsLoading(false);
    }, [id]);

    if (isLoading) {
        return <LoadingScreen />;
    }

    if (!entry || !productDetails) {
        return (
            <div className="menu-page">
                <div className="product-not-found">
                    No {product} found
                </div>
            </div>
        );
    }

    const { title, price, description } = entry;
    const { image: { url }, alt_text, product_details: { dietary_preference, protein, serving_temperature } } = productDetails;

    return (
        <div className="menu-page">
            <div className="product-container">
                <div>
                    <div className="product-image-container">
                        <img
                            src={url}
                            alt={alt_text}
                            className="product-image"
                        />
                    </div>

                    {combos && combos.length > 0 && (
                        <div className="product-image-grid">
                            {combos.map((combo, index) => (
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
                    <h1 className="product-title">{title}</h1>
                    <div className="product-price">${price}</div>
                    <p className="product-description">{description}</p>
                    <h3 className="product-section-heading">Nutritional Information</h3>
                    <div className="product-details-grid">
                        <Detail
                            label="Dietary Preference"
                            value={dietary_preference || ""}
                        />
                        <Detail
                            label="Protein"
                            value={protein || ""}
                        />
                        <Detail
                            label="Serving Temperature"
                            value={serving_temperature || ""}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Product