import React from "react";
import { TDishes } from "../../types";

const MenuCard: React.FC<{ data: TDishes[] }> = ({ data }) => {
  return (
    <div className="menu-card">
      {data ? (
        data.map((menuItem: TDishes) => (
          <div className="menu-card-item">
            <div
              {...menuItem.image.$.url}
              style={{
                background: `url(${menuItem.image.url}) lightgray 50% / cover no-repeat`,
                height: "320px",
                alignSelf: "stretch",
              }}
            ></div>
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
        ))
      ) : (
        <></>
      )}
    </div>
  );
};

export default MenuCard;
