import Personalization from "@contentstack/personalization-sdk-js";

const ECLIPSE_VARIANTS_QUERY_PARAM_KEY = "preference";
const EXCLUDED_PATHS = ["_next", "favicon.ico"];

export default async function handler(request, context) {
  const parsedUrl = new URL(request.url);
  const pathname = parsedUrl.pathname;

  if (EXCLUDED_PATHS.some((path) => pathname.includes(path))) {
    return fetch(request);
  }

  const params = await personalizationMiddlewareParams(request, context);

  parsedUrl.searchParams.set(ECLIPSE_VARIANTS_QUERY_PARAM_KEY, params);

  const modifiedRequest = new Request(parsedUrl.toString(), request);
  modifiedRequest.headers.set(
    "if-modified-since",
    "Wed, 29 May 2022 02:05:45 GMT"
  );

  const response = await fetch(modifiedRequest);
  const modifiedResponse = new Response(response.body, response);
  await Personalization.addStateToResponse(modifiedResponse);

  return modifiedResponse;
}

async function personalizationMiddlewareParams(request, context) {
  if (!context.env.NEXT_PUBLIC_PERSONALIZATION_PROJECT_UID) {
    throw Error("PERSONALIZATION_PROJECT_UID not found");
  }

  Personalization.reset();

  if (context.env.CONTENTSTACK_PERSONALIZE_EDGE_API_URL) {
    Personalization.setEdgeApiUrl(
      context.env.CONTENTSTACK_PERSONALIZE_EDGE_API_URL
    );
  }

  await Personalization.init(
    context.env.NEXT_PUBLIC_PERSONALIZATION_PROJECT_UID,
    {
      edgeMode: true,
      request,
    }
  );

  const cmsVariants = Personalization.getVariants();

  const params = Object.entries(cmsVariants)
    .map(([key, value]) => `${key}=${value}`)
    .join(",");

  return params;
}
