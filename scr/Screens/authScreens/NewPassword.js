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
import Button from '../../constant/button';
import {Colors} from '../../constant/colors';
import {FontsFmily} from '../../constant/fonts';
import {AllPostApi} from '../../component/APIscreen';
import AndroidToast from '../../component/AndroidToast';
import crashlytics from '@react-native-firebase/crashlytics';
import Entypo from 'react-native-vector-icons/Entypo';
import Loading from '../../component/Loading';

const NewPassword = ({navigation, route}) => {
  const {email} = route.params;
  const {value} = route.params;

  const [Membermodal, setMembermodal] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordErr, setPasswordErr] = useState('');
  const [confirmpassword, setconfirmPassword] = useState('');
  const [confirmpasswordErr, setconfirmPasswordErr] = useState('');
  const [passwordStrength, setPasswordStrength] = useState('');
  const [MatchPassword, setMatchPassword] = useState('');
  const specialCharRegex = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/;
  const [eye1, setEye1] = useState(false);
  const [eye2, setEye2] = useState(false);
  const [isloading, setIsLoading] = useState(false);

  setTimeout(() => {
    if (Membermodal) {
      setMembermodal(false);
      navigation.navigate('Login');
    }
  }, 5000);

  const Validation = () => {
    if (!password && !confirmpassword) {
      setPasswordErr('Enter your password');
      setconfirmPasswordErr('Enter your confirm password');
      return false;
    } else if (!password) {
      setPasswordErr('please enter your password');
      return false;
    } else if (password != confirmpassword) {
      setMatchPassword('The password confirmation does not match.');
      return false;
    } else if (!confirmpassword) {
      setconfirmPasswordErr('please enter your confirm password');
      return false;
    } else if (!specialCharRegex.test(password)) {
      setPasswordStrength(
        'Password should contain minimum 4 characters, with one UPPERCASE, lowercase, number and special character: @$! % * ? &',
      );
      return false;
    }
    return true;
  };

  const fogot = async () => {
    if (Validation()) {
      setIsLoading(true);

      AllPostApi({
        url: 'reset',
        email: email,
        pin: value,
        password: password,
        password_confirmation: confirmpassword,
      })
        .then(res => {
          console.log('Resetpassword Response', res);
          setIsLoading(false);

          if (res.status == 'success') {
            AndroidToast(res.status);
            setMembermodal(true);
          }
        })
        .catch(err => {
          setIsLoading(false);

          console.log('err in forgot password', err);
          crashlytics().recordError(err);
        });
    }
  };
  const Wrapper = Platform.OS === 'ios' ? KeyboardAvoidingView : View;

  return (
    <Wrapper behavior="padding" style={{flex: 1}}>
      <View style={Stylsheet.container}>
        {isloading && <Loading />}

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
            {'New Credentials'}
          </Text>
        </View>
        <ScrollView>
          <View style={{paddingBottom: 20}}>
            <Image
              style={[Stylsheet.subscrimg, {width: 310, height: 220}]}
              source={ImagesCom.changepass}
              resizeMode="contain"
            />

            <Text
              style={[
                Stylsheet.mediumTxt,
                {marginTop: 30, textAlign: 'center'},
              ]}>
              Create a new password
            </Text>

            <View
              style={{
                height: 170,
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: 30,
              }}>
              <View style={{alignSelf: 'center'}}>
                <Text style={Stylsheet.outtxtinpt}>New Password</Text>
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

              <View style={{alignSelf: 'center'}}>
                <Text style={Stylsheet.outtxtinpt}>Create New Password</Text>
                <View
                  style={[
                    Stylsheet.textinptBox,
                    {borderColor: confirmpasswordErr ? 'red' : '#CFCFCF'},
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
                    secureTextEntry={!eye2}
                    value={confirmpassword}
                    onChangeText={Text => {
                      setconfirmPasswordErr('');
                      setconfirmPassword(Text);
                    }}
                  />
                  <TouchableOpacity style={{}} onPress={() => setEye2(!eye2)}>
                    <Entypo
                      name={eye2 ? 'eye' : 'eye-with-line'}
                      size={20}
                      color={'black'}
                    />
                  </TouchableOpacity>
                </View>
              </View>
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
            <View style={[Stylsheet.error_view, {}]}>
              {MatchPassword ? (
                <Text
                  style={{
                    color: 'red',
                    fontFamily: 'Poppins-Regular',
                    fontSize: 10,
                  }}>
                  {MatchPassword}
                </Text>
              ) : null}
            </View>

            <View
              style={{
                marginTop: 70,
                marginBottom: Platform.OS === 'ios' ? 50 : 0,
              }}>
              <Button title={'Continue'} onPress={() => fogot()} />
            </View>
          </View>
        </ScrollView>

        {/* Modalllllllllllllllllllllll */}

        <Modal transparent={true} animationType={'none'} visible={Membermodal}>
          <View style={Stylsheet.modalBackground}>
            <View
              style={[
                Stylsheet.activityIndicatorWrapper,
                {justifyContent: 'center', height: 350},
              ]}>
              <Image
                style={Stylsheet.succsimg}
                source={ImagesCom.succuss}
                resizeMode="contain"
              />
              <Text
                style={[
                  Stylsheet.b0ldTxt,
                  {
                    textAlign: 'center',
                    fontSize: 18,
                    marginTop: 20,
                    color: '#005E53',
                  },
                ]}>
                Successful!
              </Text>
              <Text
                style={[
                  Stylsheet.regulrtxt,
                  {textAlign: 'center', fontFamily: FontsFmily.Medium},
                ]}>
                New password update successful.
              </Text>
            </View>
          </View>
        </Modal>
      </View>
    </Wrapper>
  );
};

export default NewPassword;
