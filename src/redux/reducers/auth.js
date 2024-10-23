import {
  LOGIN_SUCCESS,
  DATA_FAILED,
  DATA_LOADING,
  LOGOUT_SUCCESS,
  FORGOT_SUCCESS,
  SEND_SUCCESS,
  ALERT_OBJECT,

} from "../actions/types";
const initialState = {
  isLoggedIn: false,
  token: "",
  userId: "",
  user: null,
  isLoading: false,
  isError: false,
  countProgress: 0,
  errMsg: null,

  register: "", isSuccess: false,
  isEmailSend: false,
  alertObject: {
    visible: false,
    title: "",
    icon: "",
    message: "",
    positiveAction: ''
  }

};

export const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case DATA_LOADING:
      return {
        ...state,
        isLoading: true,
        isError: false,
        isSuccess: false,
        errMsg: null,
      };
    case DATA_FAILED:
      return {
        ...state,
        isLoading: false,
        isError: true,
        isSuccess: false,
        errMsg: action?.payload,
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        user: action?.payload,
        token: action?.payload?.token_app,
        userId: action?.payload?.id,
        isLoading: false,
        isSuccess: true,
        isError: false,
        errMsg: null,
      };
    case LOGOUT_SUCCESS:

      return {
        ...state,
        user: [],
        token: "",
        userId: "",
        isLoading: false,
        isSuccess: true,
        isError: false,
        errMsg: null,
      };
    case FORGOT_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isSuccess: true,
        isError: false,
        errMsg: null,
        isEmailSend: true
      };
    case SEND_SUCCESS:
      return {
        ...state,
        isEmailSend: false
      };
    case ALERT_OBJECT:
      return {
        ...state,
        alertObject: action?.payload
      };

    default:
      return state;
  }
};
