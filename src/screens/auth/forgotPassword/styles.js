import React from "react";
import { StyleSheet } from "react-native"
import { Colors } from "../../../constant/color";
import { HEIGHT_BASE_RATIO, WIDTH_BASE_RATIO } from "../../../constant/sizeHelper";

export const styles = StyleSheet.create({

    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    logo: {
        height: HEIGHT_BASE_RATIO(229),
        width: WIDTH_BASE_RATIO(362),
        resizeMode: "contain"
    },
    errorText: {
        fontSize: HEIGHT_BASE_RATIO(25),
        color: Colors.darkYellow,
        alignSelf: "flex-start",
        marginStart: WIDTH_BASE_RATIO(60),
        marginTop: HEIGHT_BASE_RATIO(5),
        fontFamily: "Inter-Bold"

    },
    goBackView: {
        position: "absolute",
        top: 14,
        start: 5,
    },
    gobackIcon: {
        height: HEIGHT_BASE_RATIO(40),
        width: WIDTH_BASE_RATIO(100),
        resizeMode: "contain"

    }

})