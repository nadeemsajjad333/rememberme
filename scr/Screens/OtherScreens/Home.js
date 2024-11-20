import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Modal,
  ImageBackground,
  FlatList,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Stylsheet from '../../constant/Stylsheet';
import {ImagesCom} from '../../constant/images';
import messaging from '@react-native-firebase/messaging';
import {requestNotifications, PERMISSIONS} from 'react-native-permissions';
import {
  AddEventAPI,
  AllGetAPI,
  AllGetAPI2,
  AllPostApi,
  fcm_Update,
  treeUsrAPI,
} from '../../component/APIscreen';
import {useDispatch, useSelector} from 'react-redux';
import AntDesign from 'react-native-vector-icons/AntDesign';
import moment from 'moment';
import {Colors} from '../../constant/colors';
import Loading from '../../component/Loading';
import {WebView} from 'react-native-webview';
import {logoutUser, setUser} from '../../ReduxToolkit/MyUserSlice';
import {useIsFocused} from '@react-navigation/native';
import {FontsFmily} from '../../constant/fonts';
import analytics from '@react-native-firebase/analytics';
import crashlytics from '@react-native-firebase/crashlytics';
import VersionCheck from 'react-native-version-check';
import UpdatePopop from '../../component/UpdatePopop';

const Home = ({navigation}) => {
  const user = useSelector(state => state.user.user);
  // console.log('user',user)
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const [treeToList, setTreeToList] = useState('');
  const [dobModal, setDobModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [TempData, setTempData] = useState([]);
  const [count, setCount] = useState();
  const [heart, setheart] = useState('');
  const [userList, setuserList] = useState([]);
  const [update, setupdate] = useState(false);
  // useEffect(() => {
  //   const unsubscribe = navigation.addListener('focus', () => {
  //     updateFcm();
  //   });
  //   return unsubscribe;
  // }, [navigation]);
  // useEffect(() => {
  //   if (isFocused) {
  //     updateFcm();
  //     console.log('Screen is focused');
  //   }
  // }, [isFocused]);
  useEffect(() => {
    analytics().logScreenView({screen_name: 'Home'});
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      VersionCheck.needUpdate().then(async res => {
        console.log('res', res);
        if (res.currentVersion < res.latestVersion) {
          setupdate(true);
          // Handle the update logic here, e.g., set a state or show a modal
        }
      });
    });

    return unsubscribe;
  }, []);

  const updateFcm = async () => {
    let fcmToken = await messaging().getToken();
    // console.log('fcmToken',fcmToken)
    fcm_Update({
      url: 'update-fcm',
      Auth: user?.userdata.api_token,
      fcm_token: fcmToken,
    })
      .then(res => {
        console.log('response update-fcm', res);
        if (res.message === 'User Not found') {
          // dispatch(logoutUser());
        }
      })
      .catch(err => {
        console.log('update-fcm', err);
        crashlytics().recordError(err);
      });
  };
  setTimeout(() => {
    countAPi();
  }, 60000);

  useEffect(() => {
    if (isFocused) {
      DeatilPush();
      countAPi();
      treeUsers();
      updateFcm();
    }
  }, [isFocused]);

  useEffect(() => {
    AllGetAPI({url: 'payment-status', Auth: user?.userdata.api_token})
      .then(res => {
        console.log('res', res);
      })
      .catch(err => {
        console.log('err in dob error', err);
        crashlytics().recordError(err);
      });
  }, []);

  const DeatilPush = async () => {
    AllGetAPI({url: 'today-event', Auth: user?.userdata.api_token})
      .then(res => {
        setTempData(res.events);
        if (res.is_event == true) {
          setDobModal(true);
        }
      })
      .catch(err => {
        console.log('err in dob error', err);
        crashlytics().recordError(err);
      });
  };

  const CheckPopup = async () => {
    setDobModal(false);
    const formdata = new FormData();
    formdata.append('event_id', TempData[0]?.id),
      AddEventAPI(
        {url: 'check-event', Auth: user?.userdata.api_token},
        formdata,
      )
        .then(res => {})
        .catch(err => {
          console.log('api error', err);
          crashlytics().recordError(err);
        });
  };

  const countAPi = async () => {
    AllGetAPI2({url: 'get-notification-count', Auth: user?.userdata?.api_token})
      .then(res => {
        // console.log('setCount:::', res);
        setCount(res);
      })
      .catch(err => {
        console.log('err in dob error', err);
        crashlytics().recordError(err);
      });
  };

  const treeUsers = async () => {
    try {
      const response = await fetch(
        `https://remembermefamilytree.com/api/family-tree-json/${user?.userdata?.id}`,
        {
          method: 'Get',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        },
      );
      const json = await response.json();
      setuserList(json.data);
    } catch (error) {
      console.error(error);
      crashlytics().recordError(err);
    }
  };

  return (
    <View style={{backgroundColor: '#FFFFFF', flex: 1}}>
      {loading && <Loading />}
      {update && <UpdatePopop close={() => setupdate(false)} />}
      <View style={Stylsheet.HomeHeadr}>
        <Text style={[Stylsheet.semibldTxt, {width: 52, right: 0}]}>{''}</Text>
        <Text style={Stylsheet.semibldTxt}>Home</Text>
        <View
          style={[
            Stylsheet.flexdirec,
            {width: 55, justifyContent: 'space-between', right: 20},
          ]}>
          <TouchableOpacity onPress={() => navigation.navigate('ChatList')}>
            <Image
              style={Stylsheet.homeHIcn}
              source={ImagesCom.chat}
              resizeMode="contain"
              tintColor={'#C83037'}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Notification')}>
            <Image
              style={Stylsheet.homeHIcn}
              source={ImagesCom.notifi}
              resizeMode="contain"
            />
            <View
              style={{
                width: 10,
                borderRadius: 5,
                height: 10,
                position: 'absolute',
                alignSelf: 'flex-end',
                backgroundColor: 'transparent',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 4.5,
              }}>
              <View
                style={{
                  width: 9,
                  height: 9,
                  backgroundColor:
                    count?.unread_count > 0 ? Colors.MainColor : null,
                  borderRadius: 4.5,
                  alignItems: 'center',
                  justifyContent: 'center',
                  // borderWidth: count?.unread_count.length > 0 ? null : 0.8,
                  borderColor:
                    count?.unread_count > 0 ? Colors.MainColor : null,
                }}>
                <Text
                  style={{
                    fontSize: 6,
                    color: '#fff',
                    fontFamily: FontsFmily.Regular,
                    bottom: 1,
                  }}>
                  {count?.unread_count > 0 ? count?.unread_count : ''}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <View style={Stylsheet.flexdirec}>
        <TouchableOpacity
          onPress={() => setTreeToList('tree')}
          style={[
            Stylsheet.homeBtn,
            {
              borderRightWidth: 1,
              borderRightColor: '#fff',
              backgroundColor: treeToList == 'tree' ? '#AD4950' : '#D92835',
            },
          ]}>
          <Text style={[Stylsheet.regulrtxt, {padding: 15, color: '#fff'}]}>
            Tree
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setTreeToList('list')}
          style={[
            Stylsheet.homeBtn,
            {backgroundColor: treeToList == 'list' ? '#AD4950' : '#D92835'},
          ]}>
          <Text style={[Stylsheet.regulrtxt, {padding: 15, color: '#fff'}]}>
            Tree List
          </Text>
        </TouchableOpacity>
      </View>

      {treeToList == '' ? (
        <View style={{alignSelf: 'center', marginTop: 100}}>
          <Image
            style={{width: 250, height: 250}}
            source={require('../../assets/icons/homeEty.png')}
            resizeMode="contain"
          />
        </View>
      ) : null}

      {treeToList == 'tree' ? (
        <View style={{flex: 1}}>
          <WebView
            source={{
              uri: `https://remembermefamilytree.com/api/family-tree/${user?.userdata?.id}`,
            }}
            style={{flex: 1}}
          />
        </View>
      ) : null}

      {treeToList == 'list' ? (
        <View style={{marginTop: 10}}>
          <FlatList
            data={userList}
            renderItem={({item, index}) => {
              return (
                <>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('UserMedia', {userData: item})
                    }
                    activeOpacity={0.6}
                    style={Stylsheet.card2}>
                    <View style={Stylsheet.flexdirec}>
                      <Image
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 20,
                          marginLeft: 12,
                        }}
                        source={{uri: item.image}}
                        resizeMode="cover"
                      />

                      <Text style={[Stylsheet.b0ldTxt, {paddingLeft: 15}]}>
                        {item?.username}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </>
              );
            }}
          />
        </View>
      ) : null}

      {/* /////////////////////Moadddddaaaallll */}

      <Modal transparent={true} animationType={'none'} visible={dobModal}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {
            setDobModal(false), CheckPopup();
          }}
          style={{
            flex: 1,
            backgroundColor: 'rgba(4, 4, 4,0.7)',
            justifyContent: 'space-between',
          }}>
          <TouchableOpacity
            onPress={() => CheckPopup()}
            style={{top: 20, right: 18, alignSelf: 'flex-end'}}>
            <AntDesign name="closecircle" size={25} style={{color: '#fff'}} />
          </TouchableOpacity>

          {TempData?.map(item => {
            return item?.template?.id == 7 ? (
              <View>
                <ImageBackground
                  source={{uri: item?.template?.bg_image}}
                  borderRadius={20}
                  resizeMode="cover"
                  style={{
                    width: 350,
                    height: 200,
                    margin: 5,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <View
                    style={{
                      width: 300,
                      height: 160,
                      flexDirection: 'row',
                      bottom: 10,
                    }}>
                    <View style={{width: 150}}>
                      <Image
                        style={{width: 75, height: 75, borderRadius: 10}}
                        source={{uri: item?.image}}
                        resizeMode="contain"
                      />
                      <View
                        style={{
                          width: 150,
                          height: 100,
                          justifyContent: 'space-evenly',
                        }}>
                        <View>
                          <Text style={Stylsheet.cardText1}>{item.title}</Text>
                          <Text style={Stylsheet.cardText2}>
                            {moment(item?.dob).format('MMMM, D')}
                          </Text>
                        </View>
                        <View style={{bottom: 3}}>
                          <Text style={Stylsheet.cardText1}>{item?.age}</Text>
                          <Text style={[Stylsheet.cardText1, {fontSize: 10}]}>
                            Today
                          </Text>
                        </View>
                      </View>
                    </View>
                    <View
                      style={{
                        width: 150,
                        justifyContent: 'center',
                        alignItems: 'center',
                        top: 30,
                      }}>
                      <Text style={[Stylsheet.cardText1, {fontSize: 18}]}>
                        Today Birthday
                      </Text>
                      <Text style={[Stylsheet.cardText3, {top: 2}]}>
                        {item.description}
                      </Text>
                    </View>
                  </View>
                </ImageBackground>
              </View>
            ) : null;
          })}

          {TempData?.map(item => {
            return item?.template?.id == 6 ? (
              <View>
                <ImageBackground
                  source={{uri: item.template.bg_image}}
                  borderRadius={20}
                  resizeMode="cover"
                  style={{
                    width: 350,
                    height: 200,
                    margin: 5,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <View
                    style={{
                      width: 300,
                      height: 160,
                      flexDirection: 'row',
                      bottom: 10,
                    }}>
                    <View style={{width: 150}}>
                      <Image
                        style={{width: 75, height: 75, borderRadius: 10}}
                        source={{uri: item?.image}}
                        resizeMode="contain"
                      />
                      <View
                        style={{
                          width: 150,
                          height: 100,
                          justifyContent: 'space-evenly',
                        }}>
                        <View>
                          <Text style={Stylsheet.cardText1}>{item?.title}</Text>
                          <Text style={Stylsheet.cardText2}>
                            {moment(item?.dob).format('MMMM, D')}
                          </Text>
                        </View>
                        <View style={{bottom: 3}}>
                          <Text style={Stylsheet.cardText1}>{item?.age}</Text>
                          <Text style={[Stylsheet.cardText1, {fontSize: 10}]}>
                            Today
                          </Text>
                        </View>
                      </View>
                    </View>
                    <View
                      style={{
                        width: 150,
                        justifyContent: 'center',
                        alignItems: 'center',
                        top: 35,
                      }}>
                      <Text style={[Stylsheet.cardText1, {fontSize: 18}]}>
                        Today Birthday
                      </Text>
                      <Text style={[Stylsheet.cardText3, {top: 2}]}>
                        {item?.description}
                      </Text>
                    </View>
                  </View>
                </ImageBackground>
              </View>
            ) : null;
          })}

          {TempData?.map(item => {
            return item?.template?.id == 5 ? (
              <View style={{alignSelf: 'center'}}>
                <ImageBackground
                  style={{
                    width: 350,
                    height: 200,
                    margin: 5,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  source={{uri: item?.template.bg_image}}
                  resizeMode="cover"
                  borderRadius={10}>
                  <View style={{width: 300, height: 170}}>
                    <Image
                      style={{width: 75, height: 75, borderRadius: 10}}
                      source={{uri: item?.image}}
                      resizeMode="contain"
                    />
                    <View
                      style={[
                        Stylsheet.flexdirec,
                        {justifyContent: 'space-between', marginTop: 5},
                      ]}>
                      <View>
                        <Text style={Stylsheet.cardText1}>{item?.title}</Text>
                        <Text style={Stylsheet.cardText2}>{item?.dob}</Text>
                      </View>
                      <View>
                        <Text style={Stylsheet.cardText1}>{item?.age}</Text>
                        <Text style={[Stylsheet.cardText1, {fontSize: 10}]}>
                          Today
                        </Text>
                      </View>
                    </View>
                    <Text style={[Stylsheet.cardText3, {left: 10, top: 8}]}>
                      {item?.description}
                    </Text>
                  </View>
                </ImageBackground>
              </View>
            ) : null;
          })}

          <Text>{''}</Text>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default Home;
