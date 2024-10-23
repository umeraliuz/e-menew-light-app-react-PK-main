import moment from "moment";
import React, { useState } from "react";
import { useSSR, useTranslation } from "react-i18next";
import { TouchableOpacity, StyleSheet, Image, Text, View, TextInput, FlatList } from "react-native"
import { images } from "../assets/images";
import { Colors } from "../constant/color";
import { FONT_SIZE, HEIGHT_BASE_RATIO, hp, WIDTH_BASE_RATIO, wp } from "../constant/sizeHelper";
import { Strings } from "../constant/string";

const SelectedProductExtraItem = (props) => {
    const { t } = useTranslation()
    const [isfocus, setFocus] = useState(false)
    // console.log("props?.item?.in_kitchen && props?.item?.in_kitchen != 0", (props?.item?.in_kitchen != 0));

    return (

        <>
            <View
                key={props.ingrdient.id}
                //onPress={() => props.onPressItem(props.index, props.item, "product")}
                style={[styles.container, { marginTop: HEIGHT_BASE_RATIO(5) }]}>
                <View style={[styles.leftRightContainer, { backgroundColor: Colors.transparent, borderWidth: 0 }]}>
                    <TextInput
                        editable={(!props.ingrdient?.icons || props.ingrdient?.icons == "+") && !props.is_paid && props?.ingrdient?.isOffert !== "offert"}
                        keyboardType="numeric"
                        onChangeText={text =>
                            props.onTextChange(text, props.item)
                        }
                        onEndEditing={text => {
                            props.onEndEditing(props.item, props.ingrdient)
                            setFocus(false);
                        }}
                        style={[
                            styles.textStyle,
                            styles.textInputStyle, {
                                color: props.item.is_paid == 3 ? Colors.lightGreen : (!props.ingrdient?.icons || props.ingrdient?.icons == "+") ?
                                    Colors.black :
                                    Colors.borderColor
                            }
                        ]}

                        onFocus={() => {
                            setFocus(true);

                        }}

                        defaultValue={String(props.ingrdient?.quantity)}
                        value={!isfocus && String(props.ingrdient?.quantity)}

                    />
                    {/* <Text
                                 numberOfLines={1}
                                 style={styles.textStyle}
                             >{props?.item?.quantity}</Text> */}
                </View>
                <View style={[styles.centerContainer, { backgroundColor: Colors.transparent, borderWidth: 0 }]}>

                    <Text
                        numberOfLines={2}
                        style={[styles.textStyle, { color: props.item.is_paid == 3 ? Colors.lightGreen : Colors.black }]}>
                        {`${props.ingrdient?.icons} ${props.ingrdient?.pic_name ?
                            props.ingrdient?.pic_name :
                            props.ingrdient?.comment_description ?
                                props.ingrdient?.comment_description :
                                props.ingrdient?.extra_name ?
                                    props.ingrdient?.extra_name :
                                    props.ingrdient?.ingredient_name}`}</Text>
                </View>
                {(Boolean(props?.item?.in_kitchen && props?.item?.in_kitchen != 0) || props.item.is_paid == 3) ?
                    <View style={[styles.leftRightContainer, {
                        flexDirection: "row",
                        backgroundColor: Colors.transparent,
                        borderWidth: 0
                    }]}>

                        <TouchableOpacity
                            disabled
                            onPress={() => props.deleteProductIngredient(props.pIndex, props.item, props.ingrdient, props.index)}
                            style={{}}>
                            <Image
                                style={[styles.imageStyle, {
                                    tintColor: props.item.is_paid == 3 ? Colors.lightGreen :
                                        (props.item.in_kitchen && props.item.in_kitchen != 0) ?
                                            Colors.black
                                            : Colors.red
                                }]}
                                source={(props?.ingrdient?.isOffert == "offert") ? images.giftIcon : images.blockIcon}
                            />
                        </TouchableOpacity>

                    </View> : <View style={[styles.leftRightContainer, {
                        flexDirection: "row",
                        justifyContent: "space-around",
                        backgroundColor: Colors.transparent,
                        borderWidth: 0
                    }]}>

                        <TouchableOpacity
                            disabled={Boolean(props?.item?.in_kitchen && props?.item?.in_kitchen != 0)}
                            onPress={() => props.deleteProductIngredient(props.pIndex, props.item, props.ingrdient, props.index)}
                            style={{}}>
                            <Image
                                style={[styles.imageStyle, {
                                    tintColor: props.item.is_paid == 3 ? Colors.lightGreen :
                                        (props.item.in_kitchen && props.item.in_kitchen != 0) ?
                                            Colors.black
                                            : Colors.red
                                }]}
                                source={images.deleteIcon}
                            />
                        </TouchableOpacity>
                        {props.ingrdient?.icons == "+" ? <TouchableOpacity
                            disabled={props?.ingrdient?.isOffert == "offert"}
                            onPress={() => props.ingrdientExtraOffert(props.pIndex, props.item, props.ingrdient, props.index)}
                            style={{}}>
                            <Image
                                style={[styles.imageStyle, {
                                    tintColor:
                                        Colors.black

                                }]}
                                source={
                                    props.ingrdient.isOffert == "offert" ?
                                        images.giftIcon
                                        : images.editIcon}
                            />
                        </TouchableOpacity> : <View style={styles.imageStyle} />}
                    </View>}
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
    leftRightContainer: {
        height: HEIGHT_BASE_RATIO(72),
        width: WIDTH_BASE_RATIO(123),
        backgroundColor: Colors.white,
        borderRadius: HEIGHT_BASE_RATIO(10),
        borderWidth: HEIGHT_BASE_RATIO(2),
        borderColor: Colors.borderColor,
        justifyContent: "center",
        alignItems: "center",
    },
    centerContainer: {
        height: HEIGHT_BASE_RATIO(72),
        width: WIDTH_BASE_RATIO(414),
        backgroundColor: Colors.white,
        borderRadius: HEIGHT_BASE_RATIO(10),
        borderWidth: HEIGHT_BASE_RATIO(2),
        borderColor: Colors.borderColor,
        justifyContent: "center",
        paddingStart: WIDTH_BASE_RATIO(10)
        // alignItems: "center",
    },
    imageStyle: {
        height: HEIGHT_BASE_RATIO(35),
        width: WIDTH_BASE_RATIO(35),
        resizeMode: "contain",
        tintColor: Colors.black

    },
    textStyle: {
        fontSize: FONT_SIZE(25),
        color: Colors.black,
        fontFamily: "Inter-Bold",

    },
    fixedView: {
        borderWidth: HEIGHT_BASE_RATIO(0),
        backgroundColor: Colors.darkYellow
    },
    fixedView1: {
        borderWidth: HEIGHT_BASE_RATIO(0),
        backgroundColor: Colors.lightGreen
    },
    attributeText: {
        fontSize: FONT_SIZE(20),
        color: Colors.borderColor,
        fontFamily: "Inter-Bold"
    },
    textInputStyle: {
        height: HEIGHT_BASE_RATIO(72),
        paddingTop: 0,
        paddingBottom: 0,
        textAlign: 'center',
        textAlignVertical: 'center',
    }

})

export default React.memo(SelectedProductExtraItem);