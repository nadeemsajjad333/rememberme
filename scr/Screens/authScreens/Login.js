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
import React, {useState} from 'react';
import Stylsheet from '../../constant/Stylsheet';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {ImagesCom} from '../../constant/images';
import ImagePicker from 'react-native-image-crop-picker';
import {Colors} from '../../constant/colors';
import Button from '../../constant/button';
import {FontsFmily} from '../../constant/fonts';
import {AllGetAPI, AllPostApi} from '../../component/APIscreen';
import {useDispatch} from 'react-redux';
import Loading from '../../component/Loading';
import AndroidToast from '../../component/AndroidToast';
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
import Entypo from 'react-native-vector-icons/Entypo';
import crashlytics from '@react-native-firebase/crashlytics';

const CELL_COUNT = 4;

const Login = ({navigation}) => {
  const dispatch = useDispatch();

  const [Membermodal, setMembermodal] = useState(false);
  const [error, setError] = useState(false);
  const [errorSet, seterrorSet] = useState('');
  const [resp, setResp] = useState('');
  const [verifyModal, setVerifyModal] = useState(false);
  const [Indicator, setIndicator] = useState(false);
  const [eye1, setEye1] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [isCountryPickerVisible, setCountryPickerVisible] = useState(false);
  const [isloading, setIsLoading] = useState(false);

  const [email, setEmail] = useState('');
  const [EmailErr, setEmailErr] = useState('');
  const [password, setPassword] = useState('');
  const [passwordErr, setPasswordErr] = useState('');

  const emailCheck = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  const Validation = () => {
    if (!email && !password) {
      setEmailErr('Enter your email address');
      setPasswordErr('Enter your password');

      return false;
    } else if (!email) {
      setEmailErr('please enter your Email');
      return false;
    } else if (emailCheck.test(email) === false) {
      setEmailErr('not correct format for email address');
      return false;
    } else if (!password) {
      setPasswordErr('please enter your username');
      return false;
    }

    return true;
  };

  const [value, setValue] = useState('');
  const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  const SetPinCode = async () => {
    AllPostApi({url: 'verify', email, pin: value})
      .then(res => {
        console.log('response of verify E-mail', res);
        AndroidToast(res.error);
        if (res.status == 'success') {
          Login2();
          AndroidToast(res.message);
        }
      })
      .catch(err => {
        console.log('error of verify E-mail', err);
        crashlytics().recordError(err);
      });
  };

  const Login = async () => {
    if (Validation()) {
      setIsLoading(true);

      AllPostApi({url: 'login', email: email, password: password})
        .then(res => {
          setIsLoading(false);

          console.log('Login Response Data', res);
          if (res.message == 'Invalid Username or Password') {
            seterrorSet(res.message);
            setError(true);
            setIsLoading(false);
          }
          if (res.message == 'Invalid Email') {
            seterrorSet(res.message);
            setError(true);
            setIsLoading(false);
          }
          if (
            res.status == 'success' &&
            res.message == 'User Logged In Successfully'
          ) {
            dispatch(setUser(res));
          } else if (res.message == 'User not verified') {
            setVerifyModal(true);
            setIsLoading(false);
          }
        })
        .catch(err => {
          setIsLoading(false);

          console.log('err in login', err);
          crashlytics().recordError(err);
        });
    }
  };

  const Login2 = async () => {
    if (Validation()) {
      AllPostApi({url: 'login', email: email, password: password})
        .then(res => {
          console.log('Login Response Data', res);
          if (res.message == 'Invalid Username or Password') {
            seterrorSet(res.message);
            setError(true);
          }
          if (res.message == 'Invalid Email') {
            seterrorSet(res.message);
            setError(true);
          }
          if (
            res.status == 'success' &&
            res.message == 'User Logged In Successfully'
          ) {
            setResp(res);
            setVerifyModal(false);
            setMembermodal(true);
          } else if (res.message == 'User not verified') {
            setVerifyModal(true);
          }
        })
        .catch(err => {
          console.log('err in login', err);
          crashlytics().recordError(err);
        });
    }
  };

  // useEffect(() => {
  //   if (Platform.OS === 'ios') {
  //     AllGetAPI({url: 'checkPaymentStatus'})
  //     .then(res => {
  //     console.log('res',res)
  //     if(res.status == 'success'){
  //       setpaymentcheckNavigae(res)
  //     }
  //     })
  //     .catch(err => {
  //       console.log('err in dob error', err);

  //     });
  //   } else {
  //     // Code for other platforms (e.g., Android)
  //     console.log('Not running on iOS');
  //   }
  // }, []);

  // const timeoutmember = () => {
  //   setTimeout(() => {
  //     if(paymentcheckNavigae?.paymentStatus == '0'){
  //       console.log('stattus 0 work')
  //       dispatch(setUser(respons));
  //     }else{
  //       console.log('stattus 1 work')
  //       navigation.navigate('Subscription', {res: respons});
  //     }
  //   }, 1000);
  // }
  const Wrapper = Platform.OS === 'ios' ? KeyboardAvoidingView : View;
  return (
    <Wrapper behavior="padding" style={{flex: 1}}>
      <View style={Stylsheet.container}>
        {isloading && <Loading />}

        {Indicator && <Loading progress={progress} />}
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
            {'Log In'}
          </Text>
        </View>
        <ScrollView>
          <View style={{}}>
            <Image
              style={Stylsheet.loginImg}
              source={ImagesCom.applogo}
              resizeMode="cover"
            />

            <View
              style={{
                height: 170,
                justifyContent: 'space-between',
                marginTop: 35,
              }}>
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
                    keyboardType="email-address"
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
            </View>

            <TouchableOpacity
              onPress={() => navigation.navigate('ForgotPswrd')}
              style={{marginTop: 8, alignSelf: 'flex-end', right: 25}}>
              <Text style={Stylsheet.Iagreetxt}>Forgot password?</Text>
            </TouchableOpacity>

            <View style={{marginTop: 50}}>
              <Button title={'Log In'} onPress={() => Login()} />
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
                Don’t have an account?
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                <Text style={[Stylsheet.b0ldTxt, {color: Colors.MainColor}]}>
                  {' '}
                  Sign Up
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

        <Modal transparent={true} animationType={'none'} visible={verifyModal}>
          <View style={Stylsheet.modalBackground}>
            <View style={Stylsheet.activityIndicatorWrapper}>
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
                          },
                        ]}
                        onLayout={getCellOnLayoutHandler(index)}>
                        {symbol || (isFocused ? <Cursor /> : null)}
                      </Text>
                    )}
                  />
                </View>

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

        {/* Modalllllllllllllllllllllll */}

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
                    Login();
                  }}
                />

                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('Dijit', {
                      mail: email,
                      pass: password,
                      token: resp,
                    }),
                      setMembermodal(false);
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
                  height: 180,
                  borderRadius: 10,
                  justifyContent: 'space-between',
                }}>
                <View style={{margin: 15}}>
                  <Text
                    style={{
                      color: '#fff',
                      fontSize: 16,
                      fontFamily: 'Inter-SemiBold',
                    }}>
                    Error
                  </Text>
                  <Text
                    style={{
                      color: '#fff',
                      fontSize: 14,
                      fontFamily: 'Inter-Regular',
                    }}>
                    {errorSet}
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
          </View>
        </Modal>
      </View>
    </Wrapper>
  );
};

export default Login;
