import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { TextInput, TouchableOpacity, StyleSheet, Image, Text, View, Keyboard, } from "react-native"
import { images } from "../assets/images";
import { Colors } from "../constant/color";
import { FONT_SIZE, HEIGHT_BASE_RATIO, hp, WIDTH_BASE_RATIO, wp } from "../constant/sizeHelper";
import { Strings } from "../constant/string";

const TableMargeSplitAlert = (props) => {
    const { t } = useTranslation()
    const [toggle, setToggle] = useState(false)
    useEffect(() => {

    }, [])
    return (

        <View style={styles.alertContainer}>
            <View style={styles.modelHeader}>

                <View />

                {props.title &&
                    <Text style={styles.titleStyle}>{props.title}</Text>
                }
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
            <Text style={styles.mergeSplitMsg}>
                {t('MERGE_SPLIT_MSG')}
            </Text>

            <TouchableOpacity
                onPress={() => props.onPressDone('merge')}
                style={[styles.doneButtonStyle, { backgroundColor: Colors.primaryColor }]}>
                <Text style={styles.doneText}>{t('MERGE')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => props.onPressDone('split')}
                style={[styles.doneButtonStyle, { backgroundColor: Colors.primaryColor }]}>
                <Text style={styles.doneText}>{t('SPLIT')}</Text>
            </TouchableOpacity>
        </View>

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
    }

})

export default React.memo(TableMargeSplitAlert);