import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import {Colors} from '../Constants/Colors';
import Stylsheet from './Stylsheet';

export default function Button({title, onPress}) {
  return (
    <View>
      <TouchableOpacity onPress={onPress} style={Stylsheet.ButtonMain}>
        <Text style={Stylsheet.ButonTxt}>{title}</Text>
      </TouchableOpacity>
    </View>
  );
}
