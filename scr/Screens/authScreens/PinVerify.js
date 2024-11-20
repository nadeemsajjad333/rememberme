import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import Stylsheet from '../../constant/Stylsheet';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {ImagesCom} from '../../constant/images';
import Button from '../../constant/button';
import {Colors} from '../../constant/colors';
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
import {AllPostApi} from '../../component/APIscreen';
import AndroidToast from '../../component/AndroidToast';
import Loading from '../../component/Loading';
import crashlytics from '@react-native-firebase/crashlytics';

const CELL_COUNT = 4;

const PinVerify = ({navigation, route}) => {
  const {email} = route.params;

  const maskedEmail = email
    ? `${'*'.repeat(email.indexOf('@') - 4)}${email.slice(
        email.indexOf('@') - 4,
      )}`
    : '';
  const [Indicator, setIndicator] = useState(false);

  const [counter, setcounter] = useState(59);

  useEffect(() => {
    const timer =
      counter > 0 && setInterval(() => setcounter(counter - 1), 1000);
    return () => clearInterval(timer);
  }, [counter]);

  const [refresh, setRefresh] = useState(false);
  const [value, setValue] = useState('');
  const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  const SetPinCode = async () => {
    setIndicator(true);
    AllPostApi({url: 'confirm-code', email, pin: value})
      .then(res => {
        console.log('response of send E-mail', res);
        setIndicator(false);
        if (res.status == 'success') {
          AndroidToast(res.message);
          navigation.navigate('NewPassword', {email, value});
        } else {
          AndroidToast('Invalid OTP');
        }
      })
      .catch(err => {
        console.log('error of send E-mail', err);
        crashlytics().recordError(err);
        setIndicator(false);
      });
  };
  const sendMail = async () => {
    setcounter(59);
    setIndicator(true);
    AllPostApi({url: 'forgot', email})
      .then(res => {
        console.log('response of send E-mail', res);
        if (res.status == 'success') {
          AndroidToast(res.message);
          setIndicator(false);
          navigation.navigate('PinVerify', {email});
        }
      })
      .catch(err => {
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
              style={[Stylsheet.subscrimg, {width: wp(90)}]}
              source={ImagesCom.pin}
              resizeMode="cover"
            />
            <Text
              style={[
                Stylsheet.mediumTxt,
                {textAlign: 'center', marginTop: 50},
              ]}>
              OTP will be sent to {'\n'}
              {maskedEmail}
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
                      {borderColor: value ? '#D92835' : '#E7E7E7'},
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
                <AntDesign name="right" size={14} style={{color: '#D92835'}} />
              </TouchableOpacity>
            ) : (
              <View style={[Stylsheet.counter, {flexDirection: 'row'}]}>
                <Text style={Stylsheet.counter_txt}>Resend OTP in{'  '}</Text>
                <Text style={[Stylsheet.counter_txt, {color: '#D92835'}]}>
                  {counter + 's'}
                </Text>
              </View>
            )}

            <View
              style={{
                marginTop: 70,
                marginBottom: Platform.OS === 'ios' ? 50 : 0,
              }}>
              <Button title={'Continue'} onPress={() => SetPinCode()} />
            </View>
          </View>
        </ScrollView>
      </View>
    </Wrapper>
  );
};

export default PinVerify;
