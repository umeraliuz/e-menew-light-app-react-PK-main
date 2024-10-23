import React from "react";
import { TouchableOpacity, StyleSheet, Image, Text, View } from "react-native"
import { useSelector } from "react-redux";
import { IMAGE_BASE_URL, PRODUCT_IMAGE_BASE_URL } from "../api/baseUrl";
import { images } from "../assets/images";
import { Colors } from "../constant/color";
import { FONT_SIZE, HEIGHT_BASE_RATIO, hp, WIDTH_BASE_RATIO, wp } from "../constant/sizeHelper";

const ProductItem = (props) => {
    const { restuarntLogo } = useSelector((state) => state.home);

    return (

        <TouchableOpacity
            onPress={() => props.onPressItem(props.index, props.item, "product")}
            style={[styles.container, {
                backgroundColor: props?.item?.isSelected ?
                    Colors.primaryColor //:
                    // props?.item?.color ?
                    //     props?.item?.color
                    : Colors.white
            }]}>
            <View style={{ width: WIDTH_BASE_RATIO(550) }}>
                {props?.item?.product_attribute ? <Text
                    numberOfLines={2}
                    style={[styles.textStyle, { color: props?.item?.isSelected ? Colors.white : Colors.black }]}
                >
                    {props?.item?.product_name}

                    <Text style={[styles.attributeText, { color: props?.item?.isSelected ? Colors.white : Colors.borderColor }]}>
                        {` (${props?.item?.product_attribute})`}
                    </Text>
                </Text>
                    :
                    <Text style={[styles.textStyle, { color: props?.item?.isSelected ? Colors.white : Colors.black }]}>
                        {props?.item?.product_name ? props?.item?.product_name : props?.item?.name}</Text>}

            </View>
            <Image
                style={[styles.imageStyle, (!props?.item.product_id) ? {
                    tintColor: props?.item?.isSelected ?
                        Colors.white : Colors.black
                } : styles.resLogo]}
                source={!props?.item.product_id ? images.catIcon : props?.item?.image_name ? { uri: PRODUCT_IMAGE_BASE_URL + props?.item?.image_name } : { uri: IMAGE_BASE_URL + restuarntLogo }}
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
        height: HEIGHT_BASE_RATIO(55),
        width: WIDTH_BASE_RATIO(55),
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

export default React.memo(ProductItem);