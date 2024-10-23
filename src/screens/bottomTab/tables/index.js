import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Linking } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { hideAlert, showCustomAlert } from "../../../constant/Alert";
import {
    assignSplitTable,
    changeTable,
    clientCallNotification,
    getOrderList,
    getOrderNotification,
    getSplitOrderList,
    getTables,
    mergeTable,
    releaseTables,
    splitTable,
    updateCart,
    updatetableObject,
} from "../../../redux";
import { ORDER_PLACE, REMOVE_ITEM_IDS, TO_MOVE } from "../../../redux/actions/types";

import Design from "./design";

const TableScreen = () => {
    const nav = useNavigation()
    const dispatch = useDispatch()
    const { t } = useTranslation()

    const [filterTableList, setFilterTableKList] = useState([])
    const [searchTex, setSearchTex] = useState('')
    const { tables, isMoveTable } = useSelector((state) => state.table);
    const [tableList, setTableList] = useState([])
    const { user } = useSelector((state) => state.auth);
    const { isOrderPlace } = useSelector((state) => state.cart);
    const tableObject = useSelector((state) => state.table.tableObject)
    const [isLoading, setLoading] = useState(false)
    const [tableOrder, setTableOrder] = useState(true)
    const [isTableHaveAlreadOrder, setIsTableHaveAlreadOrder] = useState(false)
    const [splitOrderModel, setSplitOrderModel] = useState(false)
    const [mergeSplitTable, setMergeSplitTable] = useState('')
    const [splitOrderList, setSplitOrderList] = useState([])
    const { clientNotificationList } = useSelector((state) => state.application);
    const [currentSelectedTable, setcurrentSelectedTable] = useState({})
    const clientNotificationRef = useRef()
    const takeawayNotificationRef = useRef()
    const intervalRef = useRef()
    //const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true)
    useEffect(() => {
        console.log("Table")
        setLoading(true)
        loadTable()

    }, [isOrderPlace])

    const loadTable = () => {
        let data = {}
        data.token = user.token_app
        data.user_id = user.id
        data.restaurant_id = user.restaurant_id

        dispatch(getTables(data, checkAleadySelectedTable, tableObject.table_number))
    }

    const checkAleadySelectedTable = (data, table) => {

        if (!isOrderPlace) {
            data.forEach((p) => {

                if (table === p.table_number) {
                    p.isSelected = true
                }
            })
        }
        setTableList(data)
        setLoading(false)

    }
    useEffect(() => {
        clearInterval(intervalRef.current)
        if (user?.token_app) {
            intervalRef.current = setInterval(loadTable, 10000);
        }
        return () => {
            clearInterval(intervalRef.current)
        }
    }, [tableObject.table_number || user.token_app])
    useEffect(() => {
        let data = {}
        clientNotificationRef.current = setInterval(() => dispatch(clientCallNotification(data)), 10000)
        data.order_type = "00T"
        takeawayNotificationRef.current = setInterval(() => {
            dispatch(getOrderNotification(data, "", "00T"))
        }, 10000)
        return () => {
            clearInterval(clientNotificationRef.current)
            clearInterval(takeawayNotificationRef.current)
        }
    }, [])

    const getOrder = (item, index,) => {
        setLoading(true)
        let data = {
            "order_id": item.order_id,
            "sub_order_id": item?.sub_order_id ? item.sub_order_id : 0
        }
        //console.log("tableObject..", data)
        dispatch(getOrderList(data, nav, setLoading))
        if (index == "No") {
            heightlightSelectedTable()
        } else {
            heightlightSelectedTable(index, item)
        }

    }

    const onSelectedTable = (index, item, type) => {

        setSearchTex('')
        setFilterTableKList([])
        // console.log("onSelectedTable", item, tableObject);
        item.index = index
        setcurrentSelectedTable(item)

        if (isMoveTable) {
            if (item.order_id) {

                if (tableObject.tag_reference == item.tag_reference) {
                    showCustomAlert(dispatch, true, "", "", t('SAME_TABLE_MSG'), '')
                    return
                }
                mergeAlert()
                setMergeSplitTable(item.tag_reference)
            } else {

                if (tableObject.is_split_Order) {

                    setLoading(true)
                    let data = {
                        "order_id": tableObject.order_id,
                        "table_id": item.tag_reference,
                        "sub_order_id": tableObject.sub_order_id
                    }

                    if (tableObject.orderType == "main") {
                        dispatch(changeTable(data, setLoading))
                    } else {

                        dispatch(assignSplitTable(data, setLoading))
                    }

                } else {
                    setLoading(true)
                    let data = {
                        "order_id": tableObject.order_id,
                        "table_id": item.tag_reference
                    }

                    dispatch(changeTable(data, setLoading))
                    // heightlightSelectedTable(index, item)
                }
            }

            return
        }

        if (isOrderPlace) {
            dispatch({
                type: ORDER_PLACE,
                payload: false
            })
        }
        dispatch({
            type: REMOVE_ITEM_IDS,
            payload: []
        })

        if (item.order_id) {
            if (item.is_split) {
                onSplitOrderList(item, index)
                showSplitOrderModel()

            } else {
                getOrder(item, index)

            }

        } else {
            if (tableObject.order_id) {
                dispatch(updateCart([]))
            }
            nav.navigate('Home')
            heightlightSelectedTable(index, item)
            //
        }

    }
    const heightlightSelectedTable = (index, itm) => {
        //  console.log("heightlightSelectedTable", itm)
        let idx = itm ? index : currentSelectedTable.index
        let item = itm ? itm : currentSelectedTable
        let d = tableList.map(res => res)
        d.forEach(e => {
            if (item.id == e.id) {
                e.isSelected = true
            } else {
                e.isSelected = false
            }
        });
        // d[idx].isSelected = true
        setTableList(d)
        dispatch(updatetableObject(item))
    }
    const onToggle = (value) => {

        setTableOrder(value)

    }
    //     setInterval(() => {
    //         let data = {
    //             "token": user.token_app,
    //             "user_id": user.id,
    //             "restaurant_id": user.restaurant_id
    //         }
    //
    //         dispatch(getTables(data, checkAleadySelectedTable))
    //
    //     }, 10000)

    const searchTable = (text) => {
        let newText = text.replace(/[^0-9]/g, '')
        let searchText = newText.toLowerCase()

        setSearchTex(searchText)
        const rge = new RegExp(`\\b${searchText}`);
        let filterT = tables.filter(res => {
            // console.log("String(res.table_number).search(`/\b${seartText}/`)", String(res.table_number).search(rge))
            if (String(res.table_number).search(rge) > -1) return res

        })
        setFilterTableKList(filterT)
    }
    const releaseTable = (index, item) => {

        if (item.order_id) {
            showCustomAlert(dispatch, true, "", "", t('RELEASE_TABLE_MSG'), yes)
            function yes() {
                dispatch({
                    type: ORDER_PLACE,
                    payload: false
                });
                setLoading(true)
                let data = {
                    "order_id": item.order_id
                }
                dispatch(releaseTables(data, "", setLoading))
                hideAlert(dispatch)
            }
        }

    }

    const onFreeOrder = () => {
        let obj = {
            "tag_reference": "00T",
            "table_number": "00T",
        }
        if (isOrderPlace) {
            dispatch({
                type: ORDER_PLACE,
                payload: false
            })
        }
        if (tableObject.order_id) {
            dispatch(updateCart([]))
        }
        dispatch(updatetableObject(obj))
        nav.navigate('Home')

    }
    const onCancelMoveTable = () => {
        dispatch({
            type: TO_MOVE,
            payload: false
        })
    }
    const mergeAlert = () => {
        setIsTableHaveAlreadOrder(!isTableHaveAlreadOrder)
    }
    const onMergeSplitTable = (type) => {
        setLoading(true)
        if (type == "merge") {
            mergeAlert()
            let data = {
                "order_id": tableObject.order_id,
                "table_id": mergeSplitTable
            }

            dispatch(mergeTable(data, setLoading))
            let d = tableList.map(res => res)
            d.forEach(e => e.isSelected = false);

            setTableList(d)

        } else if (type == "split") {
            mergeAlert()
            let data = {
                "order_id": tableObject.order_id,
                "table_id": mergeSplitTable
            }

            dispatch(splitTable(data, setLoading))
            let d = tableList.map(res => res)
            d.forEach(e => e.isSelected = false);

            setTableList(d)

        }

    }
    const showSplitOrderModel = () => {
        setSplitOrderModel(!splitOrderModel)
    }

    const onSplitOrderList = (item) => {
        setLoading(true)
        let data = {
            "table_id": item.tag_reference
        }
        dispatch(getSplitOrderList(data, setLoading, setSplitOrderList))
    }

    const getSplitOrderDetail = (index, item) => {
        currentSelectedTable.sub_order_id = index == 0 ? 0 : item.id
        currentSelectedTable.is_split_Order = true
        currentSelectedTable.orderType = index == 0 ? "main" : "sub"
        let obj = {
            "order_id": index == 0 ? item.id : item.p_order_id,
            "sub_order_id": index == 0 ? 0 : item.id

        }
        //   console.log("getSplitOrderDetail", currentSelectedTable);
        getOrder(obj, "No")
        showSplitOrderModel()
    }

    return (
        <Design
            tables={tableList}
            onSelectedTable={onSelectedTable}
            onToggle={onToggle}
            searchTable={searchTable}
            filterTableList={filterTableList}
            searchTex={searchTex}
            isLoading={isLoading}
            releaseTable={releaseTable}
            tableOrder={tableOrder}
            onFreeOrder={onFreeOrder}
            isMoveTable={isMoveTable}
            onCancelMoveTable={onCancelMoveTable}
            isTableHaveAlreadOrder={isTableHaveAlreadOrder}
            mergeAlert={mergeAlert}
            onMergeSplitTable={onMergeSplitTable}
            splitOrderModel={splitOrderModel}
            showSplitOrderModel={showSplitOrderModel}
            splitOrderList={splitOrderList}
            getSplitOrderDetail={getSplitOrderDetail}

        />
    )

}
export default TableScreen