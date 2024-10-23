import React, { useState } from 'react';
import DropDownPicker from 'react-native-dropdown-picker';

import { Colors } from '../constant/color';
import { HEIGHT_BASE_RATIO, WIDTH_BASE_RATIO } from '../constant/sizeHelper';

const CustomDropDown = ({
  buttonBackroundColor,
  titleColor,
  placeholderTitle,
  items,
  setItems,
  onChangeValue,
  dropDownWidth,
  dropDownHeight,
  value,
  setValue,
  disabled,
  dropDownDirection,
  //open,
  //setOpen
}) => {
  const [open, setOpen] = useState(false);

  return (
    <DropDownPicker
      listMode="SCROLLVIEW"
      nestedScrollEnabled={true}
      itemSeparator={true}
      itemSeparatorStyle={{
        backgroundColor: Colors.white,
        height: WIDTH_BASE_RATIO(1),
        width: dropDownWidth,
        alignSelf: 'center',
      }}
      dropDownDirection={dropDownDirection ? dropDownDirection : "AUTO"}
      disabled={disabled}
      open={open}
      value={value}
      items={items}
      setOpen={setOpen}
      setValue={setValue}
      setItems={setItems}
      onPress={open =>

        setValue(null)
      }
      // onChangeValue={(item, index) => onChangeValue(item, index)}
      placeholder={placeholderTitle}
      //style={styles.dropDownStyle}
      placeholderStyle={{
        alignSelf: 'center',
        textAlign: 'center',
        // paddingStart: WIDTH_BASE_RATIO(15),
        fontSize: HEIGHT_BASE_RATIO(25),
        color: disabled ? Colors.borderColor : Colors.white,
        fontFamily: 'Inter-Bold',
      }}
      labelProps={{
        textAlign: 'center',
        //  numberOfLines: 1,
        //adjustsFontSizeToFit: true,
      }}
      style={{
        backgroundColor: buttonBackroundColor ? buttonBackroundColor : disabled ? Colors.borderColor : Colors.primaryColor,
        paddingEnd: 0,
        marginEnd: 0,
        borderRadius: 0,
        borderWidth: 0,
        borderRadius: WIDTH_BASE_RATIO(15),
        minHeight: dropDownHeight,
        width: dropDownWidth,
      }}
      dropDownMaxHeight={400}
      dropDownContainerStyle={{
        width: dropDownWidth,
        backgroundColor: disabled ? Colors.borderColor : Colors.primaryColor,
        borderWidth: 0,
        // paddingHorizontal: WIDTH_BASE_RATIO(0),
      }}
      arrowIconContainerStyle={{
        height: HEIGHT_BASE_RATIO(30),
        width: WIDTH_BASE_RATIO(30),

        justifyContent: 'center',
        alignItems: 'center',
      }}
      arrowIconStyle={{
        width: WIDTH_BASE_RATIO(30),
        height: HEIGHT_BASE_RATIO(30),
        tintColor: disabled ? Colors.borderColor : Colors.white,
      }}
      listItemContainerStyle={{
        zIndex: 110100,
        paddingStart: WIDTH_BASE_RATIO(5),
      }}
      containerStyle={{
        borderRadius: WIDTH_BASE_RATIO(15),
        padding: 0,
        margin: 0,
        width: dropDownWidth,
      }}
      textStyle={{
        paddingStart: WIDTH_BASE_RATIO(15),
        fontSize: HEIGHT_BASE_RATIO(22),
        color: disabled ? Colors.borderColor : Colors.white,
        marginStart: 0,
        textAlign: 'center',
        fontFamily: 'Inter-Bold',
      }}
      labelStyle={{
        color: disabled ? Colors.borderColor : Colors.white,
        textAlign: 'center',
        fontSize: HEIGHT_BASE_RATIO(22),
        fontFamily: 'Inter-Bold',
      }}
      tickIconStyle={{
        width: WIDTH_BASE_RATIO(15),
        height: HEIGHT_BASE_RATIO(15),
        tintColor: disabled ? Colors.borderColor : Colors.white,
      }}
      zIndex={9000}
    />
  );
};

export default CustomDropDown;
