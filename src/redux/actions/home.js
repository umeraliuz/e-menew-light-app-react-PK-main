
import { Alert } from "react-native";
import { EndPoint } from "../../api/apiEndPonit";
import { PostMethod } from "../../api/APIMethod";
import { baseUrl } from "../../api/baseUrl";
import {

    DATA_LOADING,
    CATEGORIES_TYPE,
    MAIN_CATEGORIES,
    SUB_CATEGORIES,
    SUB_CATEGORIES_PRO,
    RESTUARNT_LOGO,
    DATA_FAILED,
    PRINTER_TAGS,

} from "../actions/types";

export const getCategoriesType = (data, fun) => {
    return (dispatch) => {

        dispatch({
            type: DATA_LOADING,
        });
        PostMethod(EndPoint.GET_CATEGORIES, data, dispatch, true, fun, cb => {

            dispatch({
                type: CATEGORIES_TYPE,
                payload: cb?.groups,
            });
            dispatch({
                type: PRINTER_TAGS,
                payload: cb?.printers,
            });
            dispatch({
                type: RESTUARNT_LOGO,
                payload: cb.restuarntLogo,
            });
            fun(cb?.groups)
            // console.log(cb)
        })

    };
};

export const getMainCategories = (data, fun) => {
    return (dispatch) => {

        dispatch({
            type: DATA_LOADING,
        });
        PostMethod(EndPoint.TOP_LEVEL_CATEGORIES, data, dispatch, true, fun, cb => {

            dispatch({
                type: MAIN_CATEGORIES,
                payload: cb?.categories,
            });
            fun(cb.categories)
        })

    };
};

export const getSubCategories = (data, fun) => {

    return (dispatch) => {

        dispatch({
            type: DATA_LOADING,
        });
        PostMethod(EndPoint.GET_SUB_CATEGORIES, data, dispatch, true, fun, cb => {

            let arrCat = cb?.products.concat(cb?.child_categories)

            dispatch({
                type: SUB_CATEGORIES,
                payload: arrCat,
            });

            fun(arrCat)
        })
    };
};
export const getSubCategoriesProduct = (data, fun) => {
    return (dispatch) => {

        dispatch({
            type: DATA_LOADING,
        });
        PostMethod(EndPoint.GET_SUB_CATEGORIES, data, dispatch, true, fun, cb => {
            dispatch({
                type: SUB_CATEGORIES_PRO,
                payload: cb?.products
            });

            fun(cb?.products, "SCP")
        })

    };
};
export const getProductExtra = (data, fun) => {

    return (dispatch) => {

        dispatch({
            type: DATA_LOADING,
        });
        PostMethod(EndPoint.GET_PRODUCT_EXTRAS, data, dispatch, true, fun, cb => {

            //             dispatch({
            //                 type: SUB_CATEGORIES_PRO,
            //                 payload: cb?.products
            //             });

            let extra = cb?.extra_json ? cb?.extra_json : cb
            fun(extra, "PE")
            dispatch({
                type: DATA_FAILED,
            });
        })

    };
};

export const getProductIngredient = (data, fun) => {

    return (dispatch) => {

        dispatch({
            type: DATA_LOADING,
        });
        PostMethod(EndPoint.GET_PRODUCT_INGREDIENTS, data, dispatch, true, fun, cb => {

            //             dispatch({
            //                 type: SUB_CATEGORIES_PRO,
            //                 payload: cb?.products
            //             });
            //
            let product_ingredients = cb?.product_ingredients ? cb?.product_ingredients : cb
            fun(product_ingredients, "PING")
            dispatch({
                type: DATA_FAILED,
            });
        })

    };
};

export const getProductInstructions = (data, fun) => {

    return (dispatch) => {

        dispatch({
            type: DATA_LOADING,
        });
        PostMethod(EndPoint.GET_PRODUCT_INSTRUCTIONS, data, dispatch, true, fun, cb => {

            //             dispatch({
            //                 type: SUB_CATEGORIES_PRO,
            //                 payload: cb?.products
            //             });
            //
            let product_instructions = cb?.product_instructions ? cb?.product_instructions : cb
            fun(product_instructions, "PINS")
            dispatch({
                type: DATA_FAILED,
            });
        })

    };
};

export const getProductComments = (data, fun) => {

    return (dispatch) => {

        dispatch({
            type: DATA_LOADING,
        });
        PostMethod(EndPoint.GET_COMMENTS, data, dispatch, true, fun, cb => {

            //             dispatch({
            //                 type: SUB_CATEGORIES_PRO,
            //                 payload: cb?.products
            //             });

            let comments = cb?.comments ? cb?.comments : cb
            comments.forEach(element => {
                if (element.icon_label === "Icon 1") {
                    element.icons = "Ø"
                    element.isSelected = true
                }
                else if (element.icon_label === "Icon 2") {
                    element.icons = "&"
                }
                else if (element.icon_label === "Icon 3") {
                    element.icons = "→"
                }
                else if (element.icon_label === "Icon 4") {
                    element.icons = "⋯"
                }
                else if (element.icon_label === "Icon 5") {
                    element.icons = "✒"
                }

            });
            fun(comments, "PCMT")
            dispatch({
                type: DATA_FAILED,
            });
        })

    };
};

export const getProductCommentsOption = (data, fun) => {

    return (dispatch) => {

        dispatch({
            type: DATA_LOADING,
        });
        PostMethod(EndPoint.GET_COMMENTS_OPTIONS, data, dispatch, true, fun, cb => {

            //             dispatch({
            //                 type: SUB_CATEGORIES_PRO,
            //                 payload: cb?.products
            //             });
            //
            let comments = cb?.comments ? cb?.comments : cb
            fun(comments, "PCMTO")
            dispatch({
                type: DATA_FAILED,
            });
        })

    };
};