import { useEffect, useState } from "react"
import { TDishes } from "../../types"
import { getEntryByUid } from "../../api";
import { useDispatch, useSelector } from "react-redux";
import { setProductDetailsData } from "../../reducer";
import { RootState } from "../../store";
import { useNavigate } from "react-router";

const Detail = ({ label, value }: { label: string, value: string }) => {
    return (
        <div className="menu-detail">
            <span className="menu-detail-label">{label}</span>
            <span className="menu-detail-value">{value}</span>
        </div>
    )
}

const MenuItem = ({ menuItem }: { menuItem: TDishes }) => {
    const dispatch = useDispatch();
    const entries = useSelector((state: RootState) => state.main.productsDetailsData);
    const [isOpen, setIsOpen] = useState(false);
    const [isAlt, setIsAlt] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // calls only the first time - on first render
        // make a call to references to fetch product details - level 2 reference
        async function getReferenceDetails() {
            try {
                const productImageReference = menuItem.product_image_reference;

                if (productImageReference) {
                    const entry = await getEntryByUid({
                        contentTypeUid: productImageReference?.[0]?._content_type_uid,
                        entryUid: productImageReference?.[0]?.uid,
                        include: false
                    });
                    dispatch(setProductDetailsData(entry));
                }
            }
            catch (error) {
                console.log(error);
            }
        }

        getReferenceDetails();
    }, []);

    const entry = entries.find(entry => entry.uid === menuItem.product_image_reference?.[0]?.uid);

    return (
        <div 
            className="menu-card-item menu-item" 
            key={menuItem.uid}
            onClick={() => navigate(`/${menuItem._content_type_uid}/${menuItem?.uid}`)}
        >
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