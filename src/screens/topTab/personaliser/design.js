import React from "react";
import { useTranslation } from "react-i18next";
import { View, Text, FlatList } from "react-native"
import PesonaliserListItem from "../../../component/PesonaliserListItem";
import { HEIGHT_BASE_RATIO } from "../../../constant/sizeHelper";
import { Strings } from "../../../constant/string";
import { styles } from "./styles";

const Design = (props) => {
    const { t } = useTranslation()
    const renderItem = ({ item, index }) => {

        return (
            <View style={{
                marginTop: HEIGHT_BASE_RATIO(15)
            }}>
                <PesonaliserListItem
                    item={item}
                    index={index}
                    onPressItem={props.onSelectedTable}

                />
            </View>
        )
    }
    return (
        <View style={styles.container}>
            <FlatList

                style={{ marginTop: HEIGHT_BASE_RATIO(57) }}
                data={props.personaliserList}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={() => {
                    return (
                        <Text style={{ alignSelf: "center" }}>{t("NO_DATA_FOUND")}</Text>
                    )
                }}
                renderItem={renderItem}
                keyExtractor={(item, index) => index + 1}
            />
        </View>
    )
}
export default Design