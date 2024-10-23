import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { images } from "../assets/images";
import { Colors } from "../constant/color";
import { FONT_SIZE, HEIGHT_BASE_RATIO, WIDTH_BASE_RATIO } from "../constant/sizeHelper";
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Header = (props) => {
    const insets = useSafeAreaInsets();
    // console.log("useSafeAreaInsets", insets)

    return (
        <View style={styles.shadowStyle}>

            <View style={[styles.headerStyle, { height: HEIGHT_BASE_RATIO(132) + HEIGHT_BASE_RATIO(insets.top), paddingTop: HEIGHT_BASE_RATIO(insets.top) }]}>
                {props.isGoback && <TouchableOpacity
                    onPress={() => props.goBack()}
                    style={[styles.rightArrowContain, { marginTop: HEIGHT_BASE_RATIO(insets.top) }]}>
                    <Image
                        source={images.rightArrow}
                        style={styles.imageStyleBack}
                    />
                </TouchableOpacity>}
                <TouchableOpacity

                    disabled={props.disabled}
                    onPress={() => props.onPress(props.type)}
                >
                    {props.isImage ?
                        <Image
                            source={props.isImage}
                            style={styles.imageStyle}
                        />
                        : <Text style={styles.headerTitle}>{props.title}</Text>
                    }
                </TouchableOpacity>
                {props.isRightButton && <TouchableOpacity
                    style={{ position: "absolute", right: WIDTH_BASE_RATIO(30), paddingTop: HEIGHT_BASE_RATIO(insets.top) }}
                    disabled={!props.isRightButton}

                    onPress={() => props.onPressRight(props.type)}

                >
                    {props.rightImage ?
                        <Image
                            source={props.rightImage}
                            style={styles.imageStyle}
                        /> :
                        <Text style={styles.headerTitle}>{props.titleRight}</Text>
                    }
                </TouchableOpacity>}
            </View>
        </View>
    )

}

const styles = StyleSheet.create({
    headerStyle: {
        flexDirection: "row",
        // height: HEIGHT_BASE_RATIO(132),
        borderBottomStartRadius: HEIGHT_BASE_RATIO(30),
        borderBottomEndRadius: HEIGHT_BASE_RATIO(30),
        backgroundColor: Colors.white,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: Colors.borderColor,

    },
    headerTitle: {
        fontSize: FONT_SIZE(25),
        color: Colors.black,
        fontFamily: "Inter-Bold"
    },
    shadowStyle: {
        // backgroundColor: "green",
        //height: HEIGHT_BASE_RATIO(135),
        borderBottomStartRadius: HEIGHT_BASE_RATIO(30),
        borderBottomEndRadius: HEIGHT_BASE_RATIO(30),
        paddingBottom: 5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            //height: HEIGHT_BASE_RATIO(135),
        },
        shadowOpacity: 0.36,
        shadowRadius: HEIGHT_BASE_RATIO(60),

        elevation: 25,
    },
    imageStyle: {
        height: HEIGHT_BASE_RATIO(70),
        width: WIDTH_BASE_RATIO(70),
        resizeMode: "contain"
    },
    imageStyleBack: {
        height: HEIGHT_BASE_RATIO(26),
        width: WIDTH_BASE_RATIO(13),
        resizeMode: "contain"
    },
    rightArrowContain: {
        height: HEIGHT_BASE_RATIO(77),
        width: HEIGHT_BASE_RATIO(77),
        borderRadius: HEIGHT_BASE_RATIO(77) / 2,
        position: "absolute",
        top: HEIGHT_BASE_RATIO(27),
        left: WIDTH_BASE_RATIO(27),
        backgroundColor: Colors.borderColor,
        justifyContent: "center",

        alignItems: "center"
    },
})

export default React.memo(Header);