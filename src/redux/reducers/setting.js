import {
    BOOKING_LIST,

} from "../actions/types";
const initialState = {

    bookingList: [],

};

export const settingReducer = (state = initialState, action) => {

    switch (action.type) {

        case BOOKING_LIST:
            return {
                ...state,
                bookingList: action.payload
            };

        default:
            return state;
    }
};
