import React from "react";
import { TouchableOpacity, StyleSheet, Image, Text } from "react-native"
import { Colors } from "../constant/color";
import { FONT_SIZE, HEIGHT_BASE_RATIO, hp, WIDTH_BASE_RATIO, wp } from "../constant/sizeHelper";

const TableListItem = (props) => {

    return (

        <TouchableOpacity
            onPress={() => props.onPressItem(props.index, props.item)}
            onLongPress={() => props.onLongPress(props.index, props.item)}
            delayLongPress={500}
            style={[styles.container, props.item.order_id && {
                backgroundColor: props.item?.color ? props.item?.color : Colors.darkYellow,
                borderWidth: HEIGHT_BASE_RATIO(0),
            }, props?.item?.isSelected && {
                backgroundColor: Colors.primaryColor,
                borderWidth: HEIGHT_BASE_RATIO(0),
            }]}>
            <Text
                style={[styles.textStyle, { color: (props?.item?.isSelected || props.item.order_id) ? Colors.white : Colors.black }]}

            >
                {props.item.table_number}
            </Text>
            <Text
                style={[styles.textStyle, { marginTop: HEIGHT_BASE_RATIO(5), color: (props?.item?.isSelected || props.item.order_id) ? Colors.white : Colors.black }]}
            >{`${props.item.seating_capacity} P`}</Text>
        </TouchableOpacity>
    )

}

const styles = StyleSheet.create({
    container: {
        height: HEIGHT_BASE_RATIO(76),
        width: WIDTH_BASE_RATIO(113),
        backgroundColor: Colors.white,
        borderRadius: HEIGHT_BASE_RATIO(12),
        borderWidth: HEIGHT_BASE_RATIO(2),
        borderColor: Colors.borderColor,
        justifyContent: "center",
        alignItems: "center"
    },
    imageSt: {
        height: HEIGHT_BASE_RATIO(205),
        width: WIDTH_BASE_RATIO(160),

        resizeMode: "contain"

    },
    textStyle: {
        fontSize: FONT_SIZE(16),
        color: Colors.black,
        fontFamily: "Inter-Bold"

    }

})

export default React.memo(TableListItem);