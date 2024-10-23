import React from "react";
import { TouchableOpacity, StyleSheet, Image, Text, View } from "react-native"
import { useSelector } from "react-redux";
import { IMAGE_BASE_URL, PRODUCT_IMAGE_BASE_URL } from "../api/baseUrl";
import { images } from "../assets/images";
import { Colors } from "../constant/color";
import { FONT_SIZE, HEIGHT_BASE_RATIO, hp, WIDTH_BASE_RATIO, wp } from "../constant/sizeHelper";

const BottomModelItem = (props) => {
    const { restuarntLogo } = useSelector((state) => state.home);

    return (

        <TouchableOpacity
            disabled={props?.item?.disabled}
            onPress={() => props?.item?.action ? props?.item.action() : props.onPressItem(props.index, props.item)}
            style={[styles.container, props?.item?.isSelected && { backgroundColor: Colors.primaryColor, borderColor: Colors.primaryColor }]}>

            {!props.isImageShown && <Image
                style={[styles.imageStyle, props?.item?.image_name && {
                    resizeMode: "cover"
                }, (props?.item?.disabled) && {

                    tintColor: props?.item?.disabled ?
                        Colors.borderColor
                        : Colors.black
                }]}
                source={props?.item?.image_name ? { uri: PRODUCT_IMAGE_BASE_URL + props?.item?.image_name } : props?.item?.icon ? props?.item?.icon : { uri: IMAGE_BASE_URL + restuarntLogo }}
            />}
            <Text
                style={[styles.textStyle, props.isImageShown && { marginTop: 0, fontSize: HEIGHT_BASE_RATIO(40) }, { color: props?.item?.disabled ? Colors.borderColor : props?.item?.isSelected ? Colors.white : Colors.black }]}
            >{props?.item?.extra_name ?
                props?.item?.extra_name :
                props?.item?.comment_description ?
                    props?.item?.comment_description :
                    props?.item?.pic_name ?
                        props?.item?.pic_name :
                        props?.item?.ingredient_name ?
                            props?.item?.ingredient_name :
                            props?.item?.product_name ?
                                props?.item?.product_name :
                                props.item.name}{props.isImageShown && (props?.typeOfDiscount?.icons === "Rabais" ? "-" : "%")}

            </Text>
            {props?.item?.product_attribute &&
                <Text
                    style={[styles.attributeText, { color: props?.item?.isSelected ? Colors.white : Colors.borderColor }]}>
                    ({props.item.product_attribute})
                </Text>}
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
        borderColor: Colors.borderColor
    },
    imageStyle: {
        height: HEIGHT_BASE_RATIO(45),
        width: WIDTH_BASE_RATIO(45),
        resizeMode: "contain",
        // tintColor: Colors.black

    },
    textStyle: {
        fontSize: FONT_SIZE(16),
        color: Colors.black,
        marginTop: HEIGHT_BASE_RATIO(16),
        fontFamily: "Inter-Bold",
        textAlign: "center"

    }, BadgeStyle: {
        height: WIDTH_BASE_RATIO(35),
        width: WIDTH_BASE_RATIO(35),
        borderRadius: WIDTH_BASE_RATIO(35) / 2,
        backgroundColor: Colors.badgeColor,
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        top: -5,
        right: -5,

    },
    attributeText: {
        fontSize: FONT_SIZE(15),
        color: Colors.borderRadius,
        fontFamily: "Inter-Bold"
    },
    resLogo: {
        height: HEIGHT_BASE_RATIO(80),
        width: WIDTH_BASE_RATIO(80),
        resizeMode: "contain"
    },

})

export default React.memo(BottomModelItem);