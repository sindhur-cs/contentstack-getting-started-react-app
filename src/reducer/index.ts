import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TData, TDishes, TFooterData, THeaderData, THomePageData, TMenu } from "../types";

interface AppState {
  headerData: THeaderData;
  footerData: TFooterData;
  homePageData: THomePageData;
  menuPageData: TMenu[];
  beverages: TData[];
  boundingboxes: any;
}

const initialState: AppState = {
  headerData: {
    logo: {
      $: {
        url: {
          "data-cslp": "",
        },
      },
      url: "",
    },
    navigation_links: {
      link: [
        {
          $: {
            title: {
              "data-cslp": "",
            },
            href: {
              "data-cslp": "",
            },
          },
          href: "",
          title: "",
        },
      ],
    },
  },
  footerData: {
    $: {
      copyright: {
        "data-cslp": "",
      },
    },
    navigation_links: {
      $: {
        title: {
          "data-cslp": "",
        },
      },
      title: "",
      link: [
        {
          $: {
            title: {
              "data-cslp": "",
            },
            href: {
              "data-cslp": "",
            },
          },
          href: "",
          title: "",
        },
      ],
    },
    information_section: {
      $: {
        descrption: {
          "data-cslp": "",
        },
        timings: {
          "data-cslp": "",
        },
        holiday: {
          "data-cslp": "",
        },
      },
      logo: {
        $: {
          url: {
            "data-cslp": "",
          },
        },
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
            $: {
              heading: {
                "data-cslp": "",
              },
              description: {
                "data-cslp": "",
              },
              primary_cta: {
                "data-cslp": "",
              },
            },
            banner: {
              $: {
                url: {
                  "data-cslp": "",
                },
              },
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
      $: {
        course_name: {
          "data-cslp": "",
        },
      },
      course_name: "",
      beverages: [
        {
          $: {
            title: {
              "data-cslp": "",
            },
            description: {
              "data-cslp": "",
            },
            price: {
              "data-cslp": "",
            },
          },
          uid: "",
          image: {
            $: {
              url: {
                "data-cslp": "",
              },
            },
            url: "",
          },
          title: "",
          description: "",
          price: 0,
          _content_type_uid: ""
        },
      ],
    },
  ],
  beverages: localStorage.getItem("beverages") ? JSON.parse(localStorage.getItem("beverages") || "[]") : [],
  boundingboxes: null
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
    setBeverages: (state, action: PayloadAction<TData[]>) => {
      state.beverages = action.payload;
    },
    setBoundingBoxes: (state, action: PayloadAction<any>) => {
      state.boundingboxes = action.payload;
    }
  },
});

export const {
  setHeaderData,
  setFooterData,
  setHomePageData,
  setMenuPageData,
  setBeverages,
  setBoundingBoxes
} = mainSlice.actions;

export default mainSlice.reducer;
