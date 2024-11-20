import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from 'react-native';
import React from 'react';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {FontsFmily} from '../constant/fonts';

export default function UpdatePopop({loader, close}) {
  const handlePress = () => {
    const url = 'https://play.google.com/store/apps/details?id=com.app.rememberme.familytree';
    Linking.openURL(url).catch(err => console.error('An error occurred', err));
  };

  return (
    <Modal transparent={true} animationType={'none'} visible={loader}>
      <View style={styles.alrtBG}>
        <View style={styles.alertsview}>
          <Text
            style={[
              styles.alrttetxt,
              {
                color: '#000',
                top: 10,
                fontSize: 14,
                fontFamily: FontsFmily.Bold,
              },
            ]}>
            Update Required
          </Text>
          <Text style={[styles.alrttetxt, {marginHorizontal: 10}]}>
            A new version of the app is available. Please update to continue
            using the app.
          </Text>
          <View
            style={{
              flexDirection: 'row',
            }}>
            <TouchableOpacity
              style={styles.cancel}
              activeOpacity={0.8}
              onPress={close}>
              <Text
                style={{
                  color: '#5FB9E8',
                  fontSize: 14,
                  fontFamily: FontsFmily.Semibold,
                }}>
                Later
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => handlePress()}
              style={styles.Ok}>
              <Text
                style={{
                  color: '#5FB9E8',
                  fontSize: 14,
                  fontFamily: FontsFmily.Semibold,
                }}>
                Update Now
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  alrtBG: {
    backgroundColor: 'rgba(4, 4, 4,0.4)',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertsview: {
    width: wp(70),
    height: hp(18),
    backgroundColor: '#F4F8F9',
    borderRadius: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  alrttetxt: {
    color: '#3F3F3F',
    fontSize: 12,
    fontFamily: FontsFmily.Semibold,
    textAlign: 'center',
  },
  Ok: {
    borderTopWidth: 0.3,
    width: 125,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: 'gray',
  },
  cancel: {
    width: 125,
    height: 40,
    borderTopWidth: 0.3,
    borderRightWidth: 0.3,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: 'gray',
  },
});
