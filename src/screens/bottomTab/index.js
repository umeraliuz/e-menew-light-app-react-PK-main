import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Image, Platform, SafeAreaView, StyleSheet, Text, View, BackHandler } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { images } from "../../assets/images";
import { showCustomAlert } from "../../constant/Alert";
import { Colors } from "../../constant/color";
import { HEIGHT_BASE_RATIO, WIDTH_BASE_RATIO } from "../../constant/sizeHelper";
import { Strings } from "../../constant/string";
import { TopTabbar } from "../topTab";
import CommandeScreen from "./commande";
import HomeScreen from "./home";
import RetourScreen from "./retour";
import TableScreen from "./tables";

export const BottomTab = () => {
    //const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true)
    const { t } = useTranslation()
    const Tab = createBottomTabNavigator()
    const dispatch = useDispatch()
    const nav = useNavigation()
    const { tableObject, isMoveTable } = useSelector((state) => state.table)
    const { cart, discountObject } = useSelector((state) => state.cart)
    const isOrderAllItemPaid = cart.every(res => res.is_paid === 3)
    const disabledAllTab = isMoveTable
    const orderedTabDisable = isMoveTable
    const homeTabDisable = isMoveTable || discountObject?.discount || (tableObject?.orderType && tableObject?.orderType !== "main" && isOrderAllItemPaid)
    const tableTabDisable = isMoveTable
    const moreTabDisable = isMoveTable

    return (
        <>
            <Tab.Navigator initialRouteName={Strings.TABLE}

                screenOptions={{
                    headerShown: false,
                    tabBarStyle: styles.tabBarSty,
                }}
                backBehavior="initialRoute"

            >

                <Tab.Screen options={{

                    tabBarLabel: ({ focused }) => (
                        <>
                            <Text style={[styles.topTabBarLabel, {
                                color: focused ?
                                    Colors.primaryColor :
                                    (cart?.length > 0 && !isMoveTable) ?
                                        Colors.badgeColor :
                                        Colors.borderColor
                            }]}
                                numberOfLines={1}
                                adjustsFontSizeToFit={true}
                            >{t("COMMANDE")}</Text>
                            <View style={[styles.line, {
                                backgroundColor: focused ?
                                    Colors.primaryColor : Colors.white
                            }]} />
                        </>
                    ),// Labal
                    tabBarIcon: ({ focused }) => (

                        <Image
                            source={images.commandeIcon}
                            style={[styles.tabIconSty,
                            {
                                tintColor: focused ?
                                    Colors.primaryColor :
                                    (cart?.length > 0 && !isMoveTable) ?
                                        Colors.badgeColor :
                                        Colors.borderColor
                            }]}
                            resizeMode={"contain"}
                        />

                    ), //  icon
                }}
                    name={Strings.COMMANDE}
                    component={CommandeScreen}
                    listeners={{
                        tabPress: e => {
                            // Prevent default action
                            { (cart?.length == 0 || isMoveTable) && e.preventDefault(); }
                        }
                    }
                    }
                />

                <Tab.Screen
                    options={{

                        tabBarLabel: ({ focused }) => (
                            <>
                                <Text style={[styles.topTabBarLabel, {
                                    color: focused ?
                                        Colors.primaryColor :
                                        homeTabDisable ?
                                            Colors.borderColor
                                            :
                                            Colors.black
                                }]}
                                    numberOfLines={1}
                                    adjustsFontSizeToFit={true}
                                >{t("HOME")}</Text>
                                <View style={[styles.line, {
                                    backgroundColor: focused ?
                                        Colors.primaryColor : Colors.white
                                }]} />
                            </>
                        ), // Labal
                        tabBarIcon: ({ focused }) => (

                            <Image
                                source={images.homeIcon}
                                style={[styles.tabIconSty,
                                {
                                    tintColor: focused ?
                                        Colors.primaryColor :
                                        homeTabDisable ?
                                            Colors.borderColor
                                            :
                                            Colors.black
                                }]}
                                resizeMode={"contain"}
                            />
                        ), //  icon
                    }}
                    name={Strings.HOME}
                    component={HomeScreen}
                    listeners={{
                        tabPress: e => {
                            // Prevent default action
                            if (tableObject?.orderType && tableObject?.orderType !== "main" && isOrderAllItemPaid) {

                                showCustomAlert(dispatch, true, "", "", t('SPLIT_PAID_UPDATE_MSG'), "")
                            } else if (discountObject?.discount) {

                                showCustomAlert(dispatch, true, "", "", t('AFTER_DISCOUNT_MSG'), "")
                            }
                            { homeTabDisable && e.preventDefault(); }
                        }
                    }
                    }
                />

                <Tab.Screen

                    options={{

                        tabBarLabel: ({ focused }) => (
                            <>
                                <Text style={[styles.topTabBarLabel, {
                                    color: (focused || tableObject !== "Table") ?
                                        Colors.primaryColor :
                                        tableTabDisable ?
                                            Colors.borderColor :
                                            Colors.black
                                }]}
                                    numberOfLines={1}
                                    adjustsFontSizeToFit={true}
                                >{tableObject?.table_number ? tableObject?.table_number : t("TABLE")}</Text>
                                <View style={[styles.line, {
                                    backgroundColor: focused ?
                                        Colors.primaryColor
                                        : Colors.white
                                }]} />
                            </>
                        ),
                        tabBarIcon: ({ focused }) => (
                            <Image
                                source={images.diningTableIcon}
                                style={[styles.tabIconSty,
                                {

                                    tintColor: focused ?
                                        Colors.primaryColor :
                                        tableTabDisable ?
                                            Colors.borderColor
                                            :
                                            Colors.black
                                }]}
                                resizeMode={"contain"}
                            />
                        ),
                    }}

                    name={Strings.TABLE}
                    component={TableScreen}
                    listeners={{

                        tabPress: e => {

                            // Prevent default action
                            { tableTabDisable && e.preventDefault(); }

                        }

                    }
                    }
                />
                <Tab.Screen
                    options={{

                        tabBarLabel: ({ focused }) => (
                            <>
                                <Text style={[styles.topTabBarLabel, {
                                    color: focused ?
                                        Colors.primaryColor :
                                        moreTabDisable ?
                                            Colors.borderColor :
                                            Colors.black
                                }]}
                                    numberOfLines={1}
                                    adjustsFontSizeToFit={true}
                                >{t("MORE")}</Text>
                                <View style={[styles.line, {
                                    backgroundColor: focused ?
                                        Colors.primaryColor : Colors.white
                                }]} />
                            </>
                        ),
                        tabBarIcon: ({ focused }) => (

                            <Image
                                source={images.moreIcon}
                                style={[styles.reTourIconStyle,
                                {
                                    tintColor: focused ?
                                        Colors.primaryColor :
                                        moreTabDisable ?
                                            Colors.borderColor :
                                            Colors.black
                                }]}
                                resizeMode={"contain"}
                            />
                        ),
                    }}
                    name={Strings.MORE}
                    component={TopTabbar}
                    listeners={{
                        tabPress: e => {
                            // Prevent default action
                            { moreTabDisable && e.preventDefault(); }
                        }
                    }
                    } />

            </Tab.Navigator>

        </>

    );
};

