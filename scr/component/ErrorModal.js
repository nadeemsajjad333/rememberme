import React from 'react';
import {
  StyleSheet,
  View,
  Modal,
  ActivityIndicator,
  Text,
  ProgressBarAndroid,
  TouchableOpacity,
} from 'react-native';

const ErrorModal = ({loader}) => {
  return (
    <Modal transparent={true} animationType={'none'} visible={loader}>
      <View style={styles.modalBackground}>
        <View style={styles.activityIndicatorWrapper}>
          <View
            style={{
              backgroundColor: '#202326',
              width: 300,
              height: 200,
              borderRadius: 10,
              justifyContent: 'space-between',
            }}>
            <Text
              style={{
                color: '#fff',
                fontSize: 14,
                fontFamily: 'Inter-Medium',
                margin: 20,
              }}>
              Invalid email or password.
            </Text>
            <TouchableOpacity style={{alignSelf: 'flex-end', margin: 25}}>
              <Text
                style={{
                  color: '#fff',
                  fontSize: 16,
                  fontFamily: 'Inter-Medium',
                }}>
                ok
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
export default ErrorModal;

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(4, 4, 4,0.7)',
  },
  activityIndicatorWrapper: {
    backgroundColor: 'transparent',
    height: 80,
    width: 80,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  txt: {
    color: '#D92835',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  progressText: {
    marginTop: 10,
    fontWeight: 'bold',
  },
});
