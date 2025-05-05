import { useEffect, useState } from "react";
import { TData, TDishes } from "../../types";
import { useNavigate } from "react-router";
import ImageComponent from "./ImageComponent";
import { RootState } from "../../store";
import { useSelector } from "react-redux";

const MenuItem = ({ menuItemProp }: { menuItemProp: TDishes }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isAlt, setIsAlt] = useState(false);
    const navigate = useNavigate();
    const [menuItem, setMenuItem] = useState<TData | null>(null);
    const data = useSelector((state: RootState) => state.main.beverages);

    useEffect(() => {
        const currEntry = data.find((data) => data.uid === menuItemProp.uid) || null;
        setMenuItem(currEntry);
    }, [data, menuItemProp]);

    return (
        <div id={menuItemProp?.uid} className="menu-card-item menu-item" onClick={() => navigate(`/${menuItemProp?._content_type_uid}/${menuItemProp?.uid}`)}>
            <ImageComponent asset={menuItem} isOpen={isOpen} setIsOpen={setIsOpen} isAlt={isAlt} setIsAlt={setIsAlt} />
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
