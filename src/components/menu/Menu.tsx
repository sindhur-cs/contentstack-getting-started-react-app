import React, { useEffect, useMemo, useState } from "react";
import MenuCard from "./MenuCard";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { LoadingSkeleton } from "../LoadingSkeleton";
import { TMenu, TDishes } from "../../types";
import { fetchCMAMenuPageData } from "../../api";
import { onEntryChange } from "../../sdk/utils";

const Menu: React.FC = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const menuPageData = useSelector(
    (state: RootState) => state.main.menuPageData
  );
  useEffect(() => {
    onEntryChange(() => {
      fetchCMAMenuPageData(dispatch, setLoading);
    });
  }, [dispatch]);

  const memoizedMenuPageData = useMemo(() => menuPageData, [menuPageData]);

  const categories = memoizedMenuPageData?.map((course: TMenu) => course);
  const dishes = memoizedMenuPageData?.map((course: TMenu) => course.beverages);
  console.log("Dishes", dishes, categories);
  const flatDishes: TDishes[] = dishes
    ?.flat()
    .filter(
      (dish, index, self) => index === self.findIndex((d) => d.uid === dish.uid)
    );

  const styleAlternateWords = (text: string) => {
    return text
      .split(" ")
      .map((char, index) =>
        index % 2 === 1 ? <span className="italic">{char}</span> : char
      )
      .reduce(
        (acc, curr) => (
          <>
            {acc} {curr}
          </>
        ),
        <></>
      );
  };

  return (
    <div className="menu-page">
      <div className="menu-heading">
        <span className="line1">Discover</span>
        <h1 className="line2">{styleAlternateWords("Our Beverages Menu")}</h1>
      </div>
      <div className="categories">
        {loading ? (
          <LoadingSkeleton />
        ) : (
          <>
            <div className="category">
              {categories
                ?.filter((category) => category.course_name !== "COMBOS") // filter combos out
                ?.map((category, index) => (
                <p
                  {...category.$.course_name}
                  key={`cat-${index}`}
                  className={activeIndex === index ? "active" : ""}
                  onClick={() => setActiveIndex(index)}
                >
                  {category.course_name}
                </p>
              ))}
            </div>
          </>
        )}
      </div>

      {!loading && (
        <div className="card-section">
          <MenuCard data={dishes[activeIndex]} />
        </div>
      )}
    </div>
  );
};

export default Menu;
