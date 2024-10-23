
import moment from "moment";
import { useTranslation } from "react-i18next";
import { Alert } from "react-native";
import { EndPoint } from "../../api/apiEndPonit";
import { PostMethod } from "../../api/APIMethod";
import { showCustomAlert } from "../../constant/Alert";
import { Strings } from "../../constant/string";
import {

    CART_INFO,
    CURRENCY_LIST,
    CUSTOMER_LIST,
    DATA_FAILED,
    DATA_LOADING,
    DISCOUNT_OBJECT,
    ORDER_PLACE,
    PAYMENT_LIST, TABLE_NUMBER, TERMINAL_LIST
} from "../actions/types";

export const updateCart = (data) => {
    return (dispatch) => {
        dispatch({
            type: CART_INFO,
            payload: data
        });

    };
};

export const getOrderList = (data, nav, fun) => {
    return (dispatch) => {

        dispatch({
            type: DATA_LOADING,
        });
        PostMethod(EndPoint.GET_ORDER_BY_ID, data, dispatch, false, fun, cb => {

            if (cb?.success === 1) {
                let orderItems = cb?.orderItems ? [...cb.orderItems] : []
                //

                let orderArray = []

                orderItems.forEach((res, index) => {
                    let proExtra = []

                    // let extraIngrInsList = []
                    res.ingrdients = []
                    res.ingrdients = (res?.ingredients_json && res?.extra_price_json !== 'null') ? JSON.parse(res.ingredients_json) : []
                    res.comments = (res?.comments_json && res?.extra_price_json !== 'null') ? JSON.parse(res.comments_json) : []
                    res.instructions = (res?.product_instruction && res?.extra_price_json !== 'null') ? JSON.parse(res.product_instruction) : []
                    res.product_extra = (res?.extra_price_json && res?.extra_price_json !== 'null') ? JSON.parse(res.extra_price_json) : []

                    res?.product_extra.forEach(extra => {

                        if (extra?.free_quantity) {

                            let copyItem = { ...extra }
                            extra.haveOffertItem = true
                            extra.icons = "+"
                            extra.quantity = extra.quantity - extra.free_quantity
                            extra.freeQuantity = extra.free_quantity
                            copyItem.quantity = extra.free_quantity

                            copyItem.isOffert = "offert",
                                copyItem.parentItemId = extra.id
                            copyItem.extra_price = 0
                            copyItem.haveOffertItem = false
                            copyItem.icons = "+"

                            copyItem.id = moment().unix() + extra.id
                            proExtra.push(extra)
                            proExtra.push(copyItem)
                        } else {

                            extra.icons = "+"
                            proExtra.push(extra)
                        }

                    })
                    res.product_extra = proExtra
                    // console.log("product_extra proExtra", proExtra)
                    if (res?.free_quantity) {
                        let copyItem = { ...res }
                        res.haveOffertItem = true
                        res.quantity = Number(res.quantity) - Number(res.free_quantity)
                        res.freeQuantity = res.free_quantity

                        copyItem.category_type_id = res.category_type_id
                        copyItem.isOffert = "offert",
                            copyItem.parentItemId = res.attrribute_id
                        copyItem.price = 0
                        copyItem.quantity = res.free_quantity
                        copyItem.instructions = [],
                            copyItem.ingrdients = [],
                            copyItem.comments = [],
                            copyItem.product_extra = [],
                            copyItem.haveOffertItem = false
                        copyItem.special_notes = ""

                        copyItem.id = moment().unix() + res.attrribute_id

                        orderArray.push(res)
                        orderArray.push(copyItem)
                    } else {
                        orderArray.push(res)
                    }

                })

                dispatch({
                    type: CART_INFO,
                    payload: orderArray
                });
                if (cb?.order?.discount_type) {

                    let disObj = {
                        DiscountType: null,
                        discount: cb?.order?.discount_value,
                        isCustom: false,
                        category_type_id: cb?.order?.discount_type,
                    }

                    dispatch({
                        type: DISCOUNT_OBJECT,
                        payload: disObj
                    })
                } else {
                    dispatch({
                        type: DISCOUNT_OBJECT,
                        payload: {}
                    })
                }
                nav.navigate(Strings.COMMANDE)
            }
            fun(false)

        })

    };
};
export const onOrderPlace = (data, fun, fun2, fun3) => {
    return (dispatch) => {

        dispatch({
            type: DATA_LOADING,
        });

        PostMethod(EndPoint.PLACE_ORDER, data, dispatch, false, "fun", cb => {

            if (cb.success === 1) {

                let lastId = cb.order
                // console.log("cb...", cb)
                if (cb?.order?.table_id == "free") {
                    fun(null)
                } else {
                    fun(lastId.id)
                }
                if (data?.payment_type != 2) {

                    dispatch({
                        type: ORDER_PLACE,
                        payload: true
                    });
                    dispatch({
                        type: CART_INFO,
                        payload: []
                    });
                    dispatch({
                        type: TABLE_NUMBER,
                        payload: "Table",
                    });
                    dispatch({
                        type: DATA_FAILED,
                    });

                } else {
                    fun2(true)
                }
            }
            fun3(false)

        })

    };
};

