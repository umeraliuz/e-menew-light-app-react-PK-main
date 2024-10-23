import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { TextInput, TouchableOpacity, StyleSheet, Image, Text, View, Keyboard, Modal, } from "react-native"
import { useDispatch, useSelector } from "react-redux";
import { images } from "../assets/images";
import { hideAlert } from "../constant/Alert";
import { Colors } from "../constant/color";
import { DEVICE_HEIGHT, FONT_SIZE, HEIGHT_BASE_RATIO, hp, WIDTH_BASE_RATIO, wp } from "../constant/sizeHelper";
import { Strings } from "../constant/string";
import Animated, { useSharedValue, useAnimatedStyle, withSequence, withTiming, withRepeat } from 'react-native-reanimated'

const CustomAlert = (props) => {
    const { t } = useTranslation()
    const [toggle, setToggle] = useState(false)
    const { alertObject } = useSelector((state) => state.auth);
    const dispatch = useDispatch()
    const rotation = useSharedValue(0);
    const translateY = useSharedValue(0);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ rotateY: `${rotation.value}deg` }],
        };
    });
    const animatedStyle2 = useAnimatedStyle(() => {
        return {
            transform: [{ translateY: translateY.value }]
        }
    });
    // useEffect(() => {
    //     //rotation.value = withSequence(withTiming(70), withTiming(0))
    //     if (alertObject?.visible) {
    //         rotation.value = withRepeat(withTiming(25), 4, true)
    //     } else {
    //         rotation.value = useSharedValue(0);
    //     }
    // }, [alertObject.visible])
    const statAnimation = () => {
        rotation.value = withSequence(
            withTiming(-10, { duration: 50 }),
            withRepeat(withTiming(2, { duration: 100 }), 3, true),
            withTiming(0, { duration: 50 })
        );
        //translateY.value += HEIGHT_BASE_RATIO(DEVICE_HEIGHT) / 3;
    }
    const resetAnimation = () => {
        rotation.value = 0;
        //translateY.value = 0
    }
    useEffect(() => {
        if (alertObject.visible) {

            statAnimation()
        } else {
            resetAnimation()
        }

    }, [alertObject.visible])
    return (
        <View style={styles.container}>
            <Modal
                animationType="fade"
                visible={alertObject?.visible}
                transparent
                elevation={40}
                statusBarTranslucent

            >
                <View style={[styles.container]} >
                    <Animated.View style={[styles.alertContainer, animatedStyle]}>

                        <View style={styles.modelHeader}>
                            <Text style={styles.titleStyle}>
                                {t('ALERT')}
                            </Text>
                        </View>

                        {props?.isImageShown &&
                            <Image
                                style={[styles.imageStyle, { tintColor: props.type == "reject" ? Colors.red : props.type == "warning" ? Colors.darkYellow : null }]}
                                source={props.type == "accept" ? images.accept : images.alertIcon}

                            />
                        }

                        <View
                            style={[styles.msgContainer]}>

                            <Text style={styles.msgStyle}>{alertObject?.message}</Text>

                        </View>
                        <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                            {alertObject?.positiveAction && <TouchableOpacity
                                disabled={props?.value?.length < 1}
                                onPress={alertObject?.positiveAction}
                                style={[styles.doneButtonStyle, { marginEnd: WIDTH_BASE_RATIO(30) }]}>
                                <Text style={styles.doneText}>{t('YES')}</Text>
                            </TouchableOpacity>}
                            <TouchableOpacity
                                disabled={props?.value?.length < 1}
                                onPress={() => { hideAlert(dispatch) }}
                                style={[styles.doneButtonStyle]}>
                                <Text style={styles.doneText}>{alertObject?.positiveAction ? t('NO') : t('OK')}</Text>
                            </TouchableOpacity>
                        </View>
                    </Animated.View>
                </View>
            </Modal>
        </View>

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
        backgroundColor: Colors.borderColor,
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
        fontSize: FONT_SIZE(50),
        color: Colors.white,
        fontFamily: "Inter-Bold",
        textAlign: "center",
        // alignSelf: "center",
        // marginBottom: HEIGHT_BASE_RATIO(20)
    },
    msgStyle: {
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

export default React.memo(CustomAlert);