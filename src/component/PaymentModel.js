import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { TextInput, TouchableOpacity, StyleSheet, Image, Text, View, Keyboard, } from "react-native"
import { images } from "../assets/images";
import { Colors } from "../constant/color";
import { FONT_SIZE, HEIGHT_BASE_RATIO, hp, WIDTH_BASE_RATIO, wp } from "../constant/sizeHelper";
import { Strings } from "../constant/string";
import CustomDropDown from "./CustomDropDown";

import DropDownPicker from 'react-native-dropdown-picker';
import { useSelector } from "react-redux";

const PaymentModel = (props) => {

    const { currencyList, terminalList, customerList } = useSelector((state) => state.cart);
    const { user } = useSelector((state) => state.auth);
    const { t } = useTranslation()
    const [toggle, setToggle] = useState(false)
    const [open, setOpen] = useState(false);
    console.log("customerList", customerList);

    let dropdownList = props.paymentType === "card" ? terminalList : props.paymentType === "cash" ? currencyList : customerList
    let val = props.paymentType === "cash" ? user.currency_id : (props.paymentType === "card" && terminalList) ?
        terminalList[0]?.value :
        terminalList ?
            customerList[0]?.value : ""
    const [value, setValue] = useState(val);

    const [items, setItems] = useState(dropdownList);

    let isTipGreater = props.amountTip > 0 ? props.amountTip > (props.amount - props.totalPrice) : false
    let disabled = props.paymentType === "cash" ? (isTipGreater || props?.amount?.length < 1 || !value || (Number(props.amount) < Number(props.totalPrice))) : false
    useEffect(() => {

    }, [])
    return (

        <View style={styles.alertContainer}>
            <View style={styles.modelHeader}>

                <View />

                <Text style={styles.titleStyle}>
                    {`${t(props.paymentType.toUpperCase())}  ${t('TOTAL')} ${t('PRICE')} (${props.totalPrice})`}</Text>

                <TouchableOpacity

                    style={{ alignSelf: "flex-end" }}
                    onPress={() => {
                        props.setPaymentType(null)
                        props.close()
                    }}
                >
                    <Image
                        source={images.whiteCross}
                        style={styles.imageStyle}
                    />
                </TouchableOpacity>

            </View>
            <View style={{ zIndex: 99 }}>
                <Text style={styles.inputTitle}>
                    {props.paymentType === "card" ?
                        t('SELECT_TERMINAL') :
                        props.paymentType === "cash" ?
                            t('CURRENCY') :
                            t('SELECT_SERVICE_PROVIDER')}</Text>

                <DropDownPicker
                    open={open}
                    value={value}
                    items={items}
                    setOpen={setOpen}
                    setValue={setValue}
                    setItems={setItems}
                    listMode={"SCROLLVIEW"}
                    scrollViewProps={{
                        nestedScrollEnabled: true,
                    }}
                    placeholder={props.paymentType === "card" ?
                        t('SELECT_TERMINAL') :
                        props.paymentType === "cash" ?
                            t('CURRENCY') :
                            t('SELECT_SERVICE_PROVIDER')}
                    style={{

                        borderRadius: WIDTH_BASE_RATIO(15),
                        borderColor: Colors.borderColor,
                        height: HEIGHT_BASE_RATIO(80),
                        width: WIDTH_BASE_RATIO(500),
                        minHeight: HEIGHT_BASE_RATIO(80),
                        borderColor: Colors.borderColor,
                        // marginTop: HEIGHT_BASE_RATIO(13),
                    }}

                    dropDownMaxHeight={400}
                    dropDownContainerStyle={{
                        width: WIDTH_BASE_RATIO(500),
                        backgroundColor: Colors.white,
                        borderRadius: WIDTH_BASE_RATIO(15),
                        borderColor: Colors.borderColor,
                        // paddingHorizontal: WIDTH_BASE_RATIO(0),
                        zIndex: 9999,
                        position: 'relative',
                        top: 0
                    }}
                    zIndex={9999}
                    elevation={true}

                />

            </View>

            <View>
                <Text style={styles.inputTitle}>{t('AMOUNT_TO_PAY')}</Text>
                <View
                    style={[styles.inputContainer, props.containerStyle && props.containerStyle]}>

                    <TextInput
                        style={styles.textinputStyle}
                        placeholder={props.placeholder}
                        placeholderTextColor={Colors.borderColor}
                        editable={props.paymentType === "cash"}
                        onChangeText={(text) => props.onTextChange(text, 'amount')}
                        keyboardType="number-pad"
                        value={props.paymentType === "cash" ? props.amount : String(props.totalPrice)}
                        autoFocus={true}
                        cursorColor={Colors.primaryColor}

                    />
                </View>
            </View>
            {props.paymentType === "cash" && user.tips_status == 1 && <View>
                <Text style={styles.inputTitle}>{t('TIPS_RECEIVED')}</Text>
                <View
                    style={[styles.inputContainer, props.containerStyle && props.containerStyle]}>

                    <TextInput
                        style={styles.textinputStyle}
                        placeholder={props.placeholder}
                        placeholderTextColor={Colors.borderColor}

                        onChangeText={(text) => props.onTextChange(text, 'tips')}
                        keyboardType="number-pad"
                        value={props.amountTip}
                        cursorColor={Colors.primaryColor}

                    />

                </View>

            </View>}
            {isTipGreater &&
                <Text style={[styles.titleStyle, { color: Colors.darkYellow }]}>{t('TIP_AMOUNT_EXCEED')}</Text>
            }
            <TouchableOpacity
                disabled={disabled}
                onPress={() => props.onPressDone(value)}
                style={[styles.doneButtonStyle, {
                    backgroundColor: disabled ? Colors.borderColor : Colors.primaryColor
                }]}>
                <Text style={[styles.doneText, {
                    color: disabled ? Colors.borderColor : Colors.white
                }]}>
                    {props.buttonName}</Text>
            </TouchableOpacity>
        </View>

    )
}

