import React from "react";
import { useTranslation } from "react-i18next";
import { TouchableOpacity, StyleSheet, Image, Text, View } from "react-native"
import { images } from "../assets/images";
import { Colors } from "../constant/color";
import { FONT_SIZE, HEIGHT_BASE_RATIO, hp, WIDTH_BASE_RATIO, wp } from "../constant/sizeHelper";
import { Strings } from "../constant/string";

const CartProductExtraItem = (props) => {
    const { t } = useTranslation()

    return (

        <>

            <View
                key={props.ingrdient.id}
                style={styles.container}>

                <View style={[styles.leftContainer, styles.leftContainer2, { borderWidth: 0, backgroundColor: Colors.transparent }]}>
                    <View style={[styles.srnoContainer, { borderWidth: 0, backgroundColor: Colors.transparent }]}>
                        <Text
                            adjustsFontSizeToFit
                            numberOfLines={1}
                            style={[styles.textStyle, { color: props.isPaid ? Colors.lightGreen : Colors.black }]}>{props.ingrdient.quantity}</Text>
                    </View>
                    <View style={{ width: WIDTH_BASE_RATIO(400) }}>
                        <Text
                            numberOfLines={1}
                            style={[styles.textStyle, { color: props.isPaid ? Colors.lightGreen : Colors.black }]}
                        >
                            {`${props.ingrdient?.icons} ${props.ingrdient?.pic_name ?
                                props.ingrdient?.pic_name :
                                props.ingrdient.comment_description ?
                                    props.ingrdient.comment_description :
                                    props.ingrdient?.extra_name ?
                                        props.ingrdient?.extra_name :
                                        props.ingrdient?.ingredient_name}`}
                        </Text>

                    </View>
                </View>
                <View style={[styles.rightContainer, { borderWidth: 0, backgroundColor: Colors.transparent }]}>
                    {props?.ingrdient?.isOffert == "offert" ?
                        <Image
                            style={styles.imageStyle}
                            source={images.giftIcon}
                        />
                        : <Text
                            adjustsFontSizeToFit
                            numberOfLines={1}
                            style={[styles.textStyle, { color: props.isPaid ? Colors.lightGreen : Colors.black }]}
                        >{props.ingrdient.extra_price ? Number(props.ingrdient.extra_price * props.ingrdient.quantity).toFixed(2) : ""}</Text>
                    }
                </View>
            </View>

        </>

    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        borderRadius: HEIGHT_BASE_RATIO(20),

        justifyContent: "space-between",
        alignItems: "center",
    },
    rightContainer: {
        height: HEIGHT_BASE_RATIO(72),
        width: WIDTH_BASE_RATIO(147),
        backgroundColor: Colors.white,
        borderRadius: HEIGHT_BASE_RATIO(10),
        borderWidth: HEIGHT_BASE_RATIO(2),
        borderColor: Colors.borderColor,
        justifyContent: "center",
        alignItems: "center",
    },
    leftContainer: {
        height: HEIGHT_BASE_RATIO(72),
        width: WIDTH_BASE_RATIO(523),
        backgroundColor: Colors.white,
        borderRadius: HEIGHT_BASE_RATIO(10),
        borderWidth: HEIGHT_BASE_RATIO(2),
        borderColor: Colors.borderColor,
        justifyContent: "center",
        alignItems: "center",
    },
    leftContainer2: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        paddingStart: WIDTH_BASE_RATIO(15)
    },
    textStyle: {
        fontSize: FONT_SIZE(25),
        color: Colors.black,
        fontFamily: "Inter-Bold"

    },
    fixedView: {
        borderWidth: HEIGHT_BASE_RATIO(0),
        backgroundColor: Colors.darkYellow
    },
    srnoContainer: {
        height: HEIGHT_BASE_RATIO(59),
        width: WIDTH_BASE_RATIO(79),
        backgroundColor: Colors.borderColor,
        borderRadius: HEIGHT_BASE_RATIO(10),
        borderWidth: HEIGHT_BASE_RATIO(2),
        borderColor: Colors.borderColor,
        justifyContent: "center",
        alignItems: "center",
        marginEnd: WIDTH_BASE_RATIO(23)
    },
    attributeText: {
        fontSize: FONT_SIZE(20),
        color: Colors.borderColor,
        fontFamily: "Inter-Bold"
    }
    ,
    imageStyle: {
        height: HEIGHT_BASE_RATIO(35),
        width: WIDTH_BASE_RATIO(35),
        resizeMode: "contain",
        tintColor: Colors.black

    },
})

export default CartProductExtraItem;