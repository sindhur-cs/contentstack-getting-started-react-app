import Personalize from "@contentstack/personalize-edge-sdk";

export default async function handler(request, context) {
  const parsedUrl = new URL(request.url);
  const pathname = parsedUrl.pathname;

  if (["_next", "favicon.ico"].some((path) => pathname.includes(path))) {
    return fetch(request);
  }

  Personalize.reset();

  if (context.env.NEXT_PUBLIC_CONTENTSTACK_PERSONALIZE_EDGE_API_URL) {
    Personalize.setEdgeApiUrl(
      context.env.NEXT_PUBLIC_CONTENTSTACK_PERSONALIZE_EDGE_API_URL
    );
  }

  await Personalize.init(
    context.env.NEXT_PUBLIC_CONTENTSTACK_PERSONALIZE_PROJECT_UID,
    {
      request,
    }
  );

  const variantParam = Personalize.getVariantParam();
  parsedUrl.searchParams.set(Personalize.VARIANT_QUERY_PARAM, variantParam);

  const modifiedRequest = new Request(parsedUrl.toString(), request);
  const response = await fetch(modifiedRequest);

  const modifiedResponse = new Response(response.body, response);
  await Personalize.addStateToResponse(modifiedResponse);
  modifiedResponse.headers.set("cache-control", "no-store");

  return modifiedResponse;
}
