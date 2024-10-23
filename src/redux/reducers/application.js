import {
    POS_CLIENT_NOTIFICATION,
    TABLES,
    TABLE_NUMBER,
    TAKEAWAY_ORDER_NOTIFICATION,
    TO_MOVE,

} from "../actions/types";
const initialState = {

    clientNotificationList: [],
    takeawayOrderList: [],

};

export const applicationReducer = (state = initialState, action) => {

    switch (action.type) {

        case POS_CLIENT_NOTIFICATION:
            return {
                ...state,
                clientNotificationList: action.payload
            };
        case TAKEAWAY_ORDER_NOTIFICATION:
            return {
                ...state,
                takeawayOrderList: action.payload
            };

        default:
            return state;
    }
};
