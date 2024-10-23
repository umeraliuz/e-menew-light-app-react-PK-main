import React from "react";
import { TouchableOpacity, StyleSheet, Image, Text, View } from "react-native"
import { Colors } from "../constant/color";
import { FONT_SIZE, HEIGHT_BASE_RATIO, hp, WIDTH_BASE_RATIO, wp } from "../constant/sizeHelper";

const CommonListItem = (props) => {

    return (

        <TouchableOpacity
            disabled={props.item.disabled}
            onPress={() => { props?.item?.action ? props.item.action() : props.onPressItem(props.index, props.item) }}
            style={[styles.container, { backgroundColor: props?.item?.isSelected ? Colors.primaryColor : Colors.white }]}>
            {props?.item?.badge > 0 &&
                <View style={styles.BadgeStyle}>
                    {props?.item?.badge > 99 ?
                        <Text style={styles.badgeText}>
                            {"99+"}
                        </Text> :
                        <Text style={styles.badgeText}>
                            {props?.item?.badge}
                        </Text>
                    }
                </View>}
            <Image
                style={[styles.imageStyle, { tintColor: props?.item?.disabled ? Colors.borderColor : Colors.black }]}
                source={props.item.icon}
            />
            <Text
                style={[styles.textStyle, { color: props?.item?.disabled ? Colors.borderColor : Colors.black }]}
            >{props.item.name}</Text>
        </TouchableOpacity>
    )

}

const styles = StyleSheet.create({
    container: {
        height: HEIGHT_BASE_RATIO(166),
        width: WIDTH_BASE_RATIO(213),
        backgroundColor: Colors.white,
        borderRadius: HEIGHT_BASE_RATIO(20),
        justifyContent: "center",
        alignItems: "center",
        borderWidth: WIDTH_BASE_RATIO(3),
        borderColor: Colors.borderColor
    },
    imageStyle: {
        height: HEIGHT_BASE_RATIO(60),
        width: WIDTH_BASE_RATIO(60),
        resizeMode: "contain"

    },
    textStyle: {
        fontSize: FONT_SIZE(16),
        color: Colors.black,
        marginTop: HEIGHT_BASE_RATIO(16),
        fontFamily: "Inter-Bold"

    }, BadgeStyle: {
        height: WIDTH_BASE_RATIO(40),
        width: WIDTH_BASE_RATIO(40),
        borderRadius: WIDTH_BASE_RATIO(40) / 2,
        backgroundColor: Colors.badgeColor,
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        top: -5,
        right: -5,

    },
    badgeText: {
        fontSize: FONT_SIZE(20),
        color: Colors.white,
        fontFamily: "Inter-Bold"
    }

})

export default React.memo(CommonListItem);