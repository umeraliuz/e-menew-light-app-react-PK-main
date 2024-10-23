import { useDispatch } from "react-redux"
import { ALERT_OBJECT } from "../redux/actions/types"

const showCustomAlert = (dispatch, isShow, title, icon, message, positiveAction) => {

    let object = {
        visible: isShow,
        title: title,
        icon: icon,
        message: message,
        positiveAction: positiveAction

    }
    dispatch({
        type: ALERT_OBJECT,
        payload: object
    })

}
const hideAlert = (dispatch) => {

    let object = {
        visible: false,
        title: "",
        icon: "",
        message: "",
        positiveAction: ''

    }
    dispatch({
        type: ALERT_OBJECT,
        payload: object
    })
    console.log(object)

}
export { showCustomAlert, hideAlert }