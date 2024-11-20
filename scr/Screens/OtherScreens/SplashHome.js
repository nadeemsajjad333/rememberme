import {
    StyleSheet,
    View,
    ImageBackground,
    Animated,
    Easing,
  } from 'react-native';
  import React, {useEffect, useRef} from 'react';
  import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
  } from 'react-native-responsive-screen';
import { FontsFmily } from '../../constant/fonts';
  
  const SplashHome = ({navigation}) => {
    const rotateAnimation = useRef(new Animated.Value(0)).current;
    const circleRadius = 0;
    const duration = 4000;
    const iterations = 1;
  
    const startAnimation = () => {
      Animated.timing(rotateAnimation, {
        toValue: 1,
        duration: duration * iterations,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start();
    };
  
    useEffect(() => {
      startAnimation();
    }, []);
  
    const interPolateRotaion = rotateAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '-180deg'],
    });
    const interPolateRotaion2 = rotateAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '180deg'],
    });
  
    const fadeAnim = useRef(new Animated.Value(0)).current;
  
    useEffect(() => {
      const delay = 0;
  
      const animationTimeout = setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 4000,
          useNativeDriver: true,
        }).start();
      }, delay);
  
      return () => clearTimeout(animationTimeout);
    }, [fadeAnim]);
  
    const animatedValue = useRef(new Animated.Value(0)).current;
  
    useEffect(() => {
      const startAnimation = () => {
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 4000,
          useNativeDriver: false,
        }).start();
      };
  
      const animationDelay = setTimeout(startAnimation, 0);
  
      return () => clearTimeout(animationDelay);
    }, [animatedValue]);
  
    const fontSize = animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 30],
    });
  
    useEffect(() => {
      setTimeout(() => {
        navigation.navigate('IndexBottom');
      }, 3000);
    }, []);
  
    return (
      <View style={{flex: 1}}>
        <ImageBackground
          source={require('../../assets/images/splashback.png')}
          style={{flex: 1}}>
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <View style={[styles.image_cintainer]}>
              <Animated.Image
                source={require('../../assets/images/green.png')}
                style={[
                  styles.Image,
                  {
                    transform: [
                      {rotate: interPolateRotaion},
                      {translateX: 0},
                      {translateY: 0},
                    ],
                  },
                ]}
                resizeMode="contain"
              />
              <Animated.Image
                source={require('../../assets/images/red.png')}
                style={[
                  styles.Image2,
                  {transform: [{rotate: interPolateRotaion2}]},
                ]}
                resizeMode="contain"
              />
              <ImageBackground
                source={require('../../assets/images/circle.png')}
                resizeMode="contain"
                borderRadius={100}
                style={styles.circle}>
                <Animated.Text style={[styles.text, {fontSize}]}>
                  RM
                </Animated.Text>
              </ImageBackground>
            </View>
  
            <View style={{alignItems: 'center', marginTop: wp(6)}}>
              <Animated.Text style={[styles.remembertext]}>
                Remember Me
              </Animated.Text>
              <Animated.Text style={[styles.remembertext1]}>
                Family Tree
              </Animated.Text>
              <Animated.Text style={[styles.text2]}>
                Honor the past,write your own future.
              </Animated.Text>
            </View>
          </View>
        </ImageBackground>
      </View>
    );
  };
  
  export default SplashHome;
  
  const styles = StyleSheet.create({
    Image: {
      width: 200,
      height: 200,
    },
    image_cintainer: {
      width: wp(60),
      height: hp(30),
      alignItems: 'center',
      justifyContent: 'center',
    },
    back_image: {
      width: wp(58),
      height: hp(28),
      alignItems: 'center',
      justifyContent: 'center',
    },
    text: {
      color: '#fff',
      fontFamily:'Brush-Script',
      fontSize:30
    },
    remembertext: {
      fontSize: 20,
      fontFamily:FontsFmily.Semibold,
      color: '#3F414E',
    },
    text2: {
      fontSize: 16,
      width: wp(60),
      fontFamily:FontsFmily.Medium,
      color: '#000000',
      marginTop: wp(4),
      textAlign: 'center',
    },
    circle: {
      width: 90,
      height: 90,
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
    },
    remembertext1: {
      fontSize: 14,
      fontFamily:FontsFmily.Semibold,
      color: '#3F414E',
    },
    Image2: {
      width: 200,
      height: 200,
      position: 'absolute',
    },
  });
  