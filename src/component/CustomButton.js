import React from "react";
import { TouchableOpacity, StyleSheet, Image, Text, ActivityIndicator } from "react-native"
import { Colors } from "../constant/color";
import { FONT_SIZE, HEIGHT_BASE_RATIO, hp, WIDTH_BASE_RATIO, wp } from "../constant/sizeHelper";

const CustomButton = (props) => {

    return (

        <TouchableOpacity
            onPress={() => props.onPress()}
            disabled={props.isLoading}
            style={[styles.container, props.containerStyle && props.containerStyle]}>
            {props.isLoading ?
                <ActivityIndicator
                    color={Colors.white}
                    size="small"
                />
                : <Text
                    style={styles.textStyle}
                >{props.name}</Text>}

        </TouchableOpacity>
    )

}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        height: HEIGHT_BASE_RATIO(89),
        width: WIDTH_BASE_RATIO(359),
        backgroundColor: Colors.primaryColor,
        borderRadius: HEIGHT_BASE_RATIO(12),
        justifyContent: "center",
        alignItems: "center",
    },
    textStyle: {
        fontSize: FONT_SIZE(25),
        color: Colors.white,
        fontFamily: "Inter-Bold"

    }

})

export default React.memo(CustomButton);