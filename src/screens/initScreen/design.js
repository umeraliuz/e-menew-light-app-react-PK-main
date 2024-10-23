

import { useNavigation } from "@react-navigation/native";
import React from "react";
import { View, Text, TouchableOpacity } from "react-native"
import { Colors } from "../../constant/color";
import { HEIGHT_BASE_RATIO } from "../../constant/sizeHelper";
import { BottomTab } from "../bottomTab";
import { TopTabbar } from "../topTab";
import { styles } from "./styles";



const Design = ({ props }) => {
    const navigation = useNavigation()
    return (
        <>
            {/* <TopTabbar /> */}
            <BottomTab />
            {/* <View style={{ flex: 1, justifyContent: "space-between" }}>
                <View style={{
                    height: HEIGHT_BASE_RATIO(132),
                    borderBottomStartRadius: HEIGHT_BASE_RATIO(60),
                    borderBottomEndRadius: HEIGHT_BASE_RATIO(60),
                    backgroundColor: Colors.white,

                }}>

                </View>
                <View style={{
                    height: HEIGHT_BASE_RATIO(132),
                    borderTopStartRadius: HEIGHT_BASE_RATIO(60),
                    borderTopEndRadius: HEIGHT_BASE_RATIO(60),
                    backgroundColor: Colors.white,

                }}>

                </View>
            </View> */}
        </>
    )
}
export default Design