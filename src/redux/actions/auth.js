
import { EndPoint } from "../../api/apiEndPonit";
import { PostMethod } from "../../api/APIMethod";
import {
  CART_INFO, DATA_LOADING, DISCOUNT_OBJECT, FORGOT_SUCCESS, LOGIN_SUCCESS, LOGOUT_SUCCESS, TABLE_NUMBER
} from "../actions/types";
import { getCurrency, getPaymentList } from "./cart";

export const loginUser = (data) => {
  return (dispatch) => {

    dispatch({
      type: DATA_LOADING,
    });

    PostMethod(EndPoint.LOGIN, data, dispatch, false, "fun", cb => {

      let data = {
        "token": cb?.user?.token_app,
        "user_id": cb?.user?.id,
        "restaurant_id": cb?.user.restaurant_id,
      }
      console.log("cb?.user", cb?.user)
      dispatch({
        type: LOGIN_SUCCESS,
        payload: cb?.user,
      });

      dispatch(getCurrency(data))
      dispatch(getPaymentList(data))
    })
  };
};

export const forgotPassword = (data) => {
  return (dispatch) => {

    dispatch({
      type: DATA_LOADING,
    });
    PostMethod(EndPoint.FORGOT_PASSWORD, data, dispatch, false, "fun", cb => {

      dispatch({
        type: FORGOT_SUCCESS,
        payload: cb?.user,
      });
    })

  };
};

export const logoutUser = (data) => {
  return (dispatch) => {

    console.log("loggout")
    dispatch({
      type: LOGOUT_SUCCESS,
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
      type: DISCOUNT_OBJECT,
      payload: {}
    })

  };
};
