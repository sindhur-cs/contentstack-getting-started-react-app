import Contentstack from "contentstack";
import ContentstackLivePreview from "@contentstack/live-preview-utils";

const getConfig = () => {
  return {
    api_key: process.env.CONTENTSTACK_API_KEY,
    delivery_token: process.env.CONTENTSTACK_DELIVERY_TOKEN,
    environment: process.env.CONTENTSTACK_ENVIRONMENT,
    region: process.env.CONTENTSTACK_REGION,
    preview_token: process.env.CONTENTSTACK_PREVIEW_TOKEN,
    host_env: process.env.CONTENTSTACK_HOST_ENV,
  };
};

const getModifiedHost = (baseHost: string, hostEnv?: string) => {
  if (hostEnv) {
    const [subdomain] = baseHost.split(".");
    return `${hostEnv}-${subdomain}.csnonprod.com`;
  }
  return baseHost;
};

const getLivePreviewHostByRegion = (region: string, hostEnv?: string) => {
  let baseHost: string;
  switch (region) {
    case "US":
      baseHost = "rest-preview.contentstack.com";
      break;
    case "EU":
      baseHost = "eu-rest-preview.contentstack.com";
      break;
    case "AZURE_NA":
      baseHost = "azure-na-rest-preview.contentstack.com";
      break;
    case "AZURE_EU":
      baseHost = "azure-eu-rest-preview.contentstack.com";
      break;
    default:
      baseHost = "rest-preview.contentstack.com";
  }
  return getModifiedHost(baseHost, hostEnv);
};

const getHostByRegion = (region: string, hostEnv?: string) => {
  let baseHost: string;
  switch (region) {
    case "US":
      baseHost = "app.contentstack.com";
      break;
    case "EU":
      baseHost = "eu-app.contentstack.com";
      break;
    case "AZURE_NA":
      baseHost = "azure-na-app.contentstack.com";
      break;
    case "AZURE_EU":
      baseHost = "azure-eu-app.contentstack.com";
      break;
    case "GCP_NA":
      baseHost = "gcp-na-api.contentstack.com";
      break;
    default:
      baseHost = "app.contentstack.com";
  }
  return getModifiedHost(baseHost, hostEnv);
};

export const initializeContentstackSdk = () => {
  const config = getConfig();
  const region: Contentstack.Region | undefined = (function (
    regionValue: string
  ) {
    switch (regionValue) {
      case "US":
        return Contentstack.Region.US;
      case "EU":
        return Contentstack.Region.EU;
      case "AZURE_NA":
        return Contentstack.Region.AZURE_NA;
      case "AZURE_EU":
        return Contentstack.Region.AZURE_EU;
      case "GCP_NA":
        return Contentstack.Region.GCP_NA;
      default:
        return undefined;
    }
  })(config.region as string);

  if (!region) {
    throw new Error(
      "Invalid region provided in CONTENTSTACK_REGION. Valid values are: " +
        Object.keys(Contentstack.Region).join(", ")
    );
  }

  const Stack = Contentstack.Stack({
    api_key: config.api_key as string,
    delivery_token: config.delivery_token as string,
    environment: config.environment as string,
    region: region,
    live_preview: {
      enable: true,
      host: getLivePreviewHostByRegion(
        config.region as string,
        config.host_env
      ),
      preview_token: config.preview_token as string,
    },
  });

  Stack.setHost(getHostByRegion(config.region as string, config.host_env));

  ContentstackLivePreview.init({
    stackSdk: Stack,
    clientUrlParams: {
      protocol: "https",
      host: getHostByRegion(config.region as string, config.host_env),
      port: 443,
    },
    editButton: {
      enable: true,
      exclude: ["outsideLivePreviewPortal"],
      includeByQueryParameter: true,
      position: "bottom",
    },
  });

  return Stack;
};

export const onEntryChange = ContentstackLivePreview.onEntryChange;
