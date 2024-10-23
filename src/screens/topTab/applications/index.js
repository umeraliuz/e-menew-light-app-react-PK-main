import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { images } from "../../../assets/images";
import { ApplicationList } from "../../../constant/constantList";
import { clientCallNotification, getOrderList, getOrderNotification, readClientNotification, updateCart, updatetableObject } from "../../../redux";
import { ORDER_PLACE, POS_CLIENT_NOTIFICATION } from "../../../redux/actions/types";
import Design from "./design";

const ApplicationsScreen = () => {
    const { t } = useTranslation()
    const [applicationList, setApplicationList] = useState(ApplicationList)
    const { user } = useSelector((state) => state.auth);

    const { isLoading } = useSelector((state) => state.home);
    const { clientNotificationList, takeawayOrderList } = useSelector((state) => state.application);
    const { isOrderPlace } = useSelector((state) => state.cart);
    const [columnNames, setColunmNames] = useState([])
    const [tableData, setTableData] = useState([])
    const [tableTitle, setTableTile] = useState("")
    const [isModelvisible, setModelvisible] = useState(false)
    const [isLoadings, setLoadings] = useState(false)
    const dispatch = useDispatch()
    const nav = useNavigation()

    // console.log("clientNotificationLis...t", clientNotificationList);
    const ApplicationList = [
        {
            id: 1,
            name: t("RECHERCHE"),
            icon: images.ticketIcon,
            action: () => onSelectedItem('RECHERCHE'),
            disabled: true

        },
        {
            id: 2,
            name: t("RESERVATION"),
            icon: images.reservIcon,
            action: () => onSelectedItem('RESERVATION'),
            disabled: true

        },
        {
            id: 3,
            name: t("PARTENAIRE"),
            icon: images.handshakIcon,
            action: () => onSelectedItem('PARTENAIRE'),
            disabled: true

        },
        {
            id: 4,
            name: t("LIVRAISON"),
            icon: images.bikeIcon,
            action: () => onSelectedItem('LIVRAISON'),
            disabled: true

        },
        {
            id: 5,
            name: t("COMMANDE"),
            icon: images.commandIcon,
            action: () => onSelectedItem('COMMANDE'),
            disabled: true

        },
        {
            id: 6,
            name: t("CLICK_COLLECT"),
            icon: images.collectIcon,
            action: () => onSelectedItem('CLICK_COLLECT'),
            disabled: true

        },
        //         {
        //             id: 7,
        //             name: t("CALCULATRICE"),
        //             icon: images.calculatorIcon,
        //             action: () => onSelectedItem('CALCULATRICE'),
        //             disabled: true
        //
        //         },
        {
            id: 8,
            name: t("APPEL"),
            icon: images.notificationIcon,
            action: () => onSelectedItem('APPEL'),
            disabled: clientNotificationList?.length > 0 ? false : true,
            badge: clientNotificationList?.length

        },
        {
            id: 9,
            name: t("EMPORTER"),
            icon: images.emporterIcon,
            action: () => onSelectedItem('EMPORTER'),
            disabled: takeawayOrderList?.length > 0 ? false : true,
            badge: takeawayOrderList?.length

        }
    ]

    const onSelectedItem = (type) => {
        if (type === "RECHERCHE") {

        } else if (type === "RESERVATION") {
            setColunmNames(['No of Persons', 'Date', 'Time', 'Action'])
            setTableTile(t('RESERVATION'))
            setTableData([])
            showModel()

        } else if (type === "PARTENAIRE") {

        } else if (type === "LIVRAISON") {
            setColunmNames(['Time', 'Order#', 'Detail'])
            setTableTile(t('LIVRAISON'))
            setTableData([])
            showModel()

        } else if (type === "COMMANDE") {

        } else if (type === "CLICK_COLLECT") {
            setColunmNames(['Time', 'Order#', 'Detail'])
            setTableTile(t('CLICK_COLLECT'))
            setTableData([])
            showModel()

        } else if (type === "CALCULATRICE") {

        } else if (type === "APPEL") {
            setColunmNames([t('TABLE'), t('INFORMATION_TYPE'), t('TIME')])
            setTableTile(t('CLIENT_REQUEST'))
            setTableData(clientNotificationList)
            showModel()

        } else if (type === "EMPORTER") {
            setColunmNames([t('TIME'), t('COMMANDE'), t('DETAIL')])
            setTableTile(t('TAKEAWAY_ORDERS'))
            // commonRootApiCalling("EMPORTER")
            setTableData(takeawayOrderList)
            showModel()

        }

    }

    const commonRootApiCalling = (type) => {
        let data = {}

        if (type === "EMPORTER") {
            data.order_type = "00T"
            dispatch(getOrderNotification(data, setTableData))
        } else if (type == "orderTicket") {

        }

    }

    const showModel = () => {

        setModelvisible(!isModelvisible)
    }
    const onPressTableItem = (item, index, type) => {
        if (type == t('CLIENT_REQUEST')) {

            let data = {
                "notification_id": item.id
            }
            dispatch(readClientNotification(data))
            let clientNotificationLists = [...clientNotificationList]
            console.log(item, index)

            clientNotificationLists.splice(index, 1)
            dispatch({
                type: POS_CLIENT_NOTIFICATION,
                payload: clientNotificationLists,
            });
            setTableData(clientNotificationLists)
        } else if (type == t('TAKEAWAY_ORDERS')) {
            getOrder(item)
        }

        //showModel()

    }

    const onFreeOrder = (item) => {
        let obj = {

            "tag_reference": "00T",
            "table_number": "00T",
            order_id: item.parent_id

        }
        if (isOrderPlace) {
            dispatch({
                type: ORDER_PLACE,
                payload: false
            })
        }
        dispatch(updateCart([]))
        dispatch(updatetableObject(obj))
        showModel()
        // nav.navigate('Home')

    }
    const getOrder = (item, index,) => {
        setLoadings(true)
        let data = {
            "order_id": item.parent_id,
            "sub_order_id": item?.sub_order_id ? item.sub_order_id : 0
        }
        dispatch(getOrderList(data, nav, setLoadings))
        onFreeOrder(item)

    }

    return (
        <Design
            applicationList={ApplicationList}
            onSelectedItem={onSelectedItem}
            tableData={tableData}
            showModel={showModel}
            isModelvisible={isModelvisible}
            isLoading={isLoading}
            columnNames={columnNames}
            tableTitle={tableTitle}
            isLoadings={isLoadings}
            onPressTableItem={onPressTableItem}

        />
    )

}
export default ApplicationsScreen