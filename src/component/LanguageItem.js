import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";
import { Colors } from "../constant/color";
import { FONT_SIZE, HEIGHT_BASE_RATIO, WIDTH_BASE_RATIO } from "../constant/sizeHelper";

const LanguageItem = (props) => {
    const { restuarntLogo } = useSelector((state) => state.home);

    return (

        <TouchableOpacity
            onPress={() => props.onPressItem(props.item)}
            style={[styles.container, {
                backgroundColor: props?.item?.isSelected ?
                    Colors.primaryColor //:
                    // props?.item?.color ?
                    //     props?.item?.color
                    : Colors.white
            }]}>
            <View style={{ width: WIDTH_BASE_RATIO(500) }}>
                {props?.item?.product_attribute ? <Text
                    numberOfLines={2}
                    style={[styles.textStyle, { color: props?.item?.isSelected ? Colors.white : Colors.black }]}
                >
                    {props?.item?.name}

                    <Text style={[styles.attributeText, { color: props?.item?.isSelected ? Colors.white : Colors.borderColor }]}>
                        {` (${props?.item?.product_attribute})`}
                    </Text>
                </Text>
                    :
                    <Text style={[styles.textStyle, { color: props?.item?.isSelected ? Colors.white : Colors.black }]}>
                        {props?.item?.name}</Text>}

            </View>
            <Image
                style={[styles.imageStyle]}
                source={props?.item?.icon}
            />

        </TouchableOpacity>
    )

}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        height: HEIGHT_BASE_RATIO(114),
        // width: WIDTH_BASE_RATIO(690),
        backgroundColor: Colors.white,
        borderRadius: HEIGHT_BASE_RATIO(20),
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: WIDTH_BASE_RATIO(34)
    },
    imageStyle: {
        height: HEIGHT_BASE_RATIO(70),
        width: WIDTH_BASE_RATIO(100),

        resizeMode: "contain"

    },
    resLogo: {
        height: HEIGHT_BASE_RATIO(80),
        width: WIDTH_BASE_RATIO(80),

        resizeMode: "contain"
    },
    textStyle: {
        fontSize: FONT_SIZE(30),
        color: Colors.black,
        fontFamily: "Inter-Bold",

    },
    attributeText: {
        fontSize: FONT_SIZE(20),
        color: Colors.borderColor,
        fontFamily: "Inter-Bold"
    }

})

export default React.memo(LanguageItem);