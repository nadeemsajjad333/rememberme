import {
  ImageBackground,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import Stylsheet from '../../../constant/Stylsheet';
import {ImagesCom} from '../../../constant/images';
import AntDesign from 'react-native-vector-icons/AntDesign';
import moment from 'moment';
import Indicator from '../../../component/Indicator';
import {useSelector} from 'react-redux';
import {AllGetAPI} from '../../../component/APIscreen';
import crashlytics from '@react-native-firebase/crashlytics';

export default function History({navigation, route}) {
  const {currentAmount} = route.params;
  const user = useSelector(state => state.user.user);
  const [History, setHistory] = useState([]);
  const [indicator, setIndicator] = useState(false);

  const totalAmount = History?.reduce((sum, transaction) => {
    return sum + parseInt(transaction.amount, 10);
  }, 0);

  useEffect(() => {
    GetHistory();
  }, []);

  const GetHistory = async () => {
    setIndicator(true);
    AllGetAPI({url: 'payout-history', Auth: user?.userdata?.api_token})
      .then(res => {
        setHistory(res.history);
        setIndicator(false);
      })
      .catch(err => {
        console.log('err in joined-by-refer', err);
        crashlytics().recordError(err);
        setIndicator(false);
      });
  };

  const renderItem = ({item, index}) => {
    return (
      <View style={Stylsheet.flexHead}>
        <View style={Stylsheet.historyCart}>
          <View style={Stylsheet.dot}></View>
          <Image
            style={{width: 30, height: 30}}
            source={ImagesCom.admin2}
            resizeMode="contain"
          />
          <Text style={[Stylsheet.balance, {fontSize: 14, paddingLeft: 15}]}>
            {item?.amount}
          </Text>
          <View></View>
        </View>
        <Text style={[Stylsheet.current, {fontSize: 12}]}>
          {item.issue_date}
        </Text>
      </View>
    );
  };

  return (
    <>
      {indicator && <Indicator />}
      <ImageBackground
        style={{flex: 1}}
        source={ImagesCom.Historybg}
        resizeMode="cover">
        <TouchableOpacity
          style={{margin: 15}}
          onPress={() => navigation.goBack()}>
          <AntDesign name="arrowleft" size={22} style={{color: '#fff'}} />
        </TouchableOpacity>

        <View
          style={{
            alignSelf: 'center',
            alignItems: 'center',
            height: 180,
            justifyContent: 'space-around',
          }}>
          <Text style={[Stylsheet.balance, {color: '#fff'}]}>
            {'$' + currentAmount}
          </Text>
          <Text style={[Stylsheet.current, {bottom: 10}]}>Current Balance</Text>

          <View style={Stylsheet.withdralview}>
            <Text style={[Stylsheet.balance, {color: '#fff'}]}>
              {'$' + totalAmount}
            </Text>
            <Text style={[Stylsheet.current, {color: '#fff'}]}>Withdrawal</Text>
          </View>
        </View>

        <View style={Stylsheet.curView}>
          <Text
            style={[Stylsheet.balance, {textAlign: 'center', marginTop: 10}]}>
            History
          </Text>

          <View style={{marginTop: 15}}>
            <FlatList data={History} renderItem={renderItem} />
          </View>
        </View>
      </ImageBackground>
    </>
  );
}

const styles = StyleSheet.create({});
