export type THeaderData = {
  logo: {
    url: string;
    $: {
      url: {
        "data-cslp": string;
      };
    };
  };
  navigation_links: {
    link: TLink[];
  };
};

export type TFooterData = {
  $: {
    copyright: {
      "data-cslp": string;
    };
  };
  navigation_links?: {
    $: {
      title: {
        "data-cslp": string;
      };
    };
    title?: string;
    link?: TLink[];
  };

  information_section?: {
    $: {
      descrption: {
        "data-cslp": string;
      };
      timings: {
        "data-cslp": string;
      };
      holiday: {
        "data-cslp": string;
      };
    };
    logo?: {
      $: {
        url: {
          "data-cslp": string;
        };
      };
      url?: string;
    };
    descrption?: string;
    timings?: string;
    holiday?: string;
  };

  copyright?: string;
};

export type THomePageData = {
  sections: {
    home: {
      hero_section?: {
        $: {
          heading: {
            "data-cslp": string;
          };
          description: {
            "data-cslp": string;
          };
          primary_cta: {
            "data-cslp": string;
          };
        };
        banner?: {
          $: {
            url: {
              "data-cslp": string;
            };
          };
          url: string;
        };
        heading?: string;
        description?: string;
        primary_cta?: string;
      };
    };
  }[];
};

export type TLink = {
  $: {
    href: {
      "data-cslp": string;
    };
    title: {
      "data-cslp": string;
    };
  };
  href: string;
  title: string;
};

export type ProductImage = {
  $: {
    uid: {
      "data-cslp": string;
    },
    _content_type_uid: {
      "data-cslp": string;
    }
  },
  uid: string;
  _content_type_uid: string;
  product_details: {
    dietary_preference: string;
    protein: string;
    serving_temperature: string;
  },
  alt_text: string;
  image: {
    url: string;
  }
}

export type TDishes = {
  $: {
    title: {
      "data-cslp": string;
    };
    description: {
      "data-cslp": string;
    };
    price: {
      "data-cslp": string;
    };
  };
  uid: string;
  image: {
    $: {
      url: {
        "data-cslp": string;
      };
    };
    url: string;
  };
  title: string;
  description: string;
  price: number;
  _content_type_uid: string;
  combos?: TDishes[],
  product_image_reference?: ProductImage[] | []
};

export type TMenu = {
  $: {
    course_name: {
      "data-cslp": string;
    };
  };
  course_name: string;
  dishes: TDishes[];
};

type ProductDetails = {
  dietary_preference: string;
  protein: string;
  serving_temperature: string;
}

export type TDishReference = {
  uid: string,
  alt_text: string,
  product_details: ProductDetails;
  image : {
    url: string;
  }
}