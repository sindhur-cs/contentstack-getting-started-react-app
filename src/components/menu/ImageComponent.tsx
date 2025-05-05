import { TAsset, TData } from "../../types";
import Spinner from "../Spinner";

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

const ImageComponent = ({ asset, isOpen, setIsOpen, isAlt, setIsAlt }: { asset: TData | null, isOpen: boolean, setIsOpen: React.Dispatch<React.SetStateAction<boolean>>, isAlt: boolean, setIsAlt: React.Dispatch<React.SetStateAction<boolean>> }) => {
    if (!asset) {
        return <div className="menu-item-image" style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
        }}>
            <Spinner />
        </div>
    }

    const image = Array.isArray(asset.image) ? asset.image[0] : asset.image;
    
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
    } } = image;

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


export default ImageComponent;