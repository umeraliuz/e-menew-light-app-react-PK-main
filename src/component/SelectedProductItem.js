import moment from "moment";
import React, { useState } from "react";
import { useSSR, useTranslation } from "react-i18next";
import { TouchableOpacity, StyleSheet, Image, Text, View, TextInput, FlatList } from "react-native"
import { images } from "../assets/images";
import { Colors } from "../constant/color";
import { FONT_SIZE, HEIGHT_BASE_RATIO, hp, WIDTH_BASE_RATIO, wp } from "../constant/sizeHelper";
import { Strings } from "../constant/string";
import SelectedProductExtraItem from "./SelectedProductExtraItem";

const SelectedProductItem = (props) => {

    const { t } = useTranslation()
    const [isfocus, setFocus] = useState(false)

    return (

        <>
            {props.type === "fixed" ?
                <View
                    style={[styles.container, { marginTop: HEIGHT_BASE_RATIO(15) }]}>
                    <View style={[styles.leftRightContainer, styles.fixedView]}>
                        <Text
                            style={[styles.textStyle, { color: Colors.white }]}
                        >{t("QUANTITY")}</Text>
                    </View>
                    <View style={[styles.centerContainer, styles.fixedView, { alignItems: "center" }]}>
                        <Text
                            style={[styles.textStyle, { color: Colors.white }]}
                        >{t("PRODUCTS")}</Text>
                    </View>
                    <View style={[styles.leftRightContainer, styles.fixedView]}>
                        <Text
                            style={[styles.textStyle, { color: Colors.white }]}
                        >{t("ACTION")}</Text>
                    </View>
                </View> :
                (props.item.is_paid == 3 || props?.item?.in_kitchen) ?
                    <>

                        <View
                            //onPress={() => props.onPressItem(props.index, props.item, "product")}
                            style={[styles.container]}>
                            <View style={[styles.leftRightContainer, styles.fixedView1, {
                                backgroundColor: props.item.is_paid == 3 ?
                                    Colors.lightGreen : Colors.yellow
                            }]}>
                                <Text
                                    numberOfLines={1}
                                    style={[styles.textStyle]}
                                >{props?.item?.quantity}</Text>
                            </View>
                            <View style={[styles.centerContainer, styles.fixedView1, {
                                backgroundColor: props.item.is_paid == 3 ?
                                    Colors.lightGreen : Colors.yellow
                            }]}>
                                {props?.item?.product_attribute ? <Text
                                    numberOfLines={1}
                                    style={[styles.textStyle]}
                                >
                                    {props?.item?.product_name}

                                    <Text
                                        numberOfLines={1}
                                        style={[styles.attributeText]}>
                                        {` (${props?.item?.product_attribute})  ${props?.item?.isDiscount
                                            ? `${props?.item?.discount} off` : ''}`}
                                    </Text>
                                </Text>
                                    :
                                    <Text
                                        numberOfLines={2}
                                        style={[styles.textStyle]}
                                    >
                                        {props?.item?.product_name}</Text>}
                            </View>
                            <TouchableOpacity
                                disabled={true}
                                onPress={() => props.onPressEdit(props.index, props.item)}
                                style={[styles.leftRightContainer, styles.fixedView1, {
                                    backgroundColor: props.item.is_paid == 3 ?
                                        Colors.lightGreen : Colors.yellow
                                }]}>
                                <Image
                                    style={[styles.imageStyle]}
                                    source={props?.item?.isOffert == "offert" ? images.giftIcon : images.blockIcon}
                                />
                            </TouchableOpacity>
                        </View>
                        <>
                            {props?.item?.product_extra &&
                                props?.item?.product_extra.map((ingrdient, index) => {
                                    return (
                                        <View key={ingrdient.id}>
                                            <SelectedProductExtraItem
                                                ingrdient={ingrdient}
                                                index={index}
                                                item={props.item}
                                                pIndex={props.index}
                                                deleteProductIngredient={props.deleteProductIngredient}
                                                onTextChange={props.onTextChange}
                                                onEndEditing={props.onEndEditing}
                                                is_paid
                                                in_kitchen={props?.item?.in_kitchen}

                                            />
                                        </View>
                                    )
                                })

                            }

                            {props?.item?.ingrdients &&

                                props?.item?.ingrdients.map((ingrdient, index) => {
                                    return (
                                        <View key={ingrdient.id}>
                                            <SelectedProductExtraItem
                                                ingrdient={ingrdient}
                                                index={index}
                                                item={props.item}
                                                pIndex={props.index}
                                                deleteProductIngredient={props.deleteProductIngredient}
                                                onTextChange={props.onTextChange}
                                                onEndEditing={props.onEndEditing}
                                                is_paid
                                                in_kitchen={props?.item?.in_kitchen}

                                            />
                                        </View>
                                    )
                                }
                                )

                            }
                            {props?.item?.instructions &&

                                props?.item?.instructions.map((ingrdient, index) => {
                                    return (
                                        <View key={ingrdient.id}>
                                            <SelectedProductExtraItem
                                                ingrdient={ingrdient}
                                                index={index}
                                                item={props.item}
                                                pIndex={props.index}
                                                deleteProductIngredient={props.deleteProductIngredient}
                                                onTextChange={props.onTextChange}
                                                onEndEditing={props.onEndEditing}
                                                is_paid
                                                in_kitchen={props?.item?.in_kitchen}

                                            />
                                        </View>
                                    )
                                }
                                )

                            }
                            {props?.item?.comments &&

                                props?.item?.comments.map((ingrdient, index) => {
                                    return (
                                        <View key={ingrdient.id}>
                                            <SelectedProductExtraItem
                                                ingrdient={ingrdient}
                                                index={index}
                                                item={props.item}
                                                pIndex={props.index}
                                                deleteProductIngredient={props.deleteProductIngredient}
                                                onTextChange={props.onTextChange}
                                                onEndEditing={props.onEndEditing}
                                                is_paid
                                                in_kitchen={props?.item?.in_kitchen}

                                            />
                                        </View>
                                    )
                                }
                                )

                            }
                            {props?.item?.special_notes &&
                                <View key={props?.item?.special_notes}>
                                    <SelectedProductExtraItem
                                        ingrdient={{
                                            quantity: 1,
                                            comment_description: props?.item?.special_notes,
                                            icons: "✒"
                                        }}
                                        index={1}
                                        item={props.item}
                                        pIndex={props.index}
                                        deleteProductIngredient={props.deleteProductIngredient}
                                        onTextChange={props.onTextChange}
                                        onEndEditing={props.onEndEditing}
                                        is_paid
                                        in_kitchen={props?.item?.in_kitchen}

                                    />
                                </View>
                            }
                        </>

                    </>
                    :
                    <>
                        <View
                            //onPress={() => props.onPressItem(props.index, props.item, "product")}
                            style={[styles.container,]}>
                            <View style={[styles.leftRightContainer, { backgroundColor: props.currentProductindex == props.index ? Colors.highlightColor : Colors.white }]}>
                                <TextInput
                                    editable={props?.item?.isOffert !== 'offert'}
                                    keyboardType="decimal-pad"
                                    onChangeText={text =>
                                        props.onTextChange(text, "quantity")
                                    }
                                    onEndEditing={text => {
                                        props.onEndEditing(props.item)
                                        setFocus(false);
                                    }}
                                    style={[
                                        styles.textStyle,
                                        styles.textInputStyle,
                                        { color: props.currentProductindex == props.index ? Colors.white : Colors.black }
                                    ]}

                                    onFocus={() => {
                                        setFocus(true);

                                    }}

                                    defaultValue={String(props?.item?.quantity)}
                                    value={isfocus ? props.text : String(props?.item?.quantity)}

                                />
                                {/* <Text
                                numberOfLines={1}
                                style={styles.textStyle}
                            >{props?.item?.quantity}</Text> */}
                            </View>
                            <View style={[styles.centerContainer, { backgroundColor: props.currentProductindex == props.index ? Colors.highlightColor : Colors.white }]}>
                                {props?.item?.product_attribute ? <Text
                                    numberOfLines={1}
                                    style={[styles.textStyle, { color: props.currentProductindex == props.index ? Colors.white : Colors.black }]}
                                >
                                    {props?.item?.product_name}

                                    <Text
                                        numberOfLines={1}
                                        style={[styles.attributeText, { color: props.currentProductindex == props.index ? Colors.white : Colors.black }]}>
                                        {` (${props?.item?.product_attribute})  ${props?.item?.isOffert == "offert" ?
                                            `offert` :
                                            props?.item?.isDiscount
                                                ? `${props?.item?.discount} off` : ''}`}
                                    </Text>
                                </Text>
                                    :
                                    <Text
                                        numberOfLines={2}
                                        style={styles.textStyle}>
                                        {props?.item?.product_name}</Text>}
                            </View>
                            <View style={[styles.leftRightContainer, { backgroundColor: props.currentProductindex == props.index ? Colors.highlightColor : Colors.white, flexDirection: "row", justifyContent: "space-around" }]}>
                                <TouchableOpacity
                                    onPress={() => props.onPressEdit(props.index, props.item, "product")}
                                >
                                    <Image
                                        style={[styles.imageStyle, {
                                            tintColor: props?.item?.isOffert == 'offert' ? Colors.red :
                                                props.currentProductindex == props.index ? Colors.white : Colors.black
                                        }]}
                                        source={props?.item?.isOffert == "offert" ? images.deleteIcon : images.editIcon}
                                    />
                                </TouchableOpacity>
                                {props?.item?.isOffert == "offert" && <TouchableOpacity
                                    disabled={true}
                                    onPress={() => props.onPressEdit(props.index, props.item, "product")}
                                >
                                    <Image
                                        style={[styles.imageStyle]}
                                        source={images.giftIcon}
                                    />
                                </TouchableOpacity>}
                            </View>
                        </View>
                        <>
                            {props?.item?.product_extra &&
                                props?.item?.product_extra.map((ingrdient, index) => {
                                    return (
                                        <View key={ingrdient.id}>
                                            <SelectedProductExtraItem
                                                ingrdient={ingrdient}
                                                index={index}
                                                item={props.item}
                                                pIndex={props.index}
                                                deleteProductIngredient={props.deleteProductIngredient}
                                                onTextChange={props.onTextChange}
                                                onEndEditing={props.onEndEditing}
                                                ingrdientExtraOffert={props.ingrdientExtraOffert}

                                            />
                                        </View>
                                    )
                                })

                            }

                            {props?.item?.ingrdients &&

                                props?.item?.ingrdients.map((ingrdient, index) => {
                                    return (
                                        <View key={ingrdient.id}>
                                            <SelectedProductExtraItem
                                                ingrdient={ingrdient}
                                                index={index}
                                                item={props.item}
                                                pIndex={props.index}
                                                deleteProductIngredient={props.deleteProductIngredient}
                                                onTextChange={props.onTextChange}
                                                onEndEditing={props.onEndEditing}

                                            />
                                        </View>
                                    )
                                }
                                )

                            }
                            {props?.item?.instructions &&

                                props?.item?.instructions.map((ingrdient, index) => {
                                    return (
                                        <View key={ingrdient.id}>
                                            <SelectedProductExtraItem
                                                ingrdient={ingrdient}
                                                index={index}
                                                item={props.item}
                                                pIndex={props.index}
                                                deleteProductIngredient={props.deleteProductIngredient}
                                                onTextChange={props.onTextChange}
                                                onEndEditing={props.onEndEditing}

                                            />
                                        </View>
                                    )
                                }
                                )

                            }
                            {props?.item?.comments &&

                                props?.item?.comments.map((ingrdient, index) => {
                                    return (
                                        <View key={ingrdient.id}>
                                            <SelectedProductExtraItem
                                                ingrdient={ingrdient}
                                                index={index}
                                                item={props.item}
                                                pIndex={props.index}
                                                deleteProductIngredient={props.deleteProductIngredient}
                                                onTextChange={props.onTextChange}
                                                onEndEditing={props.onEndEditing}

                                            />
                                        </View>
                                    )
                                }
                                )

                            }
                            {props?.item?.special_notes &&
                                <View key={props?.item?.special_notes}>
                                    <SelectedProductExtraItem
                                        ingrdient={{
                                            quantity: 1,
                                            comment_description: props?.item?.special_notes,
                                            icons: "✒",
                                            isSpecialNotes: true
                                        }}
                                        index={1}
                                        item={props.item}
                                        pIndex={props.index}
                                        deleteProductIngredient={props.deleteProductIngredient}
                                        onTextChange={props.onTextChange}
                                        onEndEditing={props.onEndEditing}

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

export default React.memo(SelectedProductItem);