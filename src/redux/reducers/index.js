import { combineReducers } from "redux";
import { applicationReducer } from "./application";

//Import All Reducers
import { authReducer } from "./auth";
import { cartReducer } from "./cart";
import { homeReducer } from "./home";
import { settingReducer } from "./setting";
import { tableReducer } from "./table";

export default combineReducers({
  auth: authReducer,
  home: homeReducer,
  table: tableReducer,
  cart: cartReducer,
  application: applicationReducer,
  setting: settingReducer
});
