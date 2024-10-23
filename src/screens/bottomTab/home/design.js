import React from "react";
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, FlatList, SafeAreaView, Text, View } from "react-native";
import { useSelector } from "react-redux";
import { images } from "../../../assets/images";
import BottomModel from "../../../component/BottomModel";
import Header from "../../../component/Header";
import HomeCategoryItem from "../../../component/HomeCategoryItem";
import OffertModel from "../../../component/OffertModel";
import ProductItemGrid from "../../../component/ProductItemGrid";
import PromptAlert from "../../../component/PromptAlert";
import SelectedProductItem from "../../../component/SelectedProductItem";
import { Colors } from "../../../constant/color";
import { HEIGHT_BASE_RATIO, WIDTH_BASE_RATIO } from "../../../constant/sizeHelper";
import Animated, {
    Layout,
    LightSpeedInLeft,
    LightSpeedOutRight,
} from 'react-native-reanimated';
import { styles } from "./styles";

const Design = (props) => {

    const { t, i18n } = useTranslation();
    const tableObject = useSelector((state) => state.table.tableObject)

    const renderItem = ({ item, index }) => {
        return (
            <View style={{
                marginTop: props?.data?.length > 2 ? HEIGHT_BASE_RATIO(20) : 0

            }}>
                <HomeCategoryItem
                    item={item}
                    index={index}
                    onPressItem={props.onSelectedCategoryType}
                    data={props.data}
                    onLongPress={props.releaseTable}
                />
            </View>
        )
    }

    const renderMainCategoryItem = ({ item, index }) => {
        return (
            <View style={{
                marginEnd: WIDTH_BASE_RATIO(15),
                marginStart: WIDTH_BASE_RATIO(15),
                marginTop: HEIGHT_BASE_RATIO(20)
            }}>
                <ProductItemGrid
                    item={item}
                    index={index}
                    onPressItem={props.onSelectMainCategory}
                />
            </View>
        )
    }

    const renderProductItem = ({ item, index }) => {
        return (
            <View style={{
                marginEnd: WIDTH_BASE_RATIO(15),
                marginStart: WIDTH_BASE_RATIO(15),
                marginTop: HEIGHT_BASE_RATIO(20)
            }}>
                <ProductItemGrid
                    item={item}
                    index={index}
                    onPressItem={props.onSelectProduct}
                />
            </View>
        )
    }

    const renderSelectedProductItem = ({ item, index }) => {
        //console.log("renderSelectedProductItem", item)

        return (
            <Animated.View
                entering={LightSpeedInLeft}
                // exiting={LightSpeedOutRight}
                layout={Layout.springify()}
                style={[{ marginTop: HEIGHT_BASE_RATIO(7) }]}>
                <SelectedProductItem
                    item={item}
                    quantity={item.quantity}
                    index={index}
                    //onPressItem={props.onSelectedTable}
                    onPressEdit={item.isOffert == 'offert' ? props.deleteProduct : props.onPressEditProduct}
                    onTextChange={props.textChange}
                    onEndEditing={props.onEndEditing}
                    deleteProductIngredient={props.deleteProductIngredient}
                    ingrdientExtraOffert={props.ingrdientExtraOffert}
                    editExtraObj={props.editExtraObj}
                    text={props.text}
                    currentProductindex={props.currentProductindex}
                />
            </Animated.View>

        )
    }

    return (
        <>

            {/* <SafeAreaView style={{ backgroundColor: Colors.lightGreen }} /> */}

            <Header
                title={props.currentNavigationPosition !== 0 ? t("GOHOME") : t("HOME")}
                onPress={props.goToHome}
                disabled={props.currentNavigationPosition == 0}
                isRightButton={props?.selectedProductList?.length > 0 &&
                    props.currentNavigationPosition !== 0 &&
                    !tableObject?.order_id}
                onPressRight={props.cartEmpty}
                titleRight={t("EMPTY_CART")}
                isImage={props.currentNavigationPosition !== 0 ? images.homeIcon : ""}
                isGoback={props.currentNavigationPosition !== 0}
                goBack={props.goBack}
            />
            <View style={[styles.container, props?.currentNavigationPosition === 0 && { justifyContent: "center" }]}>
                {/* category type */}
                {props.currentNavigationPosition == 0 &&
                    <View style={styles.flatlistWrapView}>
                        <FlatList
                            numColumns={2}
                            columnWrapperStyle={{
                                justifyContent: "space-around",
                            }}
                            showsVerticalScrollIndicator={false}
                            data={props.data}
                            renderItem={renderItem}
                            keyExtractor={(item) => "CT" + item.id}
                            key={(item) => "CT" + item.id}
                        />
                    </View>}
                {/* top level category */}
                {!props.isLoading && props.currentNavigationPosition === 1 &&
                    <FlatList
                        // style={{ marginTop: HEIGHT_BASE_RATIO(57) }}
                        numColumns={3}
                        data={props.mainCategoriesList}
                        contentContainerStyle={{
                            paddingTop: HEIGHT_BASE_RATIO(470),
                            paddingBottom: HEIGHT_BASE_RATIO(30),
                            alignSelf: "center"
                        }}
                        ListEmptyComponent={() => {
                            return (
                                !props.isVisible && <Text style={{ alignSelf: "center" }}>{t("NO_DATA_FOUND")}</Text>
                            )
                        }}
                        showsVerticalScrollIndicator={false}
                        renderItem={renderMainCategoryItem}
                        keyExtractor={(item, index) => "TLC" + item.id}
                        key={(item, index) => "TLC" + item.id}
                    />}
                {/* products */}
                {((!props.isLoading && props.currentNavigationPosition === 2)) &&
                    <FlatList
                        //style={{ marginTop: HEIGHT_BASE_RATIO(57) }}
                        numColumns={3}
                        data={props.subCategoriesList}
                        contentContainerStyle={{
                            paddingTop: HEIGHT_BASE_RATIO(470),
                            paddingBottom: HEIGHT_BASE_RATIO(30),
                            alignSelf: "center"
                        }}
                        ListEmptyComponent={() => {
                            return (
                                !props.isVisible && <Text style={{ alignSelf: "center" }}>{t("NO_DATA_FOUND")}</Text>
                            )
                        }}
                        showsVerticalScrollIndicator={false}
                        renderItem={renderProductItem}
                        keyExtractor={(item, index) => "SC" + item.id}
                        key={(item, index) => "SC" + item.id}
                    />}
                {/* select product list */}
                {props.currentNavigationPosition !== 0 && props?.selectedProductList?.length > 0 ? <View style={styles.selectedProductListView}>
                    <SelectedProductItem
                        type={'fixed'}
                    />
                    <FlatList
                        ref={props.selectedFlatlistRef}
                        style={[{ marginTop: HEIGHT_BASE_RATIO(15) }]}
                        contentContainerStyle={{
                            //paddingBottom: HEIGHT_BASE_RATIO(100)
                        }}
                        onScrollToIndexFailed={info => {
                            const wait = new Promise(resolve => setTimeout(resolve, 500));
                            wait.then(() => {
                                props.selectedFlatlistRef.current?.scrollToIndex({ index: info.index, animated: true });
                            });
                        }}
                        showsVerticalScrollIndicator={false}
                        data={props.selectedProductList}
                        extraData={props.selectedProductList}
                        renderItem={renderSelectedProductItem}
                        keyExtractor={(item, index) => "SP" + item.id}
                        key={(item, index) => "SP" + item.id}
                    />
                </View> : null}
            </View>

            {(props.isLoading && !props.isVisible) &&
                <View style={styles.indicatorStyle}>
                    <ActivityIndicator
                        color={Colors.primaryColor}
                        size={"large"}
                    />
                </View>
            }
            {props.isVisible &&

                <BottomModel
                    data={props.isEditPro ? props.PersonaliserList : props.subProductList}
                    visible={props.isVisible}
                    modelVisible={props.modelVisible}
                    onPressItem={props.isEditPro ? props.onPressEditProduct : props.onSelectSubProduct}
                    isLoading={props.isLoading}
                    isEditPro={props.isEditPro}
                    item={props.editProductObj}
                    isShowBottomSubItem={props.isShowBottomSubItem}
                    subData={props.subData}
                    commentType={props.commentType}
                    personaliserType={props.personaliserType}
                    getCommentOption={props.getCommentOption}
                    isCustomComment={props.isCustomComment}
                    onTextChange={props.textChange}
                    addCustomComments={props.addCustomComments}
                    value={props.text}
                    setIsCustomComment={props.setIsCustomComment}
                    goBackBottomSubItem={props.goBackBottomSubItem}
                />

            }
            {props.isAlert &&
                <View style={styles.alertView}>
                    <PromptAlert
                        title={props.promptAlertTitle}
                        item={props.editProductObj}
                        onTextChange={props.textChange}
                        onPressDone={props.onPressDone}
                        close={props.showAlert}
                        buttonName={t('DONE')}
                        // placeholder={String(props.editProductObj.quantity)}
                        value={props?.text ? props?.text : props.alertValue}
                        isTextField={props.promptAlertTitle !== t("ADD_QUANTITY")}

                    />
                </View>

            }

            {props.isOffert && <View style={styles.alertView}>
                <OffertModel

                    item={props?.editExtraObj ? props.editExtraObj : props.editProductObj}
                    onTextChange={props.onTextChange}
                    onPressDone={props?.editExtraObj ? props.applyIngrdientExtraOffert : props.onPressDone}
                    close={props.offertModel}
                    buttonName={t('DONE')}
                    placeholder={""}
                    paymentType={"paymentType"}
                    amount={props.amount}
                    totalPrice={"0"}
                    setPaymentType={props.setPaymentType}
                    amountTip={"0"}
                    setText={props.setText}

                />
            </View>}
        </>
        // </SafeAreaView>
    )
}
export default Design