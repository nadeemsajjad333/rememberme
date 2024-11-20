import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import React, {useState} from 'react';
import Stylsheet from '../../constant/Stylsheet';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {ImagesCom} from '../../constant/images';
import Button from '../../constant/button';
import {Colors} from '../../constant/colors';
import {AllPostApi} from '../../component/APIscreen';
import AndroidToast from '../../component/AndroidToast';
import Loading from '../../component/Loading';
import crashlytics from '@react-native-firebase/crashlytics';

const ForgotPswrd = ({navigation}) => {
  const [Membermodal, setMembermodal] = useState(false);
  const [focusInput, setFocusInput] = useState('ok');

  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [Indicator, setIndicator] = useState(false);

  const sendMail = async () => {
    setIndicator(true);
    AllPostApi({url: 'forgot', email: email})
      .then(res => {
        console.log('response of send E-mail', res);
        if (res.status == 'success') {
          AndroidToast(res.message);
          setIndicator(false);
          navigation.navigate('PinVerify', {email});
        }
      })
      .catch(err => {
        AndroidToast('Invalid email');

        console.log('error of send E-mail', err);
        crashlytics().recordError(err);
        setIndicator(false);
      });
  };
  const Wrapper = Platform.OS === 'ios' ? KeyboardAvoidingView : View;

  return (
    <Wrapper behavior="padding" style={{flex: 1}}>
      <View style={Stylsheet.container}>
        {Indicator && <Loading />}
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
            {'Forgot Password'}
          </Text>
        </View>
        <ScrollView>
          <View style={{paddingBottom: 20}}>
            <Image
              style={Stylsheet.subscrimg}
              source={ImagesCom.forgot}
              resizeMode="contain"
            />

            <Text
              style={[
                Stylsheet.mediumTxt,
                {textAlign: 'center', marginTop: 50},
              ]}>
              Choose the method we use to reset your{'\n'}password
            </Text>
            <View
              style={{
                alignItems: 'center',
                marginTop: 40,
              }}>
              <View
                style={[
                  Stylsheet.textinptBox,
                  // {borderColor: EmailErr ? 'red' : '#CFCFCF'},
                ]}>
                <Image
                  style={Stylsheet.inputicon}
                  source={ImagesCom.mail}
                  resizeMode="contain"
                />

                <TextInput
                  style={Stylsheet.TextInputS}
                  placeholder="e-mail"
                  placeholderTextColor={Colors.gray}
                  value={email}
                  onChangeText={Text => {
                    setEmail(Text);
                  }}
                />
              </View>
            </View>

            <View
              style={{
                marginTop: 70,
                marginBottom: Platform.OS === 'ios' ? 50 : 0,
              }}>
              <Button title={'Continue'} onPress={() => sendMail()} />
            </View>
          </View>
        </ScrollView>
      </View>
    </Wrapper>
  );
};

export default ForgotPswrd;
