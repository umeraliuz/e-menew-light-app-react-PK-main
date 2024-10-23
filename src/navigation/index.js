import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { StyleSheet, View } from "react-native";
import { useSelector } from "react-redux";
import CustomAlert from "../component/CustomAlert";
import { Colors } from "../constant/color";
import { NavigationPath } from "../constant/navigationRoute";
import { WIDTH_BASE_RATIO } from "../constant/sizeHelper";

import ForgotPasswordScreen from "../screens/auth/forgotPassword";
import LoginScreen from "../screens/auth/login";
import { BottomTab } from "../screens/bottomTab";

const Stack = createNativeStackNavigator();

const Navigation = ({ params }) => {

  const { token } = useSelector((state) => state.auth);
  // console.log("createNativeStackNavigator", token)

  return (
    <NavigationContainer>
      {<View style={styles.alertView}
      >
        <CustomAlert />
      </View>}
      {token ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
};

function AuthStack() {
  return (
    <Stack.Navigator
      initialRouteName={NavigationPath.LOGIN}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name={NavigationPath.LOGIN} component={LoginScreen} />
      <Stack.Screen name={NavigationPath.FORGOT_PASSWORD} component={ForgotPasswordScreen} />

    </Stack.Navigator>
  );
}
function AppStack() {
  const { tableObject } = useSelector((state) => state.table)
  return (
    <Stack.Navigator
      initialRouteName={NavigationPath.MAIN}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name={NavigationPath.MAIN} component={BottomTab} />

    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  alertView: {
    position: "absolute",
    //flex: 1,
    height: "100%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.borderColor,
    paddingHorizontal: WIDTH_BASE_RATIO(27),
    zIndex: 0,

  }
})
export default Navigation;
