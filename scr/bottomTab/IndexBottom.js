import React, {useState, useEffect} from 'react';
import {
  Alert,
  Animated,
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  Text,
  Modal,
  ImageBackground,
  Platform,
  BackHandler,
} from 'react-native';
import {CurvedBottomBar} from 'react-native-curved-bottom-bar';
import {NavigationContainer} from '@react-navigation/native';
import Home from '../Screens/OtherScreens/Home';
import Admin from '../Screens/OtherScreens/Admin';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {ImagesCom} from '../constant/images';
import Stylsheet from '../constant/Stylsheet';
import {Colors} from '../constant/colors';
import MediaDetail from '../Screens/OtherScreens/MediaDetail';
import Calender from '../Screens/OtherScreens/Calender';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Button from '../constant/button';
import {FontsFmily} from '../constant/fonts';
import {useSelector} from 'react-redux';
import {AllGetAPI} from '../component/APIscreen';

export default function IndexBottom({navigation}) {
  const user = useSelector(state => state.user.user);
  const [checksubscription, setChecksubscription] = useState('');
  const [paymentcheckNavigae, setpaymentcheckNavigae] = useState('');

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      navigation.goBack();
      return true;
    });

    return () => backHandler.remove();
  }, [navigation]);


  const handleCheck = () => {
    AllGetAPI({url: 'check-subscription', Auth: user?.userdata?.api_token})
      .then(res => {
        console.log('res of checktgfdgffgsfsfsfdsfdsfdsfdsfdsfdsfsdf', res);
        if (res.status == 'success') {
          setChecksubscription(res);
          if (Platform.OS == 'ios') {
            if (res.iosPaymentStatus === '1') {
              if (res.is_subscription == false) {
                setSubscription_modal(true);
              } else if (res.is_subscription == true) {
                navigation.navigate('AddNew');
              }
            } else {
              navigation.navigate('AddNew');
            }
          } else if (Platform.OS == 'android') {
            if (res.androidPaymentStatus === '1') {
              if (res.is_subscription == false) {
                setSubscription_modal(true);
              } else if (res.is_subscription == true) {
                navigation.navigate('AddNew');
              }
            } else {
              navigation.navigate('AddNew');
            }
          }
        }
      })
      .catch(err => {
        console.log('err in dob error', err);
      });
  };

  const [Subscription_modal, setSubscription_modal] = useState(false);

  const _renderIcon = (routeName, selectedTab) => {
    let icon = '';

    switch (routeName) {
      case 'Home':
        icon = 'home';
        break;
      case 'MediaDetail':
        icon = 'database';
        break;
      case 'Calender':
        icon = 'calendar';
        break;
      case 'Admin':
        icon = 'user';
        break;
    }

    return (
      <>
        <Feather
          name={icon}
          size={25}
          color={routeName === selectedTab ? '#D92835' : '#9E9E9E'}
        />
      </>
    );
  };
  const renderTabBar = ({routeName, selectedTab, navigate, navigation}) => {
    return (
      <TouchableOpacity
        onPress={() => navigate(routeName)}
        style={styles.tabbarItem}>
        {_renderIcon(routeName, selectedTab)}
      </TouchableOpacity>
    );
  };

  return (
    <NavigationContainer independent={true}>
      <CurvedBottomBar.Navigator
        type="DOWN"
        style={styles.bottomBar}
        shadowStyle={styles.shawdow}
        circlePosition="CENTER"
        height={65}
        circleWidth={80}
        bgColor="white"
        initialRouteName="AddNew"
        borderTopLeftRight
        renderCircle={({selectedTab, navigate}) => (
          <Animated.View style={styles.btnCircleUp}>
            <TouchableOpacity
              style={styles.button}
              // onPress={() => navigation.navigate('AddNew')}
              onPress={() => handleCheck()}>
              <Feather name={'plus'} color={'#FFFFFF'} size={25} />
            </TouchableOpacity>
          </Animated.View>
        )}
        tabBar={renderTabBar}
        screenOptions={{
          headerShown: false,
          tabBarHideOnKeyboard: true,
        }}>
        <CurvedBottomBar.Screen
          name="Home"
          position="LEFT"
          component={({navigate}) => <Home navigation={navigation} />}
        />

        <CurvedBottomBar.Screen
          name="MediaDetail"
          position="LEFT"
          component={({}) => <MediaDetail navigation={navigation} />}
        />
        <CurvedBottomBar.Screen
          name="Calender"
          position="RIGHT"
          component={({}) => <Calender navigation={navigation} />}
        />
        <CurvedBottomBar.Screen
          name="Admin"
          component={({}) => <Admin navigation={navigation} />}
          position="RIGHT"
        />
      </CurvedBottomBar.Navigator>

      <Modal
        transparent={true}
        animationType={'none'}
        visible={Subscription_modal}>
        <TouchableOpacity
          onPress={() => setSubscription_modal(false)}
          style={styles.modalBackground}>
          <View style={styles.activityIndicatorWrapper}>
            <Text
              style={[
                Stylsheet.regulrtxt,
                {
                  textAlign: 'center',
                  fontFamily: FontsFmily.Medium,
                  marginTop: 25,
                  marginHorizontal: 20,
                },
              ]}>
              you need to subscribe before adding any media file and document.
            </Text>

            <Image
              style={[styles.MemIconimg, {marginTop: 25}]}
              source={ImagesCom.subscrIcon}
              resizeMode="contain"
            />

            <ImageBackground
              style={styles.dollrimg}
              source={ImagesCom.monthly}
              borderRadius={10}
              resizeMode="cover">
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginHorizontal: 15,
                }}>
                <Text style={styles.dollrtxt}>Monthly</Text>
                <Text style={styles.dollrtxt}>
                  $2.99/
                  <Text
                    style={[styles.dollrtxt, {fontFamily: FontsFmily.Regular}]}>
                    month
                  </Text>
                </Text>
              </View>
            </ImageBackground>

            <View style={{marginTop: 35}}>
              <Button
                title={'Subscribe'}
                onPress={() => {
                  navigation.navigate('Payment_Public', {
                    res: user,
                    forpublic: 'true',
                  });
                }}
              />
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </NavigationContainer>
  );
}

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  shawdow: {
    shadowColor: '#DDDDDD',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 1,
    shadowRadius: 5,
  },
  button: {
    justifyContent: 'center',
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  bottomBar: {},
  btnCircleUp: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#D92835',
    bottom: 35,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 1,
  },
  imgCircle: {
    width: 30,
    height: 30,
    tintColor: '#9E9E9E',
  },
  tabbarItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  img: {
    width: 30,
    height: 30,
  },
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(4, 4, 4,0.7)',
  },
  activityIndicatorWrapper: {
    backgroundColor: '#fff',
    height: hp(72),
    width: wp(90),
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    // justifyContent: 'space-around',
  },
  MemIconimg: {
    width: 200,
    height: 200,
  },
  dollrimg: {
    width: 300,
    height: 90,
    alignSelf: 'center',
    marginTop: 40,
    // alignItems:'center',
    justifyContent: 'center',
  },
  dollrtxt: {
    fontSize: 14,
    fontFamily: FontsFmily.Semibold,
    color: '#FFFFFF',
  },
});
