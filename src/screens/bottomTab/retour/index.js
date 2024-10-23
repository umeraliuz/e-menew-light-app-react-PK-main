import React, { useEffect } from "react";
import { BackHandler } from "react-native";
import Design from "./design";

const RetourScreen = () => {
    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true)
    }, [])
    return (
        <Design />
    )

}
export default RetourScreen