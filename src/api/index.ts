import { Dispatch } from "react";
import { CONTENT_TYPES } from "../constants";
import {
  setBeverages,
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

export const getCMAEntry = (contentType: string) => {
  const Query = CmaStack.contentType(contentType).entry().query()
  return Query
  .find()
  .then((entry: any) => {
    console.log(entry.items);
    return entry.items;
  })
  .catch((err: any) => {
    return {};
  });
};

export const getCMAEntryByUid = (contentType: string, entryUrl: string) => {
  const Query = CmaStack.contentType(contentType).entry(entryUrl).fetch();
  
  return Query
  .then((entry: any) => {
    console.log(entry);
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
    const blogQuery = CmaStack.contentType(contentTypeUid).entry().query();
    blogQuery.find()
      .then((result) => {
        if (result.items && result.items.length > 0) {
          jsonRtePath &&
            Utils.jsonToHTML({
              entry: result.items[0],
              paths: jsonRtePath,
              renderOption,
            });

          const resultBasedOnUrl = result.items.find(item => item.url === entryUrl);

          resolve(resultBasedOnUrl);
        } else {
          reject(new Error("No entry found"));
        }
      })
      .catch((error) => {
        console.error(error);
        reject(error);
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
  if(Array.isArray(data)) {
    addEditableTags(data[0], CONTENT_TYPES.HEADER, true, "en-us");
    const serializableData = {
      logo: data[0].logo,
      navigation_links: data[0].navigation_links
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
  if(Array.isArray(data)) {
    addEditableTags(data[0], CONTENT_TYPES.FOOTER, true, "en-us");
    const serializableData = {
      $: data[0].$,
      navigation_links: data[0].navigation_links,
      information_section: data[0].information_section,
      copyright: data[0].copyright
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

export const fetchCampaignPageData = async () => {
  /*
  const Query = Stack.ContentType(contentType).Query();
  return Query.toJSON()
    .find()
    .then((entry) => {
      return entry;
    })
    .catch((err: any) => {
      return {};
    });
  */

  try {
    const data = await fetch(process.env.REACT_APP_CDN_API || "", {
      method: "GET",
      headers: {
        api_key: process.env.REACT_APP_CONTENTSTACK_API_KEY || "",
        access_token: process.env.REACT_APP_CONTENTSTACK_DELIVERY_TOKEN || "",
        "Content-Type": "application/json"
      }
    });
    const result = await data.json();
    return result;
  }
  catch(error) {
    console.log(error);
  }
}

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

  const beverages: any[] = [];

  await Promise.all(data.sections[0].menu.course.map(async (course: any) => {
    await Promise.all(course.beverages.map(async (beverage: any) => {
      const beverageData = await getCMAEntryByUid(beverage._content_type_uid, beverage.uid);
      if(beverages.find(beverage => beverage.uid === beverageData.uid)) {
        return;
      }
      beverages.push(beverageData);
    }));
  }));

  localStorage.setItem("beverages", JSON.stringify(beverages));

  addEditableTags(data, CONTENT_TYPES.PAGE, true, "en-us");
  dispatch(setMenuPageData(data.sections[0].menu.course));
  dispatch(setBeverages(beverages));
  setLoading(false);
};

export const fetchVolvoPageData = async (locale: string = "en-us") => {
  try {
    const baseUrl = process.env.REACT_APP_CAMPAIGN_CDN_API || "";
    const url = `${baseUrl}&locale=${locale}&include_fallback=true`;
    
    const data = await fetch(url, {
      method: "GET",
      headers: {
        api_key: process.env.REACT_APP_CONTENTSTACK_API_KEY || "",
        access_token: process.env.REACT_APP_CONTENTSTACK_DELIVERY_TOKEN || "",
        "Content-Type": "application/json"
      }
    });
    console.log(data);
    const result = await data.json();
    console.log(result);
    return result;
  }
  catch(error) {
    console.log(error);
  }
}

export const fetchVolvoGalleryPageData = async (locale: string = "en-us") => {
  try {
    const baseUrl = process.env.REACT_APP_CAMPAIGN_GALLERY_CDN_API || "";
    const url = `${baseUrl}&locale=${locale}&include_fallback=true`;
    
    const data = await fetch(url, {
      method: "GET",
      headers: {
        api_key: process.env.REACT_APP_CONTENTSTACK_API_KEY || "",
        access_token: process.env.REACT_APP_CONTENTSTACK_DELIVERY_TOKEN || "",
        "Content-Type": "application/json"
      }
    });
    console.log(data);
    const result = await data.json();
    console.log(result);
    return result;
  }
  catch(error) {
    console.log(error);
  }
}

export const fetchSpinsetImages = async (spinSetId: string = "xc90_1") => {
  try {
    const query = `{"custom_metadata.spin_set_id":"${spinSetId}"}`;
    const encodedQuery = encodeURIComponent(query);
    const url = `https://dev9-cdn.csnonprod.com/v3/assets?asc=title&include_count=true&query=${encodedQuery}`;
    
    const data = await fetch(url, {
      method: "GET",
      headers: {
        api_key: process.env.REACT_APP_CONTENTSTACK_API_KEY || "",
        access_token: process.env.REACT_APP_CONTENTSTACK_DELIVERY_TOKEN || "",
        "Content-Type": "application/json"
      }
    });
    
    console.log("Spinset API response:", data);
    const result = await data.json();
    console.log("Spinset images result:", result);
    return result;
  }
  catch(error) {
    console.log("Error fetching spinset images:", error);
    throw error;
  }
}