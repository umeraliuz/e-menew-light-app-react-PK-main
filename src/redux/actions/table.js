import { Alert } from "react-native";
import { EndPoint } from "../../api/apiEndPonit";
import { PostMethod } from "../../api/APIMethod";
import { baseUrl } from "../../api/baseUrl";
import { showCustomAlert } from "../../constant/Alert";
import {
    CART_INFO,
    DATA_FAILED,
    DATA_LOADING,
    ORDER_PLACE,
    TABLES,
    TABLE_NUMBER,
    TO_MOVE,

} from "../actions/types";

export const updatetableObject = (data) => {
    return (dispatch) => {
        dispatch({
            type: TABLE_NUMBER,
            payload: data
        });

    };
};

export const releaseTables = (data, nav, fun) => {
    console.log("releaseTables", data);
    return (dispatch) => {

        dispatch({
            type: DATA_LOADING,
        });

        PostMethod(EndPoint.FREE_TABLE, data, dispatch, false, fun, cb => {

            showCustomAlert(dispatch, true, "", "", cb?.message, "")

            dispatch({
                type: DATA_FAILED,
            });
            if (cb.success === 1) {
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
            }
            fun(false)
            // if (nav) {
            //     nav.navigate('Table')
            // }
            // dispatch({
            //     type: TABLES,
            //     payload: cb?.tables,
            // });
            // fun(cb?.tables)
        })

    };
};

export const getTables = (data, fun, table) => {
    return (dispatch) => {

        // dispatch({
        //     type: DATA_LOADING,
        // });

        PostMethod(EndPoint.GET_RESTAURANT_TABLES, data, dispatch, false, fun, cb => {
            //   console.log("cbcbcbcb", cb)

            dispatch({
                type: TABLES,
                payload: cb?.tables,
            });
            fun(cb?.tables, table)
        })

    };
};
export const changeTable = (data, fun) => {
    return (dispatch) => {

        // dispatch({
        //     type: DATA_LOADING,
        // });

        PostMethod(EndPoint.CHANGE_TABLE, data, dispatch, false, fun, cb => {
            console.log("changeTable", cb);
            if (cb.success === 1) {
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
                })
                dispatch({
                    type: TO_MOVE,
                    payload: false,
                });

            }
            fun(false)

        })

    };
};
export const mergeTable = (data, fun) => {
    return (dispatch) => {

        // dispatch({
        //     type: DATA_LOADING,
        // });

        PostMethod(EndPoint.MERGE_ORDER, data, dispatch, false, fun, cb => {
            console.log("mergeTable", cb);
            if (cb.success === 1) {
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
                })
                dispatch({
                    type: TO_MOVE,
                    payload: false,
                });

            }
            fun(false)
        })

    };
};
export const splitTable = (data, fun) => {
    return (dispatch) => {

        // dispatch({
        //     type: DATA_LOADING,
        // });

        PostMethod(EndPoint.MAKE_SPLIT, data, dispatch, false, fun, cb => {
            console.log("mergeTable", cb);
            if (cb.success === 1) {
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
                })
                dispatch({
                    type: TO_MOVE,
                    payload: false,
                });

            }
            fun(false)

        })

    };
};
export const getSplitOrderList = (data, fun, fun2) => {
    return (dispatch) => {

        // dispatch({
        //     type: DATA_LOADING,
        // });

        PostMethod(EndPoint.SPLIT_ORDER_LINKS, data, dispatch, false, fun, cb => {

            if (cb.success === 1) {
                cb.split_links.sub_orders = 0
                cb.split_links.paid = cb.is_main_order_paid
                cb?.split_sub_links.unshift(cb?.split_links)

                console.log("mergeTable", cb?.split_sub_links);
                let list = []

                fun2(cb?.split_sub_links)

            }
            fun(false)

        })

    };
};

export const assignSplitTable = (data, fun, fun2) => {
    return (dispatch) => {

        // dispatch({
        //     type: DATA_LOADING,
        // });

        PostMethod(EndPoint.ASSIGN_SPLIT_TABLE, data, dispatch, false, fun, cb => {
            console.log("assignSplitTable", cb);
            if (cb.success === 1) {
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
                })
                dispatch({
                    type: TO_MOVE,
                    payload: false,
                });

            }
            fun(false)

        })

    };
};
export const updateMainTableTitle = (data, fun, fun2) => {
    return (dispatch) => {

        // dispatch({
        //     type: DATA_LOADING,
        // });

        PostMethod(EndPoint.UPDATE_MAIN_TITLE, data, dispatch, false, fun, cb => {
            console.log("updateMainTableTitle", cb);
            //             if (cb.success === 1) {
            //                 dispatch({
            //                     type: ORDER_PLACE,
            //                     payload: true
            //                 });
            //                 dispatch({
            //                     type: CART_INFO,
            //                     payload: []
            //                 });
            //                 dispatch({
            //                     type: TABLE_NUMBER,
            //                     payload: "Table",
            //                 })
            //                 dispatch({
            //                     type: TO_MOVE,
            //                     payload: false,
            //                 });
            //
            //             }
            // fun(false)

        })

    };
};
export const updateSplitTableTitle = (data, fun, fun2) => {
    return (dispatch) => {

        // dispatch({
        //     type: DATA_LOADING,
        // });

        PostMethod(EndPoint.UPDATE_SPLIT_TITLE, data, dispatch, false, fun, cb => {
            console.log("updateSplitTableTitle", cb);
            //             if (cb.success === 1) {
            //                 dispatch({
            //                     type: ORDER_PLACE,
            //                     payload: true
            //                 });
            //                 dispatch({
            //                     type: CART_INFO,
            //                     payload: []
            //                 });
            //                 dispatch({
            //                     type: TABLE_NUMBER,
            //                     payload: "Table",
            //                 })
            //                 dispatch({
            //                     type: TO_MOVE,
            //                     payload: false,
            //                 });
            //
            //             }
            //fun(false)

        })

    };
};