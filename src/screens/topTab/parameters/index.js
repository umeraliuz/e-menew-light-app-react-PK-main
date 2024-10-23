import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { images } from "../../../assets/images";
import { Strings } from "../../../constant/string";
import { getBookingList, logoutUser } from "../../../redux";
import { ENAGLISH_LANGUAGE } from "../../../redux/actions/types";
import RNRestart from 'react-native-restart'

import Design from "./design";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert, NativeModules, Platform } from "react-native";

const ParameterScreen = () => {
    const { isEnglish, printerTags } = useSelector((state) => state.home);

    const { t, i18n } = useTranslation()
    const nav = useNavigation()
    const dispatch = useDispatch()
    const { PrinterModule } = NativeModules;
    const { user } = useSelector((state) => state.auth);
    const [isLanguageModel, setIsLanguageMode] = useState(false)
    const [columnNames, setColunmNames] = useState([])
    const [tableData, setTableData] = useState([])
    const [tableTitle, setTableTile] = useState("")
    const [isModelvisible, setModelvisible] = useState(false)
    const [isLoadings, setLoadings] = useState(false)
    const [showReservationModel, setShowReservationModel] = useState(false)
    const [languageList, setLanguageList] = useState([
        {
            id: 1,
            name: "English",
            icon: images.englishFlag,
            ISO: "en"
        },
        {
            id: 2,
            name: "French",
            icon: images.franceFlag,
            ISO: "fr"
        },
    ])

    const ParametresList = [
        //         {
        //             id: 1,
        //             name: t("LIVRAISON"),
        //             icon: images.bikeIcon,
        //             action: () => onSelectedItem('LIVRAISON'),
        //             disabled: true
        //
        //         },
        {
            id: 2,
            name: t("CLIENT"),
            icon: images.clientIcon,
            action: () => onSelectedItem('CLIENT'),
            disabled: true

        },

        {
            id: 4,
            name: t("TABLE"),
            icon: images.diningTableIcon,
            action: () => onSelectedItem('TABLE'),
            disabled: false

        },
        {
            id: 5,
            name: t("RESERVATION"),
            icon: images.reservIcon,
            action: () => onSelectedItem('RESERVATION'),
            disabled: false

        },
        {
            id: 6,
            name: t("STATISTIQUE"),
            icon: images.statIcon,
            action: () => onSelectedItem('STATISTIQUE'),
            disabled: true

        },
        {
            id: 7,
            name: t("CONNECT_PRINTER"),
            icon: { uri: "https://tryngo-services.com/restaurant/assets/emenewpos/printer.png" },
            action: () => onSelectedItem('CONNECT_PRINTER'),
            disabled: Platform.OS == "ios"

        },
        //         {
        //             id: 8,
        //             name: t("MENU"),
        //             icon: images.menuIcon,
        //             action: () => onSelectedItem('MENU'),
        //             disabled: true
        //
        //         },
        {
            id: 9,
            name: t("RAPPORT"),
            icon: images.reportIcon,
            action: () => onSelectedItem('RAPPORT'),
            disabled: true

        },
        {
            id: 10,
            name: t("LANGUAGE"),
            icon: images.languagesIcon,
            action: () => onSelectedItem('LANGUAGE'),
            disabled: false

        },
        {
            id: 3,
            name: t("LOGOUT"),
            icon: images.logoutIcon,
            action: () => onSelectedItem('LOGOUT'),
            disabled: false

        },

    ]
    // const [parametersList, setParametersList] = useState(ParametresList)
    const onSelectedItem = (type) => {
        if (type === "LIVRAISON") {

        } else if (type === "CLIENT") {

        } else if (type === "TABLE") {
            nav.navigate('Table')

        } else if (type === "RESERVATION") {
            let data = {}
            dispatch(getBookingList(data, setTableData))
            setColunmNames([t('NOOFPERSON'), t('DATE'), t('TIME')])
            setTableTile(t('RESERVATION'))
            // setTableData([{ person: 5, time: "12:00", date: "12/06/2023" }])
            showModel()

        } else if (type === "STATISTIQUE") {

        } else if (type === "CONNECT_PRINTER") {
            const newTags = [
                { id: 11, tag_name: 'Kitchen' },
                { id: 22, tag_name: 'Bar' },
                { id: 33, tag_name: 'Store' },
            ];
            //  const device = new PrintingDevice(newTags);
            PrinterModule.PrintingDevice(JSON.stringify(printerTags))

        } else if (type === "MENU") {

        } else if (type === "RAPPORT") {

        } else if (type === "LANGUAGE") {
            languageModel()

        } else if (type === "LOGOUT") {
            dispatch(logoutUser())
        }

    }

    useEffect(() => {
        checkalreadySelectedLang()
    }, [])

    const checkalreadySelectedLang = async () => {

        let langList = [...languageList]
        const userLang = await AsyncStorage.getItem("USER_LANG");

        langList.forEach(res => {

            if (res.ISO === userLang) {
                res.isSelected = true
            } else {
                res.isSelected = false
            }
        })
        setLanguageList(langList)

    }

    const onLangChange = async (item) => {

        const lang = item.ISO
        //const isLangRTL = lang === 'ar';
        /** 1. Store user-preferred lang  */
        await AsyncStorage.setItem("USER_LANG", lang);
        /** 2. re-translate the app to `lang`  */
        await i18n.changeLanguage(lang);
        if (Platform.OS == "android") {
            let language = lang == "en" ? "en" : "fr"
            PrinterModule.setLocale(language)
        }
        /** 3. */
        // if (isLangRTL !== I18nManager.isRTL) {
        //     /** Change app direction in case of mismatch */
        //     // await I18nManager.allowRTL(isLangRTL);
        //     // await I18nManager.forceRTL(isLangRTL);
        //     /** Force restart for the app for the changes to take effect */
        //
        //}
        RNRestart.Restart();
    };

    const languageModel = () => {

        setIsLanguageMode(!isLanguageModel)
    }

    const showModel = () => {

        setModelvisible(!isModelvisible)
    }

    const onPressTableItem = (item, index, type) => {
        if (type == t('RESERVATION')) {
            alert("acha theak hai smjh gaya")
        } else if (type == t('TAKEAWAY_ORDERS')) {

        }

        //showModel()
    }

    const addReservation = () => {
        showModel()
        showReservationModelFun()

    }

    const showReservationModelFun = () => {
        setShowReservationModel(!showReservationModel)
    }

    return (
        <Design
            onSelectedItem={onSelectedItem}
            parametersList={ParametresList}
            languageList={languageList}
            onLangChange={onLangChange}
            languageModel={languageModel}
            isLanguageModel={isLanguageModel}
            tableData={tableData}
            showModel={showModel}
            isModelvisible={isModelvisible}
            columnNames={columnNames}
            tableTitle={tableTitle}
            isLoadings={isLoadings}
            onPressTableItem={onPressTableItem}
            addReservation={addReservation}
            showReservationModelFun={showReservationModelFun}
            showReservationModel={showReservationModel}
        />
    )

}
export default ParameterScreen