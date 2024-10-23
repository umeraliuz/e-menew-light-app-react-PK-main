import React from "react";
import { useTranslation } from "react-i18next";
import { TouchableOpacity, StyleSheet, Image, Text, View } from "react-native"
import { useSelector } from "react-redux";
import { IMAGE_BASE_URL } from "../api/baseUrl";
import { images } from "../assets/images";
import { Colors } from "../constant/color";
import { FONT_SIZE, HEIGHT_BASE_RATIO, WIDTH_BASE_RATIO } from "../constant/sizeHelper";
import { Strings } from "../constant/string";
import CustomDropDown from "./CustomDropDown";

const CartVeiw = (props) => {
    const { discountObject } = useSelector((state) => state.cart);

    const { user } = useSelector((state) => state.auth);
    const { t } = useTranslation()
    const paymentList = [
        {
            label: t("CASH"),
            value: "cash"
        },
        {
            label: t("CARD"),
            value: "card"
        },
        {
            label: t("CUSTOMER_ACCOUNT"),
            value: "customer_account"
        }
    ]
    let disabled = props.disabled

    return (

        <View

            style={[styles.container]}>
            <View style={styles.textContainer}>
                <Text
                    style={styles.textTitleStyle}
                >{t("SUB_TOTAL")}</Text>
                <Text

                    style={styles.textValueStyle}
                >{`${user.currency}  ${Number(props.subTotal).toFixed(2)}`}</Text>
            </View>
            {/* <View style={styles.textContainer}>
                <Text
                    style={styles.textTitleStyle}
                >{t("GST")}</Text>
                <Text
                    style={styles.textValueStyle}
                >{`${user.currency}  ${props.gst.toFixed(2)}`}</Text>
            </View> */}
            {props.discountAmount > 0 &&
                <View style={styles.textContainer}>
                    <Text
                        style={styles.textTitleStyle}
                    >{`${t("Discount")} `}
                        <Text style={{ color: Colors.borderColor }}>
                            {`(${discountObject?.DiscountType?.toLowerCase()} `}{`${discountObject.discount}`}{`${discountObject?.DiscountType == "Rabais" ? "" : "%"})`}
                        </Text>
                    </Text>
                    <Text
                        style={styles.textValueStyle}
                    >

                        {`${user.currency}  ${Number(props.discountAmount).toFixed(2)}`}

                    </Text>
                    <TouchableOpacity
                        style={{
                            position: "absolute",
                            right: WIDTH_BASE_RATIO(-40),
                        }}
                        onPress={() => props.removeDiscount()}
                    >
                        <Image
                            source={images.deleteIcon}
                            style={styles.imageStyle}
                        />
                    </TouchableOpacity>
                </View>}

            <View style={styles.textContainer}>
                <Text
                    style={styles.textTitleStyle}
                >{t("TOTAL")}</Text>
                <Text
                    style={[styles.textValueStyle, { fontSize: HEIGHT_BASE_RATIO(30) }]}
                >{`${user.currency}  ${Number(props.totalPrice - props.discountAmount).toFixed(2)}`}</Text>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <TouchableOpacity
                    disabled={disabled}
                    onPress={() => props.orderPlace()}
                    style={[styles.confirmButtonStyle, disabled && { backgroundColor: Colors.borderColor }]}
                >
                    <Text style={[styles.confirmText, disabled && { color: Colors.borderColor }]}>
                        {t("SEND_ORDER")}
                    </Text>
                </TouchableOpacity>

                <CustomDropDown
                    dropDownWidth={WIDTH_BASE_RATIO(280)} //option
                    dropDownHeight={HEIGHT_BASE_RATIO(89)}
                    items={paymentList}
                    setItems={(item) => console.log("setItems", item)}
                    placeholderTitle={t('PAY_SEND_ORDER')}
                    setValue={props.setPaymentType}
                    value={props.paymentType}
                    onChangeValue={(item) => console.log("onChangeValue", item)}
                    open={() => { }}
                    setOpen={() => { }}
                    disabled={disabled}

                />
                {/* <TouchableOpacity
                    onPress={props.orderPlaceAndPay}
                    style={styles.confirmButtonStyle}
                >
                    <Text style={styles.confirmText}>
                        {t("PAY_SEND_ORDER")}
                    </Text>
                </TouchableOpacity> */}
            </View>
            {/* <TouchableOpacity
                disabled={disabled}
                onPress={() => props.printerRecipt()}
                style={[styles.confirmButtonStyle, disabled && { backgroundColor: Colors.borderColor }]}
            >
                <Text style={[styles.confirmText, disabled && { color: Colors.borderColor }]}>
                    {t("Print Inovice")}
                </Text>
            </TouchableOpacity> */}
        </View>
    )

}

const styles = StyleSheet.create({
    container: {
        // height: HEIGHT_BASE_RATIO(348),
        // width: WIDTH_BASE_RATIO(690),
        backgroundColor: Colors.white,
        borderRadius: HEIGHT_BASE_RATIO(20),
        paddingHorizontal: WIDTH_BASE_RATIO(55),
        paddingTop: HEIGHT_BASE_RATIO(46),
        paddingBottom: HEIGHT_BASE_RATIO(25),
        marginBottom: HEIGHT_BASE_RATIO(10)

    },
    textContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: HEIGHT_BASE_RATIO(30)
    },

    textTitleStyle: {
        fontSize: FONT_SIZE(25),
        color: Colors.black,
        fontFamily: "Inter-Bold"

    },
    imageStyle: {

        height: HEIGHT_BASE_RATIO(50),
        width: WIDTH_BASE_RATIO(30),
        tintColor: Colors.red,
        resizeMode: "contain",

    },
    textValueStyle: {
        fontSize: FONT_SIZE(20),
        color: Colors.black,
        fontFamily: "Inter-Bold"

    },
    confirmButtonStyle: {
        height: HEIGHT_BASE_RATIO(89),
        width: WIDTH_BASE_RATIO(280),
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Colors.primaryColor,
        borderRadius: HEIGHT_BASE_RATIO(10),
        // marginTop: HEIGHT_BASE_RATIO(10)

    },
    confirmText: {
        fontSize: FONT_SIZE(25),
        color: Colors.white,
        fontFamily: "Inter-Bold"
    }

})

export default React.memo(CartVeiw);