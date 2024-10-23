import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { TextInput, TouchableOpacity, StyleSheet, Image, Text, View, FlatList, ActivityIndicator, } from "react-native"
import { useDispatch, useSelector } from "react-redux";
import { images } from "../assets/images";
import { Colors } from "../constant/color";
import { FONT_SIZE, HEIGHT_BASE_RATIO, hp, WIDTH_BASE_RATIO, wp } from "../constant/sizeHelper";
import { Strings } from "../constant/string";
import { updateMainTableTitle, updateSplitTableTitle } from "../redux";
import PromptAlert from "./PromptAlert";

const SplitOrderList = (props) => {
    const { t } = useTranslation()
    const [isEdt, setisEdit] = useState(false)
    const [editItem, setEditItem] = useState({})
    const { user } = useSelector((state) => state.auth);
    const [text, setText] = useState('')

    const dispatch = useDispatch()
    useEffect(() => {

    }, [])
    const onPressEdit = (idx, itm) => {
        itm.index = idx
        setisEdit(true)
        setEditItem(itm)
        let text = itm.title ? String(itm.title) : itm.invoice_title
        setText(text)
    }

    const onTextchange = (text) => {
        setText(text)
    }
    const onTitleChange = () => {

        if (text.length > 0) {
            let data = {
                "order_id": editItem?.index == 0 ? editItem.id : 0,
                "sub_order_id": editItem?.index == 0 ? 0 : editItem.id,
                "title": text
            }
            if (editItem?.index == 0) {
                editItem.title = text
                dispatch(updateMainTableTitle(data))
            } else {
                editItem.invoice_title = text
                dispatch(updateSplitTableTitle(data))
            }

            setText('')
        }
        setisEdit(false)
    }
    const renderItem = ({ item, index }) => {
        //   console.log("item..", item);
        return (
            <>
                <View style={{ flexDirection: "row", justifyContent: "center" }}>
                    <TouchableOpacity
                        onPress={() => props.getSplitOrderDetail(index, item)}
                        style={[styles.doneButtonStyle, { backgroundColor: item?.paid ? Colors.lightGreen : Colors.darkYellow }]}>
                        <Text style={styles.doneText}>{(index == 0 && !item.title) ?
                            "main" :
                            item.title ?
                                item.title :
                                item.invoice_title
                                    ?
                                    item.invoice_title
                                    : index
                        }</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => onPressEdit(index, item)}
                        style={[styles.edtButtonStyle, { backgroundColor: item?.paid ? Colors.lightGreen : Colors.darkYellow }]}>
                        <Image
                            style={styles.imageStyle2}
                            source={images.editIcon}
                        />
                    </TouchableOpacity>
                </View>
            </>

        )

    }
    return (
        <>

            <View style={styles.alertContainer}>
                <View style={styles.modelHeader}>

                    <View />

                    <Text style={styles.titleStyle}>{t('SPLIT_ORDER_LIST')}</Text>

                    <TouchableOpacity

                        style={{ alignSelf: "flex-end" }}
                        onPress={() => props.close()}
                    >
                        <Image
                            source={images.whiteCross}
                            style={styles.imageStyle}
                        />
                    </TouchableOpacity>

                </View>
                {props.isLoading ?
                    <ActivityIndicator
                        size={'large'}
                        color={Colors.primaryColor}
                    />

                    : <>
                        <FlatList

                            style={{ borderBottomStartRadius: HEIGHT_BASE_RATIO(20), borderBottomEndRadius: HEIGHT_BASE_RATIO(20) }}
                            data={props.splitOrderList
                            }
                            contentContainerStyle={{
                                paddingTop: HEIGHT_BASE_RATIO(10),
                                //paddingBottom: HEIGHT_BASE_RATIO(150)
                            }}
                            ListEmptyComponent={() => {
                                return (
                                    <Text style={{ alignSelf: "center" }}>{t("NO_DATA_FOUND")}</Text>
                                )
                            }}
                            showsVerticalScrollIndicator={false}
                            renderItem={renderItem}
                            keyExtractor={(item, index) => "SOL" + item.id}
                            key={(item, index) => "SOL" + item.id}
                        />
                    </>
                }
            </View>
            {isEdt &&
                <View style={styles.alertView}>
                    <PromptAlert
                        title={props.promptAlertTitle}
                        item={props.editProductObj}
                        onTextChange={onTextchange}
                        onPressDone={onTitleChange}
                        close={() => {
                            setText('')
                            setisEdit(false)
                        }}
                        buttonName={t('DONE')}
                        // placeholder={String(props.editProductObj.quantity)}
                        value={text}
                        isTextField

                    />
                </View>

            }
        </>

    )
}

const styles = StyleSheet.create({
    alertContainer: {

        // height: HEIGHT_BASE_RATIO(361),
        width: WIDTH_BASE_RATIO(690),
        backgroundColor: Colors.modelBackgroundColor,
        borderRadius: HEIGHT_BASE_RATIO(20),
        borderColor: Colors.borderColor,
        paddingBottom: HEIGHT_BASE_RATIO(42),
        maxHeight: HEIGHT_BASE_RATIO(700),

        alignItems: "center",
        //justifyContent: 'center',

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
    edtButtonStyle: {
        height: HEIGHT_BASE_RATIO(89),
        width: WIDTH_BASE_RATIO(100),
        backgroundColor: Colors.primaryColor,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: HEIGHT_BASE_RATIO(10),
        //alignSelf: "flex-end",
        marginTop: HEIGHT_BASE_RATIO(21),
        marginStart: 5

    },
    titleStyle: {
        fontSize: FONT_SIZE(25),
        color: Colors.white,
        fontFamily: "Inter-Bold",
        // alignSelf: "flex-start",
        // marginBottom: HEIGHT_BASE_RATIO(20)
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
    },
    imageStyle: {
        height: WIDTH_BASE_RATIO(55),
        width: WIDTH_BASE_RATIO(55),
        resizeMode: "contain",

    },
    imageStyle2: {
        height: WIDTH_BASE_RATIO(35),
        width: WIDTH_BASE_RATIO(35),
        resizeMode: "contain",

    },
    doneText: {
        fontSize: FONT_SIZE(25),
        color: Colors.white,
        fontFamily: "Inter-Bold",
        // alignSelf: "flex-start",

    },
    mergeSplitMsg: {
        fontSize: FONT_SIZE(30),
        color: Colors.black,
        fontFamily: "Inter-Bold",
        marginTop: HEIGHT_BASE_RATIO(40),
        marginVertical: HEIGHT_BASE_RATIO(10)
    },
    alertView: {
        position: "absolute",
        //flex: 1,
        height: "100%",
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Colors.borderColor,
        paddingHorizontal: WIDTH_BASE_RATIO(27),
        zIndex: 0,

    }

})

export default React.memo(SplitOrderList);