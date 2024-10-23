import React from "react";
import { TouchableOpacity, StyleSheet, Image, Text } from "react-native"
import { Colors } from "../constant/color";
import { FONT_SIZE, HEIGHT_BASE_RATIO, hp, WIDTH_BASE_RATIO, wp } from "../constant/sizeHelper";

const PesonaliserListItem = (props) => {

    return (

        <TouchableOpacity
            onPress={() => alert('TODO...')}
            style={[styles.container, {
                backgroundColor: props?.item?.isSelected ?
                    Colors.primaryColor : Colors.white
            }]}>
            <Text
                style={[styles.textStyle, { color: props?.item?.isSelected ? Colors.white : Colors.black }]}
            >{props.item.name}</Text>
            <Image
                style={[styles.imageStyle, {
                    tintColor: props?.item?.isSelected ?
                        Colors.white : Colors.black
                }]}
                source={props.item.image}
            />

        </TouchableOpacity>
    )

}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        height: HEIGHT_BASE_RATIO(114),
        backgroundColor: Colors.white,
        borderRadius: HEIGHT_BASE_RATIO(20),
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: WIDTH_BASE_RATIO(34)
    },
    imageStyle: {
        height: HEIGHT_BASE_RATIO(40),
        width: WIDTH_BASE_RATIO(40),

        resizeMode: "contain"

    },
    textStyle: {
        fontSize: FONT_SIZE(30),
        color: Colors.black,
        fontFamily: "Inter-Bold"

    }

})

export default React.memo(PesonaliserListItem);