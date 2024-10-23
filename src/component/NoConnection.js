import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { TextInput, TouchableOpacity, StyleSheet, Image, Text, View, Keyboard, Modal, } from "react-native"
import { useDispatch, useSelector } from "react-redux";
import { images } from "../assets/images";
import { hideAlert } from "../constant/Alert";
import { Colors } from "../constant/color";
import { FONT_SIZE, HEIGHT_BASE_RATIO, hp, WIDTH_BASE_RATIO, wp } from "../constant/sizeHelper";
import { Strings } from "../constant/string";

const NoConnection = (props) => {
    const { t } = useTranslation()
    const [toggle, setToggle] = useState(false)
    const { alertObject } = useSelector((state) => state.auth);

    const dispatch = useDispatch()
    useEffect(() => {

    }, [])
    return (
        <View style={styles.container}>

            <View style={styles.container} >
                <View style={styles.alertContainer}>

                    <View style={styles.modelHeader} >
                        <Text style={styles.doneText
                        }>
                            No Internet
                        </Text>
                    </View>

                    <Image
                        style={[styles.imageStyle, { tintColor: Colors.red }]}
                        source={images.alertIcon}

                    />

                    <View
                        style={[styles.msgContainer]}>

                        <Text style={styles.titleStyle}>{t(" Pleae Check your connection!!")}</Text>

                    </View>
                    <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>

                        {/* <TouchableOpacity
                            disabled={props?.value?.length < 1}
                            onPress={() => { }}
                            style={[styles.doneButtonStyle]}>
                            <Text style={styles.doneText}>{t('TRY')}</Text>
                        </TouchableOpacity> */}
                    </View>
                </View>
            </View>

        </View>

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,

    },
    mainContainer: {

        // height: "100%",

        //  backgroundColor: Colors.borderColor,
        justifyContent: "center",
    },

    alertContainer: {

        // height: HEIGHT_BASE_RATIO(361),
        width: WIDTH_BASE_RATIO(690),
        backgroundColor: Colors.white,
        borderRadius: HEIGHT_BASE_RATIO(20),
        borderColor: Colors.borderColor,
        paddingBottom: HEIGHT_BASE_RATIO(42),

        alignItems: "center",
        //justifyContent: 'center',

    },

    msgContainer: {

        width: WIDTH_BASE_RATIO(479),

        marginTop: HEIGHT_BASE_RATIO(39),
    },

    doneButtonStyle: {
        height: HEIGHT_BASE_RATIO(89),
        width: WIDTH_BASE_RATIO(200),
        backgroundColor: Colors.primaryColor,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: HEIGHT_BASE_RATIO(10),
        //alignSelf: "flex-end",
        marginTop: HEIGHT_BASE_RATIO(21)

    },
    titleStyle: {
        fontSize: FONT_SIZE(30),
        color: Colors.black,
        fontFamily: "Inter-Bold",
        textAlign: "center"
        // alignSelf: "flex-start",
        // marginBottom: HEIGHT_BASE_RATIO(20)
    },
    modelHeader: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Colors.primaryColor,
        height: WIDTH_BASE_RATIO(89),

        borderTopLeftRadius: HEIGHT_BASE_RATIO(20),
        borderTopRightRadius: HEIGHT_BASE_RATIO(20),
    },
    imageStyle: {
        height: WIDTH_BASE_RATIO(150),
        width: WIDTH_BASE_RATIO(150),
        marginTop: HEIGHT_BASE_RATIO(39),
        resizeMode: "contain",

    },
    doneText: {
        fontSize: FONT_SIZE(25),
        color: Colors.white,
        fontFamily: "Inter-Bold",
        // alignSelf: "flex-start",

    }

})

export default React.memo(NoConnection);