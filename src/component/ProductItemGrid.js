import React from "react";
import { TouchableOpacity, StyleSheet, Image, Text, View } from "react-native"
import { useSelector } from "react-redux";
import { IMAGE_BASE_URL, PRODUCT_IMAGE_BASE_URL } from "../api/baseUrl";
import { images } from "../assets/images";
import { Colors } from "../constant/color";
import { FONT_SIZE, HEIGHT_BASE_RATIO, hp, WIDTH_BASE_RATIO, wp } from "../constant/sizeHelper";

const ProductItemGrid = (props) => {
    const { restuarntLogo } = useSelector((state) => state.home);

    return (

        <TouchableOpacity
            onPress={() => props.onPressItem(props.index, props.item, "product")}
            style={[styles.container, props?.item?.isSelected && {
                backgroundColor: Colors.primaryColor, //:
                borderColor: Colors.primaryColor

            }]}>
            <Image
                style={[styles.imageStyle, (!props?.item.product_id) ? {
                    tintColor: props?.item?.isSelected ?
                        Colors.white : Colors.black
                } : styles.resLogo]}
                source={!props?.item.product_id ? images.catIcon : props?.item?.image_name ? { uri: PRODUCT_IMAGE_BASE_URL + props?.item?.image_name } : { uri: IMAGE_BASE_URL + restuarntLogo }}
            />
            <View >
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

        </TouchableOpacity>
    )

}

const styles = StyleSheet.create({
    container: {
        height: HEIGHT_BASE_RATIO(166),
        width: WIDTH_BASE_RATIO(213),
        backgroundColor: Colors.white,
        borderRadius: HEIGHT_BASE_RATIO(20),
        justifyContent: "center",
        alignItems: "center",
        borderWidth: WIDTH_BASE_RATIO(3),
        borderColor: Colors.borderColor,
        paddingHorizontal: WIDTH_BASE_RATIO(5)
    },
    imageStyle: {
        height: HEIGHT_BASE_RATIO(50),
        width: WIDTH_BASE_RATIO(50),
        resizeMode: "contain",

    },
    resLogo: {
        height: HEIGHT_BASE_RATIO(80),
        width: WIDTH_BASE_RATIO(80),

        resizeMode: "contain"
    },
    textStyle: {
        fontSize: FONT_SIZE(16),
        color: Colors.black,
        marginTop: HEIGHT_BASE_RATIO(16),
        fontFamily: "Inter-Bold",
        textAlign: "center"

    },
    attributeText: {
        fontSize: FONT_SIZE(20),
        color: Colors.borderColor,
        fontFamily: "Inter-Bold"
    }

})

export default React.memo(ProductItemGrid);