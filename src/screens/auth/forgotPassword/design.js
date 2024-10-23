import React from "react";
import { View, Text, ImageBackground, Image, TouchableOpacity } from "react-native"
import { Formik } from 'formik';
import * as yup from 'yup'

import { styles } from "./styles";
import { Strings } from "../../../constant/string";
import { images } from "../../../assets/images";

import { HEIGHT_BASE_RATIO } from "../../../constant/sizeHelper";
import CustomInput from "../../../component/CustomInput";
import CustomButton from "../../../component/CustomButton";
import { Colors } from "../../../constant/color";
import { useTranslation } from "react-i18next";

const Design = (props) => {
    const { t } = useTranslation()
    const loginValidationSchema = yup.object().shape({
        email: yup
            .string()
            .email(t("VALID_EMAIL"))
            .required(t("EMAIL_REQUIRED"))
    })

    return (
        <ImageBackground style={styles.container}
            source={images.backgroundImage}
        >
            <TouchableOpacity
                onPress={props.goBack}
                style={styles.goBackView}>
                <Image
                    source={images.reTourIcon}
                    style={styles.gobackIcon}
                />
            </TouchableOpacity>
            <Image
                source={images.logo}
                style={styles.logo}
            />
            <Formik
                initialValues={{ email: '' }}
                validationSchema={loginValidationSchema}
                onSubmit={(values) => props.onPressForgotPassword(values)}
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

                        <CustomButton
                            name={t("RESET_PASSWORD")}
                            containerStyle={{ marginTop: HEIGHT_BASE_RATIO(25) }}
                            onPress={handleSubmit}
                            isLoading={props.isLoading}
                        />
                    </>
                )}
            </Formik>
            {props.isEmailSend &&
                <Text style={styles.errorText}>{t("FORGOT_PASSEORD_EMAIL")}</Text>
            }
        </ImageBackground>
    )
}
export default Design