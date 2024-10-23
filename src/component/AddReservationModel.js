import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { TouchableOpacity, StyleSheet, Image, Text, View, FlatList, SectionList, Button, ActivityIndicator, } from "react-native"
import { images } from "../assets/images";
import { Colors } from "../constant/color";
import { FONT_SIZE, HEIGHT_BASE_RATIO, hp, WIDTH_BASE_RATIO, wp } from "../constant/sizeHelper";

import { useDispatch, useSelector } from "react-redux";
import LanguageItem from "./LanguageItem";
import CustomButton from "./CustomButton";
import { Calendar, CalendarUtils } from "react-native-calendars";
import { forEach, groupBy, set } from 'lodash';
import moment from "moment";
import CustomSwitch from "./CustomSwitch";
import CustomInput from "./CustomInput";
import DropDownPicker from "react-native-dropdown-picker";
import * as yup from 'yup';
import { Formik } from 'formik';
import PhoneInput from "react-native-phone-number-input";
import { showCustomAlert } from "../constant/Alert";
import { getResaurantSettings, getTimings, reservadTable } from "../redux";
import { DATA_LOADING } from "../redux/actions/types";

const AddReservationModel = (props) => {
    const CurrentDate = moment();
    const dispatch = useDispatch()
    const twoDay = moment(CurrentDate, "DD-MM-YYYY").add(2, 'days').format('YYYY-MM-DD');
    const { user } = useSelector((state) => state.auth);
    const { t } = useTranslation()
    const reservationValidationSchema = yup.object().shape({
        firstName: yup
            .string()
            .required(),
        lastName: yup
            .string()
            .required(),
        email: yup
            .string()
            .email(t("VALID_EMAIL"))
            .required(t("EMAIL_REQUIRED")),
        phoneNumber: yup
            .number()
            .required(),

    })

    const [isCalendarShow, setCalendarShow] = useState(false);
    const [currentNavigationPosition, setCurrentNavigationPosition] = useState(0)
    const [selectedDate, setSelectedDate] = useState("");
    const [settingObject, setSettingObject] = useState({});
    const [isOther, setISOthers] = useState(false);
    const [customNumberPerson, setCustomNumberPerson] = useState(null);
    const [addRervationObject, setRevationObject] = useState({ gender: 'Male', comment: '' })
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(1);
    const [items, setItems] = useState([
        { label: 'We have a thumb', value: 'We have a thumb' },
        { label: 'We have a pregnant person', value: 'We have a pregnant person' },
        { label: 'We are in a hurry', value: 'We are in a hurry' },
        { label: 'I am allergic to gluten', value: 'I am allergic to gluten' },
        { label: 'I am allergic to lactose', value: 'I am allergic to lactose' },
        { label: 'I am vegan', value: 'I am vegan' },
        { label: 'I am vegetarian', value: 'aI am vegetarianpple' },
        { label: 'We have a person with reduced mobility', value: 'We have a person with reduced mobility' },
        { label: 'We would like to be on the terrace in the shade', value: 'We would like to be on the terrace in the shade' },
        { label: 'We would like to be on the terrace in the sun', value: 'We would like to be on the terrace in the sun' },
        { label: 'We have a pet', value: 'We have a pet' }

    ])
    const [isLoading, setLoading] = useState(false)
    const [numberOfPersonList, setNumberOfPersonList] = useState([
        { noOfPerson: 1, isDisabled: false },
        { noOfPerson: 2, isDisabled: false },
        { noOfPerson: 3, isDisabled: false },
        { noOfPerson: 4, isDisabled: false },
        { noOfPerson: 5, isDisabled: false },
        { noOfPerson: 6, isDisabled: false },
        { noOfPerson: 7, isDisabled: false },
        { noOfPerson: 8, isDisabled: false },
        { noOfPerson: 9, isDisabled: false },

    ])
    const [dateList, setDateList] = useState([
        {
            id: 1,
            title: t("TODAY")
        },
        {
            id: 2,
            title: t("TOMORROW")
        },
        {
            id: 3,
            title: t("CALENDAR")
        }

    ])
    const [timeList, setTimeList] = useState([])
    //         [
    //         {
    //             id: 1,
    //             time: "10:00",
    //             shift: 'Lunch'
    //         },
    //         {
    //             id: 2,
    //             time: "12:30",
    //             shift: 'Lunch'
    //         },
    //         {
    //             id: 3,
    //             time: "2:00",
    //             shift: 'Lunch'
    //         },
    //         {
    //             id: 4,
    //             time: "4:00",
    //             shift: 'Lunch'
    //         },
    //         {
    //             id: 5,
    //             time: "8:00",
    //             shift: 'Evening'
    //         },
    //         {
    //             id: 6,
    //             time: "9:00",
    //             shift: 'Evening'
    //         },
    //         {
    //             id: 7,
    //             time: "10:00",
    //             shift: 'Evening'
    //         },
    //         {
    //             id: 8,
    //             time: "11:00",
    //             shift: 'Evening'
    //         },
    //         {
    //             id: 9,
    //             time: "12:00",
    //             shift: 'Evening'
    //         },
    //         {
    //             id: 10,
    //             time: "10:00",
    //             shift: 'Evening'
    //         },
    //
    //     ]
    //     )
    const groupedData = groupBy(timeList, 'timing_title');

    const sections = Object.entries(groupedData).map(([title, data]) => ({
        title,
        data: [{ list: data }],
    }));
    const phoneInput = useRef();
    const [formattedValue, setFormattedValue] = useState("");
    const [phoneValue, setPhoneValue] = useState("");

    useEffect(() => {
        setLoading(true)
        dispatch(getResaurantSettings({}, setLimitOfPerson, setLoading))

    }, [])
    const setLimitOfPerson = (data) => {

        let newArry = [...numberOfPersonList]
        if (data?.min_reserve_person && data?.max_reserve_person) {
            newArry.forEach(p => {

                if (p.noOfPerson >= data.min_reserve_person && p.noOfPerson <= data.max_reserve_person) {
                    p.isDisabled = false
                } else {
                    p.isDisabled = true
                }

            }

            )
            setSettingObject(data)
            setNumberOfPersonList(newArry)
        } else {
            let obj = {
                min_reserve_person: 1,
                max_reserve_person: 15
            }

            setSettingObject(obj)
        }

    }

    const createDuritionChunks = (arry, intervl) => {
        console.log("create Durition Chunks", intervl.split(' ')[0], arry)

        const chunks = [];
        arry.forEach(res => {

            const startTime = res.local_timing_from;
            const endTime = res.local_timing_to;
            const duration = intervl.split(' ')[0] // minutes

            const start = moment(startTime, 'HH:mm:ss');
            const end = moment(endTime, 'HH:mm:ss');
            const chunkDuration = moment.duration(duration, 'minutes');

            let current = moment(start);
            let currentTime = CurrentDate.format('YYYY-MM-DD') == addRervationObject.Date ? moment().format('HH:mm:ss') : moment(addRervationObject.Date).format('HH:mm:ss')
            console.log("currentTime", start)

            while (current <= end) {
                const chunkStart = current.format('HH:mm:ss');
                const chunkEnd = moment(current).add(chunkDuration).format('HH:mm:ss');
                console.log("chunksStart", chunkStart,)

                if (moment(chunkEnd, 'hh:mm:ss') <= end && currentTime <= chunkStart) {
                    chunks.push({
                        startTime: moment(chunkStart, 'HH:mm:ss').format('HH:mm'),
                        timing_title: res.timing_title
                    });
                }

                current.add(chunkDuration);
            }
        })

        // console.log("chunds..", chunks);
        setTimeList(chunks)
        setLoading(false)
    }

    const renderSectionHeader = ({ section }) => {
        return (
            <View style={styles.sectionHeader}>
                <Text style={styles.headingTitle}>
                    {section.title}
                    {/* {section.title == "Lunch" ? t('LUNCH_SERVICE') : t('EVENING_SERVICE')} */}
                </Text>
            </View>
        )

    };
    const renderSectionListItem = ({ item }) => {
        return (
            <FlatList
                //style={{ flex: 1 }}
                data={item.list}
                contentContainerStyle={{
                    paddingTop: HEIGHT_BASE_RATIO(10),
                    paddingBottom: HEIGHT_BASE_RATIO(30)
                }}

                showsVerticalScrollIndicator={false}
                numColumns={3}
                renderItem={renderTimeItem}
                keyExtractor={(item, index) => "TLC" + item.startTime}
                key={(item, index) => "TLC" + item.startTime}
            />
        )
    }
    const renderTimeItem = ({ item, index }) => {
        return (
            <View style={{
                marginEnd: WIDTH_BASE_RATIO(10),
                marginTop: HEIGHT_BASE_RATIO(20)

            }}>
                <TouchableOpacity
                    onPress={() => onSelectTime(item, index)}
                    style={{
                        width: WIDTH_BASE_RATIO(210),
                        height: HEIGHT_BASE_RATIO(88),
                        backgroundColor: Colors.darkYellow,
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: 4,
                        borderWidth: 1,
                        borderColor: item.isSelected ? Colors.badgeColor : Colors.darkYellow
                    }}

                >
                    <Text style={[styles.noteText, { color: Colors.white }]}>{item.startTime}</Text>
                </TouchableOpacity>
            </View>
        )
    }
    const renderNumberOfPersonItem = ({ item, index }) => {
        return (
            <View style={{
                marginEnd: WIDTH_BASE_RATIO(10),
                marginTop: HEIGHT_BASE_RATIO(20)

            }}>
                <TouchableOpacity
                    disabled={item.isDisabled}
                    onPress={() => onSelectNoOfPerson(item, index)}
                    style={{
                        width: WIDTH_BASE_RATIO(210),
                        height: HEIGHT_BASE_RATIO(88),
                        backgroundColor: item.isDisabled ? Colors.borderColor : Colors.darkYellow,
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: 4,
                        borderWidth: 1,
                        borderColor: item.isSelected ? Colors.badgeColor : item.isDisabled ? Colors.borderColor : Colors.darkYellow
                    }}

                >
                    <Text style={[styles.noteText, {
                        color: item.isDisabled ? Colors.borderColor : Colors.white,
                    }]}>{item.noOfPerson}</Text>
                </TouchableOpacity>
            </View>
        )
    }
    const renderDateListItem = ({ item, index }) => {
        return (
            <View style={{
                marginEnd: WIDTH_BASE_RATIO(10),
                marginTop: HEIGHT_BASE_RATIO(20)

            }}>
                <TouchableOpacity
                    onPress={() => onSelectDate(item, index)}
                    style={{
                        width: WIDTH_BASE_RATIO(210),
                        height: HEIGHT_BASE_RATIO(88),
                        backgroundColor: item.isSelected ? Colors.primaryColor : Colors.white,
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: 4,
                        borderWidth: 1,
                        borderColor: item.isSelected ? Colors.primaryColor : Colors.borderColor
                    }}

                >
                    <Text style={[styles.noteText, { color: item.isSelected ? Colors.white : Colors.black }]}>{item.title}</Text>
                </TouchableOpacity>
            </View>
        )
    }

    const onSelectNoOfPerson = (item, index) => {
        let list = [...numberOfPersonList]
        list.forEach((res, idx) => {
            if (idx === index) {

                res.isSelected = true
            } else {
                res.isSelected = false
            }
        })
        addRervationObject.NoOfPerson = item.noOfPerson
        setNumberOfPersonList(list)
        setCurrentNavigationPosition(1)

    }
    const addCustomNumberPerson = (text) => {
        let newText = text.replace(/[^0-9]/g, '') // string should have only digit

        setCustomNumberPerson(newText)

    }
    const onEndEditing = () => {
        if (Number(customNumberPerson) < Number(settingObject.min_reserve_person)) {
            setCustomNumberPerson(String(settingObject.min_reserve_person))
        } else if (Number(customNumberPerson) > Number(settingObject.max_reserve_person)) {
            setCustomNumberPerson(String(settingObject.max_reserve_person))
        }
    }
    const onSelectDate = (item, index) => {
        setLoading(true)
        let list = [...dateList]
        list.forEach((res, idx) => {
            if (idx === index) {

                res.isSelected = true
            } else {
                res.isSelected = false
            }
            if (res.id == 3 & item.id !== 3) {
                res.title = t("CALENDAR")

            }
        })
        if (item.id == 1) {
            addRervationObject.Date = CurrentDate.format('YYYY-MM-DD')
            let data = {
                current_date: addRervationObject.Date
            }
            dispatch(getTimings(data, createDuritionChunks))
            setCalendarShow(false)
            setCurrentNavigationPosition(2)

        } else if (item.id == 2) {
            addRervationObject.Date = moment(CurrentDate, "DD-MM-YYYY").add(1, 'days').format('YYYY-MM-DD');
            let data = {
                current_date: addRervationObject.Date
            }
            dispatch(getTimings(data, createDuritionChunks))
            setCalendarShow(false)
            setCurrentNavigationPosition(2)

        } else if (item.id == 3) {
            setCalendarShow(true)
        }

        setDateList(list)

    }

    const goBackNavigation = () => {
        if (currentNavigationPosition > 0) {
            setCurrentNavigationPosition(pre => pre - 1)
        }
    }
    const getDate = (count) => {
        const date = new Date();
        const newDate = date.setDate(date.getDate());
        return CalendarUtils.getCalendarDateString(newDate);
    };
    const onDayPress = useCallback((day) => {
        setSelectedDate(day.dateString);
        let list = [...dateList]
        list.forEach((res, idx) => {
            if (res.id == 3) {
                res.title = day.dateString
            }
        })
        addRervationObject.Date = moment(day.timestamp).format('YYYY-MM-DD')
        let data = {
            current_date: addRervationObject.Date
        }
        dispatch(getTimings(data, createDuritionChunks))
        setDateList(list)
        setCalendarShow(false)
        setCurrentNavigationPosition(2)

    }, []);
    const marked = useMemo(() => {

        return {
            [getDate()]: {
                dotColor: 'red',
                //marked: true,
                selected: true,
                disableTouchEvent: false,
                selectedColor: Colors.white,
                selectedTextColor: Colors.borderColor

            },
            [selectedDate]: {
                selected: true,
                disableTouchEvent: true,
                selectedColor: Colors.primaryColor,
                selectedTextColor: Colors.white
            }
        };
    }, [selectedDate]);

    const onSelectTime = (item) => {
        let list = [...timeList]
        list.forEach((res, idx) => {
            if (res.startTime === item.startTime) {

                res.isSelected = true
            } else {
                res.isSelected = false
            }
        })
        addRervationObject.time = item.startTime
        setTimeList(list)
        setCurrentNavigationPosition(3)
    }

    const onToggle = (value) => {
        let gender = value ? 1 : 2
        addRervationObject.gender = gender
        //console.log(value, gender)

    }
    const onPressSubmit = (values) => {
        setLoading(true)
        const checkValid = phoneInput.current?.isValidNumber(values.phoneNumber)
        let updateObject = { ...addRervationObject, ...values }
        if (checkValid) {

            //  console.log("object reservation", updateObject, values.phoneNumber, checkValid)
        } else {
            showCustomAlert(dispatch, true, "", "", t('INVALID_NUMBER'), "")
            return
        }
        let data = {
            date_selecto_rr: updateObject.Date,
            time_selector: updateObject?.time.split(' ')[0],
            first_name: updateObject.firstName,
            last_name: updateObject.lastName,
            email: updateObject.email,
            phone_number: updateObject.phoneNumber,
            type: 2,
            no_of_people: updateObject.NoOfPerson,
            gender: updateObject.gender,
            pos: 1, // set default value as 1
            custom_comments: "Custom Comments",
            comments: value
        }
        console.log("showCustomAlert", data)

        dispatch(reservadTable(data, setLoading, props.close))

    }

    return (

        <View style={styles.alertContainer}>
            <View style={styles.modelHeader}>

                <View />

                <Text style={styles.titleStyle}>
                    {`${t('RESERVATION')}`}</Text>

                <TouchableOpacity

                    style={{ alignSelf: "flex-end" }}
                    onPress={() => {

                        props.close()
                    }}
                >
                    <Image
                        source={images.whiteCross}
                        style={styles.imageStyle}
                    />
                </TouchableOpacity>

            </View>
            <Formik
                initialValues={{ firstName: '', lastName: '', email: '', phoneNumber: '', }}
                validationSchema={reservationValidationSchema}
                onSubmit={(values) => onPressSubmit(values)}
            >
                {({ handleChange, handleSubmit, values, errors }) => (
                    <>
                        <View style={{ zIndex: 999, paddingHorizontal: WIDTH_BASE_RATIO(20) }}>

                            {currentNavigationPosition == 0 ? <View style={{ maxHeight: HEIGHT_BASE_RATIO(900) }}>
                                <Text style={styles.headingTitle}>

                                    {t('S_NO_PERSON')}</Text>
                                {isLoading ?

                                    <ActivityIndicator
                                        size={"large"}
                                        color={Colors.primaryColor}
                                        style={{ paddingVertical: HEIGHT_BASE_RATIO(100) }}
                                    /> :
                                    <FlatList
                                        //style={{ flex: 1 }}
                                        data={numberOfPersonList}
                                        contentContainerStyle={{
                                            paddingTop: HEIGHT_BASE_RATIO(10),
                                            paddingBottom: HEIGHT_BASE_RATIO(30)
                                        }}

                                        showsVerticalScrollIndicator={false}
                                        numColumns={3}
                                        renderItem={renderNumberOfPersonItem}
                                        keyExtractor={(item, index) => "TLC" + item.noOfPerson}
                                        key={(item, index) => "TLC" + item.noOfPersond}
                                    />}
                                {isOther &&
                                    <CustomInput
                                        placeholder={t("OTHERS")}
                                        containerStyle={{
                                            marginBottom: HEIGHT_BASE_RATIO(15),
                                            width: "100%",
                                            height: HEIGHT_BASE_RATIO(77),
                                            borderColor: errors.firstName ? Colors.darkYellow : Colors.borderColor,
                                        }}
                                        onChangeText={(text) => { addCustomNumberPerson(text) }}
                                        value={customNumberPerson}
                                        onEndEditing={onEndEditing}

                                    />

                                }
                                <CustomButton
                                    name={t("OTHERS")}
                                    containerStyle={{
                                        // alignSelf: "flex-end",
                                        marginTop: HEIGHT_BASE_RATIO(0),
                                        height: HEIGHT_BASE_RATIO(77),
                                        width: "100%"
                                    }}
                                    onPress={() => setISOthers(!isOther)}
                                />

                                <Text style={[styles.noteText]}>{`${t('NOTE')}: `}
                                    <Text style={{ fontFamily: "Inter-Medium", }}>
                                        {`${t('RESERVATION_CAPACITY')} ${settingObject.min_reserve_person} ${t('TO')} ${settingObject.max_reserve_person} ${t('NUMBER_OF_PEOPLE')}`}
                                    </Text>
                                </Text>
                            </View> : currentNavigationPosition == 1 ?
                                <View style={{ maxHeight: HEIGHT_BASE_RATIO(800), }}>
                                    <Text style={styles.headingTitle}>

                                        {t('DATE')}</Text>
                                    <View style={{ flexDirection: "row" }}>
                                        <FlatList
                                            //style={{ flex: 1 }}
                                            data={dateList}
                                            contentContainerStyle={{
                                                paddingTop: HEIGHT_BASE_RATIO(10),
                                                paddingBottom: HEIGHT_BASE_RATIO(30)
                                            }}

                                            showsVerticalScrollIndicator={false}
                                            numColumns={3}
                                            renderItem={renderDateListItem}
                                            keyExtractor={(item, index) => "TLC" + item.noOfPerson}
                                            key={(item, index) => "TLC" + item.noOfPersond}
                                        />
                                    </View>
                                    {isCalendarShow &&
                                        <Calendar
                                            minDate={twoDay}
                                            onDayPress={day => {
                                                onDayPress(day)

                                            }}
                                            markedDates={marked}

                                        />
                                    }

                                </View> : currentNavigationPosition == 2 ?
                                    <View style={{ maxHeight: HEIGHT_BASE_RATIO(900), }}>
                                        {isLoading ?

                                            <ActivityIndicator
                                                size={"large"}
                                                color={Colors.primaryColor}
                                                style={{ paddingVertical: HEIGHT_BASE_RATIO(100) }}
                                            /> :
                                            <SectionList
                                                sections={sections}
                                                renderItem={renderSectionListItem}
                                                showsVerticalScrollIndicator={false}
                                                renderSectionHeader={renderSectionHeader}
                                                contentContainerStyle={{ paddingBottom: HEIGHT_BASE_RATIO(30) }}
                                            />}

                                    </View> :
                                    <View style={{ maxHeight: HEIGHT_BASE_RATIO(900), }}>
                                        <View style={styles.rowContainer}>
                                            <Text style={styles.noteText}>{t("GENDER")}</Text>
                                            <CustomSwitch
                                                label1={t("MALE")}
                                                label2={t("FEMALE")}
                                                onToggle={onToggle}
                                                containerStyle={{ width: WIDTH_BASE_RATIO(450) }}
                                                ButtonContainerStyle={{ width: WIDTH_BASE_RATIO(225) }}
                                            />
                                        </View>
                                        <View style={styles.rowContainer}>
                                            <Text style={styles.noteText}>{t("FIRST_NAME")}</Text>
                                            <CustomInput
                                                placeholder={t("FIRST_NAME")}
                                                containerStyle={{
                                                    width: WIDTH_BASE_RATIO(450),
                                                    height: HEIGHT_BASE_RATIO(77),
                                                    borderColor: errors.firstName ? Colors.darkYellow : Colors.borderColor,
                                                }}
                                                onChangeText={handleChange("firstName")}
                                                value={values.firstName}

                                            />
                                        </View>
                                        <View style={styles.rowContainer}>
                                            <Text style={styles.noteText}>{t("LAST_NAME")}</Text>
                                            <CustomInput
                                                placeholder={t("LAST_NAME")}
                                                containerStyle={{
                                                    width: WIDTH_BASE_RATIO(450),
                                                    height: HEIGHT_BASE_RATIO(77),
                                                    borderColor: errors.lastName ? Colors.darkYellow : Colors.borderColor,
                                                }}
                                                onChangeText={handleChange("lastName")}
                                                value={values.lastName}

                                            />
                                        </View>
                                        <View style={styles.rowContainer}>
                                            <Text style={styles.noteText}>{t("EMAIL")}</Text>
                                            <CustomInput
                                                placeholder={t("EMAIL")}
                                                containerStyle={{
                                                    width: WIDTH_BASE_RATIO(450),
                                                    height: HEIGHT_BASE_RATIO(77),
                                                    borderColor: errors.email ? Colors.darkYellow : Colors.borderColor,
                                                }}
                                                onChangeText={handleChange("email")}
                                                value={values.email}

                                            />
                                        </View>
                                        <View style={styles.rowContainer}>
                                            <Text style={styles.noteText}>{t("PHONE_NUMBER")}</Text>
                                            <PhoneInput
                                                autoFocus={false}
                                                containerStyle={{
                                                    width: WIDTH_BASE_RATIO(450),
                                                    height: HEIGHT_BASE_RATIO(80),
                                                    borderWidth: 1,
                                                    borderRadius: HEIGHT_BASE_RATIO(15),
                                                    borderColor: errors.phoneNumber ? Colors.darkYellow : Colors.borderColor,
                                                    padding: 0,
                                                    margin: 0
                                                }}
                                                textContainerStyle={{
                                                    // width: WIDTH_BASE_RATIO(450),
                                                    height: HEIGHT_BASE_RATIO(77),
                                                    borderRadius: 10,
                                                    // backgroundColor: "brown",
                                                    paddingStart: 5,
                                                    margin: 0
                                                }}
                                                disableArrowIcon={true}
                                                textInputStyle={{
                                                    //width: WIDTH_BASE_RATIO(200750),
                                                    // backgroundColor: "blue",
                                                    height: HEIGHT_BASE_RATIO(77),
                                                    color: Colors.black,
                                                    fontSize: HEIGHT_BASE_RATIO(25),
                                                    fontFamily: "Inter-medium",
                                                    padding: 0,
                                                    marginStart: 0,

                                                }}
                                                placeholder={t('PHONE_NUMBER')}
                                                flagButtonStyle={{
                                                    width: WIDTH_BASE_RATIO(50),
                                                    //height: HEIGHT_BASE_RATIO(33),
                                                    // backgroundColor: "yellow",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                    margin: 0,
                                                    paddingStart: 10,
                                                    //marginVertical: 10
                                                }}
                                                codeTextStyle={{
                                                    // width: WIDTH_BASE_RATIO(100),
                                                    height: HEIGHT_BASE_RATIO(40),
                                                    //  backgroundColor: "green",
                                                    padding: 0,
                                                    marginEnd: 5,
                                                    color: Colors.black,
                                                    fontSize: HEIGHT_BASE_RATIO(25),
                                                    fontFamily: "Inter-medium",

                                                    // backgroundColor: "green"
                                                }}

                                                ref={phoneInput}
                                                defaultValue={phoneValue}
                                                defaultCode="DM"
                                                layout="first"
                                                onChangeText={handleChange("phoneNumber")}
                                                onChangeFormattedText={(text) => {
                                                    setFormattedValue(text);
                                                }}
                                                // withDarkTheme
                                                withShadow

                                            />
                                            {/* <PhoneInput
                                                initialCountry={'us'}
                                                style={{
                                                    width: WIDTH_BASE_RATIO(450),
                                                    height: HEIGHT_BASE_RATIO(77),
                                                    borderColor: errors.phoneNumber ? Colors.darkYellow : Colors.borderColor,
                                                }}
                                            /> */}
                                            {/* <CustomInput
                                                placeholder={t("PHONE_NUMBER")}
                                                containerStyle={{
                                                    width: WIDTH_BASE_RATIO(450),
                                                    height: HEIGHT_BASE_RATIO(77),
                                                    borderColor: errors.phoneNumber ? Colors.darkYellow : Colors.borderColor,
                                                }}
                                                onChangeText={handleChange("phoneNumber")}
                                                value={values.phoneNumber}

                                            /> */}
                                        </View>
                                        <View style={styles.rowContainer}>
                                            <Text style={styles.noteText}>{t("COMMENT")}</Text>
                                            <View style={{ height: open ? HEIGHT_BASE_RATIO(350) : "auto" }}>
                                                <DropDownPicker
                                                    open={open}
                                                    value={value}
                                                    items={items}
                                                    setOpen={setOpen}
                                                    setValue={setValue}
                                                    setItems={setItems}
                                                    listMode="SCROLLVIEW"
                                                    placeholder={t("SELECT_COMMENT")}
                                                    scrollViewProps={{
                                                        nestedScrollEnabled: true,
                                                    }}

                                                    style={{

                                                        borderRadius: WIDTH_BASE_RATIO(15),
                                                        borderColor: Colors.borderColor,
                                                        height: HEIGHT_BASE_RATIO(80),
                                                        width: WIDTH_BASE_RATIO(450),
                                                        minHeight: HEIGHT_BASE_RATIO(80),
                                                        borderColor: Colors.borderColor,

                                                    }}

                                                    maxHeight={HEIGHT_BASE_RATIO(280)}
                                                    dropDownContainerStyle={{

                                                        width: WIDTH_BASE_RATIO(450),
                                                        backgroundColor: Colors.white,
                                                        borderRadius: WIDTH_BASE_RATIO(15),
                                                        borderColor: Colors.borderColor,
                                                        // paddingHorizontal: WIDTH_BASE_RATIO(0),
                                                        position: 'relative',
                                                        top: 0
                                                    }}
                                                    zIndex={9999}
                                                />
                                            </View>
                                        </View>

                                    </View>

                            }

                            <View style={{ flexDirection: "row", justifyContent: (isOther && currentNavigationPosition == 0) ? "flex-end" : "space-between", zIndex: 0 }}>
                                {currentNavigationPosition !== 0 &&
                                    <CustomButton
                                        name={t("BACK")}
                                        containerStyle={{
                                            // alignSelf: "flex-end",
                                            marginTop: HEIGHT_BASE_RATIO(25),
                                            height: HEIGHT_BASE_RATIO(77),
                                            width: WIDTH_BASE_RATIO(250)
                                        }}
                                        onPress={goBackNavigation}
                                    />}
                                {currentNavigationPosition == 3 &&
                                    <CustomButton
                                        name={t("SUBMIT")}
                                        containerStyle={{
                                            // alignSelf: "flex-end",
                                            marginTop: HEIGHT_BASE_RATIO(25),
                                            height: HEIGHT_BASE_RATIO(77),
                                            width: WIDTH_BASE_RATIO(250)
                                        }}
                                        onPress={handleSubmit}
                                        isLoading={isLoading}
                                    />
                                }
                                {(isOther && currentNavigationPosition == 0 && customNumberPerson) &&
                                    <CustomButton
                                        name={t("NEXT")}
                                        containerStyle={{
                                            // alignSelf: "flex-end",
                                            marginTop: HEIGHT_BASE_RATIO(25),
                                            height: HEIGHT_BASE_RATIO(77),
                                            width: WIDTH_BASE_RATIO(250),
                                            alignSelf: "flex-end"
                                        }}
                                        onPress={() => {
                                            setCurrentNavigationPosition(1)
                                            addRervationObject.NoOfPerson = customNumberPerson
                                        }}

                                    />
                                }
                            </View>
                        </View>
                    </>
                )}
            </Formik>

        </View>

    )
}

