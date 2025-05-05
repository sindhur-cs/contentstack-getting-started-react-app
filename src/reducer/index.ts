import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TDishes, TDishReference, TFooterData, THeaderData, THomePageData, TMenu } from "../types";

interface AppState {
  headerData: THeaderData;
  footerData: TFooterData;
  homePageData: THomePageData;
  menuPageData: TMenu[];
  dishesData: TDishes[];
  productsDetailsData: TDishReference[];
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
      dishes: [
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
          _content_type_uid: "",
          product_image_reference: []
        },
      ],
    },
  ],
  dishesData: localStorage.getItem("dishesData") ? JSON.parse(localStorage.getItem("dishesData") || "[]") : [],
  productsDetailsData: localStorage.getItem("productsDetailsData") ? JSON.parse(localStorage.getItem("productsDetailsData") || "[]") : []
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
    setDishesData: (state, action: PayloadAction<TDishes>) => {
      const ifDishFound = state.dishesData.find(state => state.uid === action.payload.uid);
      if(!ifDishFound) {
        state.dishesData.push(action.payload);
        localStorage.setItem("dishesData", JSON.stringify(state.dishesData));
      }
    },
    setProductDetailsData: (state, action: PayloadAction<TDishReference>) => {
      const ifProductFound = state.productsDetailsData.find(state => state.uid === action.payload.uid);
      if(!ifProductFound) {
        state.productsDetailsData.push(action.payload);
        localStorage.setItem("productsDetailsData", JSON.stringify(state.productsDetailsData));
      }
    },
  },
});

export const {
  setHeaderData,
  setFooterData,
  setHomePageData,
  setMenuPageData,
  setDishesData,
  setProductDetailsData
} = mainSlice.actions;

export default mainSlice.reducer;
