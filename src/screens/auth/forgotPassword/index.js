import { useNavigation } from "@react-navigation/native";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { forgotPassword } from "../../../redux";
import { SEND_SUCCESS } from "../../../redux/actions/types";
import Design from "./design";

const ForgotPasswordScreen = () => {
    const { isLoading, isEmailSend } = useSelector((state) => state.auth);
    const nav = useNavigation()
    const dispatch = useDispatch()
    const onPressForgotPassword = (data) => {
        dispatch(forgotPassword(data))
    }
    const goBack = () => {
        dispatch({
            type: SEND_SUCCESS

        })
        nav.goBack()

    }
    return (
        <Design
            onPressForgotPassword={onPressForgotPassword}
            goBack={goBack}
            isEmailSend={isEmailSend}
            isLoading={isLoading}
        />
    )

}
export default ForgotPasswordScreen