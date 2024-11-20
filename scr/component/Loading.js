import React from 'react';
import {
  StyleSheet,
  View,
  Modal,
  ActivityIndicator,
  Text,
  ProgressBarAndroid,
} from 'react-native';
import {
  BallIndicator,
  BarIndicator,
  DotIndicator,
  MaterialIndicator,
  PacmanIndicator,
  PulseIndicator,
  SkypeIndicator,
  UIActivityIndicator,
  WaveIndicator,
} from 'react-native-indicators';

const Loading = ({loader}) => {
  return (
    <Modal transparent={true} animationType={'none'} visible={loader}>
      <View style={styles.modalBackground}>
        <View style={styles.activityIndicatorWrapper}>
          <SkypeIndicator color="#FFFFFF" size={25} />
        </View>
      </View>
    </Modal>
  );
};
export default Loading;

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: 'transparent',
  },
  activityIndicatorWrapper: {
    backgroundColor: '#D92835',
    height: 60,
    width: 60,
    borderRadius: 60,
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
