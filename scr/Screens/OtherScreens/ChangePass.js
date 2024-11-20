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
import Entypo from 'react-native-vector-icons/Entypo';
import {ImagesCom} from '../../constant/images';
import Button from '../../constant/button';
import {Colors} from '../../constant/colors';
import {ForgotPassword} from '../../component/APIscreen';
import {setUser} from '../../ReduxToolkit/MyUserSlice';
import {useDispatch, useSelector} from 'react-redux';
import AndroidToast from '../../component/AndroidToast';
import crashlytics from '@react-native-firebase/crashlytics';
import Loading from '../../component/Loading';

const ChangePass = ({navigation}) => {
  const user = useSelector(state => state.user.user);
  const dispatch = useDispatch();

  const specialCharRegex = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/;

  const [oldpassword, setOldpassword] = useState('');
  const [oldpasswordErr, setOldpasswordErr] = useState('');

  const [password, setPassword] = useState('');
  const [passwordErr, setPasswordErr] = useState('');

  const [confirmpassword, setConfirmpassword] = useState('');
  const [confirmPassErr, setConfirmPassErr] = useState('');
  const [passwordStrength, setPasswordStrength] = useState('');
  const [eye1, setEye1] = useState(false);
  const [eye2, setEye2] = useState(false);
  const [eye3, setEye3] = useState(false);
  const [isloading, setIsLoading] = useState(false);

  const Validation = () => {
    if (!oldpassword && !password && !confirmpassword) {
      setOldpasswordErr('Enter your old password');
      setPasswordErr('Enter your password');
      setConfirmPassErr('Enter your confirm password');
      // AndroidToast('pahla jdjdaj')
      setIsLoading(false);

      return false;
    } else if (!oldpassword) {
      setOldpasswordErr('please enter old password');
      // AndroidToast('pahla jdjdaj')

      return false;
    } else if (!confirmpassword) {
      setConfirmPassErr('please enter Confirm Password');
      // AndroidToast('pahla jdjdaj')

      return false;
    } else if (password !== confirmpassword) {
      setConfirmPassErr('Passwords do not match');
      AndroidToast('New password and confirm password do not match');
      return false;
    } else if (!specialCharRegex.test(password)) {
      setPasswordStrength(
        'Password should contain minimum 4 characters, with one UPPERCASE, lowercase, number and special character: @$! % * ? &',
      );
      // AndroidToast('Password should contain minimum 4 characters, with one UPPERCASE, lowercase, number and special character: @$! % * ? &')

      return false;
    }

    return true;
  };

  const updateData = async () => {
    if (Validation()) {
      setIsLoading(true);

      const formaldata = new FormData();
      formaldata.append('old_password', oldpassword),
        formaldata.append('password', password),
        formaldata.append('password_confirmation', confirmpassword),
        ForgotPassword(
          {url: 'change-password', Auth: user.userdata.api_token},
          formaldata,
        )
          .then(res => {
            console.log('Update password response', res);
            setIsLoading(false);
            if (res.status === 'success') {
              AndroidToast('Your Password Changed Successfully');
              navigation.navigate('IndexBottom');
            } else if (res.status === 'error' && res.message.old_password) {
              // Display the error message from the API response
              AndroidToast(res.message.old_password[0]);
            }
          })
          .catch(err => {
            setIsLoading(false);

            console.log('err in Update password', err);
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
            onPress={() => navigation.navigate('IndexBottom')}>
            <AntDesign name="arrowleft" size={22} style={{color: '#000'}} />
          </TouchableOpacity>
          <Text style={[Stylsheet.semibldTxt, {textAlign: 'center'}]}>
            {'Change Password'}
          </Text>
        </View>
        <ScrollView>
          <View style={{}}>
            <Image
              style={[Stylsheet.subscrimg, {width: 310, height: 220}]}
              source={ImagesCom.chngeps}
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
                height: 260,
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: 30,
              }}>
              <View style={{alignSelf: 'center'}}>
                <Text style={Stylsheet.outtxtinpt}>Old Password</Text>
                <View
                  style={[
                    Stylsheet.textinptBox,
                    {borderColor: oldpasswordErr ? 'red' : '#CFCFCF'},
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
                    value={oldpassword}
                    onChangeText={Text => {
                      setOldpassword(Text);
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
                    secureTextEntry={!eye2}
                    value={password}
                    onChangeText={Text => {
                      setPassword(Text);
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

              <View style={{alignSelf: 'center'}}>
                <Text style={Stylsheet.outtxtinpt}>Confirm Password</Text>
                <View
                  style={[
                    Stylsheet.textinptBox,
                    {borderColor: confirmPassErr ? 'red' : '#CFCFCF'},
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
                    secureTextEntry={!eye3}
                    value={confirmpassword}
                    onChangeText={Text => {
                      setConfirmpassword(Text);
                    }}
                  />
                  <TouchableOpacity style={{}} onPress={() => setEye3(!eye3)}>
                    <Entypo
                      name={eye3 ? 'eye' : 'eye-with-line'}
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

            <View
              style={{
                marginTop: 70,
                paddingBottom: Platform.OS === 'ios' ? 70 : 20,
              }}>
              <Button
                title={'Update Password'}
                onPress={() => {
                  updateData();
                }}
              />
            </View>
          </View>
        </ScrollView>
      </View>
    </Wrapper>
  );
};

export default ChangePass;
