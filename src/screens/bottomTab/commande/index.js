import { useNavigation } from "@react-navigation/native";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { NativeModules } from "react-native";
import base64 from 'react-native-base64';
const { PrinterModule } = NativeModules;

import { useDispatch, useSelector } from "react-redux";
import { IMAGE_BASE_URL } from "../../../api/baseUrl";
import { showCustomAlert } from "../../../constant/Alert";
import { Strings } from "../../../constant/string";
import { checkPaymentStatus, onOrderPlace, releaseTables } from "../../../redux";
import { DISCOUNT_OBJECT, ORDER_PLACE, TOTAL_PRICE } from "../../../redux/actions/types";
import Design from "./design";

const CommandeScreen = () => {
    const { cart, isOrderPlace, discountObject, currencyList, paymentList, removeItemIds, customerList } = useSelector((state) => state.cart);

    const { user } = useSelector((state) => state.auth);
    const { restuarntLogo } = useSelector((state) => state.home);
    const tableObject = useSelector((state) => state.table.tableObject)
    const [productList, setProductList] = useState(cart)
    const [productFormat, setProductFormat] = useState([])
    const [totalPrice, setTotalPrice] = useState(0)
    const [gst, setGst] = useState(0)
    const [subTotal, setSubTotal] = useState(0)
    const [paymentType, setPaymentType] = useState(null)
    const [isAlert, setAlert] = useState(false)
    const [amount, setAmount] = useState('')
    const [amountTip, setAmountTip] = useState(0)
    const [discountAmount, setDiscountAmount] = useState(0)
    const [lastOrderId, setLastOrderId] = useState(0)
    const [isCheckPayment, setIsCheckPayment] = useState(false)
    const [timeDurtion, setTimeDution] = useState(0)
    const [isLoadings, setLoadings] = useState(false)
    const [productsPrinterStr, setProductsPrinterStr] = useState('')
    const [xmlStringForVATPrint, setxmlStringForVATPrint] = useState('')
    const [xmlStringForKitchenPrint, setxmlStringForKitchenPrint] = useState('')
    const dispatch = useDispatch()
    const nav = useNavigation()
    const funRef = useRef(null);
    const isOrderAllItemPaid = cart.every(res => res.is_paid === 3)
    const isOrderAllItemPaidorKitchen = cart.every(res => res.is_paid === 3 || res.in_kitchen >= 0)
    // console.log("isOrderAllItemPaidorKitchen", isOrderAllItemPaidorKitchen)
    const { t, i18n } = useTranslation();

    useEffect(() => {

        //sumOfPrice()
        convertProductToOrderFormat()

    }, [cart])
    useEffect(() => {

        //sumOfPrice()
        convertProductToOrderFormat()

    }, [discountObject.discount])

    const sumOfPrice = () => {

        cart?.forEach(res => {
            totalP = totalP + res.price * res.quantity
            if (res.ingrdients) {
                res.ingrdients.forEach(ing => {
                    totalP = totalP + ing.extra_price * ing.quantity
                })
            }
        })
        setTotalPrice(totalP)
        setSubTotal(totalP)
    }

    const convertProductToOrderFormat = (cb) => {
        let arry = [...cart]
        let xmlStringForPrint = ''
        let xmlStringForKitchenPrint = {}
        let xmlStringForVATPrint = ''
        // console.log("convertProductToOrderFormat", discountObject);
        setProductList(arry)

        let proArry = []
        let totalP = 0
        let sumOfProDis = 0
        let discount = 0
        let sumOfTVA = {}

        cart?.forEach((res, indx) => {
            // console.log("res.....", res.printer_tag_name)
            let proTVA = 0

            if (res.is_paid !== 3 && res?.isOffert != "offert") {

                xmlStringForPrint = xmlStringForPrint + `[L]${res.quantity};;[L]${res.product_name}(${res.product_attribute});;[R]${res.price}${'\n'}`
                if (!(res?.in_kitchen >= 0)) {
                    xmlStringForKitchenPrint[res.printer_tag_name] = xmlStringForKitchenPrint[res.printer_tag_name] ?
                        xmlStringForKitchenPrint[res.printer_tag_name] + `[L]${res.quantity};;[L]${res.product_name}(${res.product_attribute})${'\n'}` :
                        `[L]${res.quantity};;[L]${res.product_name}(${res.product_attribute})${'\n'}`
                }
                let product_extra = []
                totalP = totalP + res.price * res.quantity
                // proTVA = res.price * res.quantity
                if ((res?.category_type_id == discountObject?.category_type_id)) {
                    sumOfProDis = sumOfProDis + res.price * res.quantity
                    proTVA = (res.price * res.quantity) * (Number(discountObject.discount)) / 100
                    res.isDiscount = true
                } else {
                    res.isDiscount = false
                    proTVA = res.price * res.quantity
                }
                if (discountObject?.category_type_id == "global") {
                    res.isDiscount = true
                }

                if (res.product_extra) {

                    res.product_extra.forEach(ing => {
                        xmlStringForPrint = xmlStringForPrint + `[L]${ing.quantity};;[L]+${ing.extra_name};;[R]${ing.extra_price}${'\n'}`
                        if (!(res?.in_kitchen >= 0)) {
                            xmlStringForKitchenPrint[res.printer_tag_name] = xmlStringForKitchenPrint[res.printer_tag_name] + `[L]${ing.quantity};;[L]+${ing.extra_name}${'\n'}`
                        }
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
                            //proTVA = proTVA + ing.extra_price * ing.quantity
                            if (res?.category_type_id == discountObject?.category_type_id) {
                                sumOfProDis = sumOfProDis + ing.extra_price * ing.quantity
                                proTVA = proTVA + (ing.extra_price * ing.quantity) * (Number(discountObject.discount)) / 100
                                ing.isDiscount = true
                            } else {
                                proTVA = proTVA + ing.extra_price * ing.quantity
                                ing.isDiscount = false
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
            } else {
                if (res?.category_type_id == discountObject?.category_type_id && res.isOffert !== "offert") {
                    res.isDiscount = true
                } else {
                    res.isDiscount = false
                }
                if (discountObject?.category_type_id == "global" || discountObject?.category_type_id == "rabais") {
                    res.isDiscount = true
                }
            }
            if (res?.vat_table) {

                // sumOfTVA[res.vat_table] = sumOfTVA[res.vat_table] ? sumOfTVA[res.vat_table] + (proTVA * Number(res.vat_table)) / 100 : (proTVA * Number(res.vat_table)) / 100
                sumOfTVA[res.vat_table] = sumOfTVA[res.vat_table] ? sumOfTVA[res.vat_table] + (proTVA - (100 / (100 + Number(res.vat_table))) * proTVA) : (proTVA - (100 / (100 + Number(res.vat_table))) * proTVA)
                sumOfTVA[`${res.vat_table}P`] = sumOfTVA[`${res.vat_table}P`] ? sumOfTVA[`${res.vat_table}P`] + proTVA : proTVA
                // console.log("sumOfTVA", sumOfTVA)

            }

        })

        setProductList(cart)
        dispatch({
            type: TOTAL_PRICE,
            payload: totalP
        })
        if (discountObject?.category_type_id == "rabais" && !isOrderAllItemPaid) {

            discount = discountObject.discount

        }
        else if (discountObject?.category_type_id == "global" && !isOrderAllItemPaid) {
            discount = (totalP * Number(discountObject.discount)) / 100
        }
        else if (discountObject?.category_type_id && !isOrderAllItemPaid) {
            discount = (sumOfProDis * Number(discountObject.discount)) / 100

        }
        if (discountObject.discount && discount == 0 && !isOrderAllItemPaid) {
            removeDiscount()
            let msg = `${t('DISCOUNT_NOT_APPLY_MSG')} ${discountObject?.DiscountType} ${t('CATEGORY')} `
            showCustomAlert(dispatch, true, "", "", msg, "")
        } else if (discountObject.discount && discount > 0) {
            nav.navigate(Strings.COMMANDE)
        }

        setTotalPrice(totalP)
        setSubTotal(totalP)
        setDiscountAmount(discount)

        //return proArry
        setProductFormat(proArry)
        //remove whitespace to the end of the string.
        xmlStringForPrint = xmlStringForPrint.replace(/((\s*\S+)*)\s*/, "$1")

        setProductsPrinterStr(xmlStringForPrint)
        for (const key in xmlStringForKitchenPrint) {

            xmlStringForKitchenPrint[key] = xmlStringForKitchenPrint[key].replace(/((\s*\S+)*)\s*/, "$1")

        }
        for (const key in sumOfTVA) {
            if (!key.includes('P')) {
                if (discountObject?.category_type_id == "global" && !isOrderAllItemPaid) {
                    xmlStringForVATPrint = xmlStringForVATPrint + `[L] ;;[L]TVA ${key}% (${Number((sumOfTVA[`${key}P`]) * (Number(discountObject.discount)) / 100).toFixed(2)});;[R]${Number((sumOfTVA[`${key}`]) * (Number(discountObject.discount)) / 100).toFixed(2)}${'\n'}`
                } else if (discountObject?.category_type_id == "rabais" && !isOrderAllItemPaid) {
                    let ratePercent = Number(totalP * Number(discountObject.discount)) / 100;
                    console.log("rratePercent", ratePercent)
                    xmlStringForVATPrint = xmlStringForVATPrint + `[L] ;;[L]TVA ${key}% (${Number((sumOfTVA[`${key}P`]) * (Number(ratePercent)) / 100).toFixed(2)});;[R]${Number((sumOfTVA[`${key}`]) * (Number(ratePercent)) / 100).toFixed(2)}${'\n'}`

                    console.log("xmlStringForVATPrint", xmlStringForVATPrint)
                } else {
                    xmlStringForVATPrint = xmlStringForVATPrint + `[L] ;;[L]TVA ${key}% (${Number(sumOfTVA[`${key}P`]).toFixed(2)});;[R]${Number(sumOfTVA[`${key}`]).toFixed(2)}${'\n'}`

                }

            }

        }

        setxmlStringForKitchenPrint(xmlStringForKitchenPrint)
        xmlStringForVATPrint = xmlStringForVATPrint.replace(/((\s*\S+)*)\s*/, "$1")
        setxmlStringForVATPrint(xmlStringForVATPrint)

    }

    const orderPlace = (payment_type, currency_id, payment_token) => {
        let cumsterAccount
        // let productFormat = convertProductToOrderFormat()
        if (payment_type > 2) {

            cumsterAccount = customerList.find(res => res.id == payment_type)
        }
        console.log("payment_type", cumsterAccount);
        setLoadings(true)
        const orderData = {

            "currency_id": currency_id ? currency_id : payment_type ? user.currency_id : 0,
            "closing_datetime": user.closing_datetime,
            "payment_type": payment_type ? payment_type : 0,
            "payment_token": payment_token ? payment_token : "",
            "direct_free_table": "No",
            "tip_amount": Number(amountTip) ? Number(amountTip) : 0,
            "return_from_given_amount": 0,//Number(amount) > Number(totalPrice) ? Number(amount) - Number(totalPrice) - Number(amountTip) : 0,
            "order_id": tableObject?.order_id ? tableObject?.order_id : 0,
            "sub_order_id": tableObject.sub_order_id ? tableObject.sub_order_id : 0,
            "table_id": tableObject.tag_reference == "00T" ? "free" : tableObject.tag_reference,
            "gmap_latitude": 0.000,
            "gmap_longitude": 0.000,
            "phone_number_format": user.phone_number,
            "user_email": user.email,
            "lang": "en",
            "take_away": tableObject.tag_reference == "00T" ? 1 : 0,
            "order_method": tableObject.tag_reference == "00T" ? "free" : "0",
            "takeaway": 0,
            "delivery_charges": 0,
            "shiping_charges": 0,
            "additional_notes": "",
            "subtotal": Number(subTotal),
            "total_price": Number(totalPrice) - Number(discountAmount),
            "products": productFormat,
            "discount_type": cumsterAccount ? "global" : discountObject?.category_type_id ? discountObject?.category_type_id : "0",
            "discount_value": cumsterAccount ? cumsterAccount.discount_percentage : discountObject?.discount ? discountObject?.discount : "0",
            "remove_discount": (discountObject?.discount || cumsterAccount) ? 0 : 1,
            "remove_items": removeItemIds
        }

        console.log("orderPlace.....", orderData);
        if (tableObject?.order_id) {
            setLastOrderId(tableObject?.order_id)
        }
        //  let fun = payment_type == 2 ? setIsCheckPayment : setLastOrderId
        dispatch(onOrderPlace(orderData, setLastOrderId, setIsCheckPayment, setLoadings))
        setAmount(0),
            setAmountTip(0)
        if (isAlert)
            showAlert()
        // setPaymentType(null)
        if (!isOrderAllItemPaidorKitchen || (!isOrderAllItemPaidorKitchen && payment_type)) {
            for (const key in xmlStringForKitchenPrint) {
                // console.log(key)
                printerReciptKitchen(key)

            }

        }

    }
    const goToHome = (type) => {

        dispatch({
            type: ORDER_PLACE,
            payload: false
        })
        if (type === "releaseTable") {
            let data = {
                "order_id": lastOrderId
            }
            dispatch(releaseTables(data, nav, setLastOrderId))
        }
        nav.navigate('Table')

        setPaymentType(null)
        setLastOrderId(0)

    }
    const orderPlaceAndPay = (value) => {

        if (paymentType == "card") {
            orderPlace(2, "", value)

        } else if (paymentType == "cash") {
            orderPlace(1, value)

        } else if (paymentType == "customer_account") {
            //  console.log("customer_account", value);

            orderPlace(value)

        }
        printerRecipt()

    }
    const showAlert = () => {

        setAlert(!isAlert)
        if (!isAlert) {
            setAmount('')
            setAmountTip('')

        } else {
            //setPaymentType(null)
        }

    }
    useEffect(() => {

        if (paymentType) {
            if (paymentType == "card") {
                showAlert()

            } else if (paymentType == "cash") {
                showAlert()

            } else if (paymentType == "customer_account") {
                showAlert()

            }

        }
    }, [paymentType])

    const onTextChange = (text, type,) => {
        let newText = text.replace(/[^0-9.]/g, '')
        newText = newText.replace(/\./, "#").replace(/\./g, "").replace(/#/, ".");

        console.log("newText..", newText)

        if (type == "amount") {
            setAmount(newText)

        } else if (type === "tips") {

            if (newText > (amount - (totalPrice - discountAmount))) {

                setAmountTip(newText)
                // setAmountTip((String(amount - (totalPrice - discountAmount))))
            } else {
                setAmountTip(newText)
            }
        }

    }
    const removeDiscount = () => {
        dispatch({
            type: DISCOUNT_OBJECT,
            payload: {}
        })
    }

    const checkPaymentStatusFun = () => {
        let data = {
            "order_id": lastOrderId,
            "total_price": Number(totalPrice) - Number(discountAmount)
        }
        // console.log("checkPaymentStatusFun", data)
        dispatch(checkPaymentStatus(data, clearInterval, setIsCheckPayment, funRef.current))

    }

    useEffect(() => {

        if (isCheckPayment) {
            funRef.current = setInterval(() => {
                setTimeDution(prev => prev + 1)
                checkPaymentStatusFun()

            }, 1000)
        }

    }, [isCheckPayment])
    //     useEffect(() => {
    //         if (timeDurtion == 10) {
    //
    //             clearInterval(funRef.current)
    //             funRef.current = null
    //
    //             setIsCheckPayment(false)
    //         }
    //
    //     }, [timeDurtion == 10])

    function urlSafeBase64Encode(str) {
        var base = base64.encode(str);
        return base.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    }

    const printerRecipt = () => {
        console.log('printerRecipt', discountAmount)
        let street_address = user?.street_address || '',
            postcode_city = user?.postcode_city || '',
            phone_number = user?.phone_number || '',
            resturantName = user?.restaurant.trading_name || ''

        let recipt_str = `<receipt>default
[C]<img>LOGO|96|96</img>
[C]<font size='big'>${resturantName}</font>
<T>1;;1
[L]Table: ${tableObject.table_number};;[R]<font color='bg-black'> Ticket Id: 004 </font>
[L]${moment().format("DD-MM-YYYY")};;[R]${moment().format("H:mm")}
</T>

<T>1;;4;;2
[L]Qt;;[L]${t("PRODUCTS")};;[R]CHF
${productsPrinterStr}
</T>
<dashed-line>
<T>1;;4;;2
[L] ;;[L]${t("SUB_TOTAL")};;[R]${(subTotal).toFixed(2)}
</T>
<dashed-line>
<T>1;;4;;2
[L] ;;[L]${t("REDUCTION")};;[R]${(Number(discountAmount)).toFixed(2)}
[L] ;;[L]<b>${t("TOTAL_PAY")}</b>;;[R]<b>${(totalPrice - discountAmount).toFixed(2)}</b>
${xmlStringForVATPrint}
</T>

[C]<font size='big'>${t("THANK_YOU")}</font>

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

    const printerReciptKitchen = (key) => {
        let street_address = user?.street_address,
            postcode_city = user?.postcode_city,
            phone_number = user?.phone_number,
            resturantName = user?.restaurant.trading_name,
            restaurant_code = user?.restaurant.restaurant_code

        let recipt_str = `<receipt>${key}

<T>1;;1
[L]${resturantName};;[R]${t("TABLE")}: ${tableObject.table_number}
</T>
<dashed-line>
<T>1;;4
[L]Qt;;[L]${t("PRODUCTS")}
 ${xmlStringForKitchenPrint[key]}

<dashed-line>
<T>1;;1
[L]  ${restaurant_code};;[R]${moment().format("DD-MM-YYYY H:mm")}

</T>
</receipt>`

        console.log("printerReciptKitchen", recipt_str)
        let stringBase = urlSafeBase64Encode(recipt_str)

        //         let stringBase2 = base64.encode(recipt_str2)

        let url = 'empplight://print?econtent=' + stringBase + "&image_tags=<LOGO>" + `&image_urls=<${IMAGE_BASE_URL + restuarntLogo}/>`
        console.log("recipt_str", url)
        // PrinterModule.setLanguage('fr')
        PrinterModule.PrintingService(url)

    }

    return (
        <Design
            productList={productList}
            totalPrice={totalPrice}
            subTotal={subTotal}
            gst={gst}
            orderPlace={orderPlace}
            isOrderPlace={isOrderPlace}
            goToHome={goToHome}
            orderPlaceAndPay={orderPlaceAndPay}
            paymentType={paymentType}
            setPaymentType={setPaymentType}
            setAlert={setAlert}
            isAlert={isAlert}
            showAlert={showAlert}
            onTextChange={onTextChange}
            amount={amount}
            discountAmount={discountAmount}
            removeDiscount={removeDiscount}
            amountTip={amountTip}
            isCheckPayment={isCheckPayment}
            isOrderAllItemPaid={isOrderAllItemPaid}
            isLoadings={isLoadings}
            lastOrderId={lastOrderId}
            printerRecipt={printerRecipt}

        />
    )
}
export default CommandeScreen