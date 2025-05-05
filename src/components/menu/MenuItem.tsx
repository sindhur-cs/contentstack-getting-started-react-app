import { useEffect, useState } from "react"
import { TDishes } from "../../types"
import { getEntryByUid } from "../../api";
import { useDispatch, useSelector } from "react-redux";
import { setProductDetailsData } from "../../reducer";
import { RootState } from "../../store";
import { useNavigate } from "react-router";
import ImageComponent from "./ImageComponent";

const MenuItem = ({ menuItem }: { menuItem: TDishes }) => {
    const dispatch = useDispatch();
    const entries = useSelector((state: RootState) => state.main.productsDetailsData);
    const [isOpen, setIsOpen] = useState(false);
    const [isAlt, setIsAlt] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
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

    if(!entry) return null;

    return (
        <div 
            className="menu-card-item menu-item" 
            key={menuItem.uid}
            onClick={() => navigate(`/${menuItem._content_type_uid}/${menuItem?.uid}`)}
        >
            <ImageComponent entry={entry} isOpen={isOpen} setIsOpen={setIsOpen} isAlt={isAlt} setIsAlt={setIsAlt} />
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