const styles = StyleSheet.create({
    container: {

    },
    alertContainer: {

        //height: HEIGHT_BASE_RATIO(361),
        width: WIDTH_BASE_RATIO(690),
        backgroundColor: Colors.modelBackgroundColor,
        borderRadius: HEIGHT_BASE_RATIO(20),
        borderColor: Colors.borderColor,
        paddingBottom: HEIGHT_BASE_RATIO(43),

        alignItems: "center",
        //justifyContent: 'center',

    },

    inputContainer: {
        flexDirection: "row",
        height: HEIGHT_BASE_RATIO(80),
        backgroundColor: Colors.white,
        borderRadius: HEIGHT_BASE_RATIO(12),
        borderWidth: HEIGHT_BASE_RATIO(2),
        borderColor: Colors.borderColor,
        alignItems: "center",
        justifyContent: 'space-between',
        paddingHorizontal: WIDTH_BASE_RATIO(1),
        marginTop: HEIGHT_BASE_RATIO(13),
    },

    iconViewStlye: {
        height: HEIGHT_BASE_RATIO(77),
        width: WIDTH_BASE_RATIO(40),
        backgroundColor: Colors.transparent,
        justifyContent: "center",
        alignItems: "center",
    },
    iconsStlye: {
        height: HEIGHT_BASE_RATIO(23),
        width: WIDTH_BASE_RATIO(23),

    },
    textinputStyle: {
        height: HEIGHT_BASE_RATIO(80),
        width: WIDTH_BASE_RATIO(500),
        backgroundColor: Colors.transparent,
        justifyContent: "center",
        alignItems: "center",
        fontSize: FONT_SIZE(20),
        color: Colors.black,
        fontFamily: "Inter-Bold"
    },
    doneButtonStyle: {
        height: HEIGHT_BASE_RATIO(89),
        width: WIDTH_BASE_RATIO(500),
        backgroundColor: Colors.primaryColor,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: HEIGHT_BASE_RATIO(10),
        //alignSelf: "flex-end",
        marginTop: HEIGHT_BASE_RATIO(21)

    },
    titleStyle: {
        fontSize: FONT_SIZE(25),
        color: Colors.white,
        fontFamily: "Inter-Bold",
        // alignSelf: "flex-start",
        // marginBottom: HEIGHT_BASE_RATIO(20)
    },
    inputTitle: {
        fontSize: FONT_SIZE(16),
        color: Colors.black,
        fontFamily: "Inter-Bold",
        marginTop: HEIGHT_BASE_RATIO(13)
    },
    modelHeader: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: Colors.primaryColor,
        paddingHorizontal: WIDTH_BASE_RATIO(27),
        paddingVertical: HEIGHT_BASE_RATIO(16),
        borderTopLeftRadius: HEIGHT_BASE_RATIO(20),
        borderTopRightRadius: HEIGHT_BASE_RATIO(20),
        marginBottom: HEIGHT_BASE_RATIO(34)
    },
    imageStyle: {
        height: WIDTH_BASE_RATIO(55),
        width: WIDTH_BASE_RATIO(55),
        resizeMode: "contain",

    },
    doneText: {
        fontSize: FONT_SIZE(25),
        color: Colors.white,
        fontFamily: "Inter-Bold",
        // alignSelf: "flex-start",

    }

})

export default React.memo(PaymentModel);