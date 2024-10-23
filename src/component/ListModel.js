import moment from "moment";
import React, { useState } from "react";

import { useTranslation } from "react-i18next";
import { ActivityIndicator, FlatList, Image, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { images } from "../assets/images";
import { Colors } from "../constant/color";
import { FONT_SIZE, HEIGHT_BASE_RATIO, WIDTH_BASE_RATIO } from "../constant/sizeHelper";
import CustomButton from "./CustomButton";
import CustomSearch from "./CustomSearch";

const ListModel = (props) => {
    const { t } = useTranslation()
    const [filterList, setFilterList] = useState([])
    const [searchTex, setSearchTex] = useState('')

    const renderItem = ({ item, index }) => {

        let idX = (props?.data?.length - index) >= 100 ?
            props?.data?.length - index :
            (props?.data?.length - index) >= 10 ?
                "0".concat(props?.data?.length - index) :
                "00".concat(props?.data?.length - index)

        return (
            <View style={{

                backgroundColor: index % 2 !== 1 ? "transparent" : Colors.white,
                paddingVertical: HEIGHT_BASE_RATIO(27),
                flexDirection: "row",
            }}>

                <View style={{ width: WIDTH_BASE_RATIO(632) / props.columnNames.length, justifyContent: "center", alignItems: "center" }}>
                    <Text style={[styles.tableHeaderTitle, { color: Colors.black, fontSize: HEIGHT_BASE_RATIO(18) }]}>{`${idX} (${item.table_id})`}</Text>
                </View>
                <View style={{ width: WIDTH_BASE_RATIO(632) / props.columnNames.length, justifyContent: "center", alignItems: "center" }}>
                    <Text style={[styles.tableHeaderTitle, { color: Colors.black, fontSize: HEIGHT_BASE_RATIO(18) }]}>{item.payment_method}</Text>
                </View>
                <View style={{ width: WIDTH_BASE_RATIO(632) / props.columnNames.length, justifyContent: "center", alignItems: "center" }}>
                    <Text style={[styles.tableHeaderTitle, { color: Colors.black, fontSize: HEIGHT_BASE_RATIO(18) }]}>{item.amount_paid}</Text>
                </View>
                <View style={{ width: WIDTH_BASE_RATIO(632) / props.columnNames.length, justifyContent: "center", alignItems: "center" }}>
                    <Text style={[styles.tableHeaderTitle, { color: Colors.black, fontSize: HEIGHT_BASE_RATIO(18) }]}>{moment.unix(item.created_at_str).format('DD-MM-YYYY HH:mm:ss')}</Text>
                </View>
                <TouchableOpacity onPress={() => props.getTicketData(item)} style={{ width: WIDTH_BASE_RATIO(632) / props.columnNames.length, justifyContent: "center", alignItems: "center" }}>
                    <Image style={styles.imageStyle} source={{ uri: "https://tryngo-services.com/restaurant/assets/emenewpos/printer.png" }} />
                </TouchableOpacity>

            </View>

        )
    }
    const searchTable = (text) => {
        let seartText = text.toLowerCase()
        setSearchTex(seartText)
        let filterT = props.data.filter(res => {
            if (String(res.table_id).includes(seartText)) return res

        })
        setFilterList(filterT)
    }
    const renderClientNofiItem = ({ item, index }) => {

        let idX = (props?.data?.length - index) >= 100 ?
            props?.data?.length - index :
            (props?.data?.length - index) >= 10 ?
                "0".concat(props?.data?.length - index) :
                "00".concat(props?.data?.length - index)

        return (
            <TouchableOpacity
                onPress={() => props.onPressTableItem(item, index, props.title)}
                style={{
                    backgroundColor: index % 2 !== 1 ? "transparent" : Colors.white,
                    paddingVertical: HEIGHT_BASE_RATIO(27),
                    flexDirection: "row",
                }}>

                <View style={{ width: WIDTH_BASE_RATIO(632) / props.columnNames.length, justifyContent: "center", alignItems: "center" }}>
                    <Text style={[styles.tableHeaderTitle, { color: Colors.black, fontSize: HEIGHT_BASE_RATIO(18) }]}>{`${idX} (${item.table_id})`}</Text>
                </View>
                <View style={{ width: WIDTH_BASE_RATIO(632) / props.columnNames.length, justifyContent: "center", alignItems: "center" }}>
                    <Image source={item.notification_type == 1 ?
                        images.infoIcon :
                        item.notification_type == 3 ?
                            images.cashIcon : images.editIcon}
                        style={{ width: WIDTH_BASE_RATIO(25), height: HEIGHT_BASE_RATIO(25), tintColor: Colors.black }}

                    />
                </View>

                <View style={{ width: WIDTH_BASE_RATIO(632) / props.columnNames.length, justifyContent: "center", alignItems: "center" }}>
                    {/* moment.unix(item.updated_at).format('DD-MM-YYYY HH:mm:ss') */}
                    <Text style={[styles.tableHeaderTitle, { color: Colors.black, fontSize: HEIGHT_BASE_RATIO(18) }]}>{item.created_at}</Text>
                </View>

            </TouchableOpacity>

        )
    }
    const renderTakeawayOrderItem = ({ item, index }) => {

        return (
            <View

                style={{
                    backgroundColor: index % 2 !== 1 ? "transparent" : Colors.white,
                    paddingVertical: HEIGHT_BASE_RATIO(27),
                    flexDirection: "row",
                }}>

                <View style={{ width: WIDTH_BASE_RATIO(632) / props.columnNames.length, justifyContent: "center", alignItems: "center" }}>
                    <Text style={[styles.tableHeaderTitle, { color: Colors.black, fontSize: HEIGHT_BASE_RATIO(18) }]}>{moment.unix(item.created_at_stamp).format('HH:mm')}</Text>
                </View>
                <View style={{ width: WIDTH_BASE_RATIO(632) / props.columnNames.length, justifyContent: "center", alignItems: "center" }}>
                    <Text style={[styles.tableHeaderTitle, { color: Colors.black, fontSize: HEIGHT_BASE_RATIO(18) }]}>{item.restaurant_oid
                    }</Text>
                </View>

                <TouchableOpacity
                    onPress={() => props.onPressTableItem(item, index, props.title)}
                    style={{ width: WIDTH_BASE_RATIO(632) / props.columnNames.length, justifyContent: "center", alignItems: "center" }}>
                    {/* moment.unix(item.updated_at).format('DD-MM-YYYY HH:mm:ss') */}
                    <Text style={[styles.tableHeaderTitle, { color: Colors.blue, fontSize: HEIGHT_BASE_RATIO(25) }]}>{t('DETAIL')}</Text>
                </TouchableOpacity>

            </View>

        )
    }
    const renderReservationItem = ({ item, index }) => {

        return (
            <View

                style={{
                    backgroundColor: index % 2 !== 1 ? "transparent" : Colors.white,
                    paddingVertical: HEIGHT_BASE_RATIO(27),
                    flexDirection: "row",
                }}>

                <View style={{ width: WIDTH_BASE_RATIO(632) / props.columnNames.length, justifyContent: "center", alignItems: "center" }}>
                    <Text style={[styles.tableHeaderTitle, { color: Colors.black, fontSize: HEIGHT_BASE_RATIO(18) }]}>{item.no_of_people}</Text>
                </View>
                <View style={{ width: WIDTH_BASE_RATIO(632) / props.columnNames.length, justifyContent: "center", alignItems: "center" }}>
                    <Text style={[styles.tableHeaderTitle, { color: Colors.black, fontSize: HEIGHT_BASE_RATIO(18) }]}>{moment(item.date_time_arrival).format("YYYY-MM-DD")
                    }</Text>
                </View>
                <View style={{ width: WIDTH_BASE_RATIO(632) / props.columnNames.length, justifyContent: "center", alignItems: "center" }}>
                    <Text style={[styles.tableHeaderTitle, { color: Colors.black, fontSize: HEIGHT_BASE_RATIO(18) }]}>{item.arrival_hour
                    }</Text>
                </View>

                {/* <TouchableOpacity
                    onPress={() => props.onPressTableItem(item, index, props.title)}
                    style={{ width: WIDTH_BASE_RATIO(632) / props.columnNames.length, justifyContent: "center", alignItems: "center" }}>
                    <Text style={[styles.tableHeaderTitle, { color: Colors.blue, fontSize: HEIGHT_BASE_RATIO(25) }]}>{t('ACTION')}</Text>
                </TouchableOpacity> */}

            </View>

        )
    }
    return (
        <View>
            {/* <StatusBar hidden={true} /> */}
            <Modal
                visible={props.visible}
                transparent
                elevation={40}
                statusBarTranslucent
                style={styles.container}>

                <View style={styles.mainContainer} >

                    <View>
                        <View style={styles.modelContainer}>
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
                            <View style={{ maxHeight: HEIGHT_BASE_RATIO(900), paddingHorizontal: WIDTH_BASE_RATIO(29), paddingBottom: HEIGHT_BASE_RATIO(20) }}>
                                {props.isSearch && <CustomSearch
                                    onChangeText={searchTable}
                                    placeholder={t('SEARCH_TICKET')}
                                    containerStyle={{ marginTop: HEIGHT_BASE_RATIO(23) }}
                                />}
                                {props.isButton && <CustomButton
                                    name={props.buttonTitle}
                                    containerStyle={{
                                        alignSelf: "flex-end",
                                        marginTop: HEIGHT_BASE_RATIO(25),
                                        height: HEIGHT_BASE_RATIO(77),
                                        width: WIDTH_BASE_RATIO(300)
                                    }}
                                    onPress={props.buttonAction}
                                />}

                                <View style={styles.tableHeader}>
                                    {props.columnNames.map(name => {
                                        return (
                                            <View key={name} style={{ width: WIDTH_BASE_RATIO(632) / props.columnNames.length, justifyContent: "center", alignItems: "center" }}>
                                                <Text style={styles.tableHeaderTitle}>{name}</Text>
                                            </View>
                                        )
                                    })
                                    }
                                </View>
                                {(props.isLoading) ?
                                    <View style={{ position: "absolute", top: HEIGHT_BASE_RATIO(210), justifyContent: "center", alignSelf: "center", justifyContent: "center" }}>
                                        <ActivityIndicator
                                            color={Colors.primaryColor}
                                            size={"small"}
                                        />
                                    </View>

                                    : <FlatList

                                        style={{ borderColor: Colors.borderColor, borderWidth: 1, borderBottomStartRadius: HEIGHT_BASE_RATIO(20), borderBottomEndRadius: HEIGHT_BASE_RATIO(20) }}
                                        data={filterList?.length > 0 || searchTex !== '' ?
                                            filterList : props.data}
                                        contentContainerStyle={{
                                            paddingTop: HEIGHT_BASE_RATIO(10),
                                            //paddingBottom: HEIGHT_BASE_RATIO(150)
                                        }}
                                        ListEmptyComponent={() => {
                                            return (
                                                <Text style={{ alignSelf: "center" }}>{t("NO_DATA_FOUND")}</Text>
                                            )
                                        }}
                                        showsVerticalScrollIndicator={false}
                                        renderItem={props.title === t('CLIENT_REQUEST') ?
                                            renderClientNofiItem :
                                            props.title === t('TAKEAWAY_ORDERS') ?
                                                renderTakeawayOrderItem :
                                                props.title === t('RESERVATION') ?
                                                    renderReservationItem :
                                                    renderItem
                                        }
                                        keyExtractor={(item, index) => "SC" + item.id}
                                        key={(item, index) => "SC" + item.id}
                                    />
                                }
                            </View>
                        </View>
                    </View>
                </View>

                {/* </TouchableWithoutFeedback> */}
            </Modal>
        </View>
    )

}

const styles = StyleSheet.create({
    container: {
        height: "100%",
    },
    mainContainer: {

        height: "100%",

        backgroundColor: Colors.borderColor,
        justifyContent: "center",
        paddingHorizontal: WIDTH_BASE_RATIO(15),
    },
    modelContainer: {

        backgroundColor: Colors.modelBackgroundColor,
        maxHeight: HEIGHT_BASE_RATIO(1080),
        borderRadius: HEIGHT_BASE_RATIO(20),
        paddingBottom: HEIGHT_BASE_RATIO(25),
        zIndex: 33,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 18,
        },
        shadowOpacity: 0.25,
        shadowRadius: 20.00,
        elevation: 24

    },
    imageStyle: {
        height: WIDTH_BASE_RATIO(57),
        width: WIDTH_BASE_RATIO(57),
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
    titleStyle: {
        fontSize: FONT_SIZE(30),
        color: Colors.white,
        fontFamily: "Inter-Bold",
        alignSelf: "center",
        marginStart: HEIGHT_BASE_RATIO(30)
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
    tableHeader: {

        width: "100%",
        flexDirection: "row",
        // justifyContent: "space-around",
        alignItems: "center",
        backgroundColor: Colors.darkYellow,
        paddingVertical: WIDTH_BASE_RATIO(20),
        marginTop: HEIGHT_BASE_RATIO(16),
        borderTopLeftRadius: HEIGHT_BASE_RATIO(20),
        borderTopRightRadius: HEIGHT_BASE_RATIO(20),
    },
    tableHeaderTitle: {
        fontSize: FONT_SIZE(20),
        color: Colors.white,
        fontFamily: "Inter-Bold",

    }

})

export default React.memo(ListModel);