
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSelector } from "react-redux";
import { showCustomAlert } from "../constant/Alert";
import { logoutUser } from "../redux";
import { CART_INFO, DATA_FAILED, LOGOUT_SUCCESS, ORDER_PLACE, TABLE_NUMBER } from "../redux/actions/types";
import { baseUrl } from "./baseUrl";

export const PostMethod = async (endPoint, data, dispatch, type, fun, cb) => {

  const isConnected = await AsyncStorage.getItem("IS_CONNECTION");
  const root = await AsyncStorage.getItem("persist:root");
  //const keys = await AsyncStorage.getAllKeys();
  const parasRoot = JSON.parse(root)
  const auth = JSON.parse(parasRoot.auth)
  if (auth?.user?.token_app) {
    data.token = auth.user.token_app
    data.user_id = auth.user.id
    data.restaurant_id = auth.user.restaurant_id
  }
  // console.log("base root", data, endPoint)
  // const datas = await AsyncStorage.multiGet(keys);
  //console.log("base data", datas)
  let res
  await baseUrl
    .post(endPoint, data)
    .then(async (ress) => {
      // console.log("res...", ress?.data?.data)

      res = ress
    })
    .catch((err) => {
      //  console.log("res...err", err)
      cb([])
      if (isConnected == "true") {
        showCustomAlert(dispatch, true, "", "", "Internal Server Error", "")
      }
      dispatch({
        type: DATA_FAILED,
      });
    });
  if (res) {
    try {
      //  console.log("res?.data?.success", res?.data?.success, endPoint)
      if (res?.data?.success === 1) {
        let data = { ...res?.data?.data, ...res?.data }

        cb(data)

      } else {
        if (res?.data?.success == 10) {

          dispatch(logoutUser());
        } else if (res?.data?.data?.data?.is_paid == 1) {

          dispatch({
            type: CART_INFO,
            payload: []
          });
          dispatch({
            type: TABLE_NUMBER,
            payload: "Table",
          });

        }
        dispatch({
          type: DATA_FAILED,

        });
        if (type) {
          cb([])
        } else {
          if (fun !== "fun") {
            fun(false)
          }
        }
        showCustomAlert(dispatch, true, "", "", res?.data?.message, "")
      }

    } catch {
      cb([])
      console.log("my side error")
      dispatch({
        type: DATA_FAILED,
      });
    }
  }
};