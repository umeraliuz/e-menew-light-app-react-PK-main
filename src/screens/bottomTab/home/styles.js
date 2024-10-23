import React from "react";
import { StyleSheet } from "react-native"
import { Colors } from "../../../constant/color";
import { FONT_SIZE, HEIGHT_BASE_RATIO, WIDTH_BASE_RATIO } from "../../../constant/sizeHelper";

export const styles = StyleSheet.create({

    container: {
        flex: 1,
        // paddingHorizontal: WIDTH_BASE_RATIO(15),
        //  backgroundColor: "yellow"

    },

    flatlistWrapView: {
        height: HEIGHT_BASE_RATIO(1092),
    },
    selectedProductListView: {

        maxHeight: HEIGHT_BASE_RATIO(460),
        //minHeight: HEIGHT_BASE_RATIO(460),
        width: "100%",
        backgroundColor: Colors.white,
        position: 'absolute',
        borderBottomStartRadius: WIDTH_BASE_RATIO(30),
        borderBottomEndRadius: WIDTH_BASE_RATIO(30),
        elevation: 20,
        paddingHorizontal: WIDTH_BASE_RATIO(15),
        paddingBottom: 20
    },
    indicatorStyle: {
        position: "absolute",
        top: HEIGHT_BASE_RATIO(720),
        justifyContent: "center",
        alignSelf: "center",

    },

    imageStyle: {
        height: HEIGHT_BASE_RATIO(26),
        width: WIDTH_BASE_RATIO(13),
        resizeMode: "contain"
    },
    rightArrowContain: {
        height: HEIGHT_BASE_RATIO(77),
        width: HEIGHT_BASE_RATIO(77),
        borderRadius: HEIGHT_BASE_RATIO(77) / 2,
        position: "absolute",
        top: HEIGHT_BASE_RATIO(27),
        left: WIDTH_BASE_RATIO(27),
        backgroundColor: Colors.borderColor,
        justifyContent: "center",

        alignItems: "center"
    },
    alertView: {
        position: "absolute",
        //flex: 1,
        height: "100%",
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Colors.borderColor,
        paddingHorizontal: WIDTH_BASE_RATIO(27),
        zIndex: 0,

    }
})