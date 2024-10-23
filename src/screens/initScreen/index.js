
import React, { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import Design from "./design";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../redux";




export const InitialScreen = () => {
    const dispatch = useDispatch()
    const { isLoading } = useSelector((state) => state.auth);
    useEffect(() => {


    }, [])

    return (
        <Design

        />
    )

}
// export default InitialScreen