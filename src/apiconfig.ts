export const DAM_API = {
    url: `https://${process.env.REACT_APP_DAM_BASE_URL}/spaces/search`,
    headers: {
      'accept': 'application/json',
      'content-type': 'application/json',
      'access_token': process.env.REACT_APP_ACCESS_TOKEN || "",
      'space_key': process.env.REACT_APP_SPACE_KEY || "",
    },
    payload: {
      spaces: [process.env.REACT_APP_SPACE_KEY],
      skip: 0,
      limit: 50,
      include: "assets",
      sort: 'title',
      fields: ["asset_type", "path", "custom_metadata"]
    }
  };

  export function assetUrl(assetId: string) {
    return {
        url: `https://${process.env.REACT_APP_DAM_BASE_URL}/spaces/${process.env.REACT_APP_SPACE_KEY}/assets/${assetId}`,
        headers: {
          'accept': 'application/json',
          'content-type': 'application/json',
          'access_token': process.env.REACT_APP_ACCESS_TOKEN || "",
          'space_key': process.env.REACT_APP_SPACE_KEY || "",
        },
        payload: {
          spaces: [process.env.REACT_APP_SPACE_KEY],
          skip: 0,
          limit: 50,
          include: "assets",
          sort: 'title',
          fields: ["asset_type", "path", "custom_metadata"]
        }
    };
  }