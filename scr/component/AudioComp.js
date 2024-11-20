import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import Sound from 'react-native-sound';
import Slider from '@react-native-community/slider';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons3 from 'react-native-vector-icons/Ionicons';
import {Colors} from '../constant/colors';

export default function AudioComp({audioUri, recive, snd}) {
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    Sound.setCategory('Playback');

    const sound = new Sound(audioUri, Sound.MAIN_BUNDLE, error => {
      if (error) {
        console.log('Error loading audio:', error);
      } else {
        setSound(sound);
        setDuration(sound.getDuration());
      }
    });

    return () => {
      if (sound) {
        sound.stop();
        sound.release();
      }
    };
  }, []);

  useEffect(() => {
    const progressInterval = setInterval(() => {
      if (sound && isPlaying) {
        sound.getCurrentTime(seconds => {
          setProgress(seconds);
        });
      }
    }, 1000);

    return () => clearInterval(progressInterval);
  }, [sound, isPlaying]);

  const playPauseToggle = () => {
    if (sound) {
      if (isPlaying) {
        sound.pause();
      } else {
        sound.play(success => {
          if (success) {
            sound.setCurrentTime(0);
            setProgress(0);
            setIsPlaying(false);
          } else {
          }
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  const onSliderValueChange = value => {
    if (sound) {
      sound.setCurrentTime(value);
      setProgress(value);
    }
  };

  const formatTime = seconds => {
    const minutes = Math.floor(seconds / 60);
    const secondsRemaining = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${secondsRemaining
      .toString()
      .padStart(2, '0')}`;
  };

  return (
    <View
      style={{
        width: 250,
        height: 60,
        backgroundColor: recive ? '#ffffff' : 'pink',
        borderRadius: 50,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        shadowColor: '#5A5252',
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,

        elevation: 1.5,
      }}>
      <TouchableOpacity
        style={{
          width: 35,
          height: 35,
          borderColor: Colors.MainColor,
          borderWidth: 1,
          borderRadius: 23,
          alignItems: 'center',
          justifyContent: 'center',
          left: 5,
        }}
        onPress={() => playPauseToggle()}>
        <Ionicons3
          name={isPlaying ? 'pause' : 'play'}
          size={23}
          style={{color: Colors.MainColor}}
        />
      </TouchableOpacity>

      <Slider
        style={{width: '70%'}}
        value={progress}
        minimumValue={0}
        maximumValue={duration}
        minimumTrackTintColor={Colors.MainColor}
        maximumTrackTintColor="#000000"
        thumbTintColor="red"
        step={1}
        onValueChange={onSliderValueChange}
      />

      <Text
        style={{
          fontSize: 10,
          color: '#000',
          right: 7,
          fontFamily: 'Inter-Medium',
        }}>
        {formatTime(Math.round(progress))}
      </Text>
    </View>
  );
}
