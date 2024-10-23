import { groupBy } from 'lodash';
import React from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, FlatList, SafeAreaView, SectionList, Text, View } from "react-native";
import CustomAlert2 from '../../../component/CustomAlert2';
import CustomButton from "../../../component/CustomButton";
import CustomSearch from "../../../component/CustomSearch";
import CustomSwitch from "../../../component/CustomSwitch";
import Header from "../../../component/Header";
import SplitOrderList from "../../../component/SplitOrderList";
import TableListItem from "../../../component/TableListItem";
import TableMargeSplitAlert from "../../../component/TableMargeSplitAlert";
import { Colors } from "../../../constant/color";
import { HEIGHT_BASE_RATIO, WIDTH_BASE_RATIO } from "../../../constant/sizeHelper";
import { styles } from "./styles";

const Design = (props) => {
    const { t } = useTranslation()
    let data = props.filterTableList?.length > 0 || props.searchTex !== '' ?
        props.filterTableList : props.tables
    //seating_capacity   table_group
    const groupedData = groupBy(data, 'table_group_name');

    const sections = Object.entries(groupedData).map(([title, data]) => ({
        title,
        data: [{ list: data }],
    }));

    const renderItem = ({ item, index }) => {

        return (
            <View style={{
                marginEnd: WIDTH_BASE_RATIO(30),
                marginTop: HEIGHT_BASE_RATIO(16),

            }}>
                <TableListItem
                    item={item}
                    index={index}
                    onPressItem={props.onSelectedTable}
                    onLongPress={props.releaseTable}

                />
            </View>

        )
    }
    const renderSectionHeader = ({ section }) => {
        return (
            <View style={styles.sectionHeader}>
                <Text style={styles.titleStyle}>
                    {section.title}
                </Text>
            </View>
        )

    };
    const renderSectionListItem = ({ item }) => {
        // console.log("renderSectionListItem", item);
        return (
            <FlatList
                numColumns={5}
                showsVerticalScrollIndicator={false}
                //  style={{ marginTop: HEIGHT_BASE_RATIO(30) }}
                contentContainerStyle={{ paddingBottom: HEIGHT_BASE_RATIO(30) }}
                data={item.list}
                ListEmptyComponent={() => {

                    return (
                        props.isLoading ?
                            null
                            :
                            <Text style={{ alignSelf: "center" }}>{t("NO_TABLE_FOUND")}</Text>
                    )
                }}
                renderItem={renderItem}
                keyExtractor={(item, index) => item.id}
            />
        )
    }

    return (
        // console.log("renderSectionListItem", props.tables),
        <>
            <Header
                title={props.isMoveTable ? t("DEPLACER") : t("TABLE")}
                disabled={true}
                isRightButton={props.isMoveTable}
                onPressRight={props.onCancelMoveTable}
                titleRight={t("CANCEL")}

            />
            <View style={styles.container}>

                {!props.isMoveTable && <CustomSwitch
                    disabled={props.isMoveTable}
                    label1={t("COMMENDES")}
                    label2={t("COMMENDES_FIBRE")}
                    onToggle={props.onToggle}
                    containerStyle={{ marginTop: HEIGHT_BASE_RATIO(47) }}
                />}
                {props.tableOrder ? <>
                    <CustomSearch
                        placeholder={t("SEARCH_TABLE")}
                        onChangeText={props.searchTable}
                        containerStyle={{ marginTop: HEIGHT_BASE_RATIO(23) }}
                        isNumeric={true}
                        searchTex={props.searchTex}
                    />
                    <SectionList
                        numColumns={5}
                        sections={sections}
                        renderItem={renderSectionListItem}
                        showsVerticalScrollIndicator={false}
                        renderSectionHeader={renderSectionHeader}
                        contentContainerStyle={{ paddingBottom: HEIGHT_BASE_RATIO(30) }}
                    />

                </> :
                    <View style={{ justifyContent: "center", alignItems: "center" }}>
                        <CustomButton
                            name={t("NEW_ORDER")}
                            containerStyle={{ marginTop: HEIGHT_BASE_RATIO(400) }}
                            onPress={props.onFreeOrder}

                        />
                    </View>

                }

            </View>
            {props.isLoading &&
                <View style={styles.alertView}>
                    <ActivityIndicator
                        olor={Colors.primaryColor}
                        size={"large"}

                    />
                </View>

            }
            {props.isTableHaveAlreadOrder && <View style={styles.alertView}>
                <TableMargeSplitAlert
                    onPressDone={props.onMergeSplitTable}
                    close={props.mergeAlert}

                />

            </View>}
            {props.splitOrderModel && <View style={styles.alertView}>
                <SplitOrderList
                    onPressDone={props.onMergeSplitTable}
                    close={props.showSplitOrderModel}
                    splitOrderList={props.splitOrderList}
                    isLoading={props.isLoading}
                    getSplitOrderDetail={props.getSplitOrderDetail}

                />
            </View>}
        </>
    )
}
export default Design