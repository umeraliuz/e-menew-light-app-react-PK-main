import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../../redux/actions/auth";
import { DATA_FAILED, SEND_SUCCESS } from "../../../redux/actions/types";
import Design from "./design";

const LoginScreen = () => {
    const { isLoading, } = useSelector((state) => state.auth)
    const [isViewPassword, setViewPassword] = useState(false)
    const nav = useNavigation()
    const dispatch = useDispatch()

    const onPressLogin = (data) => {

        dispatch(loginUser(data))
    }
    const onPressForgotPassword = () => {
        nav.navigate('forgotPassword')
    }
    useEffect(() => {
        dispatch({ type: DATA_FAILED })
    }, [])

    const viewPassword = () => {
        setViewPassword(!isViewPassword)
    }

    return (
        <Design
            onPressLogin={onPressLogin}
            onPressForgotPassword={onPressForgotPassword}
            isLoading={isLoading}
            viewPassword={viewPassword}
            isViewPassword={isViewPassword}
        />
    )

}
export default LoginScreen