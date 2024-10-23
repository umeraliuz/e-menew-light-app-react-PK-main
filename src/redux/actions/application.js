
import { EndPoint } from "../../api/apiEndPonit";
import { PostMethod } from "../../api/APIMethod";
import { baseUrl } from "../../api/baseUrl";
import {
    DATA_FAILED,
    DATA_LOADING,
    POS_CLIENT_NOTIFICATION,
    TABLES,
    TABLE_NUMBER,
    TAKEAWAY_ORDER_NOTIFICATION,

} from "./types";

export const clientCallNotification = (data, fun) => {
    return (dispatch) => {

        // dispatch({
        //     type: DATA_LOADING,
        // });

        PostMethod(EndPoint.POS_CLIENT_NOTIFICATION, data, dispatch, false, fun, cb => {
            // console.log("clientCallNotificationksgihf", cb)

            dispatch({
                type: POS_CLIENT_NOTIFICATION,
                payload: cb?.notifications
                ,
            });

        })

    };
};
export const readClientNotification = (data, fun) => {
    return (dispatch) => {
        //
        //         dispatch({
        //             type: DATA_LOADING,
        //         });

        PostMethod(EndPoint.READ_NOTIFICATION, data, dispatch, false, fun, cb => {
            // console.log("read notification", cb)

            // dispatch({
            //     type: POS_CLIENT_NOTIFICATION,
            //     payload: cb?.notifications
            //     ,
            // });

        })

    };
};

export const getOrderNotification = (data, type) => {
    return (dispatch) => {

        // dispatch({
        //     type: DATA_LOADING,
        // });

        PostMethod(EndPoint.ORDER_NOTIFICATIONS, data, dispatch, false, "fun", cb => {
            //console.log("getOrderNotification", cb)
            dispatch({
                type: TAKEAWAY_ORDER_NOTIFICATION,
                payload: cb?.order_results

            });

            // dispatch({
            //     type: TABLES,
            //     payload: cb?.tables,
            // });
            // fun(cb?.order_results)
            // dispatch({
            //     type: DATA_FAILED,
            // });
        })

    };
};