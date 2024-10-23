import React, { useState } from "react";
import { TouchableWithoutFeedback, TouchableOpacity, StyleSheet, Image, Text, View, } from "react-native"
import { Colors } from "../constant/color";
import { FONT_SIZE, HEIGHT_BASE_RATIO, hp, WIDTH_BASE_RATIO, wp } from "../constant/sizeHelper";
import Animated, { useSharedValue, useAnimatedStyle, withSequence, withTiming, withRepeat } from 'react-native-reanimated'

const CustomSwitch = (props) => {
    const [toggle, setToggle] = useState(false)
    const rotation = useSharedValue(0);
    const translateY = useSharedValue(0);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ rotateY: `${rotation.value}deg` }],
        };
    });

    return (
        <TouchableWithoutFeedback
            disabled={props.disabled}
            onPress={() => {

                setToggle(!toggle)
                props.onToggle(toggle)
            }} >

            <View
                style={[styles.container, props.containerStyle && props.containerStyle]}>

                <View style={[styles.ButtoncontainerStyle, !toggle ? {
                    backgroundColor: Colors.darkYellow,
                } : styles.disableView
                    , props.ButtonContainerStyle && props.ButtonContainerStyle]}>
                    <Text
                        style={[styles.textStyle, { color: !toggle ? Colors.white : Colors.black }]}
                    >
                        {props.label1}
                    </Text>
                </View>

                <View style={[styles.ButtoncontainerStyle, toggle ? {
                    backgroundColor: Colors.darkYellow,
                } : styles.disableView, props.ButtonContainerStyle && props.ButtonContainerStyle]}>
                    <Text
                        style={[styles.textStyle, { color: toggle ? Colors.white : Colors.black }]}
                    >

                        {props.label2}
                    </Text>
                </View>
            </View>
        </TouchableWithoutFeedback>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        height: HEIGHT_BASE_RATIO(77),
        width: WIDTH_BASE_RATIO(690),
        backgroundColor: Colors.white,
        borderRadius: HEIGHT_BASE_RATIO(12),
        borderWidth: HEIGHT_BASE_RATIO(2),
        borderColor: Colors.borderColor,
        alignItems: "center"
    },

    ButtoncontainerStyle: {
        height: HEIGHT_BASE_RATIO(77),
        width: WIDTH_BASE_RATIO(345),
        backgroundColor: Colors.white,
        borderRadius: HEIGHT_BASE_RATIO(12),
        justifyContent: "center",
        alignItems: "center",
    },
    textStyle: {
        fontSize: FONT_SIZE(16),
        color: Colors.black,
        fontFamily: "Inter-Bold"
    },
    disableView: {
        height: HEIGHT_BASE_RATIO(77),
        width: WIDTH_BASE_RATIO(345),
        backgroundColor: "transparent",
    }

})

export default React.memo(CustomSwitch);