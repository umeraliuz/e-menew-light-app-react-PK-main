import React, { useState } from "react";
import { TextInput, TouchableOpacity, StyleSheet, Image, Text, View, } from "react-native"
import { images } from "../assets/images";
import { Colors } from "../constant/color";
import { FONT_SIZE, HEIGHT_BASE_RATIO, hp, WIDTH_BASE_RATIO, wp } from "../constant/sizeHelper";
import { Strings } from "../constant/string";

const CustomInput = (props) => {
    const [toggle, setToggle] = useState(false)
    return (

        <View
            style={[styles.container, props.containerStyle && props.containerStyle]}>

            <TextInput
                style={styles.textinputStyle}
                placeholder={props.placeholder}
                placeholderTextColor={Colors.borderColor}
                onChangeText={(text) => props.onChangeText(text)}
                value={props.value}
                defaultValue={props.value}
                secureTextEntry={props.type === Strings.PASSWORD && !props.visible}
                onSubmitEditing={props.onSubmitEditing}
                onEndEditing={props.onEndEditing}
            />
            {props?.icon && <View style={styles.iconViewStlye}>
                <TouchableOpacity
                    onPress={props.onPressIcon}
                >
                    <Image
                        style={styles.iconsStlye}
                        source={props.icon}
                    />
                </TouchableOpacity>
            </View>}
        </View>

    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        height: HEIGHT_BASE_RATIO(89),
        width: WIDTH_BASE_RATIO(632),
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
        height: HEIGHT_BASE_RATIO(34),
        width: WIDTH_BASE_RATIO(34),
        tintColor: "#70707080"

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

export default React.memo(CustomInput);