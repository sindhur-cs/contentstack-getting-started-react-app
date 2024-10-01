"use client";
import React, { useEffect, useMemo, useState } from "react";
import MenuCard from "@/components/menu/MenuCard";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { LoadingSkeleton } from "@/app/LoadingSkeleton";
import { TMenu, TDishes } from "@/types";
import { fetchMenuPageData } from "@/api";
import { onEntryChange } from "@/sdk/utils";
import Personalize from "@contentstack/personalize-edge-sdk";

export const dynamic = "force-dynamic";

export default function Menu({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) {
  let variant = decodeURIComponent(
    searchParams[Personalize.VARIANT_QUERY_PARAM]
  );
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const menuPageData = useSelector(
    (state: RootState) => state.main.menuPageData
  );

  useEffect(() => {
    onEntryChange(() => {
      fetchMenuPageData(dispatch, variant, setLoading);
    });
  }, [dispatch]);

  const memoizedMenuPageData = useMemo(() => menuPageData, [menuPageData]);

  const categories = memoizedMenuPageData?.map((course: TMenu) => course);
  const dishes = memoizedMenuPageData?.map((course: TMenu) => course.dishes);
  const flatDishes: TDishes[] = dishes
    ?.flat()
    .filter(
      (dish, index, self) => index === self.findIndex((d) => d.uid === dish.uid)
    );

  const styleAlternateWords = (text: string) => {
    return text
      .split(" ")
      .map((char, index) =>
        index % 2 === 1 ? (
          <span key={index} className="italic">
            {char}
          </span>
        ) : (
          char
        )
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
        <h1 className="line2">{styleAlternateWords("Our Dining Menu")}</h1>
      </div>
      <div className="categories">
        {loading ? (
          <LoadingSkeleton />
        ) : (
          <>
            <div className="category">
              <p
                key="cat-0"
                className={activeIndex === 0 ? "active" : ""}
                onClick={() => setActiveIndex(0)}
              >
                ALL CATEGORIES
              </p>
              {categories?.map((category, index) => (
                <p
                  {...category.$.course_name}
                  key={`cat-${index + 1}`}
                  className={activeIndex === index + 1 ? "active" : ""}
                  onClick={() => setActiveIndex(index + 1)}
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
          {activeIndex === 0 ? (
            <MenuCard data={flatDishes} />
          ) : (
            <MenuCard data={dishes[activeIndex - 1]} />
          )}
        </div>
      )}
    </div>
  );
}
