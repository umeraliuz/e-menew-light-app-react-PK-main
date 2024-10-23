import {
    CART_INFO, CURRENCY_LIST, CUSTOMER_LIST, DISCOUNT_OBJECT, ORDER_PLACE, PAYMENT_LIST, REMOVE_ITEM_IDS, TERMINAL_LIST, TOTAL_PRICE,

} from "../actions/types";
const initialState = {
    cart: [],
    isOrderPlace: false,
    currencyList: [],
    paymentList: [],
    totalPrice: 0,
    discountObject: {},
    terminalList: [],
    customerList: [],
    removeItemIds: []

};

export const cartReducer = (state = initialState, action) => {
    switch (action.type) {
        case CART_INFO:
            return {
                ...state,
                cart: action.payload
            };
        case ORDER_PLACE:
            return {
                ...state,
                isOrderPlace: action.payload
            }
        case CURRENCY_LIST:
            return {
                ...state,
                currencyList: action.payload
            }
        case PAYMENT_LIST:
            return {
                ...state,
                paymentList: action.payload
            }
        case TERMINAL_LIST:
            return {
                ...state,
                terminalList: action.payload
            }
        case TOTAL_PRICE:
            return {
                ...state,
                totalPrice: action.payload
            }
        case DISCOUNT_OBJECT:
            return {
                ...state,
                discountObject: action.payload
            }
        case CUSTOMER_LIST:
            return {
                ...state,
                customerList: action.payload
            }
        case REMOVE_ITEM_IDS:
            return {
                ...state,
                removeItemIds: action.payload
            }
        default:
            return state;
    }
};
