import { TDishes } from "../../types";
import MenuItem from "./MenuItem";

const MenuCard: React.FC<{ data: TDishes[] }> = ({ data }) => {
  return (
    <div className="menu-card">
      {data ? (
        data.map((menuItem: TDishes) => (
          <MenuItem key={menuItem.uid} menuItem={menuItem}/>
        ))
      ) : (
        <></>
      )}
    </div>
  );
};

export default MenuCard;
