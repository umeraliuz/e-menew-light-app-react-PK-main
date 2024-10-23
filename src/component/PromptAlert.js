import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { TextInput, TouchableOpacity, StyleSheet, Image, Text, View, Keyboard, } from "react-native"
import { images } from "../assets/images";
import { Colors } from "../constant/color";
import { FONT_SIZE, HEIGHT_BASE_RATIO, hp, WIDTH_BASE_RATIO, wp } from "../constant/sizeHelper";
import { Strings } from "../constant/string";

const PromptAlert = (props) => {
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

            <View
                style={[styles.inputContainer, props.containerStyle && props.containerStyle]}>

                <TextInput
                    style={styles.textinputStyle}

                    placeholder={props.placeholder}
                    placeholderTextColor={Colors.borderColor}

                    onChangeText={(text) => props.onTextChange(text)}
                    keyboardType={props.isTextField ? "default" : "number-pad"}
                    autoFocus={true}
                    cursorColor={Colors.primaryColor}
                    defaultValue={props.value}
                    multiline={props.isTextField}
                    numberOfLines={1}
                // adjustsFontSizeToFit={true}

                />

            </View>
            <TouchableOpacity
                disabled={props?.value?.length < 1}
                onPress={props.onPressDone}
                style={[styles.doneButtonStyle, { backgroundColor: props?.value?.length < 1 ? Colors.borderColor : Colors.primaryColor }]}>
                <Text style={styles.doneText}>{props.buttonName}</Text>
            </TouchableOpacity>
        </View>

    )
}

const styles = StyleSheet.create({
    container: {

        //flex: 1,
        // height: "100%",
        // width: "100%",
        // justifyContent: "center",
        /// alignItems: "center",
        // backgroundColor: Colors.borderColor,
        //paddingHorizontal: WIDTH_BASE_RATIO(27)
    },
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

    inputContainer: {
        flexDirection: "row",
        maxHeight: HEIGHT_BASE_RATIO(250),
        backgroundColor: Colors.white,
        borderRadius: HEIGHT_BASE_RATIO(12),
        borderWidth: HEIGHT_BASE_RATIO(2),
        borderColor: Colors.borderColor,
        width: WIDTH_BASE_RATIO(479),
        // alignItems: "center",
        justifyContent: 'space-between',
        paddingHorizontal: WIDTH_BASE_RATIO(1),
        marginTop: HEIGHT_BASE_RATIO(39),
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
        //height: HEIGHT_BASE_RATIO(77),
        width: WIDTH_BASE_RATIO(460),
        backgroundColor: Colors.transparent,
        //justifyContent: "center",
        //alignItems: "center",
        fontSize: FONT_SIZE(20),
        color: Colors.black,
        fontFamily: "Inter-Bold",
        // minHeight: HEIGHT_BASE_RATIO(40)
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

    }

})

export default React.memo(PromptAlert);