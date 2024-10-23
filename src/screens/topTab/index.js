
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useTranslation } from "react-i18next";
import { Image, SafeAreaView, StyleSheet, Text } from "react-native";
import { images } from "../../assets/images";
import { Colors } from "../../constant/color";
import { HEIGHT_BASE_RATIO, WIDTH_BASE_RATIO } from "../../constant/sizeHelper";
import { Strings } from "../../constant/string";
import ApplicationsScreen from "./applications";
import FunctionScreen from "./functions";
import ParameterScreen from "./parameters";
import PersonaliserScreen from "./personaliser";

export const TopTabbar = () => {
    const TopTab = createMaterialTopTabNavigator()
    const { t } = useTranslation()
    return (
        <>
            <SafeAreaView style={{ backgroundColor: Colors.white }} />
            <TopTab.Navigator initialRouteName={Strings.PARAMETERS}

                screenOptions={{
                    tabBarBounces: false,
                    tabBarPressColor: Colors.white,

                    animationEnabled: false,
                    swipeEnabled: false,
                    tabBarIndicatorStyle: styles.tabBarIndicatorStyle,

                    headerShown: false,
                    tabBarStyle: styles.tabBarSty,
                }}
            >
                <TopTab.Screen options={{

                    tabBarLabel: ({ focused }) => (
                        <Text
                            numberOfLines={1}
                            //adjustsFontSizeToFit={true}
                            style={[styles.topTabBarLabel, {
                                color: focused ?
                                    Colors.primaryColor :
                                    Colors.black
                            }]}

                        >{t("PARAMETERS")}</Text>
                    ),// Labal
                    tabBarIcon: ({ focused }) => (

                        <Image
                            source={images.gearIcon}
                            style={[styles.tabIconSty,
                            {
                                tintColor: focused ?
                                    Colors.primaryColor :
                                    Colors.black
                            }]}
                            resizeMode={"contain"}
                        />

                    ), //  icon
                }}
                    name={Strings.PARAMETERS}
                    component={ParameterScreen} />

                <TopTab.Screen
                    options={{

                        tabBarLabel: ({ focused }) => (
                            <Text

                                style={[styles.topTabBarLabel, {
                                    color: focused ?
                                        Colors.primaryColor :
                                        Colors.black
                                }]}
                                numberOfLines={1}
                            //adjustsFontSizeToFit={true}
                            >{t("APPLICATIONS")}</Text>
                        ), // Labal
                        tabBarIcon: ({ focused }) => (

                            <Image
                                source={images.applicationIcon}
                                style={[styles.tabIconSty,
                                {
                                    tintColor: focused ?
                                        Colors.primaryColor :
                                        Colors.black
                                }]}
                                resizeMode={"contain"}
                            />
                        ), //  icon
                    }}
                    name={Strings.APPLICATIONS}
                    component={ApplicationsScreen} />
                <TopTab.Screen

                    options={{

                        tabBarLabel: ({ focused }) => (
                            <Text style={[styles.topTabBarLabel, {
                                color: focused ?
                                    Colors.primaryColor :
                                    Colors.black
                            }]}
                                numberOfLines={1}
                            // adjustsFontSizeToFit={true}
                            >{t("FUNCTIONS")}</Text>
                        ),
                        tabBarIcon: ({ focused }) => (

                            <Image
                                source={images.functionIcon}
                                style={[styles.tabIconSty,
                                {

                                    tintColor: focused ?
                                        Colors.primaryColor :
                                        Colors.black
                                }]}
                                resizeMode={"contain"}
                            />
                        ),
                    }}

                    name={Strings.FUNCTIONS}
                    component={FunctionScreen} />
                {/* <TopTab.Screen
                    options={{

                        tabBarLabel: ({ focused }) => (
                            <Text style={[styles.topTabBarLabel, {
                                color: focused ?
                                    Colors.primaryColor :
                                    Colors.black
                            }]}
                                numberOfLines={1}
                            // adjustsFontSizeToFit={true}
                            >{t("PERSONALISER")}</Text>
                        ),
                        tabBarIcon: ({ focused }) => (

                            <Image
                                source={images.editIcon}
                                style={[styles.reTourIconStyle,
                                {
                                    tintColor: focused ?
                                        Colors.primaryColor :
                                        Colors.black
                                }]}
                                resizeMode={"contain"}
                            />
                        ),
                    }}
                    name={Strings.PERSONALISER}
                    component={PersonaliserScreen} /> */}

            </TopTab.Navigator>
        </>

    );
}
const styles = StyleSheet.create({
    tabIconSty: {
        height: HEIGHT_BASE_RATIO(48),
        width: WIDTH_BASE_RATIO(48),
        resizeMode: "contain"

    },
    tabBarSty: {
        height: HEIGHT_BASE_RATIO(132),
        borderBottomStartRadius: HEIGHT_BASE_RATIO(30),
        borderBottomEndRadius: HEIGHT_BASE_RATIO(30)
    },
    reTourIconStyle: {
        height: HEIGHT_BASE_RATIO(40),
        width: WIDTH_BASE_RATIO(40),
        resizeMode: "contain"
    },
    topTabBarLabel: {
        fontSize: HEIGHT_BASE_RATIO(14),
        color: Colors.black,
        marginTop: HEIGHT_BASE_RATIO(10),
        fontFamily: "Inter-Bold"
    },
    tabBarIndicatorStyle: {
        backgroundColor: Colors.primaryColor,
        width: WIDTH_BASE_RATIO(180),
        alignSelf: "center",
        marginStart: WIDTH_BASE_RATIO(30)
    }
})