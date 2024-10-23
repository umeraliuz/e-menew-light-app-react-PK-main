import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const isLive = true

const BASE_URL = isLive ? "https://restaurant.tryngo-services.pk/" : "https://tryngo-services.com/restaurant"
const baseUrl = axios.create({
    baseURL: `${BASE_URL}/api/v2/`,

});
baseUrl.interceptors.request.use(
    async function (config) {
        config.headers = {
            ...config.headers,
        };
        const userLang = await AsyncStorage.getItem("USER_LANG")
        function User() {

            // Rule 2: call hooks in function component
            const { token } = useSelector((state) => state.auth);
            console.log("token...", token)
            return <>{token}</>;
        }
        config.headers['X-Localization'] = userLang;
        config.headers.Authorization = `Bearer ${User}`;
        // console.log("config header", config, userLang)
        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
);

baseUrl.interceptors.response.use(function (response) {
    if (response.status === 401) {
    }
    return response;
});

export const IMAGE_BASE_URL = BASE_URL
export const PRODUCT_IMAGE_BASE_URL = `${BASE_URL}/uploads/products/`
export const TOP_LEVEL_CAT_IMAGE_BASE_URL = `${BASE_URL}/uploads/categories/icons/`
export { baseUrl };
