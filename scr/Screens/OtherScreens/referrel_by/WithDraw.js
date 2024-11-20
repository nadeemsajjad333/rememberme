import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
} from 'react-native';
import React, {useState} from 'react';
import Stylsheet from '../../../constant/Stylsheet';
import {useSelector} from 'react-redux';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {ImagesCom} from '../../../constant/images';
import {Colors} from '../../../constant/colors';
import {FontsFmily} from '../../../constant/fonts';
import Button from '../../../constant/button';
import {AllPostApi} from '../../../component/APIscreen';
import Indicator from '../../../component/Indicator';
import crashlytics from '@react-native-firebase/crashlytics';
import AndroidToast from '../../../component/AndroidToast';

export default function WithDraw({navigation, route}) {
  const {currentAmount} = route.params;
  const user = useSelector(state => state.user.user);
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const [indicator, setIndicator] = useState(false);

  const handleWithdrawal = () => {
    const amount = parseFloat(withdrawalAmount);

    if (isNaN(amount) || amount < 5) {
      // Alert.alert('Error', 'Minimum withdrawal amount is $5');
      AndroidToast('Minimum withdrawal amount is $5');
    } else if (currentAmount < 5) {
      AndroidToast('Insufficient balance. You need at least $5 to withdraw.');
    } else {
      Amount_withdrawl();
    }
  };

  const Amount_withdrawl = async () => {
    setIndicator(true);
    AllPostApi({
      url: 'payout-request',
      Auth: user.userdata.api_token,
      amount: withdrawalAmount,
    })
      .then(res => {
        setIndicator(false);
        navigation.navigate('JoinedPeople');
      })
      .catch(err => {
        console.log('api errror', err);
        crashlytics().recordError(err);
        setIndicator(false);
      });
  };

  return (
    <View style={Stylsheet.container}>
      {indicator && <Indicator />}
      <View
        style={{
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
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <TouchableOpacity
          style={{left: 10}}
          onPress={() => navigation.goBack()}>
          <AntDesign name="arrowleft" size={22} style={{color: '#000'}} />
        </TouchableOpacity>
        <Text style={[Stylsheet.semibldTxt, {left: 5}]}>Cash Withdraw</Text>
        <TouchableOpacity
          style={{right: 10}}
          onPress={() => navigation.navigate('History', {currentAmount})}>
          <Image
            style={{width: 25, height: 25}}
            source={ImagesCom.walet}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      <View
        style={[Stylsheet.textinptBox, {alignSelf: 'center', marginTop: 100}]}>
        <Image
          style={Stylsheet.inputicon}
          source={ImagesCom.account}
          resizeMode="contain"
        />
        <Text style={[Stylsheet.current, {width: 180, paddingLeft: 10}]}>
          Current Balance
        </Text>
        <Text style={Stylsheet.balance}>{'$' + currentAmount}</Text>
      </View>

      <View style={{alignSelf: 'center', alignItems: 'center', marginTop: 40}}>
        <Text style={[Stylsheet.current, {fontSize: 12}]}>
          Enter the amount you want to Withdraw
        </Text>
        <View
          style={{
            width: 100,
            height: 70,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <TextInput
            style={[
              Stylsheet.balance,
              {fontSize: 16, width: 70, fontFamily: FontsFmily.Medium, top: 3},
            ]}
            placeholder="987.55"
            placeholderTextColor={'#B4B4B4'}
            onChangeText={text => setWithdrawalAmount(text)}
            value={withdrawalAmount}
            keyboardType="numeric"
          />
          <Text style={[Stylsheet.balance, {fontSize: 22}]}>$</Text>
        </View>

        <View style={Stylsheet.line}></View>
        <View
          style={{flexDirection: 'row', alignItems: 'center', marginTop: 10}}>
          <Image
            style={[Stylsheet.inputicon, {tintColor: '#b4b4b4'}]}
            source={ImagesCom.information}
            resizeMode="contain"
          />
          <Text style={[Stylsheet.current, {fontSize: 12, left: 5}]}>
            minimum withdrawl amount{' '}
            <Text style={[Stylsheet.balance, {fontSize: 12}]}>$5</Text>
          </Text>
        </View>
      </View>

      <Text
        style={[
          Stylsheet.current,
          {fontSize: 12, left: 5, textAlign: 'center', marginTop: 80},
        ]}>
        This amount will go to your card{' '}
        <Text style={[Stylsheet.balance, {fontSize: 12}]}>
          ${withdrawalAmount}
        </Text>
      </Text>
      <View style={{marginTop: 120}}>
        <Button
          title={'Withdraw'}
          onPress={() => {
            handleWithdrawal();
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({});