export const BottomTab2 = () => {
    const Tab = createBottomTabNavigator();
    const { tableObject } = useSelector((state) => state.table)
    return (
        <>
            <Tab.Navigator initialRouteName={Strings.TABLE}
                screenOptions={{
                    headerShown: false,
                    tabBarStyle: styles.tabBarSty,
                }}

            >

                <Tab.Screen
                    options={{

                        tabBarLabel: ({ focused }) => (
                            <>
                                <Text style={[styles.topTabBarLabel, {
                                    color: focused ?
                                        Colors.primaryColor :
                                        Colors.black
                                }]}
                                >{Strings.HOME}</Text>
                                <View style={[styles.line, {
                                    backgroundColor: focused ?
                                        Colors.primaryColor : Colors.white
                                }]} />
                            </>
                        ), // Labal
                        tabBarIcon: ({ focused }) => (

                            <Image
                                source={images.homeIcon}
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
                    name={Strings.HOME}
                    component={HomeScreen} />
                <Tab.Screen

                    options={{

                        tabBarLabel: ({ focused }) => (
                            <>
                                <Text style={[styles.topTabBarLabel, {
                                    color: (focused || tableObject !== "Table") ?
                                        Colors.primaryColor :
                                        Colors.black
                                }]}
                                >{tableObject?.table_number ? tableObject.table_number : tableObject}</Text>
                                <View style={[styles.line, {
                                    backgroundColor: focused ?
                                        Colors.primaryColor : Colors.white
                                }]} />
                            </>
                        ),
                        tabBarIcon: ({ focused }) => (
                            <Image
                                source={images.diningTableIcon}
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

                    name={Strings.TABLE}
                    component={TableScreen} />
                <Tab.Screen
                    options={{

                        tabBarLabel: ({ focused }) => (
                            <>
                                <Text style={[styles.topTabBarLabel, {
                                    color: focused ?
                                        Colors.primaryColor :
                                        Colors.black
                                }]}
                                >{Strings.RETOUR}</Text>
                                <View style={[styles.line, {
                                    backgroundColor: focused ?
                                        Colors.primaryColor : Colors.white
                                }]} />
                            </>
                        ),
                        tabBarIcon: ({ focused }) => (

                            <Image
                                source={images.reTourIcon}
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
                    name={Strings.RETOUR}
                    component={TopTabbar} />

            </Tab.Navigator>

        </>

    );
};

const styles = StyleSheet.create({
    tabIconSty: {
        height: HEIGHT_BASE_RATIO(70),
        width: WIDTH_BASE_RATIO(70),
        resizeMode: "contain"

    },
    tabBarSty: {
        height: Platform.OS === 'ios' ? HEIGHT_BASE_RATIO(160) : HEIGHT_BASE_RATIO(132),
        justifyContent: "center",
        alignItems: "center",
        borderTopStartRadius: HEIGHT_BASE_RATIO(30),
        borderTopEndRadius: HEIGHT_BASE_RATIO(30),
        borderWidth: 1,
        borderColor: Colors.borderColor,
    },
    reTourIconStyle: {
        height: HEIGHT_BASE_RATIO(40),
        width: WIDTH_BASE_RATIO(40),
        resizeMode: "contain"
    },
    topTabBarLabel: {
        fontSize: HEIGHT_BASE_RATIO(16),
        color: Colors.black,
        fontFamily: "Inter-Bold"
    },
    line: {
        marginVertical: HEIGHT_BASE_RATIO(5),
        height: HEIGHT_BASE_RATIO(5),
        backgroundColor: Colors.primaryColor,
        width: "80%"
    }
})