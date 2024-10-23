import React from "react";
import { StyleSheet } from "react-native"
import { Colors } from "../../../constant/color";
import { FONT_SIZE, HEIGHT_BASE_RATIO, WIDTH_BASE_RATIO } from "../../../constant/sizeHelper";

export const styles = StyleSheet.create({

    container: {
        flex: 1,
        paddingHorizontal: WIDTH_BASE_RATIO(15)

    },
    headerStyle: {
        height: HEIGHT_BASE_RATIO(132),
        borderBottomStartRadius: HEIGHT_BASE_RATIO(60),
        borderBottomEndRadius: HEIGHT_BASE_RATIO(60),
        backgroundColor: Colors.white,
        justifyContent: "center",
        alignItems: "center"
    },
    headerTitle: {
        fontSize: FONT_SIZE(25),
        color: Colors.black,
        fontFamily: "Inter-Bold"
    },
    successfulContainer: {
        position: "absolute",
        height: "100%",
        width: "100%",
        paddingHorizontal: WIDTH_BASE_RATIO(30),
        backgroundColor: Colors.white,
        justifyContent: "center",
        alignItems: "center"
    },
    succesfulMsg: {
        fontSize: FONT_SIZE(45),
        color: Colors.black,
        fontFamily: "Inter-Bold",
        textAlign: "center"
    },
    acceptImage: {
        height: WIDTH_BASE_RATIO(300),
        width: WIDTH_BASE_RATIO(300),
        resizeMode: "contain",
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