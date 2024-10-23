import React from "react";
import { StyleSheet } from "react-native"
import { Colors } from "../../../constant/color";
import { WIDTH_BASE_RATIO } from "../../../constant/sizeHelper";

export const styles = StyleSheet.create({

    container: {
        flex: 1,
        //justifyContent: "center",
        //alignItems: "center"
        paddingHorizontal: WIDTH_BASE_RATIO(15),
    },
    alertView: {
        position: "absolute",
        //flex: 1,
        height: "100%",
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Colors.borderColor,
        paddingHorizontal: WIDTH_BASE_RATIO(27)
    }
})