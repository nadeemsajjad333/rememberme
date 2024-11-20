import React from 'react';
import {
  StyleSheet,
  View,
  Modal,
  ActivityIndicator,
  Text,
  ProgressBarAndroid,
} from 'react-native';

import ProgressBar from 'react-native-progress/Bar';

const Progress_Bar = ({loaders, progress, uploading}) => {
  const formattedProgress = Math.round(progress * 100);

  return (
    <Modal transparent={true} animationType={'none'} visible={loaders}>
      <View style={styles.modalBackground}>
        <View style={styles.activityIndicatorWrapper}>
          <ProgressBar
            progress={progress}
            width={200}
            height={15}
            borderRadius={10}
            color="#D92835"
          />
          <Text style={styles.txt}>{formattedProgress + '%'}</Text>
        </View>
      </View>
    </Modal>
  );
};
export default Progress_Bar;

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
    color: '#fff',
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    position: 'absolute',
  },
  progressText: {
    marginTop: 10,
    fontWeight: 'bold',
    color: 'red',
  },
});
