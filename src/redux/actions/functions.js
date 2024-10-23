import { Alert } from "react-native";
import { EndPoint } from "../../api/apiEndPonit";
import { PostMethod } from "../../api/APIMethod";
import { baseUrl } from "../../api/baseUrl";
import { showCustomAlert } from "../../constant/Alert";
import {
    DATA_FAILED,
    DATA_LOADING,
    TABLES,
    TABLE_NUMBER,

} from "../actions/types";

export const giveTips = (data, fun) => {
    return (dispatch) => {

        dispatch({
            type: DATA_LOADING,
        });

        PostMethod(EndPoint.APPLY_ORDER_TIPS, data, dispatch, false, fun, cb => {

            showCustomAlert(dispatch, true, "", "", cb?.message, "")
            dispatch({
                type: DATA_FAILED,
            });
            // dispatch({
            //     type: TABLES,
            //     payload: cb?.tables,
            // });
            // fun(cb?.tables)
        })

    };
};
export const getOrderTicket = (data, fun) => {
    return (dispatch) => {

        dispatch({
            type: DATA_LOADING,
        });

        PostMethod(EndPoint.ORDER_TICKET, data, dispatch, false, fun, cb => {

            // dispatch({
            //     type: TABLES,
            //     payload: cb?.tables,
            // });
            fun(cb?.orders)
            dispatch({
                type: DATA_FAILED,
            });
        })

    };
};
