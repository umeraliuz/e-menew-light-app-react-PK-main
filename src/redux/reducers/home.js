import {
    CATEGORIES_TYPE, DATA_FAILED, DATA_LOADING, ENAGLISH_LANGUAGE, MAIN_CATEGORIES, PRINTER_TAGS, RESTUARNT_LOGO, SUB_CATEGORIES, SUB_CATEGORIES_PRO,

} from "../actions/types";
const initialState = {
    isLoading: false,
    categoriesType: [],
    mainCategories: [],
    subCategories: [],
    subCategoriesPro: [],
    printerTags: [],
    isEnglish: true,
    restuarntLogo: ""

};

export const homeReducer = (state = initialState, action) => {

    switch (action.type) {
        case DATA_LOADING:
            return {
                ...state,
                isLoading: true
            }
        case DATA_FAILED:
            return {
                ...state,
                isLoading: false
            }

        case CATEGORIES_TYPE:
            return {
                ...state,
                categoriesType: action.payload,
                isLoading: false,
            };
        case PRINTER_TAGS:
            return {
                ...state,
                printerTags: action.payload,
                isLoading: false,
            };
        case MAIN_CATEGORIES:
            return {
                ...state,
                mainCategories: action.payload,
                isLoading: false,
            };
        case SUB_CATEGORIES:
            return {
                ...state,
                subCategories: action.payload,
                isLoading: false,
            };
        case SUB_CATEGORIES_PRO:
            return {
                ...state,
                subCategoriesPro: action.payload,
                isLoading: false,
            };
        case ENAGLISH_LANGUAGE:
            return {
                ...state,
                isEnglish: action.payload,
            };
        case RESTUARNT_LOGO:
            return {
                ...state,
                restuarntLogo: action.payload,
            };

        default:
            return state;
    }
};
