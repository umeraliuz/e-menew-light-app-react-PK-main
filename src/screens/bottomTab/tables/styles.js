import React from "react";
import { StyleSheet } from "react-native"
import { Colors } from "../../../constant/color";

import { FONT_SIZE, HEIGHT_BASE_RATIO, WIDTH_BASE_RATIO } from "../../../constant/sizeHelper";

export const styles = StyleSheet.create({

    container: {
        flex: 1,
        marginTop: HEIGHT_BASE_RATIO(10),
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
    alertView: {
        position: "absolute",
        //flex: 1,
        height: "100%",
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Colors.borderColor,
        // paddingHorizontal: WIDTH_BASE_RATIO(27)
    },
    sectionHeader: {
        marginTop: HEIGHT_BASE_RATIO(20),
        width: "100%",
        flexDirection: "row",
        // justifyContent: "center",
        alignItems: "center",
        //backgroundColor: Colors.borderColor,
        height: WIDTH_BASE_RATIO(89),
        paddingStart: WIDTH_BASE_RATIO(20),
        borderRadius: HEIGHT_BASE_RATIO(10),

    },
    titleStyle: {
        fontSize: FONT_SIZE(40),
        color: Colors.borderColor,
        fontFamily: "Inter-Bold",
        textAlign: "center",
        // alignSelf: "center",
        // marginBottom: HEIGHT_BASE_RATIO(20)
    }
})