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
import { cond } from "lodash";

export const getBookingList = (data, fun) => {
    return (dispatch) => {

        dispatch({
            type: DATA_LOADING,
        });

        PostMethod(EndPoint.BOOKING_LIST, data, dispatch, false, fun, cb => {
            console.log("getBookingList", cb)
            fun(cb.bookings)

            // showCustomAlert(dispatch, true, "", "", cb?.message, "")
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
export const getTimings = (data, fun) => {
    return (dispatch) => {

        dispatch({
            type: DATA_LOADING,
        });

        PostMethod(EndPoint.GET_TIMINGS, data, dispatch, false, fun, cb => {

            // dispatch({
            //     type: TABLES,
            //     payload: cb?.tables,
            // });
            // console.log("get timing ", cb)
            fun(cb?.timing, cb.reservation_interval)
            dispatch({
                type: DATA_FAILED,
            });
        })

    };
};
export const reservadTable = (data, fun, fun1) => {
    return (dispatch) => {

        dispatch({
            type: DATA_LOADING,
        });

        PostMethod(EndPoint.BOOK_RESERVATION, data, dispatch, false, fun, cb => {

            showCustomAlert(dispatch, true, "", "", cb?.data?.message, "")
            fun(false),
                fun1()
            dispatch({
                type: DATA_FAILED,
            });
        })

    };
};

export const getResaurantSettings = (data, fun, fun1) => {
    return (dispatch) => {

        dispatch({
            type: DATA_LOADING,
        });

        PostMethod(EndPoint.RESTAURANT_SETTINGS, data, dispatch, false, fun, cb => {
            //console.log("getResaurantSettings.....", cb)
            fun(cb)
            fun1(false)
            //  dispatch({
            //     type: TABLES,
            //     payload: cb?.tables,
            // });
            dispatch({
                type: DATA_FAILED,
            });
        })

    };
};