import { Formik } from 'formik';
import React from "react";
import { useTranslation } from 'react-i18next';
import { Image, ImageBackground, Text, TouchableOpacity } from "react-native";
import Animated from 'react-native-reanimated'
import * as yup from 'yup';

import { images } from "../../../assets/images";
import CustomButton from "../../../component/CustomButton";
import CustomInput from "../../../component/CustomInput";
import { Colors } from "../../../constant/color";
import { HEIGHT_BASE_RATIO } from "../../../constant/sizeHelper";
import { Strings } from "../../../constant/string";
import { styles } from "./styles";

const Design = (props) => {

    const { t } = useTranslation()
    const loginValidationSchema = yup.object().shape({
        email: yup
            .string()
            .email(t("VALID_EMAIL"))
            .required(t("EMAIL_REQUIRED")),
        password: yup
            .string()
            .min(1, ({ min }) => `${t("VALID_PASSWORD")} ${min} ${t("CHARACTERS")}`)
            .required(t("PASSWORD_REQUIRED")),
    })

    return (
        <ImageBackground style={styles.container}
            source={images.backgroundImage}
        >
            <Image
                source={images.logo}
                style={styles.logo}
            />
            <Formik
                initialValues={{ email: '', password: '' }}
                validationSchema={loginValidationSchema}
                onSubmit={(values) => props.onPressLogin(values)}
            >
                {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
                    <>
                        <CustomInput
                            placeholder={t("EMAIL")}
                            containerStyle={{
                                marginTop: HEIGHT_BASE_RATIO(91),
                                borderColor: errors.email ? Colors.darkYellow : Colors.borderColor,
                            }}
                            onChangeText={handleChange("email")}
                            value={values.email}

                        />
                        {errors.email &&
                            <Text style={styles.errorText}>{errors.email}</Text>
                        }
                        <CustomInput
                            placeholder={t("PASSWORD")}
                            containerStyle={{
                                marginTop: HEIGHT_BASE_RATIO(25),
                                borderColor: errors.password ? Colors.darkYellow : Colors.borderColor,
                            }}
                            onChangeText={handleChange('password')}
                            value={values.password}
                            type={Strings.PASSWORD}
                            onPressIcon={props.viewPassword}
                            visible={props.isViewPassword}
                            icon={props.isViewPassword ? images.hideEyeIcon : images.eyeIcon}
                        />
                        {errors.password &&
                            <Text style={styles.errorText}>{errors.password}</Text>
                        }
                        <CustomButton
                            isLoading={props.isLoading}
                            name={t("LOGIN")}
                            containerStyle={{ marginTop: HEIGHT_BASE_RATIO(25) }}
                            onPress={handleSubmit}
                        />

                    </>
                )}
            </Formik>
            <Animated.View
                style={[styles.forgotPasswordView]}>
                <TouchableOpacity
                    onPress={props.onPressForgotPassword}
                >
                    <Text style={styles.forgotText}>{t("FORGOT_PASSEORD")}?</Text>
                </TouchableOpacity>
            </Animated.View>
        </ImageBackground>
    )
}
export default Design