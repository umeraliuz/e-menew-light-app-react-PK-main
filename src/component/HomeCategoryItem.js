import React from "react";
import { TouchableOpacity, StyleSheet, Image, Text } from "react-native"
import { useSelector } from "react-redux";
import { IMAGE_BASE_URL, PRODUCT_IMAGE_BASE_URL, TOP_LEVEL_CAT_IMAGE_BASE_URL } from "../api/baseUrl";
import { images } from "../assets/images";
import { Colors } from "../constant/color";
import { FONT_SIZE, HEIGHT_BASE_RATIO, hp, WIDTH_BASE_RATIO, wp } from "../constant/sizeHelper";

const HomeCategoryItem = (props) => {
    const { restuarntLogo } = useSelector((state) => state.home);
    // console.log("props?.item", props?.item);

    return (

        <TouchableOpacity
            onPress={() => props.onPressItem(props.index, props.item)}
            style={[props.data?.length > 2 ? styles.container2 : styles.container,
            { backgroundColor: props?.item?.isSelected ? Colors.primaryColor : Colors.white }]}>
            <Image
                style={[styles.imageStyle]}

                source={props?.item?.icon ? { uri: TOP_LEVEL_CAT_IMAGE_BASE_URL + props?.item?.icon } : { uri: IMAGE_BASE_URL + restuarntLogo }}
            />
            <Text
                style={[styles.textStyle, { color: props?.item?.isSelected ? Colors.white : Colors.black }]}
            >{props.item.name}</Text>
        </TouchableOpacity>
    )

}

const styles = StyleSheet.create({
    container: {
        height: HEIGHT_BASE_RATIO(1092),
        width: WIDTH_BASE_RATIO(337),
        backgroundColor: Colors.white,
        borderRadius: HEIGHT_BASE_RATIO(20),
        justifyContent: "center",
        alignItems: "center"
    },
    container2: {
        height: HEIGHT_BASE_RATIO(500),
        width: WIDTH_BASE_RATIO(337),
        backgroundColor: Colors.white,
        borderRadius: HEIGHT_BASE_RATIO(20),
        justifyContent: "center",
        alignItems: "center"
    },
    imageStyle: {
        height: HEIGHT_BASE_RATIO(205),
        width: WIDTH_BASE_RATIO(160),

        resizeMode: "contain"

    },
    textStyle: {
        fontSize: FONT_SIZE(35),
        color: Colors.black,
        marginTop: HEIGHT_BASE_RATIO(98),
        fontFamily: "Inter-Bold"

    },

})

export default React.memo(HomeCategoryItem);