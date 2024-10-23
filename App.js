/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect, useState, useRef } from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import SplashScreen from 'react-native-splash-screen';
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/lib/integration/react";
import './src/constant/translations/i18n';
import Navigation from "./src/navigation";
import { persister, store } from "./src/redux/store";
import NetInfo, { useNetInfo, NetInfoCellularGeneration } from "@react-native-community/netinfo";
import { View, Text, StyleSheet, NativeModules, Platform } from 'react-native';

import NoConnection from './src/component/NoConnection';
import { Colors } from './src/constant/color';
import { isLive } from './src/api/baseUrl';

const App = () => {

  const { t, i18n } = useTranslation()
  const netInfo = useNetInfo();
  const [isConnected, setIsConnected] = useState(true)

  const internCheckRef = useRef(null)

  const changeLange = async () => {
    const userLang = await AsyncStorage.getItem("USER_LANG");

    const lang = (userLang) === 'fr' ? 'fr' : 'en';
    await AsyncStorage.setItem("USER_LANG", lang);
    await i18n.changeLanguage(lang);

  }

  useEffect(() => {

    changeLange()
    setTimeout(() => {
      SplashScreen.hide();
    }, 1000);
  }, []);
  useEffect(() => {

    const unsubscribe = NetInfo.addEventListener(async state => {

      await AsyncStorage.setItem("IS_CONNECTION", state.isConnected.toString());
      setIsConnected(state.isConnected)

    });

  }, [])

  useEffect(() => {
    internCheckRef.current = setInterval(() => internetWokring(), 10000)

  }, [])
  const internetWokring = async () => {
    fetch('https://www.google.com')
      .then(async () => {
        setIsConnected(true)
        await AsyncStorage.setItem("IS_CONNECTION", 'true');
      })
      .catch(async () => {
        setIsConnected(false)
        await AsyncStorage.setItem("IS_CONNECTION", "false");
      });
  }

  return (
    <Provider store={store}>
      <PersistGate persistor={persister}>

        {/* <StatusBar hidden /> */}
        <Navigation />
        {!isConnected &&
          <View style={styles.alertView}>
            <NoConnection />
          </View>

        }
        {!isLive && <Text style={{ position: "absolute", alignSelf: "center" }}>Dev Mode</Text>}
      </PersistGate>

    </Provider>

  );
};

const styles = StyleSheet.create({
  alertView: {
    position: "absolute",
    //flex: 1,
    height: "100%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.borderColor,
    // paddingHorizontal: WIDTH_BASE_RATIO(27)
  }
})

export default App;
