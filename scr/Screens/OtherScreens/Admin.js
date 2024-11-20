import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  Keyboard,
  Alert,
  Share,
  Modal,
  FlatList,
  Linking,
  SafeAreaView,
  Platform,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import Stylsheet from '../../constant/Stylsheet';
import {ImagesCom} from '../../constant/images';
import AntDesign from 'react-native-vector-icons/AntDesign';
import ImagePicker from 'react-native-image-crop-picker';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {Colors} from '../../constant/colors';
import Button from '../../constant/button';
import {useDispatch, useSelector} from 'react-redux';
import {logoutUser, setUser} from '../../ReduxToolkit/MyUserSlice';
import {AllGetAPI, AllPostApi} from '../../component/APIscreen';
import Loading from '../../component/Loading';
import {useIsFocused} from '@react-navigation/native';
import {FontsFmily} from '../../constant/fonts';

const Admin = ({navigation}) => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.user.user);
  const [Membermodal, setMembermodal] = useState(false);
  const [Reward, setReward] = useState(false);
  const [error, setError] = useState(false);
  const isFocused = useIsFocused();
  const [image, setImage] = useState('');
  const [username, setusername] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [inviteModal, setInviteModal] = useState(false);
  const [tickCheck, setTickCheck] = useState(false);
  const [onchange, setOnchange] = useState('join');
  const [paymentcheckNavigae, setpaymentcheckNavigae] = useState('');
  console.log('paymentcheckNavigae', paymentcheckNavigae);

  const [confirm2, setconfirm2] = useState(false);
  const close1modal = () => {
    setconfirm2(false);
  };
  const openURL = async url => {
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      await Linking.openURL(url);
    } else {
      console.error(`Don't know how to open URL: ${url}`);
    }
  };

  const Logout = () => {
    Alert.alert('Are you soure you want to log out?', '', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'OK', onPress: () => dispatch(logoutUser())},
    ]);
  };

  const [isCountryPickerVisible, setCountryPickerVisible] = useState(false);

  const handleCountrySelect = country => {
    setSelectedCountry(country);
  };

  const picker = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
    }).then(image => {
      console.log(image);
      setImage(image.path);
    });
  };

  const onShare = async () => {
    try {
      const result = await Share.share({
        message:
          'Check out this app: https://play.google.com/store/apps/details?id=com.app.rememberme.familytree',
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // Shared with activity type of result.activityType
        } else {
          // Shared
        }
      } else if (result.action === Share.dismissedAction) {
        // Dismissed
      }
    } catch (error) {
      Alert.alert(error.message);
    }
  };

  useEffect(() => {
    if (isFocused) {
      AllGetAPI({url: 'checkPaymentStatus'})
        .then(res => {
          console.log('res', res);
          if (res.status == 'success') {
            setpaymentcheckNavigae(res);
          }
        })
        .catch(err => {
          console.log('err in dob error', err);
          crashlytics().recordError(err);
        });
    }
  }, [isFocused]);

  return (
    <View style={Stylsheet.container}>
      {Membermodal && <Loading />}
      <View style={{paddingBottom: 110}}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            height: 70,
            backgroundColor: '#FFFFFF',
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,

            elevation: 5,
          }}>
          <View style={[Stylsheet.flexdirec, {}]}>
            <Text style={Stylsheet.semibldTxt}>{'               '}</Text>
          </View>
          <Text style={Stylsheet.semibldTxt}>Profile</Text>
          <View
            style={[
              Stylsheet.flexdirec,
              {width: 50, justifyContent: 'space-between'},
            ]}>
            {Platform.OS === 'ios' && paymentcheckNavigae?.iosStatus === '1' ? (
              <TouchableOpacity
                onPress={() => navigation.navigate('JoinedPeople')}>
                <Image
                  style={{width: 19, height: 18}}
                  source={ImagesCom.amount}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            ) : Platform.OS === 'android' &&
              paymentcheckNavigae?.androidStatus === '1' ? (
              <TouchableOpacity
                onPress={() => navigation.navigate('JoinedPeople')}>
                <Image
                  style={{width: 19, height: 18}}
                  source={ImagesCom.amount}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            ) : null}
            <TouchableOpacity style={{right: 10}} onPress={() => onShare()}>
              <Image
                style={[Stylsheet.homeHIcn, {width: 20, height: 20}]}
                source={ImagesCom.share}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        </View>
        <ScrollView>
          <View style={{marginBottom: 65}}>
            <TouchableOpacity
              onPress={() => navigation.navigate('EditProfile')}
              style={{alignSelf: 'flex-end', top: 30, right: 20}}>
              <Text style={Stylsheet.edit}>Edit</Text>
            </TouchableOpacity>
            <View
              style={{marginTop: 10, alignSelf: 'center'}}
              onPress={() => picker()}>
              <Image
                style={Stylsheet.prfileimg}
                source={
                  user.userdata.image
                    ? {uri: user.userdata.image}
                    : ImagesCom.prologo
                }
                resizeMode="cover"
              />
            </View>

            <View
              style={{
                height: 330,
                justifyContent: 'space-between',
                marginTop: 35,
              }}>
              <View style={{alignSelf: 'center'}}>
                <Text style={Stylsheet.outtxtinpt}>Username</Text>
                <View style={Stylsheet.textinptBox}>
                  <Image
                    style={Stylsheet.inputicon}
                    source={ImagesCom.user}
                    resizeMode="contain"
                  />

                  <TextInput
                    style={[Stylsheet.TextInputS, {}]}
                    placeholder="Mueem Hassan"
                    editable={false}
                    placeholderTextColor={'#000'}
                    value={user.userdata.username}
                    onChangeText={Text => {
                      setusername(Text);
                    }}
                  />
                </View>
              </View>

              <View style={{alignSelf: 'center'}}>
                <Text style={Stylsheet.outtxtinpt}>E-mail</Text>
                <View style={Stylsheet.textinptBox}>
                  <Image
                    style={Stylsheet.inputicon}
                    source={ImagesCom.mail}
                    resizeMode="contain"
                  />

                  <TextInput
                    style={[Stylsheet.TextInputS, {}]}
                    placeholder="Xmaddy@gmail.com"
                    placeholderTextColor={'#000'}
                    editable={false}
                    value={user.userdata.email}
                  />
                </View>
              </View>

              <View style={{alignSelf: 'center'}}>
                <Text style={Stylsheet.outtxtinpt}>Phone No</Text>
                <View style={Stylsheet.textinptBox}>
                  <Image
                    style={Stylsheet.inputicon}
                    source={ImagesCom.phone}
                    resizeMode="contain"
                  />

                  <TextInput
                    style={[Stylsheet.TextInputS, {}]}
                    placeholder=""
                    placeholderTextColor={'#000'}
                    editable={false}
                    value={user.userdata.phoneno}
                    keyboardType="phone-pad"
                  />
                </View>
              </View>

              <View style={{alignSelf: 'center'}}>
                <Text style={Stylsheet.outtxtinpt}>Country</Text>
                <View style={Stylsheet.textinptBox}>
                  <Image
                    style={Stylsheet.inputicon}
                    source={ImagesCom.flag}
                    resizeMode="contain"
                  />

                  <TextInput
                    style={[Stylsheet.TextInputS, {}]}
                    placeholder=""
                    placeholderTextColor={'#000'}
                    editable={false}
                    value={user.userdata.country}
                    keyboardType="phone-pad"
                  />
                </View>
              </View>
            </View>

            <View
              style={{
                height: 120,
                justifyContent: 'space-between',
                marginTop: 30,
                alignSelf: 'center',
                alignItems: 'center',
              }}>
              <Button
                title={'Log Out'}
                onPress={() => {
                  // setError(true);
                  setconfirm2(true);
                }}
              />

              <TouchableOpacity
                onPress={() => navigation.navigate('ChangePass')}
                style={Stylsheet.logwithBtn}>
                <Text style={[Stylsheet.b0ldTxt, {}]}>Change Password</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>

      {/* Modalllllllllllllllllllllll */}

      <Modal transparent={true} animationType={'none'} visible={inviteModal}>
        <View style={Stylsheet.modalBackground}>
          <View style={[Stylsheet.activityIndicatorWrapper, {height: 500}]}>
            <TouchableOpacity
              style={{alignSelf: 'flex-end', margin: 17}}
              onPress={() => setInviteModal(false)}>
              <AntDesign name="close" size={22} style={{color: '#000'}} />
            </TouchableOpacity>

            <Text style={Stylsheet.nameTxt_Inv}>John Travolta</Text>
            <Text style={Stylsheet.nameTxt_Inv2}>
              has invited you to connect
            </Text>

            <View style={{marginTop: 30, height: 260}}>
              <FlatList
                showsVerticalScrollIndicator={false}
                data={[1, 2, 3, 4, 5, 6, 7]}
                keyExtractor={item => item.id}
                renderItem={({item}) => {
                  return (
                    <View style={Stylsheet.invite_flat}>
                      <View style={Stylsheet.invite_view1}>
                        <Image
                          style={Stylsheet.invite_fltimg}
                          source={ImagesCom.invimg}
                          resizeMode="contain"
                        />
                        <Text style={Stylsheet.invite_flttxt}>
                          Yana Ivanova
                        </Text>
                      </View>
                      <View style={Stylsheet.invite_view2}>
                        <TouchableOpacity
                          onPress={() => openURL('https://www.google.com')}>
                          <AntDesign
                            name="close"
                            size={22}
                            style={{color: '#000'}}
                          />
                        </TouchableOpacity>

                        <TouchableOpacity
                          onPress={() => setTickCheck(!tickCheck)}>
                          <AntDesign
                            name={!tickCheck ? 'checkcircle' : 'checkcircleo'}
                            size={22}
                            style={{color: !tickCheck ? '#D92835' : '#000'}}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  );
                }}
              />
            </View>

            <View
              style={[
                Stylsheet.flexdirec,
                {width: 250, justifyContent: 'space-between', marginTop: 30},
              ]}>
              <TouchableOpacity
                onPress={() => setInviteModal(false)}
                style={[
                  Stylsheet.inviteee,
                  {
                    backgroundColor: '#FFFFFF',
                    borderWidth: 1,
                    borderColor: Colors.MainColor,
                    elevation: 0,
                  },
                ]}>
                <Text style={[Stylsheet.ButonTxt, {color: Colors.MainColor}]}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={Stylsheet.inviteee}>
                <Text style={Stylsheet.ButonTxt}>Invite</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* /////////////////////////////////// */}
      <Modal transparent={true} animationType={'none'} visible={error}>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            flexDirection: 'column',
            justifyContent: 'space-around',
            backgroundColor: 'rgba(4, 4, 4,0.5)',
          }}>
          <View
            style={{
              backgroundColor: 'transparent',
              height: 80,
              width: 80,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-around',
            }}>
            <View
              style={{
                backgroundColor: '#202326',
                width: 300,
                height: 150,
                borderRadius: 10,
                justifyContent: 'space-between',
              }}>
              <View style={{alignItems: 'center', top: 15}}>
                <Text
                  style={{
                    color: '#fff',
                    fontSize: 15,
                    fontFamily: 'Inter-Medium',
                  }}>
                  {'Logout'}
                </Text>
                <Text
                  style={{
                    color: '#fff',
                    fontSize: 16,
                    fontFamily: 'Inter-Regular',
                  }}>
                  {'Are you soure?'}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  width: 80,
                  justifyContent: 'space-between',
                }}>
                <TouchableOpacity
                  onPress={() => setError(false)}
                  style={{
                    width: 150,
                    height: 50,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderWidth: 1,
                    borderLeftWidth: 0,
                    borderBottomWidth: 0,
                    borderColor: 'rgba(250,250,250,0.3)',
                  }}>
                  <Text
                    style={{
                      color: '#fff',
                      fontSize: 16,
                      fontFamily: 'Inter-SemiBold',
                    }}>
                    Cancel
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    width: 150,
                    height: 50,
                    borderWidth: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderWidth: 1,
                    borderRightWidth: 0,
                    borderBottomWidth: 0,
                    borderLeftWidth: 0,
                    borderColor: 'rgba(250,250,250,0.3)',
                  }}
                  onPress={() => {
                    Logout(), setError(false);
                  }}>
                  <Text
                    style={{
                      color: '#fff',
                      fontSize: 16,
                      fontFamily: 'Inter-SemiBold',
                    }}>
                    Yes
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        transparent={true}
        visible={confirm2}
        onRequestClose={close1modal}
        animationType="none">
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}>
          <View
            style={{
              width: wp(90),
              height: wp(50),
              borderRadius: wp(4),
              justifyContent: 'space-evenly',
              backgroundColor: 'white',
            }}>
            <View style={{alignSelf: 'center', marginHorizontal: wp(10)}}>
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: FontsFmily.Medium,
                  color: Colors.black,
                  textAlign: 'center',
                }}>
                Are you sure you want to logout?
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
                alignItems: 'center',
              }}>
              <TouchableOpacity
                onPress={() => {
                  setconfirm2(false);
                  setTimeout(() => {
                    dispatch(logoutUser());
                  }, 500);
                }}
                style={{
                  width: wp(24),
                  height: wp(9),
                  borderRadius: wp(8),
                  backgroundColor: 'red',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontSize: 15,
                    fontFamily: FontsFmily.Regular,
                    color: 'white',
                    textAlign: 'center',
                    lineHeight: 20,
                  }}>
                  Yes
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => close1modal()}
                style={{
                  width: wp(24),
                  height: wp(9),
                  borderRadius: wp(8),
                  backgroundColor: Colors.white,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderWidth: 1,
                  borderColor: 'red',
                }}>
                <Text
                  style={{
                    fontSize: 15,
                    fontFamily: FontsFmily.Regular,
                    color: Colors.black,
                    textAlign: 'center',
                    lineHeight: 20,
                  }}>
                  No
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Joining person modal */}
    </View>
  );
};

export default Admin;
