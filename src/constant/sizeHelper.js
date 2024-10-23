import { Dimensions, PixelRatio, Platform } from 'react-native';

export const DEVICE_WIDTH = Dimensions.get('window').width;

export const DEVICE_HEIGHT = Dimensions.get('window').height;

export const IS_IOS = Platform.OS === 'ios';
export const IS_ANDROID = Platform.OS === 'android';

export const WIDTH_BASE_RATIO = (value) => {
    const DESIGN_WIDTH = 720;
    const WINDOW_WIDTH = DEVICE_WIDTH;
    const VALUE_IN_SCREEN_WDITH_RATIO = IS_IOS ? ((WINDOW_WIDTH * value) / DESIGN_WIDTH * 0.97) : (WINDOW_WIDTH * value) / DESIGN_WIDTH;
    //const VALUE_IN_SCREEN_WDITH_RATIO = wp(value)
    return VALUE_IN_SCREEN_WDITH_RATIO;
};

export const HEIGHT_BASE_RATIO = (value) => {
    const DESIGN_HEIGHT = 1440;
    const WINDOW_HEIGHT = DEVICE_HEIGHT;
    const VALUE_IN_SCREEN_HEIGHT_RATIO = IS_IOS ? ((WINDOW_HEIGHT * value) / DESIGN_HEIGHT * 0.97) : (WINDOW_HEIGHT * value) / DESIGN_HEIGHT;
    // const VALUE_IN_SCREEN_HEIGHT_RATIO = hp(value)
    return VALUE_IN_SCREEN_HEIGHT_RATIO;
};

export const wp = (widthPercent) => {
    const elemWidth =
        typeof widthPercent === 'number' ? widthPercent : parseFloat(widthPercent);
    return PixelRatio.roundToNearestPixel((DEVICE_WIDTH * elemWidth) / 100);
};

export const hp = (heightPercent) => {
    const elemHeight =
        typeof heightPercent === 'number'
            ? heightPercent
            : parseFloat(heightPercent);

    return PixelRatio.roundToNearestPixel((DEVICE_HEIGHT * elemHeight) / 100);
};

export const FONT_SIZE = (value) => {
    return HEIGHT_BASE_RATIO(value);
};