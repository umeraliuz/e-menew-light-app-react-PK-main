import React from "react";
import { View, Text } from "react-native"
import { Strings } from "../../../constant/string";
import { styles } from "./styles";

const Design = () => {
    return (
        <View style={styles.container}>
            <Text>{Strings.RETOUR}</Text>
        </View>
    )
}
export default Design