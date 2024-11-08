import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// COMMENT: Add TMenu in below import statement
import { AboutText, ContactText, TFooterData, THeaderData, THomePageData, TMenu } from "../types";

interface AppState {
  headerData: THeaderData;
  footerData: TFooterData;
  homePageData: THomePageData;
  menuPageData: TMenu[];
  aboutPageData: AboutText;
  contactPageData: ContactText;
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
  // COMMENT: Uncomment below lines
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
  aboutPageData: {
    uid: "",
    about: ""
  },
  contactPageData: {
    uid: "",
    contact: ""
  }
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
    // COMMENT: Uncomment below lines
    setMenuPageData: (state, action: PayloadAction<TMenu[]>) => {
      state.menuPageData = action.payload;
    },
    setAboutPageData: (state, action: PayloadAction<AboutText>) => {
      state.aboutPageData = action.payload;
    },
    setContactPageData: (state, action: PayloadAction<ContactText>) => {
      state.contactPageData = action.payload;
    }
  },
});

export const {
  setHeaderData,
  setFooterData,
  setHomePageData,
  // COMMENT: Uncomment below line
  setMenuPageData,
  setAboutPageData,
  setContactPageData
} = mainSlice.actions;

export default mainSlice.reducer;
