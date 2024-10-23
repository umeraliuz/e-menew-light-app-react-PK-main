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
import CustomSwitch from "./CustomSwitch";

const OffertModel = (props) => {

    const { user } = useSelector((state) => state.auth);
    const { t } = useTranslation()
    const [toggle, setToggle] = useState(false)
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(1);
    const [items, setItems] = useState([])
    const [isClient, setIsClient] = useState(true)
    let disabled = false//props?.item?.quantity == 0;
    useEffect(() => {

        let qty = Number(props.item.quantity) + Number(props?.item?.freeQuantity ? props?.item?.freeQuantity : 0)
        // console.log(" Number(props?.item?.freeQuantity)", qty);
        let quantityLsit = []

        for (let i = 0; i < qty; i++) {
            let obj = {}

            obj.label = i + 1
            obj.value = i + 1
            quantityLsit.push(obj)

        }

        setItems(quantityLsit)
        props.setText(String(value))
    }, [])
    const onToggle = (value) => {

        setIsClient(value)

    }
    let object = {
        noOfQuntity: value,
        type: isClient ? "Client" : "Personel"
    }
    let qty = Number(props.item.quantity) + Number(props?.item?.freeQuantity ? props?.item?.freeQuantity : 0) - value
    props.setText(String(qty))

    return (

        <View style={[styles.alertContainer, { paddingBottom: HEIGHT_BASE_RATIO(43) }]}>
            <View style={styles.modelHeader}>

                <View />

                <Text style={styles.titleStyle}>
                    {`${t('OFFERT')}  `}
                    {props?.item?.product_name &&
                        <Text style={styles.titleStyle}>{`${props.item.product_name}`}
                            <Text
                                numberOfLines={1}
                                style={[styles.attributeText]}>
                                {` (${props?.item?.product_attribute})`}
                            </Text>
                        </Text>
                    }</Text>

                <TouchableOpacity

                    style={{ alignSelf: "flex-end" }}
                    onPress={() => {
                        //  props.setPaymentType(null)
                        props.close()
                    }}
                >
                    <Image
                        source={images.whiteCross}
                        style={styles.imageStyle}
                    />
                </TouchableOpacity>

            </View>
            <CustomSwitch
                //disabled={true}
                label1={t("CLIENT")}
                label2={t("PERSONAL")}
                onToggle={onToggle}
                containerStyle={{
                    width: WIDTH_BASE_RATIO(480),
                    marginTop: HEIGHT_BASE_RATIO(47)
                }}
                ButtonContainerStyle={{
                    width: WIDTH_BASE_RATIO(240),

                }}

            />
            <View >
                <Text style={styles.inputTitle}>
                    {t('SELECT_QUINTITY')}</Text>

                <DropDownPicker
                    open={open}
                    value={value}
                    items={items}
                    setOpen={setOpen}
                    setValue={setValue}
                    setItems={setItems}
                    listMode="SCROLLVIEW"
                    scrollViewProps={{
                        nestedScrollEnabled: true,
                    }}

                    style={{

                        borderRadius: WIDTH_BASE_RATIO(15),
                        borderColor: Colors.borderColor,
                        height: HEIGHT_BASE_RATIO(80),
                        width: WIDTH_BASE_RATIO(500),
                        minHeight: HEIGHT_BASE_RATIO(80),
                        borderColor: Colors.borderColor,

                    }}

                    dropDownMaxHeight={400}
                    dropDownContainerStyle={{

                        width: WIDTH_BASE_RATIO(500),
                        backgroundColor: Colors.white,
                        borderRadius: WIDTH_BASE_RATIO(15),
                        borderColor: Colors.borderColor,
                        // paddingHorizontal: WIDTH_BASE_RATIO(0),
                        position: 'relative',
                        top: 0
                    }}
                    zIndex={9999}
                />

            </View>

            <TouchableOpacity
                disabled={disabled}
                onPress={() => props.onPressDone(object)}
                style={[styles.doneButtonStyle, {
                    backgroundColor: disabled ? Colors.borderColor : Colors.primaryColor,
                    zIndex: 0
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
        height: HEIGHT_BASE_RATIO(77),
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
        height: HEIGHT_BASE_RATIO(77),
        width: WIDTH_BASE_RATIO(479),
        backgroundColor: Colors.transparent,
        justifyContent: "center",
        alignItems: "center",
        fontSize: FONT_SIZE(20),
        color: Colors.black,
        fontFamily: "Inter-Bold"
    },
    doneButtonStyle: {
        height: HEIGHT_BASE_RATIO(89),
        width: WIDTH_BASE_RATIO(479),
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
        fontSize: FONT_SIZE(25),
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

export default React.memo(OffertModel);