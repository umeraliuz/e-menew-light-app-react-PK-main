import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { images } from "../../../assets/images";
import { onOrderHold } from "../../../redux";
import { getOrderTicket, giveTips } from "../../../redux/actions/functions";
import { TO_MOVE } from "../../../redux/actions/types";
import CommandeScreen from "../../bottomTab/commande";

import Design from "./design";
import moment from "moment";
import base64 from "react-native-base64";
import { IMAGE_BASE_URL } from "../../../api/baseUrl";
import { NativeModules } from "react-native";

const FunctionScreen = () => {
    const { t } = useTranslation()
    const dispatch = useDispatch()
    const nav = useNavigation()
    const { PrinterModule } = NativeModules;

    const tableObject = useSelector((state) => state.table.tableObject)

    const { user } = useSelector((state) => state.auth);
    const { cart, discountObject, removeItemIds } = useSelector((state) => state.cart);
    const { isLoading, restuarntLogo } = useSelector((state) => state.home);
    const [functionList, setFunctionList] = useState('')
    const [isAlert, setIsAlert] = useState(false)
    const [isModelvisible, setModelvisible] = useState(false)
    const [text, setText] = useState("")
    const [columnNames, setColunmNames] = useState([])
    const [tableData, setTableData] = useState([])
    const [tableTitle, setTableTile] = useState("")
    const [isLoadings, setLoadings] = useState(false)

    const FunctionsList = [
        {
            id: 1,
            name: t("PAUSE"),
            icon: images.pauseIcon,
            action: () => onSelectedItem('PAUSE'),
            disabled: (cart.length > 0 && tableObject?.tag_reference !== "00T") ? false : true

        },
        //         {
        //             id: 2,
        //             name: t("OFFERT"),
        //             icon: images.giftIcon,
        //             action: () => onSelectedItem('OFFERT'),
        //             disabled: true
        //
        //         },
        {
            id: 3,
            name: t("ENCAISSER"),
            icon: images.cashIcon,
            action: () => onSelectedItem('ENCAISSER'),
            disabled: true

        },
        {
            id: 4,
            name: t("TICKET"),
            icon: images.ticketIcon,
            action: () => onSelectedItem('TICKET'),
            disabled: false

        },
        {
            id: 5,
            name: t("POURBOIRE"),
            icon: images.cashBankIcon,
            action: () => onSelectedItem('POURBOIRE'),
            disabled: user.tips_status !== 1

        },
        {
            id: 6,
            name: t("NOTE"),
            icon: images.noteIcon,
            action: () => onSelectedItem('NOTE'),
            disabled: true

        },
        {
            id: 7,
            name: t("DEPLACER"),
            icon: images.textIcon,
            action: () => onSelectedItem('DEPLACER'),
            disabled: (cart.length > 0 && cart.every(res => res.is_paid)) ? false : true

        },
        //         {
        //             id: 8,
        //             name: t("REMISE"),
        //             icon: images.remiseIcon,
        //             action: () => onSelectedItem('REMISE'),
        //             disabled: true
        //
        //         },
        {
            id: 9,
            name: t("SCAN"),
            icon: images.scanIcon,
            action: () => onSelectedItem('SCAN'),
            disabled: true

        }
    ]

    const onSelectedItem = (type) => {
        if (type === "PAUSE") {
            convertProductToOrderFormat()
        } else if (type === "OFFERT") {

        } else if (type === "ENCAISSER") {

        } else if (type === "TICKET") {
            orderTicket()

        } else if (type === "POURBOIRE") {
            showAlert()
        } else if (type === "NOTE") {

        } else if (type === "DEPLACER") {
            dispatch({
                type: TO_MOVE,
                payload: true
            })
            nav.navigate("Table")

        } else if (type === "REMISE") {

        } else if (type === "SCAN") {

        }

    }

    const showAlert = () => {

        setIsAlert(!isAlert)
        if (!isAlert)
            setText('')

    }
    const giveTip = () => {
        if (text?.length > 0) {
            commonRootApiCalling("giveTip")
        }

    }
    const commonRootApiCalling = (type) => {
        let data = {}
        if (type === "giveTip") {
            data.currency_id = user?.currency_id,
                data.order_tips = text
            dispatch(giveTips(data))
            showAlert()
            setText('')
        } else if (type == "orderTicket") {
            dispatch(getOrderTicket(data, setTableData))
        }

    }
    const textChange = (text) => {
        setText(text)
    }
    const orderTicket = () => {
        setColunmNames([t('TICKET_ID'), t('PAYMENT_METHOD'), t('AMOUNT'), t("TIME"), t("PRINT")])
        setTableTile(t('TICKET'))
        commonRootApiCalling("orderTicket")
        showModel()
    }

    const showModel = () => {

        setModelvisible(!isModelvisible)
    }

    const convertProductToOrderFormat1 = (cb) => {

        let proArry = []
        let totalP = 0
        //         cart?.forEach(res => {
        //             if (res.is_paid !== 3) {
        //                 totalP = totalP + res.price * res.quantity
        //                 let proObj = {
        //                     "product_id": res.product_id,
        //                     "quantity": res.quantity,
        //                     "options": {
        //                         "product_extra": {},
        //                         "product_extra_quantity": 0,
        //                         "attrbuite_id": res?.attrribute_id ? res?.attrribute_id : 0,
        //                         "price": res.price,
        //                         "sale_price": res.price,
        //                         "actual_price": res.price,
        //                         "extras_price": 0,
        //                         "extras_original_price": 0,
        //                         "extras_discounted_price": 0,
        //                         "rate_percent": 0,
        //                         "instructions": {},
        //                         "ingrdients": {},
        //                         "comments": {},
        //                         "special_note": res.special_note ? res.special_note : ""
        //                     }
        //                 }
        //                 proArry.push(proObj)
        //             }
        //
        //         })
        cart?.forEach(res => {
            if (res.is_paid !== 3) {
                let product_extra = []
                totalP = totalP + res.price * res.quantity

                if (res.product_extra) {

                    res.product_extra.forEach(ing => {

                        let obj = {}
                        obj.id = ing.id
                        obj.qty = ing.quantity
                        product_extra.push(obj)
                        if (ing.extra_price) {
                            totalP = totalP + ing.extra_price * ing.quantity
                        }
                    })
                }

                let proObj = {
                    "product_id": res.product_id,
                    "quantity": res.quantity,
                    "options": {
                        "product_extra": product_extra?.length > 0 ? { ...product_extra } : {},
                        "product_extra_quantity": 0,
                        "attrbuite_id": res?.attrribute_id ? res?.attrribute_id : 0,
                        "price": res.price,
                        "sale_price": res.price,
                        "actual_price": res.price,
                        "extras_price": 0,
                        "extras_original_price": 0,
                        "extras_discounted_price": 0,
                        "rate_percent": 0,
                        "instructions": res.instructions ? { ...res.instructions } : {},
                        "ingrdients": res.ingrdients ? { ...res.ingrdients } : {},
                        "comments": res.comments ? { ...res.comments } : {},
                        "special_note": res.special_note ? res.special_note : ""
                    }
                }
                proArry.push(proObj)
            }

        })

        //return proArry
        holdOrder(proArry, totalP)

    }

    const convertProductToOrderFormat = (cb) => {

        let proArry = []
        let totalP = 0
        let sumOfProDis = 0
        let discount = 0
        cart?.forEach(res => {
            if (res.is_paid !== 3 && res?.isOffert != "offert") {
                let product_extra = []
                totalP = totalP + res.price * res.quantity

                if (res?.category_type_id == discountObject?.category_type_id) {
                    sumOfProDis = sumOfProDis + res.price * res.quantity
                }

                if (res.product_extra) {

                    res.product_extra.forEach(ing => {
                        if (ing?.isOffert != "offert") {
                            let obj = {}
                            obj.id = ing.id
                            obj.qty = ing?.haveOffertItem ? ing.freeQuantity + ing.quantity : ing.quantity
                            obj.free_item_type = ing?.haveOffertItem ? ing.free_item_type : 0
                            obj.free_quantity = ing?.haveOffertItem ? ing.freeQuantity : 0
                            product_extra.push(obj)
                        }
                        if (ing.extra_price) {
                            totalP = totalP + ing.extra_price * ing.quantity
                            if (res?.category_type_id == discountObject?.category_type_id) {
                                sumOfProDis = sumOfProDis + ing.extra_price * ing.quantity
                            }
                        }
                    })
                }

                let proObj = {
                    "product_id": res.product_id,
                    "quantity": res?.haveOffertItem ? res.freeQuantity + res.quantity : res.quantity,
                    "free_item_type": res?.haveOffertItem ? res.free_item_type : 0,
                    "free_quantity": res?.haveOffertItem ? res.freeQuantity : 0,
                    "options": {
                        "product_extra": product_extra?.length > 0 ? { ...product_extra } : {},
                        "product_extra_quantity": 0,
                        "attrbuite_id": res?.attrribute_id ? res?.attrribute_id : 0,
                        "price": res.price,
                        "sale_price": res.price,
                        "actual_price": res.price,
                        "extras_price": 0,
                        "extras_original_price": 0,
                        "extras_discounted_price": 0,
                        "rate_percent": 0,
                        "instructions": res.instructions ? { ...res.instructions } : {},
                        "ingrdients": res.ingrdients ? { ...res.ingrdients } : {},
                        "comments": res.comments ? { ...res.comments } : {},
                        "special_note": res?.special_notes ? res?.special_notes : "",
                        "order_item_id": res?.order_item_id ? res?.order_item_id : 0

                    }
                }
                if (!res.in_kitchen) {
                    proArry.push(proObj)
                }
            }

        })

        if (discountObject?.category_type_id == "rabais") {

            discount = discountObject.discount

        }
        else if (discountObject?.category_type_id == "global") {
            discount = (totalP * Number(discountObject.discount)) / 100
        }
        else if (discountObject?.category_type_id) {
            discount = (sumOfProDis * Number(discountObject.discount)) / 100

        }

        holdOrder(proArry, totalP, discount)

    }

    const holdOrder = async (productFormat, totalPrice) => {
        setLoadings(true)

        //   let productFormat = convertProductToOrderFormat()

        let orderData = {

            "table_id": String(tableObject.tag_reference),
            "gmap_latitude": 0.000,
            "gmap_longitude": 0.000,
            "phone_number_format": user.phone_number,
            "user_email": user.email,
            "lang": "en",
            "take_away": 0,
            "order_method": "0",
            "takeaway": 0,
            "delivery_charges": 0,
            "shiping_charges": 0,
            "payment_type": "Cash",
            "additional_notes": "",
            "subtotal": totalPrice,
            "total_price": totalPrice,
            "products": productFormat,
            "order_id": tableObject.order_id,
            "discount_type": discountObject?.category_type_id ? discountObject?.category_type_id : "0",
            "discount_value": discountObject?.discount ? discountObject?.discount : "0",
            "remove_discount": discountObject?.discount ? 0 : 1,
            "remove_items": removeItemIds,
            "sub_order_id": tableObject.sub_order_id ? tableObject.sub_order_id : 0,
        }
        console.log("before on hold order  object", orderData);
        dispatch(onOrderHold(orderData, nav, setLoadings))

    }
    const getTicketData = (data) => {

        let xmlStringForPrint = ''

        let proArry = []
        let totalP = 0
        let sumOfProDis = 0
        let discount = 0
        data?.order_items.forEach((res, indx) => {
            console.log("getTicketData/..", res)
            xmlStringForPrint = xmlStringForPrint + `[L]${res.quantity};;[L]${res?.product_detail.product_name};;[R]${res.price}${'\n'}`
            let product_extra = []
            totalP = totalP + res.price * res.quantity

            if (res.extra_price_json) {

                res.extra_price_json.forEach(ing => {
                    xmlStringForPrint = xmlStringForPrint + `[L]${ing.quantity};;[L]+${ing.extra_name};;[R]${ing.extra_price}${'\n'}`

                    if (ing.extra_price) {
                        totalP = totalP + ing.extra_price * ing.quantity

                    }
                })
            }

        })

        // setTotalPrice(totalP)
        // setSubTotal(totalP)
        // setDiscountAmount(discount)
        // //return proArry
        // setProductFormat(proArry)
        xmlStringForPrint = xmlStringForPrint.replace(/((\s*\S+)*)\s*/, "$1")
        // setProductsPrinterStr(xmlStringForPrint)

        printerRecipt(data, xmlStringForPrint, totalP, discount)

    }

    function urlSafeBase64Encode(str) {
        var base = base64.encode(str);
        return base.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    }
    const printerRecipt = (data, xmlStringForPrint, totalP, discount) => {
        let street_address = user?.street_address || '',
            postcode_city = user?.postcode_city || '',
            phone_number = user?.phone_number || '',
            resturantName = user?.restaurant.trading_name || ''

        console.log("user...", user)

        let recipt_str = `<receipt>default
[C]<img>LOGO|96|96</img>
[C]<font size='big'>${resturantName}</font>
<T>1;;1
[L]Table: ${data.table_id};;[R]<font color='bg-black'> Ticket Id: 004 </font>
[L]${moment().format("DD-MM-YYYY")};;[R]${moment().format("H:mm")}
</T>

<T>1;;4;;2
[L]Qt;;[L]Produits;;[R]CHF
${xmlStringForPrint}
</T>
<dashed-line>
<T>1;;4;;2
[L] ;;[L]Sous-total;;[R]${(totalP).toFixed(2)}
</T>
<dashed-line>
<T>1;;4;;2
[L] ;;[L]Réduction;;[R]${(discount).toFixed(2)}
[L] ;;[L]<b>Total payé</b>;;[R]<b>${(totalP - discount).toFixed(2)}</b>
[L] ;;[L]TVA 0% (0);;[R]0
</T>

[C]<font size='big'>Merci pour votre visite.</font>

[L]Notes : ""

[L]${street_address}
[L] ${postcode_city}
[L]Tel ${phone_number}
[L]RC CHE-113.302.913
</receipt>`

        console.log(recipt_str)
        let stringBase = urlSafeBase64Encode(recipt_str)

        //         let stringBase2 = base64.encode(recipt_str2)

        let url = 'empplight://print?econtent=' + stringBase + "&image_tags=<LOGO>" + `&image_urls=<${IMAGE_BASE_URL + restuarntLogo}/>`
        console.log("recipt_str", url)
        // PrinterModule.setLanguage('fr')
        PrinterModule.PrintingService(url)

    }
    return (
        <Design
            onSelectedItem={onSelectedItem}
            functionList={FunctionsList}
            showAlert={showAlert}
            textChange={textChange}
            giveTip={giveTip}
            isAlert={isAlert}
            tableData={tableData}
            showModel={showModel}
            isModelvisible={isModelvisible}
            isLoading={isLoading}
            columnNames={columnNames}
            tableTitle={tableTitle}
            text={text}
            isLoadings={isLoadings}
            getTicketData={getTicketData}
        />
    )

}
export default FunctionScreen