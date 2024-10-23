import {
    TABLES,
    TABLE_NUMBER,
    TO_MOVE,

} from "../actions/types";
const initialState = {
    tableObject: "Table",
    tables: [],
    isMoveTable: false

};

export const tableReducer = (state = initialState, action) => {
    switch (action.type) {
        case TABLE_NUMBER:
            return {
                ...state,
                tableObject: action.payload
            };
        case TABLES:
            return {
                ...state,
                tables: action.payload
            };
        case TO_MOVE:
            return {
                ...state,
                isMoveTable: action.payload
            };

        default:
            return state;
    }
};
