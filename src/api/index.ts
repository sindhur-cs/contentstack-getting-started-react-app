import { Dispatch } from "react";
import { CONTENT_TYPES } from "../constants";
import {
  setFooterData,
  setHeaderData,
  setHomePageData,
  setMenuPageData,
} from "../reducer";
import { initializeContentstackManagementSdk, initializeContentstackSdk } from "../sdk/utils";
import * as Utils from "@contentstack/utils";
import { addEditableTags } from "@contentstack/utils";

const Stack = initializeContentstackSdk();
const CmaStack = initializeContentstackManagementSdk();

const entryuids = [
  ["beverages", "blta731e4b806a082da"],
  ["beverages", "blte85de550a9c317e2"], 
  ["beverages", "blta48e59ea0120aae0"], 
  ["beverages", "bltd2735c5350123258"],
  ["beverages", "blt6266a887e6d1d2ae"],
  ["beverages", "bltcca8bd6c8899c4e7"],
  ["combos", "bltc1233f77d71bd6e6"], 
  ["combos", "blt098db4f4c0194b34"],
  ["combos", "bltcc0cbb5b9509ded4"],
  ["combos", "bltbd0db6fc7a4c11ea"],
  ["combos", "blt1a650fa55b700e26"],
  ["page", "blt52268218c0c386ed"],
  ["page", "blted95b6b9909b91f8"],
  ["footer", "bltba6f4a94433308ae"],
  ["header", "blt806b6de69b2e6436"]
]

type GetEntryByUrl = {
  entryUrl: string | undefined;
  contentTypeUid: string;
  referenceFieldPath: string[] | undefined;
  jsonRtePath: string[] | undefined;
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

export const getCMAEntry = async (contentType: string) => {
  const matchingEntries = entryuids.filter((entryuid) => entryuid[0] === contentType);
  const entries = await Promise.all(
    matchingEntries.map(async (entryuid) => {
      try {
        const Query = CmaStack.contentType(contentType).entry(entryuid[1]);
        const entry = await Query.fetch();
        return entry;
      } catch (err) {
        console.error(err);
        return null;
      }
    })
  );
  return entries.filter(entry => entry !== null);
};

export const getCMAEntryByUid = (contentType: string, entryUrl: string) => {
  const Query = CmaStack.contentType(contentType).entry(entryUrl).fetch();

  return Query
    .then((entry: any) => {
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

export const getCMAEntryByUrl = ({
  contentTypeUid,
  entryUrl,
  referenceFieldPath,
  jsonRtePath,
}: GetEntryByUrl) => {
  return new Promise((resolve, reject) => {
    entryuids.filter((entryuid) => entryuid[0] === contentTypeUid).forEach(async (entryuid) => {
      const blogQuery = CmaStack.contentType(contentTypeUid).entry(entryuid[1]);
      blogQuery.fetch()
        .then((result) => {
          const resultBasedOnUrl = result.url === entryUrl ? result : null;
          if (resultBasedOnUrl) {
            resolve(resultBasedOnUrl);
          }
        })
        .catch((error) => {
          console.error(error);
          reject(error);
        });
    });
  });
};

export const fetchHeaderData = async (
  dispatch: Dispatch<any>
): Promise<void> => {
  const data = await getEntry(CONTENT_TYPES.HEADER);
  addEditableTags(data[0][0], CONTENT_TYPES.HEADER, true, "en-us");
  dispatch(setHeaderData(data[0][0]));
};

export const fetchCMAHeaderData = async (
  dispatch: Dispatch<any>
): Promise<void> => {
  const data = await getCMAEntry(CONTENT_TYPES.HEADER);
  if (Array.isArray(data) && data[0]) {
    addEditableTags(data[0], CONTENT_TYPES.HEADER, true, "en-us");
    const serializableData = {
      logo: data[0]?.logo,
      navigation_links: data[0]?.navigation_links
    };
    dispatch(setHeaderData(serializableData));
  }
};

export const fetchFooterData = async (
  dispatch: Dispatch<any>
): Promise<void> => {
  const data = await getEntry(CONTENT_TYPES.FOOTER);
  addEditableTags(data[0][0], CONTENT_TYPES.FOOTER, true, "en-us");
  dispatch(setFooterData(data[0][0]));
};

export const fetchCMAFooterData = async (
  dispatch: Dispatch<any>
): Promise<void> => {
  const data = await getCMAEntry(CONTENT_TYPES.FOOTER);   
  if (Array.isArray(data) && data[0]) {
    addEditableTags(data[0], CONTENT_TYPES.FOOTER, true, "en-us");
    const serializableData = {
      $: data[0]?.$,
      navigation_links: data[0]?.navigation_links,
      information_section: data[0]?.information_section,
      copyright: data[0]?.copyright
    };
    dispatch(setFooterData(serializableData));
  }
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

export const fetchCMAHomePageData = async (
  dispatch: Dispatch<any>
): Promise<void> => {
  const data: any = await getCMAEntryByUrl({
    contentTypeUid: CONTENT_TYPES.PAGE,
    entryUrl: "/",
    referenceFieldPath: undefined,
    jsonRtePath: undefined,
  });
  if (!data) {
    dispatch(setHomePageData({
      sections: [{
        home: {}
      }]
    }));
  }
  else {
    addEditableTags(data, CONTENT_TYPES.PAGE, true, "en-us");
    const serializableData = {
      sections: [{
        home: {
          hero_section: {
            $: data.sections?.[0]?.home?.hero_section?.$,
            banner: data.sections?.[0]?.home?.hero_section?.banner,
            heading: data.sections?.[0]?.home?.hero_section?.heading,
            description: data.sections?.[0]?.home?.hero_section?.description,
            primary_cta: data.sections?.[0]?.home?.hero_section?.primary_cta
          }
        }
      }]
    };
    dispatch(setHomePageData(serializableData));
  }
};

export const fetchInitialData = async (
  dispatch: Dispatch<any>,
  setLoading: (status: boolean) => void
): Promise<void> => {
  try {
    await Promise.all([
      // fetchHeaderData(dispatch),
      fetchCMAHeaderData(dispatch),
      // fetchFooterData(dispatch),
      fetchCMAFooterData(dispatch),
      // fetchHomePageData(dispatch),
      fetchCMAHomePageData(dispatch)
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
    referenceFieldPath: ["sections.menu.course.beverages"],
    jsonRtePath: undefined,
  });
  addEditableTags(data[0], CONTENT_TYPES.PAGE, true, "en-us");
  dispatch(setMenuPageData(data[0].sections[0].menu.course));
  setLoading(false);
};

export const fetchCMAMenuPageData = async (
  dispatch: Dispatch<any>,
  setLoading: (status: boolean) => void
): Promise<void> => {
  const data: any = await getCMAEntryByUrl({
    contentTypeUid: CONTENT_TYPES.PAGE,
    entryUrl: "/menu",
    referenceFieldPath: ["sections.menu.course.beverages"],
    jsonRtePath: undefined,
  });

  if (!data) {
    dispatch(setMenuPageData([]));
  }
  else {
    addEditableTags(data, CONTENT_TYPES.PAGE, true, "en-us");
    dispatch(setMenuPageData(data.sections[0].menu.course));
  }
  setLoading(false);
};