import React from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { images } from "../assets/images";
import { Colors } from "../constant/color";
import { FONT_SIZE, HEIGHT_BASE_RATIO, WIDTH_BASE_RATIO } from "../constant/sizeHelper";
import BottomModelItem from "./BottomModelItem";
import CustomButton from "./CustomButton";

const BottomModel = (props) => {

    const { t } = useTranslation()

    const renderProductItem = ({ item, index }) => {

        return (
            <View style={{
                marginEnd: WIDTH_BASE_RATIO(20),
                marginTop: HEIGHT_BASE_RATIO(20)
            }}>
                <BottomModelItem
                    item={item}
                    index={index}
                    onPressItem={props.onPressItem}
                    isImageShown={props.personaliserType === "REMISE"}
                    typeOfDiscount={props.commentType.find(res => res.isSelected)}

                />
            </View>

        )
    }
    const renderItem = ({ item, index }) => {

        return (
            <View style={{
                marginEnd: WIDTH_BASE_RATIO(16),
                marginTop: HEIGHT_BASE_RATIO(16)
            }}>

                <TouchableOpacity
                    onPress={() => props.getCommentOption(index, item)}

                    style={[styles.commentTypeContainer, {
                        width: props.personaliserType === "REMISE" ?
                            WIDTH_BASE_RATIO(150) : WIDTH_BASE_RATIO(113)
                    }, item?.isSelected && {
                        backgroundColor: Colors.primaryColor,
                        borderWidth: HEIGHT_BASE_RATIO(0),
                    }]}>
                    <Text
                        numberOfLines={1}
                        adjustsFontSizeToFit
                        style={[styles.textStyle, { color: item?.isSelected ? Colors.white : Colors.black }]}

                    >
                        {item.icons}
                    </Text>

                </TouchableOpacity>

            </View>

        )
    }
    return (
        <View>
            {/* <StatusBar hidden={true} /> */}
            {/* <Modal
                visible={props.visible}
                transparent
                elevation={40}
                statusBarTranslucent
                style={styles.container}> */}

            <View style={styles.mainContainer} >

                <View>
                    <View style={[styles.modelContainer, {
                        height: props?.isCustomComment ? HEIGHT_BASE_RATIO(1200) :
                            props?.isShowBottomSubItem ? HEIGHT_BASE_RATIO(600)
                                : HEIGHT_BASE_RATIO(600)
                    }]}>
                        <View style={styles.modelHeader}>
                            {props.isEditPro &&
                                <>
                                    {props.isShowBottomSubItem ? <TouchableOpacity
                                        onPress={() => {
                                            props.goBackBottomSubItem()

                                        }}
                                        style={styles.rightArrowContain}>
                                        <Image
                                            source={images.rightArrow}
                                            style={styles.imageStyle2}
                                        />
                                    </TouchableOpacity> : <View style={[styles.rightArrowContain, { backgroundColor: Colors.transparent }]} />}

                                    {props?.item?.product_name &&
                                        props.personaliserType === "REMISE" ?
                                        <Text style={styles.titleStyle}>{`${t('REMISE')}`}

                                        </Text> :
                                        <Text style={styles.titleStyle}>{`${props?.item?.product_name}`}
                                            <Text
                                                numberOfLines={1}
                                                style={styles.attributeText}>
                                                {` (${props?.item?.product_attribute})`}
                                            </Text>
                                        </Text>
                                    }
                                    <TouchableOpacity

                                        style={{ alignSelf: "flex-end" }}
                                        onPress={() => {
                                            props.modelVisible()
                                            props.setIsCustomComment(false)
                                        }}
                                    >
                                        <Image

                                            source={images.closeIcon}
                                            style={styles.imageStyle}
                                        />
                                    </TouchableOpacity>

                                </>}
                        </View>
                        {props.isShowBottomSubItem ?
                            <>
                                {((props.commentType.length > 0 && props.personaliserType === "COMMENTS_COMMENTAIRES" || props.personaliserType === "REMISE"))
                                    && <View style={{ height: HEIGHT_BASE_RATIO(140), }}>
                                        <FlatList
                                            horizontal
                                            style={{ marginTop: HEIGHT_BASE_RATIO(20) }}
                                            data={props.commentType}
                                            contentContainerStyle={{
                                                paddingTop: HEIGHT_BASE_RATIO(10),
                                                paddingBottom: HEIGHT_BASE_RATIO(0)
                                            }}
                                            ListEmptyComponent={() => {
                                                return (
                                                    <Text style={{ alignSelf: "center" }}>{t("NO_DATA_FOUND")}</Text>
                                                )
                                            }}
                                            showsHorizontalScrollIndicator={false}
                                            renderItem={renderItem}
                                            keyExtractor={(item, index) => "CT" + item.id}
                                            key={(item, index) => "CT" + item.id}
                                        />
                                    </View>
                                }
                                {props?.isCustomComment ?
                                    <>

                                        <View style={styles.inputContainer}>
                                            <TextInput
                                                style={styles.textinputStyle}
                                                keyboardType={props.personaliserType === "REMISE" ? "decimal-pad" : "default"}

                                                placeholder={props.personaliserType === "REMISE" ? t("REMISE") : t("COMMENTS")}
                                                placeholderTextColor={Colors.borderColor}

                                                onChangeText={(text) => props.onTextChange(text)}

                                                autoFocus={true}
                                                cursorColor={Colors.primaryColor}
                                                value={props.value}
                                                multiline={true}
                                                numberOfLines={props.personaliserType === "REMISE" ? 1 : 10}
                                                textAlignVertical={'top'}
                                            // adjustsFontSizeToFit={true}

                                            />
                                        </View>
                                        <CustomButton
                                            disabled={props.value.length == 0}
                                            name={t("DONE")}
                                            containerStyle={styles.buttonStyle2}
                                            onPress={() => props.addCustomComments()}
                                        />
                                    </>
                                    : (props.isLoading) ?
                                        <View style={styles.loaderView}>
                                            <ActivityIndicator
                                                color={Colors.primaryColor}
                                                size={"large"}
                                            />
                                        </View>

                                        : <FlatList
                                            numColumns={3}
                                            style={{ marginTop: HEIGHT_BASE_RATIO(20) }}
                                            data={props.subData}
                                            contentContainerStyle={{
                                                paddingTop: HEIGHT_BASE_RATIO(10),
                                                paddingBottom: HEIGHT_BASE_RATIO(150)
                                            }}
                                            ListEmptyComponent={() => {
                                                return (
                                                    (props.isLoading) ?
                                                        <View style={styles.loaderView}>
                                                            <ActivityIndicator
                                                                color={Colors.primaryColor}
                                                                size={"large"}
                                                            />
                                                        </View> :
                                                        <Text style={{ alignSelf: "center" }}>{t("NO_DATA_FOUND")}</Text>
                                                )
                                            }}
                                            showsVerticalScrollIndicator={false}
                                            renderItem={renderProductItem}
                                            keyExtractor={(item, index) => "SC" + item.id}
                                            key={(item, index) => "SC" + item.id}
                                        />}
                            </> :
                            (props.isLoading) ?
                                <View style={styles.loaderView}>
                                    <ActivityIndicator
                                        color={Colors.primaryColor}
                                        size={"large"}
                                    />
                                </View>

                                : <FlatList
                                    numColumns={3}
                                    style={{ marginTop: HEIGHT_BASE_RATIO(20) }}
                                    data={props.data}
                                    contentContainerStyle={{
                                        paddingTop: HEIGHT_BASE_RATIO(10),
                                        paddingBottom: HEIGHT_BASE_RATIO(150)
                                    }}
                                    ListEmptyComponent={() => {
                                        return (
                                            <Text style={{ alignSelf: "center" }}>{t("NO_DATA_FOUND")}</Text>
                                        )
                                    }}
                                    showsVerticalScrollIndicator={false}
                                    renderItem={renderProductItem}
                                    keyExtractor={(item, index) => "SC" + item.id}
                                    key={(item, index) => "SC" + item.id}
                                />
                        }
                        {/* {!props.isEditPro && <CustomButton

                            name={t("DONE")}
                            containerStyle={styles.buttonStyle}
                            onPress={() => props.modelVisible()}
                        />} */}
                    </View>
                </View>
            </View>

            {/* </TouchableWithoutFeedback> */}
            {/* </Modal> */}
        </View>
    )

}