export const onOrderHold = (data, nav, fun) => {

    return (dispatch) => {

        // dispatch({
        //     type: DATA_LOADING,
        // });
        PostMethod(EndPoint.PUT_ON_HOLD, data, dispatch, false, fun, cb => {

            fun(false)
            if (cb.success === 1) {
                showCustomAlert(dispatch, true, "", "", cb?.message, "")
                dispatch({
                    type: ORDER_PLACE,
                    payload: true
                });
                dispatch({
                    type: CART_INFO,
                    payload: []
                });
                dispatch({
                    type: TABLE_NUMBER,
                    payload: "Table",
                });
                dispatch({
                    type: DATA_FAILED,
                });
                nav.navigate('Table')
            }
        })

    };
};

export const getCurrency = (data, fun) => {

    return (dispatch) => {

        PostMethod(EndPoint.GET_CURRENCY_LIST, data, dispatch, false, fun, cb => {

            let list = []

            cb.currencyList.forEach(element => {
                element.label = element.currency_code
                element.value = element.id
                list.push(element)

            });

            dispatch({
                type: CURRENCY_LIST,
                payload: list
            });

        })

    };
};

export const getPaymentList = (data, fun) => {

    return (dispatch) => {

        PostMethod(EndPoint.PAYMENT_TYPE_LIST, data, dispatch, false, fun, cb => {

            let list = []

            cb.paymentTypeList.forEach(element => {
                element.label = element.paymentTypeLabel
                element.value = element.payment_method
                list.push(element)

            });

            dispatch({
                type: PAYMENT_LIST,
                payload: list
            });

        })

    };
};

export const getTerminalList = (data, fun) => {

    return (dispatch) => {

        PostMethod(EndPoint.GET_TERMINAL_LIST, data, dispatch, false, fun, cb => {

            let list = []

            cb?.data?.data.forEach(element => {
                element.label = element.serial_number
                element.value = element.token
                list.push(element)

            });

            dispatch({
                type: TERMINAL_LIST,
                payload: list
            });

        })

    };
};
export const checkPaymentStatus = (data, fun, fun2, ref) => {

    return (dispatch) => {

        PostMethod(EndPoint.CHECK_PAYMENT_STATUS, data, dispatch, false, fun, cb => {

            if (cb.success === 1) {

                if (cb?.payment_result_status == 1) {

                    dispatch({
                        type: ORDER_PLACE,
                        payload: true
                    });
                    dispatch({
                        type: CART_INFO,
                        payload: []
                    });
                    dispatch({
                        type: TABLE_NUMBER,
                        payload: "Table",
                    });
                    dispatch({
                        type: DATA_FAILED,
                    });
                    fun(ref)
                    fun2(false)
                } else if (cb?.payment_result_status == 2) {
                    dispatch({
                        type: DATA_FAILED,
                    });
                    showCustomAlert(dispatch, true, "", "", "Card Declined, Please Try again", "")

                    fun(ref)
                    fun2(false)
                }
            }

        })

    };
};

export const getCustomerList = (data, fun) => {

    return (dispatch) => {

        PostMethod(EndPoint.GET_CUSTOMER_LIST, data, dispatch, false, fun, cb => {

            let list = []

            cb?.data?.data.forEach(element => {
                element.label = element.client_name
                element.value = element.id
                list.push(element)

            });
            // console.log("res.orderItems", list);

            dispatch({
                type: CUSTOMER_LIST,
                payload: list
            });

        })

    };
};