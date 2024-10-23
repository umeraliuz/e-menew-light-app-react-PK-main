import React from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, FlatList, Image, SafeAreaView, Text, View, Platform } from "react-native";
import { images } from "../../../assets/images";
import CartProductItem from "../../../component/CartProductItem";
import CartVeiw from "../../../component/CartVeiw";
import CustomButton from "../../../component/CustomButton";
import Header from "../../../component/Header";
import PaymentModel from "../../../component/PaymentModel";
import { Colors } from "../../../constant/color";

import { HEIGHT_BASE_RATIO } from "../../../constant/sizeHelper";

import { styles } from "./styles";

const Design = (props) => {
    //console.log("Design....", props.productList.length);

    const { t } = useTranslation()

    const renderItem = ({ item, index }) => {

        return (

            <View style={{

                marginTop: HEIGHT_BASE_RATIO(7)
            }}>
                <CartProductItem
                    data={props.productList.length}
                    item={item}
                    quantity={item.quantity}
                    index={index}
                    //onPressItem={props.onSelectedTable}
                    deleteProduct={props.deleteProduct}

                />
            </View>

        )
    }

    return (
        <>

            <Header
                title={t("COMMANDE")}
                disabled={true}
                onPress={props.orderPlace}
                type={'hold'}
                isRightButton={!props.isOrderAllItemPaid && Platform.OS == "android"}
                onPressRight={props.printerRecipt}
                rightImage={{ uri: "https://tryngo-services.com/restaurant/assets/emenewpos/printer.png" }}
            />
            <View style={styles.container}>
                <CartProductItem
                    type={'fixed'}
                />
                <FlatList
                    style={{ marginTop: HEIGHT_BASE_RATIO(20) }}
                    contentContainerStyle={{ paddingBottom: HEIGHT_BASE_RATIO(20) }}
                    showsVerticalScrollIndicator={false}
                    data={props.productList}
                    renderItem={renderItem}
                    keyExtractor={(item) => "CT" + item.id}
                    key={(item) => "CT" + item.id}
                />

                <CartVeiw
                    totalPrice={props.totalPrice}
                    gst={props.gst}
                    subTotal={props.subTotal}
                    orderPlace={props.orderPlace}
                    orderPlaceAndPay={props.orderPlaceAndPay}
                    setPaymentType={props.setPaymentType}
                    paymentType={props.paymentType}
                    discountAmount={props.discountAmount}
                    removeDiscount={props.removeDiscount}
                    disabled={props.isOrderAllItemPaid}
                    printerRecipt={props.printerRecipt}

                />
            </View>
            {(props.isOrderPlace || props.isCheckPayment) &&
                <View style={styles.successfulContainer}>
                    {!props.isCheckPayment && <Image
                        source={images.accept}
                        style={styles.acceptImage}
                    />}
                    <Text style={styles.succesfulMsg}>
                        {props.isCheckPayment ? "Payment in process please wait" : props?.paymentType ? t("PAYMENT_SUCCESSFUL") : t("ORDER_SUCCESSFUL")}
                    </Text>
                    {props.isCheckPayment &&
                        <ActivityIndicator
                            size={"large"}
                            color={Colors.primaryColor}
                        />
                    }

                    {!props.isCheckPayment &&
                        <>

                            <CustomButton
                                name={t("NEW_ORDER")}
                                containerStyle={{ marginTop: HEIGHT_BASE_RATIO(25) }}
                                onPress={() => props.goToHome()}
                            />
                            {(props?.paymentType && props.lastOrderId) && <CustomButton
                                name={t("RELEASE_TABLE")}
                                containerStyle={{ marginTop: HEIGHT_BASE_RATIO(25) }}
                                onPress={() => props.goToHome("releaseTable")}
                            />}

                        </>
                    }
                </View>

            }
            {props.isAlert &&
                <View style={styles.alertView}>
                    <PaymentModel

                        //item={props.editProductObj}
                        onTextChange={props.onTextChange}
                        onPressDone={props.orderPlaceAndPay}
                        close={props.showAlert}
                        buttonName={t('DONE')}
                        placeholder={""}
                        paymentType={props.paymentType}
                        amount={props.amount}
                        totalPrice={(props.totalPrice - props.discountAmount)}
                        setPaymentType={props.setPaymentType}
                        amountTip={props.amountTip}

                    />
                </View>

            }

            {props.isLoadings &&
                <View style={styles.alertView}>
                    <ActivityIndicator
                        color={Colors.primaryColor}
                        size={"large"}

                    />
                </View>

            }
        </>
    )
}
export default Design