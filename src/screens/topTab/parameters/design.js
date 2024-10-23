import React from "react";
import { useTranslation } from "react-i18next";
import { View, Text, FlatList, Alert } from "react-native"
import AddReservationModel from "../../../component/AddReservationModel";
import CommonListItem from "../../../component/CommonListItem";
import LanguageListModel from "../../../component/LanguageListModel";
import ListModel from "../../../component/ListModel";
import { HEIGHT_BASE_RATIO, WIDTH_BASE_RATIO } from "../../../constant/sizeHelper";
import { Strings } from "../../../constant/string";
import { styles } from "./styles";

const Design = (props) => {
    const { t } = useTranslation()
    const renderItem = ({ item, index }) => {

        return (
            <View style={{
                marginEnd: WIDTH_BASE_RATIO(22),
                marginTop: HEIGHT_BASE_RATIO(20)
            }}>
                <CommonListItem
                    item={item}
                    index={index}
                    onPressItem={props.onSelectedItem}
                />
            </View>

        )
    }

    return (
        <>
            <View style={styles.container}>

                <FlatList
                    numColumns={3}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{
                        paddingTop: HEIGHT_BASE_RATIO(30),
                        paddingBottom: HEIGHT_BASE_RATIO(30)
                    }}
                    data={props.parametersList}
                    renderItem={renderItem}
                    keyExtractor={(item) => "T" + item.id}
                    key={(item) => "T" + item.id}
                />

            </View>
            {props.isLanguageModel &&
                <View style={styles.alertView}>
                    <LanguageListModel
                        languageList={props.languageList}
                        onLangChange={props.onLangChange}
                        languageModel={props.languageModel}
                    />
                </View>}
            {<ListModel
                columnNames={props.columnNames}
                visible={props.isModelvisible}
                isLoading={false}
                data={props.tableData}
                title={props.tableTitle}
                close={props.showModel}
                isSearch={false}
                onPressTableItem={props.onPressTableItem}
                isButton={true}
                buttonTitle={t("ADD_RESERVATION")}
                buttonAction={props.addReservation}

            />}
            {props.showReservationModel && <View style={styles.alertView}>
                <AddReservationModel
                    close={props.showReservationModelFun}
                />
            </View>

            }
        </>
    )
}
export default Design