const styles = StyleSheet.create({
    container: {
        height: "100%",
        //zIndex: 99,
        // backgroundColor: Colors.white,
        // borderRadius: HEIGHT_BASE_RATIO(20),
        // paddingHorizontal: WIDTH_BASE_RATIO(55),
        //paddingTop: HEIGHT_BASE_RATIO(46),
        // paddingBottom: HEIGHT_BASE_RATIO(25),
        // marginBottom: HEIGHT_BASE_RATIO(10),
        //justifyContent: "flex-end",
        //overflow: "hidden",
    },
    mainContainer: {
        shadowColor: "#c92750",
        shadowOffset: {
            width: 0,
            height: 18,
        },
        shadowOpacity: 0.25,
        shadowRadius: 20.00,

        // height: "50%",

        // backgroundColor: Colors.borderColor,
        //justifyContent: "flex-end",
        //zIndex: 0,
        //
        // position: "absolute",
        //top: "3%"
        elevation: 24
    },
    modelContainer: {

        backgroundColor: Colors.white,
        // height: HEIGHT_BASE_RATIO(708),
        // borderRadius: HEIGHT_BASE_RATIO(20),
        borderTopLeftRadius: HEIGHT_BASE_RATIO(20),
        borderTopRightRadius: HEIGHT_BASE_RATIO(20),
        paddingHorizontal: WIDTH_BASE_RATIO(15),
        paddingTop: HEIGHT_BASE_RATIO(24),
        // paddingBottom: HEIGHT_BASE_RATIO(25),
        zIndex: 33,
        // shadowColor: "#c92750",
        // shadowOffset: {
        //     width: 0,
        //     height: 18,
        // },
        // shadowOpacity: 0.25,
        // shadowRadius: 20.00,

    },
    imageStyle: {
        height: WIDTH_BASE_RATIO(57),
        width: WIDTH_BASE_RATIO(57),
        resizeMode: "contain",

    },
    imageStyle2: {
        height: WIDTH_BASE_RATIO(30),
        width: WIDTH_BASE_RATIO(30),
        resizeMode: "contain",

    },
    textContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: HEIGHT_BASE_RATIO(30)
    },

    textTitleStyle: {
        fontSize: FONT_SIZE(25),
        color: Colors.black,
        fontFamily: "Inter-Bold"

    },
    textValueStyle: {
        fontSize: FONT_SIZE(20),
        color: Colors.black,
        fontFamily: "Inter-Bold"

    },
    confirmButtonStyle: {
        height: HEIGHT_BASE_RATIO(89),
        width: WIDTH_BASE_RATIO(576),
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Colors.primaryColor,
        borderRadius: HEIGHT_BASE_RATIO(12),

    },
    confirmText: {
        fontSize: FONT_SIZE(25),
        color: Colors.white,
        fontFamily: "Inter-Bold"
    },
    buttonStyle: {
        position: "absolute",
        bottom: HEIGHT_BASE_RATIO(45),
        right: HEIGHT_BASE_RATIO(45),
        height: HEIGHT_BASE_RATIO(80),
        width: WIDTH_BASE_RATIO(150),
        backgroundColor: Colors.darkYellow,
    },
    buttonStyle2: {
        // position: "absolute",
        //bottom: HEIGHT_BASE_RATIO(45),
        //right: HEIGHT_BASE_RATIO(45),
        marginTop: HEIGHT_BASE_RATIO(15),
        alignSelf: "flex-end",
        height: HEIGHT_BASE_RATIO(80),
        width: WIDTH_BASE_RATIO(150),
        backgroundColor: Colors.darkYellow,
    },
    titleStyle: {
        fontSize: FONT_SIZE(30),
        color: Colors.black,
        fontFamily: "Inter-Bold",
        alignSelf: "center",
        marginStart: HEIGHT_BASE_RATIO(30)
    },

    modelHeader: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        // backgroundColor: "green"

    },
    attributeText: {
        fontSize: FONT_SIZE(20),
        color: Colors.borderColor,
        fontFamily: "Inter-Bold"
    },
    rightArrowContain: {
        height: HEIGHT_BASE_RATIO(57),
        width: HEIGHT_BASE_RATIO(57),
        borderRadius: HEIGHT_BASE_RATIO(77) / 2,
        // position: "absolute",
        // top: HEIGHT_BASE_RATIO(27),
        //left: WIDTH_BASE_RATIO(27),
        backgroundColor: Colors.borderColor,
        justifyContent: "center",

        alignItems: "center"
    },
    commentTypeContainer: {
        height: HEIGHT_BASE_RATIO(76),
        width: WIDTH_BASE_RATIO(113),
        backgroundColor: Colors.white,
        borderRadius: HEIGHT_BASE_RATIO(12),
        borderWidth: HEIGHT_BASE_RATIO(2),
        borderColor: Colors.borderColor,
        justifyContent: "center",
        alignItems: "center"
    },
    textStyle: {
        fontSize: FONT_SIZE(30),
        color: Colors.black,
        fontFamily: "Inter-Bold"

    },
    loaderView:
    {
        position: "absolute",
        top: HEIGHT_BASE_RATIO(350),
        justifyContent: "center",
        alignSelf: "center",
        justifyContent: "center"
    },
    textinputStyle: {
        //height: HEIGHT_BASE_RATIO(77),
        // width: WIDTH_BASE_RATIO(479),
        backgroundColor: Colors.transparent,
        //justifyContent: "center",
        //alignItems: "center",
        fontSize: FONT_SIZE(25),
        color: Colors.black,
        fontFamily: "Inter-Bold",
        width: "100%",
        // minHeight: HEIGHT_BASE_RATIO(40)
        maxHeight: HEIGHT_BASE_RATIO(250),
    },
    inputContainer: {
        flexDirection: "row",
        maxHeight: HEIGHT_BASE_RATIO(250),
        backgroundColor: Colors.transparent,
        borderRadius: HEIGHT_BASE_RATIO(12),
        borderWidth: HEIGHT_BASE_RATIO(2),
        borderColor: Colors.borderColor,
        width: "100%",
        // alignItems: "center",
        justifyContent: 'space-between',
        paddingHorizontal: WIDTH_BASE_RATIO(1),

    },

})

export default React.memo(BottomModel);