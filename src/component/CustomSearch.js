import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { TextInput, TouchableOpacity, StyleSheet, Image, Text, View, } from "react-native"
import { images } from "../assets/images";
import { Colors } from "../constant/color";
import { FONT_SIZE, HEIGHT_BASE_RATIO, hp, WIDTH_BASE_RATIO, wp } from "../constant/sizeHelper";
import { Strings } from "../constant/string";

const CustomSearch = (props) => {
    const { t } = useTranslation()
    const [toggle, setToggle] = useState(false)
    return (

        <View
            style={[styles.container, props.containerStyle && props.containerStyle]}>

            <TextInput
                style={styles.textinputStyle}
                placeholder={props.placeholder}
                placeholderTextColor={Colors.borderColor}
                onChangeText={(text) => props.onChangeText(text)}
                keyboardType={props.isNumeric ? 'numeric' : 'default'}
                value={props.searchTex}
            />
            <View style={styles.iconViewStlye}>
                <Image
                    style={styles.iconsStlye}
                    source={props.icon ? props.icon : images.searchIcon}
                />
            </View>
        </View>

    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        height: HEIGHT_BASE_RATIO(77),
        backgroundColor: Colors.white,
        borderRadius: HEIGHT_BASE_RATIO(12),
        borderWidth: HEIGHT_BASE_RATIO(2),
        borderColor: Colors.borderColor,
        alignItems: "center",
        justifyContent: 'space-between',
        paddingHorizontal: WIDTH_BASE_RATIO(27)
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
        width: WIDTH_BASE_RATIO(500),
        backgroundColor: Colors.transparent,
        justifyContent: "center",
        alignItems: "center",
        fontSize: FONT_SIZE(20),
        color: Colors.black,
        fontFamily: "Inter-Bold"
    },

})

export default React.memo(CustomSearch);