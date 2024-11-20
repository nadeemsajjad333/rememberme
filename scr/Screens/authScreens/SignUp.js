import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  Modal,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import Stylsheet from '../../constant/Stylsheet';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {ImagesCom} from '../../constant/images';
import ImagePicker from 'react-native-image-crop-picker';
import {Colors} from '../../constant/colors';
import Button from '../../constant/button';
import CountryPickerModal from 'react-native-country-picker-modal';
import {FontsFmily} from '../../constant/fonts';
import {RegisterApi, AllPostApi, AllGetAPI} from '../../component/APIscreen';
import AndroidToast from '../../component/AndroidToast';
import {useDispatch} from 'react-redux';
import {setUser} from '../../ReduxToolkit/MyUserSlice';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Indicator from '../../component/Indicator';
import Loading from '../../component/Loading';
import Entypo from 'react-native-vector-icons/Entypo';
import crashlytics from '@react-native-firebase/crashlytics';

const CELL_COUNT = 4;

const SignUp = ({navigation}) => {
  const dispatch = useDispatch();
  const [Membermodal, setMembermodal] = useState(false);
  const [verifyModal, setVerifyModal] = useState(false);
  const [error, setError] = useState(false);

  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedCountryErr, setSelectedCountryErr] = useState(false);
  const [isCountryPickerVisible, setCountryPickerVisible] = useState(false);

  const [image, setImage] = useState('');
  const [imageErr, setImageErr] = useState('');
  const [username, setUsername] = useState('');
  const [usernameErr, setUsernameErr] = useState('');
  const [email, setEmail] = useState('');
  const [EmailErr, setEmailErr] = useState('');
  const [password, setPassword] = useState('');
  const [passwordErr, setPasswordErr] = useState('');
  const [phone, setPhone] = useState('');
  const [phoneErr, setPhoneErr] = useState('');
  const [LoadingCursor, setLoadingCursor] = useState('');
  const [passwordStrength, setPasswordStrength] = useState('');
  const [isChecked, setChecked] = useState(0);
  const [ischeckederr, setischeckederr] = useState('');
  const [loader, setloader] = useState(false);
  const [respons, setrespons] = useState('');
  const [eye1, setEye1] = useState(false);
  const [paymentcheckNavigae, setpaymentcheckNavigae] = useState('');

  const emailCheck = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  const specialCharRegex = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/;
  const [counter, setcounter] = useState(59);
  console.log(counter);
  useEffect(() => {
    if (verifyModal) {
      const timer =
        counter > 0 && setInterval(() => setcounter(counter - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [counter, verifyModal]);
  const sendMail = async () => {
    setcounter(59);
    // setIndicator(true);
    AllPostApi({url: 'forgot', email})
      .then(res => {
        console.log('response of send E-mail', res);
        if (res.status == 'success') {
          AndroidToast(res.message);
          // setIndicator(false);
          setcounter(120);
          // navigation.navigate('PinVerify', {email});
        }
      })
      .catch(err => {
        console.log('error of send E-mail', err);

        crashlytics().recordError(err);
        // setIndicator(false);
      });
  };
  const Validation = () => {
    if (!email && !password && !username && !phone && !isChecked && !image) {
      setEmailErr('Enter your email address');
      setUsernameErr('Enter your email address');
      setPasswordErr('Enter your password');
      setPhoneErr('Enter your phone no');
      setischeckederr('Enter your');
      setImageErr('');

      return false;
    } else if (!email) {
      setEmailErr('please enter your Email');
      return false;
    } else if (emailCheck.test(email) === false) {
      setEmailErr('not correct format for email address');
      return false;
    } else if (!username) {
      setUsernameErr('please enter your username');
      return false;
    } else if (!password) {
      setPasswordErr('please enter your password');
      return false;
    } else if (!image) {
      setImageErr('Please select your picture');
      return false;
    } else if (!specialCharRegex.test(password)) {
      setPasswordStrength(
        'Password should contain minimum 4 characters, with one UPPERCASE, lowercase, number and special character: @$! % * ? &',
      );
      return false;
    } else if (!isChecked) {
      setError(true);
      setischeckederr('Please accept our terms & conditions.');
      return false;
    }

    return true;
  };

  const handleCountrySelect = country => {
    setSelectedCountry(country);
  };

  const [value, setValue] = useState('');
  const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  const timeout = () => {
    setTimeout(() => {
      setMembermodal(true);
    }, 1000);
  };
  const SetPinCode = async () => {
    console.log('::::::::::::::');
    AllPostApi({url: 'verify', email, pin: value})
      .then(res => {
        console.log('response of emial verify', res);
        if (res.status == 'success') {
          setVerifyModal(false);
          AndroidToast(res.message);
          timeout();
        } else {
          AndroidToast(res.error);
        }
      })
      .catch(err => {
        console.log('error of verify E-mail', err);
        crashlytics().recordError(err);
      });
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

  const register = async () => {
    if (Validation()) {
      setloader(true);
      const contri = selectedCountry.name;
      const formdata = new FormData();
      formdata.append('image', {
        uri: image,
        type: 'image/jpg',
        name: `image${new Date()}.jpg`,
      });
      formdata.append('image', image),
        formdata.append('username', username),
        formdata.append('email', email),
        formdata.append('password', password),
        formdata.append('phoneno', phone),
        formdata.append('country', contri);
      formdata.append('is_agree_term', isChecked);
      RegisterApi({url: 'register'}, formdata)
        .then(res => {
          console.log('res', res);
          setloader(false);
          if (res.validaterror == 1) {
            AndroidToast('The email has already been taken.');
            setloader(false);
          }
          if (res.status == 'success') {
            setloader(false);
            setVerifyModal(true, {email: email});
            setrespons(res);
          }
        })
        .catch(err => {
          console.log('api error', err);
          crashlytics().recordError(err);
          setloader(false);
        });
    }
  };

  useEffect(() => {
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
  }, []);

  const paymentstatuscheckfor_IOS = () => {
    setTimeout(() => {
      if (paymentcheckNavigae?.iosStatus === '0') {
        console.log('Status 0 work');
        setMembermodal(false);
        dispatch(setUser(respons));
      } else {
        console.log('Status 1 work');
        navigation.navigate('Subscription', {res: respons});
        setMembermodal(false);
      }
    }, 1000);
  };

  const paymentstatuscheckfor_Android = () => {
    setTimeout(() => {
      if (paymentcheckNavigae?.androidStatus === '0') {
        console.log('Status 0 work');
        setMembermodal(false);
        dispatch(setUser(respons));
      } else {
        console.log('Status 1 work');
        navigation.navigate('Subscription', {res: respons});
        setMembermodal(false);
      }
    }, 1000);
  };
  const Wrapper = Platform.OS === 'ios' ? KeyboardAvoidingView : View;

  return (
    <Wrapper behavior="padding" style={{flex: 1}}>
      <View style={Stylsheet.container}>
        {loader && <Loading />}
        <View
          style={{
            //  flexDirection: 'row',
            justifyContent: 'center',
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
          <TouchableOpacity
            style={{marginLeft: 10, position: 'absolute', left: 5}}
            onPress={() => navigation.goBack()}>
            <AntDesign name="arrowleft" size={22} style={{color: '#000'}} />
          </TouchableOpacity>
          <Text style={[Stylsheet.semibldTxt, {textAlign: 'center'}]}>
            {'Create Your Account'}
          </Text>
        </View>
        <ScrollView>
          <View style={{}}>
            <View style={Stylsheet.signavatr}>
              <TouchableOpacity onPress={() => picker()}>
                <Image
                  style={Stylsheet.avtarimg}
                  source={image ? {uri: image} : ImagesCom.avatar1}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            </View>

            <View
              style={{
                height: 420,
                justifyContent: 'space-between',
                marginTop: 35,
              }}>
              <View style={{alignSelf: 'center'}}>
                <Text style={Stylsheet.outtxtinpt}>Username</Text>
                <View
                  style={[
                    Stylsheet.textinptBox,
                    {borderColor: usernameErr ? 'red' : '#CFCFCF'},
                  ]}>
                  <Image
                    style={Stylsheet.inputicon}
                    source={ImagesCom.user}
                    resizeMode="contain"
                  />

                  <TextInput
                    style={Stylsheet.TextInputS}
                    placeholder="Enter username"
                    placeholderTextColor={Colors.gray}
                    value={username}
                    onChangeText={Text => {
                      setUsernameErr('');
                      setUsername(Text);
                    }}
                  />
                </View>
              </View>

              <View style={{alignSelf: 'center'}}>
                <Text style={Stylsheet.outtxtinpt}>E-mail</Text>
                <View
                  style={[
                    Stylsheet.textinptBox,
                    {borderColor: EmailErr ? 'red' : '#CFCFCF'},
                  ]}>
                  <Image
                    style={Stylsheet.inputicon}
                    source={ImagesCom.mail}
                    resizeMode="contain"
                  />

                  <TextInput
                    style={Stylsheet.TextInputS}
                    placeholder="Enter e-mail"
                    placeholderTextColor={Colors.gray}
                    value={email}
                    onChangeText={Text => {
                      setEmailErr('');
                      setEmail(Text);
                    }}
                  />
                </View>
              </View>

              <View style={{alignSelf: 'center'}}>
                <Text style={Stylsheet.outtxtinpt}>Password</Text>
                <View
                  style={[
                    Stylsheet.textinptBox,
                    {borderColor: passwordErr ? 'red' : '#CFCFCF'},
                  ]}>
                  <Image
                    style={Stylsheet.inputicon}
                    source={ImagesCom.lock}
                    resizeMode="contain"
                  />

                  <TextInput
                    style={Stylsheet.TextInputS}
                    placeholder="Enter password"
                    placeholderTextColor={Colors.gray}
                    secureTextEntry={!eye1}
                    value={password}
                    onChangeText={Text => {
                      setPasswordErr('');
                      setPasswordStrength('');
                      setPassword(Text);
                    }}
                  />
                  <TouchableOpacity style={{}} onPress={() => setEye1(!eye1)}>
                    <Entypo
                      name={eye1 ? 'eye' : 'eye-with-line'}
                      size={20}
                      color={'black'}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={{alignSelf: 'center'}}>
                <Text style={Stylsheet.outtxtinpt}>Phone No</Text>
                <View
                  style={[
                    Stylsheet.textinptBox,
                    {borderColor: phoneErr ? 'red' : '#CFCFCF'},
                  ]}>
                  <Image
                    style={Stylsheet.inputicon}
                    source={ImagesCom.phone}
                    resizeMode="contain"
                  />

                  <TextInput
                    style={Stylsheet.TextInputS}
                    placeholder="Enter Number"
                    placeholderTextColor={Colors.gray}
                    keyboardType="phone-pad"
                    value={phone}
                    onChangeText={Text => {
                      setPhone(Text);
                      setPhoneErr('');
                    }}
                  />
                </View>
              </View>

              <View style={{alignSelf: 'center'}}>
                <Text style={Stylsheet.outtxtinpt}>Country</Text>
                <View
                  style={[
                    Stylsheet.textinptBox,
                    {borderColor: selectedCountryErr ? 'red' : '#CFCFCF'},
                  ]}>
                  {!selectedCountry ? (
                    <View>
                      <Image
                        style={Stylsheet.inputicon}
                        source={ImagesCom.flag}
                        resizeMode="contain"
                      />
                    </View>
                  ) : null}

                  <View style={{paddingLeft: 10}}>
                    <CountryPickerModal
                      visible={isCountryPickerVisible}
                      onClose={() => {
                        setCountryPickerVisible(false);
                      }}
                      withFilter={true}
                      withFlag={true}
                      withCountryNameButton={true}
                      // placeholder="Select a Country"
                      placeholderTextColor="gray"
                      countryCode={selectedCountry?.cca2}
                      onSelect={handleCountrySelect}
                      onChangeText={Text => {
                        selectedCountry(Text);
                        setSelectedCountryErr('');
                      }}
                      //   translation="eng"
                    />
                  </View>
                </View>
              </View>
            </View>

            <View
              style={[Stylsheet.flexdirec, {paddingLeft: 28, marginTop: 8}]}>
              {isChecked == '0' ? (
                <TouchableOpacity onPress={() => setChecked('1')}>
                  <Image
                    style={Stylsheet.checicn}
                    source={ImagesCom.without}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              ) : null}

              {isChecked == '1' ? (
                <TouchableOpacity onPress={() => setChecked('0')}>
                  <Image
                    style={Stylsheet.checicn}
                    source={ImagesCom.check}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              ) : null}

              <View style={Stylsheet.flexdirec}>
                <Text style={Stylsheet.Iagreetxt}>I agree to all</Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate('Term_Cndtn')}
                  style={{}}>
                  <Text
                    style={[
                      Stylsheet.Iagreetxt,
                      {
                        fontSize: 12,
                        fontFamily: FontsFmily.Semibold,
                        color: Colors.MainColor,
                        textDecorationLine: 'underline',
                        paddingLeft: 5,
                      },
                    ]}>
                    Terms & Conditions
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={Stylsheet.error_view}>
              {imageErr ? (
                <Text
                  style={{
                    color: 'red',
                    fontFamily: FontsFmily.Medium,
                    fontSize: 12,
                  }}>
                  {imageErr}
                </Text>
              ) : null}
            </View>
            <View style={Stylsheet.error_view}>
              {passwordStrength ? (
                <Text
                  style={{
                    width: 250,
                    color: 'red',
                    fontFamily: 'Poppins-Regular',
                    fontSize: 10,
                  }}>
                  {passwordStrength}
                </Text>
              ) : null}
            </View>

            <View style={{marginTop: 50}}>
              <Button
                title={'Sign Up'}
                onPress={() => {
                  register();
                }}
              />
            </View>

            <View
              style={[
                Stylsheet.flexdirec,
                {alignSelf: 'center', marginTop: 20},
              ]}>
              <Text
                style={[
                  Stylsheet.outtxtinpt,
                  {fontSize: 12, fontFamily: FontsFmily.Regular},
                ]}>
                Already have an account?
              </Text>

              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={[Stylsheet.b0ldTxt, {color: Colors.MainColor}]}>
                  {' '}
                  Log In
                </Text>
              </TouchableOpacity>
            </View>

            <View>
              <Image
                style={Stylsheet.dotsimg}
                source={ImagesCom.dots}
                resizeMode="contain"
              />
            </View>
          </View>
        </ScrollView>

        {/* Modalllllllllllllllllllllll Member ship */}

        <Modal transparent={true} animationType={'none'} visible={Membermodal}>
          <View style={Stylsheet.modalBackground}>
            <View style={Stylsheet.activityIndicatorWrapper}>
              <Image
                style={Stylsheet.MemIconimg}
                source={ImagesCom.membicon}
                resizeMode="contain"
              />
              <Text
                style={[
                  Stylsheet.regulrtxt,
                  {textAlign: 'center', fontFamily: FontsFmily.Medium},
                ]}>
                Select and continue as you are new member{'\n'}or already have a
                membership
              </Text>
              <View
                style={{
                  height: 120,
                  justifyContent: 'space-between',
                  marginTop: 30,
                }}>
                <Button
                  title={'New Member'}
                  onPress={() => {
                    if (Platform.OS === 'ios') {
                      paymentstatuscheckfor_IOS();
                    } else if (Platform.OS === 'android') {
                      paymentstatuscheckfor_Android();
                    }
                  }}
                />

                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('Dijit', {
                      mail: email,
                      pass: password,
                      token: respons,
                    }),
                      setMembermodal(false);
                    // navigation.navigate('Dijit')
                  }}
                  style={Stylsheet.logwithBtn}>
                  <Text
                    style={[
                      Stylsheet.b0ldTxt,
                      {
                        paddingLeft: 10,
                        fontSize: 14,
                        fontFamily: FontsFmily.Medium,
                      },
                    ]}>
                    Already have membership
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* /////////////////////// emsil verification */}

        <Modal transparent={true} animationType={'none'} visible={verifyModal}>
          <View style={Stylsheet.modalBackground}>
            <View style={[Stylsheet.activityIndicatorWrapper, {}]}>
              <View style={{paddingBottom: 20}}>
                <View style={[Stylsheet.flexHead, {marginTop: 20}]}>
                  <Text style={Stylsheet.semibldTxt}>{'    '}</Text>

                  <Text style={Stylsheet.semibldTxt}>Email Verification</Text>
                  <Text style={Stylsheet.semibldTxt}>{''}</Text>
                </View>

                <Image
                  style={[Stylsheet.subscrimg, {width: 180, height: 100}]}
                  source={ImagesCom.pin}
                  resizeMode="cover"
                />
                <Text
                  style={[
                    Stylsheet.mediumTxt,
                    {
                      textAlign: 'center',
                      marginTop: 50,
                      fontSize: 11,
                      marginHorizontal: 20,
                    },
                  ]}>
                  Verification code has been send to your email account Please
                  enter the verification code
                </Text>

                <View style={Stylsheet.pinView}>
                  <CodeField
                    ref={ref}
                    {...props}
                    value={value}
                    onChangeText={setValue}
                    cellCount={CELL_COUNT}
                    rootStyle={Stylsheet.codeFieldRoot2}
                    keyboardType="number-pad"
                    textContentType="oneTimeCode"
                    renderCell={({index, symbol, isFocused}) => (
                      <Text
                        key={index}
                        style={[
                          Stylsheet.cell2,
                          isFocused,
                          {
                            borderColor: value ? '#D92835' : '#E7E7E7',
                            width: 60,
                            height: 45,
                            lineHeight: wp(12),
                          },
                        ]}
                        onLayout={getCellOnLayoutHandler(index)}>
                        {symbol || (isFocused ? <Cursor /> : null)}
                      </Text>
                    )}
                  />
                </View>
                {counter == 0 ? (
                  <TouchableOpacity
                    onPress={() => sendMail()}
                    style={Stylsheet.counter}>
                    <Text style={[Stylsheet.counter_txt, {color: '#D92835'}]}>
                      Resend{' '}
                    </Text>
                    <AntDesign
                      name="right"
                      size={14}
                      style={{color: '#D92835'}}
                    />
                  </TouchableOpacity>
                ) : (
                  <View style={[Stylsheet.counter, {flexDirection: 'row'}]}>
                    <Text style={Stylsheet.counter_txt}>
                      Resend OTP in{'  '}
                    </Text>
                    <Text style={[Stylsheet.counter_txt, {color: '#D92835'}]}>
                      {counter + 's'}
                    </Text>
                  </View>
                )}

                <TouchableOpacity
                  onPress={() => {
                    SetPinCode();
                  }}
                  style={{
                    width: wp(80),
                    height: 50,
                    backgroundColor: Colors.MainColor,
                    borderRadius: 15,
                    alignItems: 'center',
                    justifyContent: 'center',
                    alignSelf: 'center',
                    marginTop: 20,
                  }}>
                  <Text style={Stylsheet.ButonTxt}>Verify</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* /////////////////////////////////// errrrroooooorrrr */}
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
                backgroundColor: '#202326',
                width: 280,
                height: 140,
                borderRadius: 10,
                justifyContent: 'space-between',
              }}>
              <View style={{margin: 20}}>
                {/* <Text
                style={{
                  color: '#fff',
                  fontSize: 16,
                  fontFamily: 'Inter-SemiBold',
                }}>
                Error
              </Text> */}
                <Text
                  style={{
                    color: '#fff',
                    fontSize: 14,
                    fontFamily: 'Inter-Medium',
                  }}>
                  {ischeckederr}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setError(false)}
                style={{alignSelf: 'flex-end', margin: 25}}>
                <Text
                  style={{
                    color: '#fff',
                    fontSize: 16,
                    fontFamily: 'Inter-SemiBold',
                  }}>
                  ok
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </Wrapper>
  );
};

export default SignUp;
