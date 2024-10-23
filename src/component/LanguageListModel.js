import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { TouchableOpacity, StyleSheet, Image, Text, View, FlatList, } from "react-native"
import { images } from "../assets/images";
import { Colors } from "../constant/color";
import { FONT_SIZE, HEIGHT_BASE_RATIO, hp, WIDTH_BASE_RATIO, wp } from "../constant/sizeHelper";

import { useSelector } from "react-redux";
import LanguageItem from "./LanguageItem";

const LanguageListModel = (props) => {

    const { user } = useSelector((state) => state.auth);
    const { t } = useTranslation()

    const [value, setValue] = useState(user.currency_id);

    const renderLanguageItem = ({ item, index }) => {
        return (
            <View style={{
                marginTop: HEIGHT_BASE_RATIO(10)
            }}>
                <LanguageItem
                    item={item}
                    quantity={item.quantity}
                    index={index}
                    onPressItem={props.onLangChange}

                />
            </View>
        )
    }
    return (

        <View style={styles.alertContainer}>
            <View style={styles.modelHeader}>

                <View />

                <Text style={styles.titleStyle}>
                    {`${t('LANGUAGE')}`}</Text>

                <TouchableOpacity

                    style={{ alignSelf: "flex-end" }}
                    onPress={() => {

                        props.languageModel()
                    }}
                >
                    <Image
                        source={images.whiteCross}
                        style={styles.imageStyle}
                    />
                </TouchableOpacity>

            </View>
            <View style={{ zIndex: 999 }}>

                <View style={{ maxHeight: HEIGHT_BASE_RATIO(400), paddingHorizontal: WIDTH_BASE_RATIO(20) }}>
                    <Text style={styles.inputTitle}>

                        {t('SELECT_LANGUAGE')}</Text>
                    <FlatList
                        style={{ flex: 1 }}
                        data={props.languageList}
                        contentContainerStyle={{
                            paddingTop: HEIGHT_BASE_RATIO(10),
                            paddingBottom: HEIGHT_BASE_RATIO(30)
                        }}

                        showsVerticalScrollIndicator={false}
                        renderItem={renderLanguageItem}
                        keyExtractor={(item, index) => "TLC" + item.id}
                        key={(item, index) => "TLC" + item.id}
                    />
                </View>
            </View>

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

    titleStyle: {
        fontSize: FONT_SIZE(25),
        color: Colors.white,
        fontFamily: "Inter-Bold",
        // alignSelf: "flex-start",
        // marginBottom: HEIGHT_BASE_RATIO(20)
    },
    inputTitle: {
        fontSize: FONT_SIZE(30),
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

})

export default React.memo(LanguageListModel);