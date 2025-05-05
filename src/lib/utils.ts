import { ProductImage, TDishReference } from "../types";

// just type conversion nothing else
export const convertToProductImage = (productDetails: TDishReference): ProductImage => ({
    ...productDetails,
    $: {
        uid: { 'data-cslp': '' },
        _content_type_uid: { 'data-cslp': '' }
    },
    _content_type_uid: productDetails.uid
});