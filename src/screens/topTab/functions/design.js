import React, { useRef } from "react";
import { useTranslation } from "react-i18next";
import { View, Text, FlatList, ActivityIndicator } from "react-native"
import CommonListItem from "../../../component/CommonListItem";
import ListModel from "../../../component/ListModel";
import PromptAlert from "../../../component/PromptAlert";
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
                    data={props.functionList}
                    renderItem={renderItem}
                    keyExtractor={(item) => "T" + item.id}
                    key={(item) => "T" + item.id}
                />

            </View>
            {props.isAlert &&
                <View style={styles.alertView}>
                    <PromptAlert
                        title={t("POURBOIRES")}
                        onTextChange={props.textChange}
                        onPressDone={props.giveTip}
                        close={props.showAlert}
                        buttonName={t('DONE')}
                        placeholder={t('POURBOIRES')}
                        value={props.text}
                    />
                </View>
            }
            {<ListModel
                columnNames={props.columnNames}
                visible={props.isModelvisible}
                isLoading={props.isLoading}
                data={props.tableData}
                title={props.tableTitle}
                close={props.showModel}
                isSearch
                getTicketData={props.getTicketData}
            />}
            {props.isLoadings &&
                <View style={styles.alertView}>
                    <ActivityIndicator

                    />
                </View>

            }
        </>
    )
}
export default Design