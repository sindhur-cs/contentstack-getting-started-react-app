import { Dispatch } from "react";
import { CONTENT_TYPES } from "../constants";
import {
  setDishesData,
  setFooterData,
  setHeaderData,
  setHomePageData,
  setMenuPageData,
} from "../reducer";
import { initializeContentstackSdk } from "../sdk/utils";
import * as Utils from "@contentstack/utils";
import { addEditableTags } from "@contentstack/utils";
import { TDishes, TMenu } from "../types";

const Stack = initializeContentstackSdk();

type GetEntryByUrl = {
  entryUrl: string | undefined;
  contentTypeUid: string;
  referenceFieldPath: string[] | undefined;
  jsonRtePath: string[] | undefined;
};

type GetEntryByUid = {
  entryUid: string;
  contentTypeUid: string;
  include: boolean
};

const renderOption = {
  span: (node: any, next: any) => next(node.children),
};

export const getEntry = (contentType: string) => {
  const Query = Stack.ContentType(contentType).Query();
  return Query.toJSON()
    .find()
    .then((entry) => {
      return entry;
    })
    .catch((err: any) => {
      return {};
    });
};

export const getEntryByUrl = ({
  contentTypeUid,
  entryUrl,
  referenceFieldPath,
  jsonRtePath,
}: GetEntryByUrl) => {
  return new Promise((resolve, reject) => {
    const blogQuery = Stack.ContentType(contentTypeUid).Query();
    if (referenceFieldPath) blogQuery.includeReference(referenceFieldPath);
    blogQuery.toJSON();
    const data = blogQuery.where("url", `${entryUrl}`).find();
    data.then(
      (result) => {
        jsonRtePath &&
          Utils.jsonToHTML({
            entry: result,
            paths: jsonRtePath,
            renderOption,
          });
        resolve(result[0]);
      },
      (error) => {
        console.error(error);
        reject(error);
      }
    );
  });
};

export const getEntryByUid = async ({
  contentTypeUid,
  entryUid,
  include
}: GetEntryByUid) => {
  const Query = await Stack.ContentType(contentTypeUid).Entry(entryUid);

  if(include) {
    Query.includeReference("product_image_reference");
  }

  // when dishes include the combos references as well
  if(include && contentTypeUid === "dishes") {
    Query.includeReference("combos", "combos.product_image_reference");
  }

  return Query.toJSON()
  .fetch()
  .then((entry) => {
    return entry;
  })
  .catch((err: any) => {
    return {};
  })
}

export const fetchHeaderData = async (
  dispatch: Dispatch<any>
): Promise<void> => {
  const data = await getEntry(CONTENT_TYPES.HEADER);
  addEditableTags(data[0][0], CONTENT_TYPES.HEADER, true, "en-us");
  dispatch(setHeaderData(data[0][0]));
};

export const fetchFooterData = async (
  dispatch: Dispatch<any>
): Promise<void> => {
  const data = await getEntry(CONTENT_TYPES.FOOTER);
  addEditableTags(data[0][0], CONTENT_TYPES.FOOTER, true, "en-us");
  dispatch(setFooterData(data[0][0]));
};

export const fetchHomePageData = async (
  dispatch: Dispatch<any>
): Promise<void> => {
  const data: any = await getEntryByUrl({
    contentTypeUid: CONTENT_TYPES.PAGE,
    entryUrl: "/",
    referenceFieldPath: undefined,
    jsonRtePath: undefined,
  });
  addEditableTags(data[0], CONTENT_TYPES.PAGE, true, "en-us");
  dispatch(setHomePageData(data[0]));
};

export const fetchInitialData = async (
  dispatch: Dispatch<any>,
  setLoading: (status: boolean) => void
): Promise<void> => {
  try {
    await Promise.all([
      fetchHeaderData(dispatch),
      fetchFooterData(dispatch),
      fetchHomePageData(dispatch),
    ]);
    setLoading(false);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

export const fetchMenuPageData = async (
  dispatch: Dispatch<any>,
  setLoading: (status: boolean) => void
): Promise<void> => {
  const data: any = await getEntryByUrl({
    contentTypeUid: CONTENT_TYPES.PAGE,
    entryUrl: "/menu",
    referenceFieldPath: ["sections.menu.course.dishes"],
    jsonRtePath: undefined,
  });
  addEditableTags(data[0], CONTENT_TYPES.PAGE, true, "en-us");
  
  data[0].sections[0].menu.course.forEach((course: TMenu) => {
    course.dishes.forEach((dish: TDishes) => {
      dispatch(setDishesData(dish));
    });
  });
  
  dispatch(setMenuPageData(data[0].sections[0].menu.course));
  setLoading(false);
};
