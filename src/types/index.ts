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
};

export type TMenu = {
  $: {
    course_name: {
      "data-cslp": string;
    };
  };
  course_name: string;
  beverages: TDishes[];
};

export type TAsset = {
    uid: string;
    file_name: string;
    asset_id: string;
    parent_uid: string;
    org_uid: string;
    space_uid: string;
    is_dir: boolean;
    path: {
        uid: string;
        title: string;
    }[];
    version: number;
    permanent_url_slug: string | null;
    owner_uid: string;
    title: string;
    description: string;
    content_type: string;
    file_size: number;
    dimensions: {
        width: number;
        height: number;
    };
    created_at: string;
    updated_at: string;
    created_by: string;
    updated_by: string;
    tags: string[];
    locale: string;
    custom_metadata: {
        media_set_id: string;
        alttext: string;
        nutrition_information: {
            energy: string;
            protein: string;
            carbohydrates: string;
            sodium: string;
            sugar: string;
            fat: string;
        };
        content_uid: string;
    };
    asset_type: {
        uid: string;
        title: string;
    };
    url: string;
    space_name: string;
};

export type Image = {
  url: string;
  custom_metadata: {
      alttext: string;
      combo_menu_flag: string;
      content_uid: string;
      nutrition_information: {
          carbohydrates: string;
          energy: string;
          fat: string;
          protein: string;
          sodium: string;
          sugar: string;
      }
  }
}

export type TData = {
  uid: string;
  content_type_uid: string;
  price: number;
  title: string;
  description: string;
  image: Image | Image[],
  $: {
    price: number[],
    description: string[],
    title: string[]
  }
}