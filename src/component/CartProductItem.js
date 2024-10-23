import React from "react";
import { useTranslation } from "react-i18next";
import { TouchableOpacity, StyleSheet, Image, Text, View } from "react-native"
import { useSelector } from "react-redux";
import { images } from "../assets/images";
import { Colors } from "../constant/color";
import { FONT_SIZE, HEIGHT_BASE_RATIO, hp, WIDTH_BASE_RATIO, wp } from "../constant/sizeHelper";
import { Strings } from "../constant/string";
import CartProductExtraItem from "./CartProductExtraItem";

const CartProductItem = (props) => {
    const { t } = useTranslation()
    const { discountObject } = useSelector((state) => state.cart);
    // console.log("CartProductItem", props);
    return (

        <>
            {props.type === "fixed" ?
                <View
                    style={[styles.container, { marginTop: HEIGHT_BASE_RATIO(15) }]}>

                    <View style={[styles.leftContainer, styles.fixedView]}>
                        <Text
                            style={[styles.textStyle, { color: Colors.white }]}
                        >{t("PRODUCTS")}</Text>
                    </View>
                    <View style={[styles.rightContainer, styles.fixedView]}>
                        <Text
                            style={[styles.textStyle, { color: Colors.white }]}
                        >{t("PRICE")}</Text>
                    </View>
                </View> :
                (props.item.is_paid == 3 || props?.item?.in_kitchen) ?
                    <>
                        <View
                            style={styles.container}>

                            <View style={[styles.leftContainer, styles.leftContainer2, {
                                borderWidth: 0,
                                backgroundColor: props.item.is_paid == 3 ?
                                    Colors.lightGreen : Colors.yellow
                            }]}>
                                <View style={[styles.srnoContainer, { borderWidth: 0, backgroundColor: Colors.lightWhite }]}>
                                    <Text
                                        adjustsFontSizeToFit
                                        numberOfLines={1}
                                        style={[styles.textStyle]}>{props.item.quantity}</Text>
                                </View>
                                <View style={{ width: WIDTH_BASE_RATIO(400) }}>
                                    {props?.item?.product_attribute ? <Text
                                        numberOfLines={1}
                                        style={[styles.textStyle]}
                                    >
                                        {props?.item?.product_name}

                                        <Text
                                            numberOfLines={1}
                                            style={[styles.attributeText]}>
                                            {` (${props?.item?.product_attribute}) ${props?.item?.isDiscount
                                                ? `${discountObject?.discount} off` : ''}`}
                                        </Text>
                                    </Text>
                                        :
                                        <Text
                                            numberOfLines={1}
                                            style={styles.textStyle}>
                                            {props?.item?.product_name}</Text>}
                                </View>
                            </View>
                            <View style={[styles.rightContainer, {
                                borderWidth: 0,
                                backgroundColor: props.item.is_paid == 3 ?
                                    Colors.lightGreen : Colors.yellow
                            }]}>
                                {props?.item?.isOffert == 'offert' ?
                                    <Image
                                        style={styles.imageStyle}
                                        source={images.giftIcon}
                                    />
                                    : <Text
                                        adjustsFontSizeToFit
                                        numberOfLines={1}
                                        style={styles.textStyle}
                                    >{Number(props.item.price * props.item.quantity).toFixed(2)}</Text>
                                }
                            </View>
                        </View>
                        <>
                            {props?.item?.product_extra &&

                                props?.item?.product_extra.map((ingrdient, index) => {
                                    return (
                                        <View key={ingrdient.id}>
                                            <CartProductExtraItem
                                                ingrdient={ingrdient}
                                                index={index}
                                                isPaid={props.item.is_paid == 3}
                                            />
                                        </View>
                                    )
                                })
                            }
                            {props?.item?.ingrdients &&

                                props?.item?.ingrdients.map((ingrdient, index) => {
                                    return (
                                        <View key={ingrdient.id}>
                                            <CartProductExtraItem
                                                ingrdient={ingrdient}
                                                index={index}
                                                isPaid={props.item.is_paid == 3}
                                            />
                                        </View>
                                    )
                                })
                            }
                            {props?.item?.instructions &&

                                props?.item?.instructions.map((ingrdient, index) => {
                                    return (
                                        <View key={ingrdient.id}>
                                            <CartProductExtraItem
                                                ingrdient={ingrdient}
                                                index={index}
                                                isPaid={props.item.is_paid == 3}
                                            />
                                        </View>
                                    )
                                })
                            }
                            {props?.item?.comments &&

                                props?.item?.comments.map((ingrdient, index) => {
                                    return (
                                        <View key={ingrdient.id}>
                                            <CartProductExtraItem
                                                ingrdient={ingrdient}
                                                index={index}
                                                isPaid={props.item.is_paid == 3}
                                            />
                                        </View>
                                    )
                                })
                            }
                            {props?.item?.special_notes &&

                                <View key={props?.item?.special_note}>
                                    <CartProductExtraItem
                                        ingrdient={
                                            {
                                                quantity: 1,
                                                comment_description: props?.item?.special_notes,
                                                icons: "✒"
                                            }
                                        }
                                        index={1}
                                        isPaid={props.item.is_paid == 3}
                                    />
                                </View>

                            }

                        </>
                    </>
                    :
                    <>
                        <View
                            style={styles.container}>

                            <View style={[styles.leftContainer, styles.leftContainer2]}>
                                <View style={styles.srnoContainer}>
                                    <Text
                                        adjustsFontSizeToFit
                                        numberOfLines={1}
                                        style={styles.textStyle}>{props.item.quantity}</Text>
                                </View>
                                <View style={{ width: WIDTH_BASE_RATIO(400) }}>
                                    {props?.item?.product_attribute ? <Text
                                        numberOfLines={1}
                                        style={styles.textStyle}
                                    >
                                        {props?.item?.product_name}

                                        <Text
                                            numberOfLines={1}
                                            style={styles.attributeText}>
                                            {` (${props?.item?.product_attribute}) ${props?.item?.isDiscount
                                                ? `${discountObject?.discount} off` : ''}`}
                                        </Text>
                                    </Text>
                                        :
                                        <Text
                                            numberOfLines={1}
                                            style={styles.textStyle}>
                                            {props?.item?.product_name}</Text>}
                                </View>
                            </View>
                            <View style={styles.rightContainer}>
                                {props?.item?.isOffert == 'offert' ?
                                    <Image
                                        style={styles.imageStyle}
                                        source={images.giftIcon}
                                    />
                                    : <Text
                                        adjustsFontSizeToFit
                                        numberOfLines={1}
                                        style={styles.textStyle}
                                    >{Number(props.item.price * props.item.quantity).toFixed(2)}</Text>
                                }
                            </View>
                        </View>
                        <>
                            {props?.item?.product_extra &&

                                props?.item?.product_extra.map((ingrdient, index) => {
                                    return (
                                        <View key={ingrdient.id}>
                                            <CartProductExtraItem
                                                ingrdient={ingrdient}
                                                index={index}
                                            />
                                        </View>
                                    )
                                })
                            }
                            {props?.item?.ingrdients &&

                                props?.item?.ingrdients.map((ingrdient, index) => {
                                    return (
                                        <View key={ingrdient.id}>
                                            <CartProductExtraItem
                                                ingrdient={ingrdient}
                                                index={index}
                                            />
                                        </View>
                                    )
                                })
                            }
                            {props?.item?.instructions &&

                                props?.item?.instructions.map((ingrdient, index) => {
                                    return (
                                        <View key={ingrdient.id}>
                                            <CartProductExtraItem
                                                ingrdient={ingrdient}
                                                index={index}
                                            />
                                        </View>
                                    )
                                })
                            }
                            {props?.item?.comments &&

                                props?.item?.comments.map((ingrdient, index) => {
                                    return (
                                        <View key={ingrdient.id}>
                                            <CartProductExtraItem
                                                ingrdient={ingrdient}
                                                index={index}
                                            />
                                        </View>
                                    )
                                })
                            }
                            {props?.item?.special_notes &&

                                <View key={props?.item?.special_note}>
                                    <CartProductExtraItem
                                        ingrdient={
                                            {
                                                quantity: 1,
                                                comment_description: props?.item?.special_notes,
                                                icons: "✒"
                                            }
                                        }
                                        index={1}
                                    />
                                </View>

                            }

                        </>
                    </>
            }
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
    },
    imageStyle: {
        height: HEIGHT_BASE_RATIO(35),
        width: WIDTH_BASE_RATIO(35),
        resizeMode: "contain",
        tintColor: Colors.black

    },

})

export default React.memo(CartProductItem);