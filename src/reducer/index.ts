import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TFooterData, THeaderData, THomePageData, TMenu } from "../types";

interface AppState {
  headerData: THeaderData;
  footerData: TFooterData;
  homePageData: THomePageData;
  menuPageData: TMenu[];
}

const initialState: AppState = {
  headerData: {
    website_title: "",
    logo: {
      url: "",
    },
    navigation_links: {
      link: [
        {
          href: "",
          title: "",
        },
      ],
    },
  },
  footerData: {
    title: "",
    navigation_links: {
      title: "",
      link: [
        {
          href: "",
          title: "",
        },
      ],
    },
    information_section: {
      logo: {
        url: "",
      },
      descrption: "",
      timings: "",
      holiday: "",
    },
    copyright: "",
  },
  homePageData: {
    sections: [
      {
        home: {
          hero_section: {
            banner: {
              url: "",
            },
            heading: "",
            description: "",
            primary_cta: "",
          },
        },
      },
    ],
  },
  menuPageData: [
    {
      course_name: "",
      dishes: [
        {
          uid: "",
          image: {
            url: "",
          },
          title: "",
          description: "",
          price: 0,
        },
      ],
    },
  ],
};

const mainSlice = createSlice({
  name: "main",
  initialState,
  reducers: {
    setHeaderData: (state, action: PayloadAction<THeaderData>) => {
      state.headerData = action.payload;
    },
    setFooterData: (state, action: PayloadAction<TFooterData>) => {
      state.footerData = action.payload;
    },
    setHomePageData: (state, action: PayloadAction<THomePageData>) => {
      state.homePageData = action.payload;
    },
    setMenuPageData: (state, action: PayloadAction<TMenu[]>) => {
      state.menuPageData = action.payload;
    },
  },
});

export const {
  setHeaderData,
  setFooterData,
  setHomePageData,
  setMenuPageData,
} = mainSlice.actions;

export default mainSlice.reducer;
