import React from "react";
import { View, Text, FlatList, ActivityIndicator } from "react-native"
import CommonListItem from "../../../component/CommonListItem";
import ListModel from "../../../component/ListModel";
import { Colors } from "../../../constant/color";
import { HEIGHT_BASE_RATIO, WIDTH_BASE_RATIO } from "../../../constant/sizeHelper";
import { Strings } from "../../../constant/string";
import { styles } from "./styles";

const Design = (props) => {
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
                    data={props.applicationList}
                    renderItem={renderItem}
                    keyExtractor={(item) => "T" + item.id}
                    key={(item) => "T" + item.id}
                />
                {<ListModel
                    columnNames={props.columnNames}
                    visible={props.isModelvisible}
                    isLoading={false}
                    data={props.tableData}
                    title={props.tableTitle}
                    close={props.showModel}
                    isSearch={false}
                    onPressTableItem={props.onPressTableItem}
                />}

            </View>
            {props.isLoadings &&
                <View style={styles.alertView}>
                    <ActivityIndicator
                        olor={Colors.primaryColor}
                        size={"large"}

                    />
                </View>

            }
        </>
    )
}
export default Design