const styles = StyleSheet.create({
    container: {

    },
    alertContainer: {

        width: WIDTH_BASE_RATIO(690),
        backgroundColor: Colors.modelBackgroundColor,
        borderRadius: HEIGHT_BASE_RATIO(20),
        borderColor: Colors.borderColor,
        paddingBottom: HEIGHT_BASE_RATIO(43)
    },

    titleStyle: {
        fontSize: FONT_SIZE(25),
        color: Colors.white,
        fontFamily: "Inter-Bold",
    },
    headingTitle: {
        fontSize: FONT_SIZE(30),
        color: Colors.black,
        fontFamily: "Inter-Bold",
        marginTop: HEIGHT_BASE_RATIO(13)
    },
    modelHeader: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: Colors.primaryColor,
        paddingHorizontal: WIDTH_BASE_RATIO(27),
        paddingVertical: HEIGHT_BASE_RATIO(16),
        borderTopLeftRadius: HEIGHT_BASE_RATIO(20),
        borderTopRightRadius: HEIGHT_BASE_RATIO(20),
        marginBottom: HEIGHT_BASE_RATIO(34)
    },
    noteText: {
        fontSize: FONT_SIZE(25),
        color: Colors.black,
        fontFamily: "Inter-Bold",
        // marginTop: HEIGHT_BASE_RATIO(13)
    },

    imageStyle: {
        height: WIDTH_BASE_RATIO(55),
        width: WIDTH_BASE_RATIO(55),
        resizeMode: "contain",

    },
    rowContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: HEIGHT_BASE_RATIO(20)
    }

})

export default React.memo(AddReservationModel);