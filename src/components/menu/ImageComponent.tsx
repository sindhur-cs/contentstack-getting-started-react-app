import { TDishReference } from "../../types";

const Detail = ({ label, value }: { label: string, value: string }) => {
    return (
        <div className="menu-detail">
            <span className="menu-detail-label">{label}</span>
            <span className="menu-detail-value">{value}</span>
        </div>
    )
}

const ImageComponent = ({ entry, isOpen, setIsOpen, isAlt, setIsAlt }: { entry: TDishReference, isOpen: boolean, setIsOpen: (isOpen: boolean) => void, isAlt: boolean, setIsAlt: (isAlt: boolean) => void }) => {
    return (
        <div
            className="menu-item-image"
            style={{
                backgroundImage: `url(${entry?.image?.url || ""})`
            }}
        >
            <div
                className="info-icon"
                onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(!isOpen);
                }}
            >
                {!isOpen ? (
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
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="16" x2="12" y2="12"></line>
                        <line x1="12" y1="8" x2="12.01" y2="8"></line>
                    </svg>
                ) : (
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
                )}
            </div>

            {/* hover alt text icon */}
            <div
                className="alt-text-icon"
                onMouseOver={(e) => setIsAlt(true)}
                onMouseOut={(e) => setIsAlt(false)}
                title={entry?.alt_text || "Image description"}
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
                {entry?.alt_text || "No description available"}
            </div>}

            {/* product details */}
            {isOpen && (
                <div
                    className="menu-product-details"
                >
                    <div style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "18px",
                    }}>
                        <Detail label="Dietary Preference:" value={entry?.product_details?.dietary_preference || ""} />
                        <Detail label="Protein:" value={entry?.product_details?.protein || ""} />
                        <Detail label="Serving Temperature:" value={entry?.product_details?.serving_temperature || ""} />
                    </div>
                </div>
            )}
        </div>
    )
}

export default ImageComponent;