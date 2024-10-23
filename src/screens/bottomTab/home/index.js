import { useNavigation } from "@react-navigation/native";
import _ from "lodash";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from 'react-i18next';
import { BackHandler } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { images } from "../../../assets/images";
import { hideAlert, showCustomAlert } from "../../../constant/Alert";
import {
  getCategoriesType,
  getCustomerList,
  getMainCategories,
  getProductComments,
  getProductCommentsOption,
  getProductExtra,
  getProductIngredient,
  getProductInstructions,
  getSubCategories,
  getSubCategoriesProduct,
  getTerminalList,
  updateCart
} from "../../../redux";
import {
  DATA_FAILED,
  DISCOUNT_OBJECT,
  ORDER_PLACE,
  REMOVE_ITEM_IDS
} from "../../../redux/actions/types";
import Design from "./design";

const HomeScreen = () => {
  const dispatch = useDispatch()
  const { t } = useTranslation();

  const nav = useNavigation()
  const { cart, isOrderPlace, totalPrice, removeItemIds } = useSelector((state) => state.cart);
  const tableObject = useSelector((state) => state.table.tableObject)
  const { isLoading } = useSelector((state) => state.home);
  const [data, setData] = useState([])
  const [mainCategoriesList, setMainCategoriesList] = useState([])
  const [subCategoriesList, setSubCategoriesList] = useState([])
  const [selectedProductList, setSelectedProductList] = useState([])
  const [subProductList, setSubProductList] = useState([])
  const [subData, setSubData] = useState([])
  const [commentType, setCommentType] = useState([])
  const [currentNavigationPosition, setCurrentNavigationPosition] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [isEditPro, setIsEditPro] = useState(false)
  const [editProductObj, setEditProductObj] = useState(null)
  const [editExtraObj, setEditExtraObj] = useState(null)
  const [isAlert, setAlert] = useState(false)
  const [isShowBottomSubItem, setShowBottomSubItem] = useState(false)
  const [text, setText] = useState("")
  const [alertValue, setAlertValue] = useState("")
  const [promptAlertTitle, setPromptAlertTitle] = useState("")
  const [personaliserType, setPersonaliserType] = useState("")
  const [isCustomComment, setIsCustomComment] = useState(false)
  const [isOffert, setIsOffert] = useState(false)
  const [addNewItem, setAddNewItem] = useState(false)
  const [currentProductindex, setCurrentProductindex] = useState(false)

  const [categoryTypeObj, setcategoryTypeObj] = useState(null)
  const { user } = useSelector((state) => state.auth);
  const selectedFlatlistRef = useRef(null)

  const DiscountList = [{
    id: 1,
    name: t("10"),
    isSelected: false,
  },
  {
    id: 2,
    name: t("20"),
    isSelected: false,
  },
  {
    id: 3,
    name: t("30"),
    isSelected: false,
  },
  {
    id: 4,
    name: t("40"),
    isSelected: false,
  },
  {
    id: 5,
    name: t("50"),
    isSelected: false,
  },
  {
    id: 6,
    name: t("60"),
    isSelected: false,
  },
  {
    id: 7,
    name: t("70"),
    isSelected: false,
  },
  {
    id: 8,
    name: t("80"),
    isSelected: false,
  },
  {
    id: 9,
    name: t("90"),
    isSelected: false,
  },
  ]
  const PersonaliserList = [
    //     {
    //       id: 1,
    //       name: t("A_COTE"),
    //       icon: images.logoutIcon,
    //       isSelected: false,
    //       action: () => onSelectPersonaliserItem("A_COTE"),
    //       disabled: true
    //
    //     },
    {
      id: 2,
      name: t("REMISE"),
      icon: images.remiseIcon,
      isSelected: false,
      action: () => onSelectPersonaliserItem("REMISE"),
      disabled: false

    },
    {
      id: 3,
      name: t("OFFERT"),
      icon: images.giftIcon,
      isSelected: false,
      action: () => onSelectPersonaliserItem("OFFERT"),
      disabled: false

    },
    //     {
    //       id: 4,
    //       name: t("REPLACE_INGREDIENT"),
    //       icon: images.replaceIcon,
    //       isSelected: false,
    //       action: () => onSelectPersonaliserItem("REPLACE_INGREDIENT"),
    //       disabled: true
    //
    //     },
    {
      id: 5,
      name: t("INSTRUCTION_PRODUCTION"),
      icon: images.choiceIcon,
      isSelected: false,
      action: () => onSelectPersonaliserItem("INSTRUCTION_PRODUCTION"),
      disabled: false

    },
    {
      id: 6,
      name: t("COMMENTS_COMMENTAIRES"),
      icon: images.commentIcon,
      isSelected: false,
      action: () => onSelectPersonaliserItem("COMMENTS_COMMENTAIRES"),
      disabled: false

    },
    {
      id: 7,
      name: t("REMOVE_INGREDIENT"),
      icon: images.removeIcon,
      isSelected: false,
      action: () => onSelectPersonaliserItem("REMOVE_INGREDIENT"),
      disabled: false

    },
    {
      id: 8,
      name: t("EXTRA_INGREDIENT"),
      icon: images.plusIcon,
      isSelected: false,
      action: () => onSelectPersonaliserItem("EXTRA_INGREDIENT"),
      disabled: false
    },
    {
      id: 9,
      name: t("SUPPRIMER"),
      icon: images.deleteIcon,
      isSelected: false,
      action: () => onSelectPersonaliserItem('SUPPRIMER'),
      disabled: false

    },
  ]

  const handleDiscountType = () => {
    const discountTypeList = data.map((res, index) => ({
      id: index + 1,
      icons: res.name,
      isSelected: index === 0,
      category_type_id: res.id
    }));

    discountTypeList.push(
      {
        id: data.length + 1,
        icons: t("Rabais"),
        isSelected: false,
        category_type_id: t("rabais"),
      },
      {
        id: data.length + 2,
        icons: t("Global"),
        isSelected: false,
        category_type_id: t("global"),
      },
      {
        id: data.length + 3,
        icons: t("Custom"),
        isSelected: false,
        category_type_id: t("custom"),
      }
    );

    setCommentType(discountTypeList);
    setShowBottomSubItem(true);
    setSubData(DiscountList);
  };

  const onSelectPersonaliserItem = (type) => {
    setPersonaliserType(type)
    setIsCustomComment(false)

    switch (type) {
      case "A_COTE":
        break;

      case "REMISE":
        handleDiscountType();
        break;

      case "OFFERT":
        // offertModel();
        setCurrentNavigationPosition((pres) => pres - 1)
        setIsVisible(false);
        setIsOffert(true);
        break;
      case "REPLACE_INGREDIENT":
        break;
      case "REMOVE_INGREDIENT":
        commonRootApiCalling({}, 'REMOVE_INGREDIENT');
        setCommentType([]);
        setShowBottomSubItem(true);
        break;

      case "COMMENTS_COMMENTAIRES":
        commonRootApiCalling({}, 'COMMENTS_COMMENTAIRES');
        setCommentType([]);
        setShowBottomSubItem(true);
        break;

      case "INSTRUCTION_PRODUCTION":
        commonRootApiCalling({}, 'INSTRUCTION_PRODUCTION');
        setCommentType([]);
        setShowBottomSubItem(true);
        break;

      case "EXTRA_INGREDIENT":
        commonRootApiCalling({}, 'EXTRA_INGREDIENT');
        setCommentType([]);
        setShowBottomSubItem(true);
        break;

      case "SUPPRIMER":
        deleteProduct();
        break;

      default:
        break;
    }
  };

  useEffect(() => {

    commonRootApiCalling({}, 'getCategoriesType')
    // const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true)
    const unsubscribe = nav.addListener('focus', () => {

      dispatch({ type: DATA_FAILED })
    });
    return () => unsubscribe;
  }, [])

  useEffect(() => {

    if (isOrderPlace || tableObject) {
      resetState()

    }
  }, [isOrderPlace || tableObject])

  const onSelectedCategoryType = (index, item) => {
    if (tableObject !== "Table") {
      setSelectedProductList(cart);
      setData(prevData =>
        prevData.map((e, i) => ({
          ...e,
          isSelected: i === index
        }))
      );
      setcategoryTypeObj(item);
      commonRootApiCalling(item, "getMainCategories");
    } else {
      nav.navigate("Table");
    }
  };

  const onSelectMainCategory = (index, item) => {
    const updatedList = mainCategoriesList.map((e, i) => ({
      ...e,
      isSelected: i === index
    }));

    setMainCategoriesList(updatedList);
    commonRootApiCalling(item, "getSubCategories");
  };

  const checkAleadySelectedPro = (data, type) => {

    cart.forEach((res) => {
      data.forEach((p) => {
        if (type == 'PE' || type == 'PINS' || type == 'PING' || type == "PCMTO") {

          if (res.id === editProductObj.id && (res.is_paid !== 3 && !res?.in_kitchen)) {

            let list = type == 'PE' ?
              res?.product_extra :
              type == 'PING' ?
                res?.ingrdients :
                type == "PINS" ?
                  res?.instructions :
                  type == "PCMTO" ?
                    res.comments :
                    []

            if (list?.length > 0) {
              list.forEach(itm => {

                if (itm.id === p.id) {
                  p.isSelected = false
                }
              })
            }

          }

        } else {
          //|| p.id == res.attrribute_id
          if ((res.id === p.id || res.child_id === p.id) && (res.is_paid !== 3 && !res?.in_kitchen)) {
            if (p.stock_quantity_enable && p.stock_quantity == 0) {
              p.isSelected = false
            } else {
              p.isSelected = false
            }
          }
        }
      })
    })
    if (type == "SCP") { setSubProductList(data) } else if (type == 'PE' ||
      type == 'PING' ||
      type == "PINS" ||
      type == "PCMTO") { setSubData(data) } else { setSubCategoriesList(data) }
  }

  const onSelectProduct = (index, item) => {
    if (isOrderPlace) {
      dispatch({ type: ORDER_PLACE, payload: false });
    }

    if (item.product_id) {
      incermentQuantity(index, item);
    } else {
      commonRootApiCalling(item, 'getSubCategoriesProduct');
      modelVisible();
      setCurrentNavigationPosition(3);

      const updatedSubCategoriesList = subCategoriesList.map(itm => ({
        ...itm,
        isSelected: itm.id === item.child_id || itm.id === item.id
      }));

      setSubCategoriesList(updatedSubCategoriesList);
    }
  };

  const commonRootApiCalling = (item, type, comment_type) => {
    const data = {}
    switch (type) {
      case "getCategoriesType":
        dispatch(getCategoriesType(data, setData));
        dispatch(getTerminalList(data, ""));
        dispatch(getCustomerList(data, ""));
        break;

      case "getMainCategories":
        data.category_id = item.id;
        dispatch(getMainCategories(data, setMainCategoriesList));
        setCurrentNavigationPosition(1);
        break;

      case "getSubCategories":
        data.parent_category_id = item.id;
        data.child_category_id = 0;
        data.order_method = tableObject === "Table" ? "" : "00T";
        dispatch(getSubCategories(data, checkAleadySelectedPro));
        setCurrentNavigationPosition(2);
        break;

      case "getSubCategoriesProduct":
        data.parent_category_id = item.parent_id;
        data.child_category_id = item.id;
        data.order_method = "";
        dispatch(getSubCategoriesProduct(data, checkAleadySelectedPro));
        break;

      case "EXTRA_INGREDIENT":
        data.product_id = editProductObj.product_id;
        data.attribute_id = editProductObj.attrribute_id;
        data.order_item_id = editProductObj?.id ?? 0;
        dispatch(getProductExtra(data, checkAleadySelectedPro));
        break;

      case "REMOVE_INGREDIENT":
        data.product_id = editProductObj.product_id;
        data.attribute_id = editProductObj.attrribute_id;
        data.order_item_id = editProductObj?.id ?? 0;
        dispatch(getProductIngredient(data, checkAleadySelectedPro));
        break;

      case "INSTRUCTION_PRODUCTION":
        data.product_id = editProductObj.product_id;
        data.attribute_id = editProductObj.attrribute_id;
        data.order_item_id = editProductObj?.id ?? 0;
        dispatch(getProductInstructions(data, checkAleadySelectedPro));
        break;

      case "COMMENTS_COMMENTAIRES":
        if (!comment_type) {
          dispatch(getProductComments(data, setCommentType));
          setIsCustomComment(false);
        }
        data.comment_type = comment_type || 1;
        data.order_item_id = 0;
        dispatch(getProductCommentsOption(data, checkAleadySelectedPro));
        break;

      default:
        // Do nothing
        break;
    }
  }

  const modelVisible = () => {
    if (isVisible) {
      setEditProductObj(null)
    }
    setIsVisible(!isVisible)

    setShowBottomSubItem(false)
    if (isEditPro) {
      editPro()
    }
  }

  const onSelectSubProduct = (index, item) => {

    incermentQuantity(index, item)

  }

  // increase product quantity on selected product
  // manually change product  quantity
  const incermentQuantity = (index, itm, offertObject, type) => {
    setAddNewItem(true)

    // offertObject is comming from  applyOffert() otherwise it will be undefined

    let item = { ...itm }
    //console.log("incermentQuantity", item, index);
    let offertProductMatch = false

    let list = [...cart]
    let findProIndex = list.findIndex((p) => (((p.id == item.id || p.parentItemId == item.attrribute_id) && p.is_paid !== 3 && !p.in_kitchen && p.isOffert != "offert")))

    let findPro = list[findProIndex]//list.find((p) => (((p.id == item.id || p.parentItemId == item.attrribute_id) && p.is_paid !== 3 && !p.in_kitchen)))

    // if product not selected or add extra , comment etc product having more then 1 quantity then type is newObject
    let pro = [...subCategoriesList]
    let att = [...subProductList]
    pro.forEach((itm) => {
      if (itm.id === item.child_id || itm.id === item.id) {
        itm.isSelected = true
      } else {
        itm.isSelected = false
      }
    })
    if (att.length > 0 && type !== "newObject") {
      att.forEach((sp, indx) => {
        // console.log(("indx == index", indx == index));
        if (indx == index) {

          sp.isSelected = true
        } else {
          sp.isSelected = false
        }
      })
      // att[index].isSelected = true
    }
    setSubCategoriesList(pro)
    setSubProductList(att)

    if (!findPro && !text || type == "newObject") {
      if (item.stock_quantity_enable && item.stock_quantity == 0) {
        showCustomAlert(dispatch, true, "", "", t('OUT_STOCK'), "")
        return
      }
      item.quantity = 1
      item.category_type_id = categoryTypeObj.id
      item.printer_tag_name = categoryTypeObj.printer_tag_name
      list.push(item)

    } else {
      // aleady selected product
      list.forEach((itm) => {
        // checked offert  product from selected product list
        if (((itm.parentItemId == item.id || itm.parentItemId == item.attrribute_id) && itm.is_paid !== 3 && !itm.in_kitchen)) {

          if (offertObject) {
            offertProductMatch = true
            itm.quantity = offertObject?.noOfQuntity
          }
        } else {
          if ((itm.id === item.id) && itm.is_paid !== 3 && !itm.in_kitchen) { //|| itm.attrribute_id == item.id
            //if  product stock quantity check is enable
            if (item.stock_quantity_enable) {
              if (item.stock_quantity >= (text.length > 0 ? Number(text) : Number(itm.quantity + 1))) {

                if (offertObject) {  //if offert is applied
                  itm.freeQuantity = offertObject?.noOfQuntity
                }

                itm.quantity = text.length > 0 ? Number(text) : Number(itm.quantity) + 1
                itm.haveOffertItem = (offertObject?.noOfQuntity || itm?.haveOffertItem) ? true : false
                itm.free_item_type = offertObject?.type == "Client" ? 1 : offertObject?.type == "Personel" ? 2 : 0

              }
              else {
                let msg = `${t('MAXQUANTITY')} ${item.stock_quantity} ${t('QUANTITYs')}`
                showCustomAlert(dispatch, true, "", "", msg, "")
              }
            } else {
              //if  product stock quantity check is disable

              if (offertObject) { //if offert is applied
                itm.freeQuantity = offertObject?.noOfQuntity
                itm.free_item_type = offertObject?.type == "Client" ? 1 : offertObject?.type == "Personel" ? 2 : 0
              }
              itm.quantity = text.length > 0 ? Number(text) : Number(itm.quantity) + 1
              itm.haveOffertItem = (offertObject?.noOfQuntity || itm?.haveOffertItem) ? true : false

            }
          }
        }

      })
    }
    // first time if offert is apply
    // add copy of item that product
    if (offertObject?.noOfQuntity && !offertProductMatch) {
      let copyItem = { ...item }

      copyItem.quantity = offertObject?.noOfQuntity
      copyItem.category_type_id = categoryTypeObj.id
      copyItem.printer_tag_name = categoryTypeObj.printer_tag_name
      copyItem.isOffert = "offert",
        copyItem.parentItemId = item.id
      copyItem.price = 0
      copyItem.instructions = [],
        copyItem.ingrdients = [],
        copyItem.comments = [],
        copyItem.product_extra = [],
        copyItem.haveOffertItem = false
      copyItem.special_notes = ""

      copyItem.id = moment().unix()
      list.splice(editProductObj?.index + 1, 0, copyItem)
      //list.push(copyItem)
      dispatch(updateCart(list))
      setSelectedProductList(list)
      setText('')
      setEditProductObj(null)
      setAddNewItem(false)
      // setAddNewItem(true)

    } else {
      //move current update item  to last

      if (findProIndex != -1) {
        // let newArry = [...list]
        let element_to_move = list.splice(findProIndex, 1)  // remove element from original index
        // console.log("element_to_move", element_to_move, findProIndex, newArry)
        list.push(element_to_move[0])
      }
      dispatch(updateCart(list))
      setSelectedProductList(list)
      setText('')
    }
    //  console.log("list...", list);
    // if (selectedFlatlistRef.current) {
    //   selectedFlatlistRef.current.scrollToEnd()
    // }
  }

  // selected product list scroll to end on update or add new product
  useEffect(() => {

    if (selectedFlatlistRef.current) {

      if (addNewItem) {

        setCurrentProductindex(selectedProductList.length - 1)
        // setEditProductObj(null)
        selectedFlatlistRef.current.scrollToEnd()
        setAddNewItem(false)

      }
    }
  }, [selectedProductList?.length && addNewItem])

  //delete product, offert
  const deleteProduct = (index, item) => {

    let selectedItem = item ? item : editProductObj ? editProductObj : item
    let selectedIndex = item ? index : editProductObj ? editProductObj?.index : index
    let removeIdList = removeItemIds ? [...removeItemIds] : []
    // setEditProductObj(selectedItem)
    showCustomAlert(dispatch, true, "", "", t('DELETEALERT'), yes)

    function yes() {
      let list = [...selectedProductList]
      let pro = [...subCategoriesList]

      // check selected product is not offert product or offert not applied on that product
      if (!selectedItem.isOffert) {

        // unselect delete product
        pro.forEach((itm) => {
          if (itm.id === selectedItem.id || selectedItem.attrribute_id == itm.id) {// if have not child product
            itm.isSelected = false
          } else if (selectedItem.child_id === itm.id || selectedItem.attrribute_id == itm.id) { // if have  child product
            let filter = list.filter(p => selectedItem.child_id === p.child_id)
            //if having more then two  child then not unselect
            if (filter?.length < 2) {
              itm.isSelected = false
            }

          }
        })
      } else {
        // offert product or offert parent product

        // find perent product of offert product
        let parentObj = list.find(res => (res.id === selectedItem.parentItemId ||
          selectedItem.parentItemId == res.attrribute_id)
          && res.is_paid !== 3 && !res.in_kitchen && res.isOffert != 'offert')

        if (parentObj) {
          parentObj.quantity = parentObj?.quantity + selectedItem?.quantity
          parentObj.haveOffertItem = false
          parentObj.freeQuantity = 0
          //console.log("setCurrentProductindex...", parentObj.quantity)
          //setCurrentProductindex(pre => pre - 1)
        }

      }
      //if selected product is parent  then delete both parent product and offert product
      if (selectedItem.haveOffertItem) {
        let offetItemIndex = list.findIndex(res => (res.parentItemId === selectedItem.id || selectedItem.attrribute_id == res.parentItemId) && res.is_paid !== 3 && !res.in_kitchen && res.isOffert == 'offert')
        // console.log("offetItemIndex..", offetItemIndex)
        list.splice(offetItemIndex, 1)
        list.splice(selectedIndex, 1)
        // list.splice(selectedIndex, 1)
      } else {
        list.splice(selectedIndex, 1)
      }
      //add id of  removed product into removeIdList
      if (selectedItem?.order_item_id) {
        removeIdList.push(selectedItem?.order_item_id)
        dispatch({
          type: REMOVE_ITEM_IDS,
          payload: removeIdList
        })
      }

      setSubCategoriesList(pro)
      setSelectedProductList(list)
      dispatch(updateCart(list))
      if (isVisible) {

        // editPro()
        modelVisible()
      }

      hideAlert(dispatch)
    }

  }
  const deleteProductOtimise = async (index, item = editProductObj || {}) => {
    let { child_id, isOffert, attrribute_id, id, parentItemId, quantity, order_item_id } = item;

    let removeIdList = removeItemIds ? [...removeItemIds] : [];

    showCustomAlert(dispatch, true, "", "", t('DELETEALERT'), async () => {
      try {
        let list = [...selectedProductList];
        let pro = [...subCategoriesList];

        // check selected product is not offert product or offert not applied on that product
        if (!isOffert) {
          // unselect delete product
          pro.forEach((itm) => {
            if (itm.id === id || attrribute_id == itm.id) {
              itm.isSelected = false;
            } else if (child_id === itm.id || attrribute_id == itm.id) {
              let filter = list.filter(p => child_id === p.child_id);
              if (filter?.length < 2) {
                itm.isSelected = false;
              }
            }
          });
        } else {
          // offert product or offert parent product
          let parentObj = list.find(res => (res.id === parentItemId || parentItemId == res.attrribute_id) && res.is_paid !== 3 && !res.in_kitchen && res.isOffert != 'offert');

          if (parentObj) {
            parentObj.quantity = parentObj?.quantity + quantity;
            parentObj.haveOffertItem = false;
            parentObj.freeQuantity = 0;
          }
        }

        if (item.haveOffertItem) {
          let offetItemIndex = list.findIndex(res => (res.parentItemId === id || attrribute_id == res.parentItemId) && res.is_paid !== 3 && !res.in_kitchen && res.isOffert == 'offert');
          list.splice(offetItemIndex, 1);
          list.splice(index, 1);
        } else {
          list.splice(index, 1);
        }

        if (order_item_id) {
          removeIdList.push(order_item_id);
          dispatch({ type: REMOVE_ITEM_IDS, payload: removeIdList });
        }

        setSubCategoriesList(pro);
        setSelectedProductList(list);
        dispatch(updateCart(list));
        if (isVisible) {
          // editPro();
          modelVisible();
        }

        hideAlert(dispatch);
      } catch (error) {
        console.error(error);
      }
    });
  };

  const goBack = () => {
    setCurrentNavigationPosition((prev) => {

      if (prev > 0) {
        setIsVisible(false)
        setIsEditPro(false)
        setShowBottomSubItem(false)
        setEditProductObj(null)
        return prev - 1
      }
      return prev
    })

    dispatch({ type: DATA_FAILED })

    return true
  }

  useEffect(() => {

    const subscription = BackHandler.addEventListener('hardwareBackPress', () => goBack());
    return () => subscription.remove();

  }, []);

  const resetState = () => {
    commonRootApiCalling({}, 'getCategoriesType')
    setSelectedProductList([])
    setCurrentNavigationPosition(0)
    setEditProductObj(null)
    setCurrentProductindex(0)
    setIsVisible(false)
    dispatch({
      type: DISCOUNT_OBJECT,
      payload: {}
    })
    dispatch({ type: DATA_FAILED })

  }
  //add extra, comment, spcial note, remove ingredients
  // also menually increase extra quantity
  const addProductExtraIngredients = (index, item, ingredientItem, isComment, value) => {
    let copyPro
    let offertProductMatch = false
    let list = [...cart]
    let ingredientItm = ingredientItem ? ingredientItem : item
    let findPro = list.find((pro) => (pro.id === (editProductObj?.id || item.id) && pro.is_paid !== 3 && !pro.isOffert && !pro.in_kitchen))
    //  console.log("addProductExtraIngredients", findPro)
    let findExtra
    if (findPro?.product_extra) {
      findExtra = findPro?.product_extra.find((ex) => (ex?.id == ingredientItm?.id))
    }
    //only for already selected extras.
    if (findExtra || ((text && ingredientItm?.icons == "+"))) {
      if (personaliserType === "EXTRA_INGREDIENT" || ingredientItm?.icons == "+") {
        list.forEach(pro => {
          //check current selected product, not paid, not in kitchen
          if (pro.id === (editProductObj?.id || item.id) && pro.is_paid !== 3 && !pro.isOffert && !pro.in_kitchen) {
            pro?.product_extra?.forEach(itm => {
              // extra  offert
              if (itm?.parentItemId == ingredientItm?.id) {

                if (value) {
                  offertProductMatch = true
                  itm.quantity = value?.noOfQuntity //itm.quantity + value?.noOfQuntity
                }
              } else {
                if (itm.id == ingredientItm?.id) {
                  if (value) { // only working offert apply

                    itm.freeQuantity = value?.noOfQuntity//itm?.freeQuantity ? itm.freeQuantity + value?.noOfQuntity : value?.noOfQuntity
                    itm.free_item_type = value?.type == "Client" ? 1 : value?.type == "Personel" ? 2 : 0
                  }

                  itm.quantity = text.length > 0 ? Number(text) : itm.quantity + 1
                  itm.haveOffertItem = (value?.noOfQuntity || itm?.haveOffertItem) ? true : false
                }
              }
            })
          }

        })

      }

    }

    else {
      //check already add extra, comment, ingredients.
      let ingrdients = editProductObj?.ingrdients ? [...editProductObj?.ingrdients] : []
      let product_extra = editProductObj?.product_extra ? [...editProductObj?.product_extra] : []
      let instructions = editProductObj?.instructions ? [...editProductObj?.instructions] : []
      let comments = editProductObj?.comments ? [...editProductObj?.comments] : []
      list.forEach(pro => {
        if ((pro.id === editProductObj.id) && pro.is_paid !== 3 && !pro.isOffert && !pro.in_kitchen) {
          ingredientItm.quantity = 1
          ingredientItm.viewId = moment().valueOf()
          //check if quantity more then 1 then create copy of product then  add
          if (pro.quantity > 1) {
            copyPro = { ...pro }
            if (personaliserType === "EXTRA_INGREDIENT") {
              if (comments.length == 0) {

              }
              ingredientItm.icons = "+"
              product_extra.push(ingredientItm)
              copyPro.product_extra = _.uniqBy(product_extra, 'id')

            } else if (personaliserType === "INSTRUCTION_PRODUCTION") {

              ingredientItm.icons = "!"

              instructions.push(ingredientItm)
              copyPro.instructions = _.uniqBy(instructions, 'id')

            } else if (personaliserType === "REMOVE_INGREDIENT") {

              ingredientItm.icons = "-"
              ingredientItm.ingredient_price = 0
              ingrdients.push(ingredientItm)
              copyPro.ingrdients = _.uniqBy(ingrdients, 'id')

            } else if (personaliserType === "COMMENTS_COMMENTAIRES") {

              if (ingredientItm.comments_type_id == 1) {
                ingredientItm.icons = "Ø"
              }
              else if (ingredientItm.comments_type_id == 2) {
                ingredientItm.icons = "&"
              }
              else if (ingredientItm.comments_type_id == 3) {
                ingredientItm.icons = "→"
              }
              else if (ingredientItm.comments_type_id == 4) {
                ingredientItm.icons = "⋯"
              }
              else if (ingredientItm.comments_type_id == 5) {
                ingredientItm.icons = "✒"
                copyPro.special_notes = ingredientItm.comment_description
              }
              if (ingredientItm.comments_type_id !== 5) {
                comments.push(ingredientItm)
                copyPro.comments = _.uniqBy(comments, 'id')
              }
            }

            copyPro.isSelected = false,
              copyPro.order_item_id = 0
            copyPro.id = moment().valueOf()
            //add copy of product into list
            incermentQuantity("", copyPro, "", "newObject")
            // decrease quantity of current product.
            pro.quantity = pro.quantity - 1
            modelVisible()

          }
          else {
            if (personaliserType === "EXTRA_INGREDIENT") {
              if (comments.length == 0) {

              } console.log("product_extra...", product_extra)
              ingredientItm.icons = "+"
              product_extra.push(ingredientItm)

              pro.product_extra = _.uniqBy(product_extra, 'id')

            } else if (personaliserType === "INSTRUCTION_PRODUCTION") {

              ingredientItm.icons = "!"

              instructions.push(ingredientItm)

              pro.instructions = _.uniqBy(instructions, 'id')

            } else if (personaliserType === "REMOVE_INGREDIENT") {

              ingredientItm.icons = "-"
              ingredientItm.ingredient_price = 0
              ingrdients.push(ingredientItm)

              pro.ingrdients = _.uniqBy(ingrdients, 'id')

            } else if (personaliserType === "COMMENTS_COMMENTAIRES") {

              if (ingredientItm.comments_type_id == 1) {
                ingredientItm.icons = "Ø"
              }
              else if (ingredientItm.comments_type_id == 2) {
                ingredientItm.icons = "&"
              }
              else if (ingredientItm.comments_type_id == 3) {
                ingredientItm.icons = "→"
              }
              else if (ingredientItm.comments_type_id == 4) {
                ingredientItm.icons = "⋯"
              }
              else if (ingredientItm.comments_type_id == 5) {
                ingredientItm.icons = "✒"
                pro.special_notes = ingredientItm.comment_description

              }
              if (ingredientItm.comments_type_id !== 5) {
                comments.push(ingredientItm)

                pro.comments = _.uniqBy(comments, 'id')
              }
            }
            setEditProductObj({ ...pro, index: editProductObj.index })
          }
        }

      })

    }
    if (!isComment) {
      subData.forEach((res, indx) => {
        if (index == indx) {
          res.isSelected = true
        } else {
          res.isSelected = false
        }

      })
      // data[index].isSelected = true
      setSubData(subData)
    }
    if (value?.noOfQuntity && !offertProductMatch) {

      let copyItem = { ...ingredientItm }

      copyItem.quantity = value?.noOfQuntity

      copyItem.isOffert = "offert",
        copyItem.parentItemId = ingredientItm.id
      copyItem.extra_price = 0
      copyItem.haveOffertItem = false

      copyItem.id = moment().unix()

      editProductObj?.product_extra.splice(ingredientItm?.index + 1, 0, copyItem)
      //list.push(copyItem)
      dispatch(updateCart(list))
      setSelectedProductList(list)
      setText('')

    } else {
      if (!copyPro) {

        dispatch(updateCart(list))
        setSelectedProductList(list)
        setText('')
      }
    }
    // console.log("editProductObj.....", editProductObj)
    setEditExtraObj(null)
    if (selectedFlatlistRef.current && editProductObj) {
      selectedFlatlistRef.current.scrollToIndex({
        index: editProductObj?.index,
        animated: true,
        // viewPosition: 0.5
      })
    }
  }

  const onPressEditProduct = (index, item, type) => {

    if (type == "product") {
      if (!isVisible) {
        setCurrentNavigationPosition(pre => pre + 1)
      }
      setCurrentProductindex(index)

      setShowBottomSubItem(false)
      setIsEditPro(true)
      setIsVisible(true)
      setEditProductObj({ ...item, index: index })
    } else if (personaliserType == "EXTRA_INGREDIENT" ||
      personaliserType == "REMOVE_INGREDIENT" ||
      personaliserType == "INSTRUCTION_PRODUCTION" ||
      personaliserType == "COMMENTS_COMMENTAIRES"
    ) {
      addProductExtraIngredients(index, item)
    }
    else if (personaliserType == "REMISE") {

      onDiscount(item)
    }
  }

  const editPro = () => {
    //console.log('editPro...', currentNavigationPosition)
    setIsEditPro(!isEditPro)
    if (isEditPro) {
      setPersonaliserType(null)
      setCurrentNavigationPosition(pre => pre - 1)
    }
  }
  const showAlert = () => {

    // editPro()
    setIsVisible(false)
    setAlert(!isAlert)
    if (!isAlert)
      setText('')

  }

  const addManullyQuantity = (type, item) => {

    if (text <= 0) {
      if (Number(text) === 0) {

        showCustomAlert(dispatch, true, "", "", t('QUANTITY_ONE_MSG'), "")
        setText('')
      }

      return
    }

    if (text.length > 0) {
      if (editProductObj.stock_quantity_enable) {
        if (editProductObj.stock_quantity >= Number(text)) {
          let list = [...cart]

          list.forEach((itm) => {
            if (itm.id === editProductObj.id || itm.id == editProductObj.attrribute_id) {
              itm.quantity = Number(text)
            }
          })
          dispatch(updateCart(list))
          setSelectedProductList(list)
        } else {
          let msg = `${t('MAXQUANTITY')} ${editProductObj.stock_quantity} ${t('QUANTITYs')}`
          showCustomAlert(dispatch, true, "", "", msg, "")
        }
      } else {
        let list = [...cart]

        list.forEach((itm) => {
          if (itm.id === editProductObj.id || itm.id == editProductObj.attrribute_id) {
            itm.quantity = Number(text)
          }
        })
        dispatch(updateCart(list))
        setSelectedProductList(list)

      }
    }

    setText("")
    showAlert()

  }
  const textChange = (text, type) => {

    if (personaliserType === "REMISE") {

      let newText = text.replace(/[^0-9.]/g, '') // string should have only digit
      newText = newText.replace(/\./, "#").replace(/\./g, "").replace(/#/, "."); // remove dot (.) if have more then 1

      let selectedCat = commentType.find(res => res.isSelected)
      if (selectedCat.icons == "Rabais") {
        setText(newText)
      } else {
        if (Number(newText) > 100) {
          // for discount %age should not be greater then 100
          setText("100")
        } else {
          setText(newText)
        }
      }
      return
    }
    if (type == "quantity") {
      // console.log("textChange", type);

      let newText = text.replace(/[^0-9]/g, '') // quantity should be whole number
      //console.log("textChange", newText);
      setText(newText)
      return
    }
    setText(text)
  }
  const goToHome = () => {
    setIsVisible(false)
    setShowBottomSubItem(false)
    setCurrentNavigationPosition(0)
    setEditProductObj(null)

  }

  // calling from alert model
  const onPressDone = (value) => {

    if (personaliserType === "A_COTE") {

    }
    else if (personaliserType === "REMISE") {
      console.log("REMISE")
    }
    else if (personaliserType === "OFFERT") {
      console.log("offer")

      offertModel()
      setText(value.noOfQuntity)
      applyOffert(value)

    }
    else if (personaliserType === "REPLACE_INGREDIENT") {

    }
    else if (personaliserType === "REMOVE_INGREDIENT") {

    }
    else if (personaliserType === "COMMENTS_COMMENTAIRES") {

    }
    else if (personaliserType === "INSTRUCTION_PRODUCTION") {
      if (text.length > 0) {
        let list = [...cart]

        list.forEach((itm) => {
          if (itm.id === editProductObj.id || itm.id == editProductObj.attrribute_id) {
            itm.special_notes = text
          }
        })
        dispatch(updateCart(list))
        setSelectedProductList(list)
      }
      setText("")
      showAlert()

    }
    else if (personaliserType === "EXTRA_INGREDIENT") {
      //addManullyQuantity()

    }
    else if (type === "SUPPRIMER") {

    }

  }
  const onEndEditing = (item, ingredientItem) => {

    if (text.length > 0 && Number(text) > 0) {
      if (ingredientItem) {
        addProductExtraIngredients("", item, ingredientItem)
      } else {
        incermentQuantity('', item)
      }
    } else {

      if (text.length > 0 && Number(text) === 0) {

        showCustomAlert(dispatch, true, "", "", t('QUANTITY_ONE_MSG'), "")
        setText('')
      }
      return

    }
  }

  const cartEmpty = () => {
    //let isAllPaid = selectedProductList.every(res => res.is_paid === 3)
    showCustomAlert(dispatch, true, "", "", t('CLEAR_CART_MSG'), yes)

    function yes() {
      let paidList = selectedProductList.filter(res => res.is_paid === 3)

      resetState()
      dispatch(updateCart(paidList))
      setSelectedProductList(paidList)
      hideAlert(dispatch)
      setIsVisible(false)
      setShowBottomSubItem(false)
      setEditProductObj(null)
    }

  }
  const deleteProductIngredient = (index, item, ingredientItem, ingredientIndex) => {

    let list = [...cart]

    list.forEach(pro => {
      if ((pro.id === item.id || pro.attrribute_id == item.id) && !pro.isOffert && pro.is_paid !== 3 && !pro.in_kitchen) {

        if (ingredientItem.extra_name) {
          if (ingredientItem?.isOffert && pro) {
            //console.log("deleteProductIngredient", pro);
            pro.product_extra[ingredientIndex - 1].quantity = pro.product_extra[ingredientIndex - 1].quantity + ingredientItem.quantity
            pro.product_extra[ingredientIndex - 1].haveOffertItem = false
            pro.product_extra[ingredientIndex - 1].freeQuantity = 0
          }
          if (ingredientItem?.haveOffertItem) {

            pro.product_extra = pro.product_extra.filter(res => {
              if (ingredientItem.id === res.id) {
                return false
              } else if (ingredientItem?.id === res?.parentItemId) {
                return false
              }
              // console.log(ingredientItem.id !== res.id || ingredientItem?.id !== res?.parentItemId)
              // return (ingredientItem.id !== res.id || ingredientItem?.id !== res?.parentItemId)
              return true

            })
          } else {
            pro.product_extra = pro.product_extra.filter(res => ingredientItem.id !== res.id)
          }

        } else if (ingredientItem.pic_name) {
          pro.instructions = pro.instructions.filter(res => ingredientItem.id !== res.id)
        } else if (ingredientItem.ingredient_name) {
          pro.ingrdients = pro.ingrdients.filter(res => ingredientItem.id !== res.id)
        }
        else if (ingredientItem.isSpecialNotes) {
          pro.special_notes = ""

        }
        else if (ingredientItem.comment_description) {

          pro.comments = pro.comments.filter(res => ingredientItem.id !== res.id)

        }
        // pro?.extraIngrInsList.splice(ingredientIndex, 1)

      }

    })
    dispatch(updateCart(list))
    setSelectedProductList(list)

  }

  const getCommentOption = (index, item) => {

    let list = [...commentType]
    if (personaliserType == "REMISE") {
      setText('')
      if (item.icons !== "Custom") {
        list.forEach((res, indx) => {
          if (index == indx) {
            res.isSelected = true
          } else {
            res.isSelected = res.icons == "Custom" ? res.isSelected : false
          }
        })
      } else {

        if (list[index].isSelected) {
          setIsCustomComment(false)
        } else {
          setIsCustomComment(true)
        }
        list[index].isSelected = !list[index].isSelected
      }
      setCommentType(list)
    } else {
      list.forEach((res, indx) => {
        if (index == indx) {
          res.isSelected = true
        } else {
          res.isSelected = false
        }
      })
      setCommentType(list)
      if (index + 1 == 5) {
        setIsCustomComment(true)
      } else {

        commonRootApiCalling({}, "COMMENTS_COMMENTAIRES", index + 1)
        setIsCustomComment(false)
        setText('')

      }
    }

  }
  const addCustomComments = () => {

    if (text.length > 0) {
      if (personaliserType === "REMISE") {

        onDiscount("", "custom")
        return
      }
      let obj = {
        comment_description: text,
        comments_type_id: 5,
        id: moment().unix(),

      }
      addProductExtraIngredients?.("", {}, obj, true)
      setText('')

    }
  }
  const goBackBottomSubItem = () => {
    setShowBottomSubItem(false)
    setIsCustomComment(false)
    setPersonaliserType(null)

  }
  const onDiscount = (item, type) => {
    let selectedCat = commentType.find(res => res.isSelected)
    if ((Number(text) <= 0 || !Number(text)) && type == "custom") {
      setText('')
      return
    }
    if (selectedCat?.icons == "Rabais" && ((Number(text) || Number(item?.name)) > Number(totalPrice))) {
      showCustomAlert(dispatch, true, "", "", t('DISCOUNT_LESS_TOTAL'), "")
      return
    }
    let disObj = {
      DiscountType: selectedCat.icons,
      discount: type ? Number(text) : item.name,
      isCustom: type ? true : false,
      category_type_id: selectedCat.category_type_id,
    }
    dispatch({
      type: DISCOUNT_OBJECT,
      payload: disObj
    })
    modelVisible()
    setIsCustomComment(false)
    setText('')

  }
  const offertModel = () => {
    setIsOffert(!isOffert)
    setIsEditPro(false)
    // if (isOffert) {
    //   setEditExtraObj(null)
    // }

  }

  const applyOffert = (offertObject) => {
    incermentQuantity('', editProductObj, offertObject)
    // editPro()

  }

  const ingrdientExtraOffert = (pIndex, pItem, ingrdient, index) => {
    //console.log(pIndex, pItem, ingrdient, index)
    pItem.index = pIndex;
    ingrdient.index = index
    setEditExtraObj(ingrdient)
    setEditProductObj(pItem)
    offertModel()
  }
  const applyIngrdientExtraOffert = (value) => {

    addProductExtraIngredients("", "", editExtraObj, "", value)
    offertModel()

  }

  return (
    <Design
      {...{
        data,
        onSelectedCategoryType,
        mainCategoriesList,
        onSelectMainCategory,
        selectedProductList,
        deleteProduct,
        subCategoriesList,
        onSelectProduct,
        currentNavigationPosition,
        goBack,
        isLoading,
        subProductList,
        isVisible,
        modelVisible,
        onSelectSubProduct,
        onPressEditProduct,
        PersonaliserList,
        isEditPro,
        isAlert,
        textChange,
        addManullyQuantity,
        goToHome,
        editProductObj,
        showAlert,
        text,
        promptAlertTitle,
        onPressDone,
        onEndEditing,
        cartEmpty,
        alertValue,
        isShowBottomSubItem,
        subData,
        setShowBottomSubItem,
        deleteProductIngredient,
        commentType,
        personaliserType,
        getCommentOption,
        isCustomComment,
        addCustomComments,
        setIsCustomComment,
        setPersonaliserType,
        goBackBottomSubItem,
        isOffert,
        offertModel,
        setText,
        ingrdientExtraOffert,
        editExtraObj,
        applyIngrdientExtraOffert,
        selectedFlatlistRef,
        currentProductindex,
      }}
    />
  )
}
export default HomeScreen