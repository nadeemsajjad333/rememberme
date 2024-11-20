import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  FlatList,
  ScrollView,
  Image,
  Modal,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Stylsheet from '../../constant/Stylsheet';
import Button from '../../constant/button';
import moment from 'moment';
import {useSelector} from 'react-redux';
import {AddEventAPI} from '../../component/APIscreen';
import Loading from '../../component/Loading';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

const Templates = ({navigation, route}) => {
  const user = useSelector(state => state.user.user);

  const {items} = route.params;
  console.log('route=======', items);

  const [Membermodal, setMembermodal] = useState(false);
  const [heart, setheart] = useState('');

  const [evenId, setEvenId] = useState('');
  const [tempId, setTempId] = useState('');

  const [age, setAge] = useState(0);
  console.log('age+++', age);

  const [daysLeft, setDaysLeft] = useState(0);

  useEffect(() => {
    if (!items || !items[0]?.event?.dob) {
        console.error('DOB is missing or invalid');
        return; // Exit if DOB is invalid or not present
    }

    // Ensure the date string is in full `YYYY-MM-DD` format
    const dobString = items[0].event.dob;
    const formattedDOB = dobString.split('-').map((part, index) => {
        // Ensure each part of the date (year, month, day) is correctly formatted
        if (part.length < 2 && index > 0) {  // Month or day which needs padding
            return `0${part}`;
        }
        return part;
    }).join('-');

    const birthdateObj = new Date(formattedDOB);
    if (isNaN(birthdateObj.getTime())) {
        console.error('Invalid Date after formatting:', formattedDOB);
        return; // Exit if date conversion fails
    }

    const today = new Date();
    const ageDiff = today.getFullYear() - birthdateObj.getFullYear();
    let age = ageDiff;

    if (
        today.getMonth() < birthdateObj.getMonth() ||
        (today.getMonth() === birthdateObj.getMonth() && today.getDate() < birthdateObj.getDate())
    ) {
        age--;
    }

    setAge(age);

    const nextBirthday = new Date(today.getFullYear(), birthdateObj.getMonth(), birthdateObj.getDate());
    if (nextBirthday < today) {
        nextBirthday.setFullYear(nextBirthday.getFullYear() + 1);
    }

    const timeDiff = nextBirthday - today;
    const days = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

    setDaysLeft(days);
}, [items]);



  const TempPush = async () => {
    setMembermodal(true);
    const formdata = new FormData();

    formdata.append('receiver_id', evenId),
      formdata.append('template_id', tempId);
    AddEventAPI(
      {url: 'update-event-template', Auth: user.userdata.api_token},
      formdata,
    )
      .then(res => {
        setMembermodal(false);
        console.log('respomse', res);

        navigation.navigate('IndexBottom');
      })
      .catch(err => {
        console.log('api error', err);
        setMembermodal(false);
      });
  };

  const renderItem = ({item, index}) => {
    console.log('itemssssssssss', item);
    return index == '0' ? (
      <TouchableOpacity
        onPress={() => {
          setheart(item.color),
            setTempId(item.id),
            setEvenId(item.event.receiver_id);
        }}>
        <ImageBackground
          source={{uri: item.bg_image}}
          borderRadius={20}
          resizeMode="cover"
          style={{
            width: 350,
            height: 200,
            margin: 5,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <View style={{alignSelf: 'flex-end', right: 15, top: 10}}>
            <AntDesign
              name={heart == '#a65ff7' ? 'heart' : 'hearto'}
              size={25}
              color={'#EEEEEE'}
            />
          </View>
          <View
            style={{
              width: 300,
              height: 160,
              flexDirection: 'row',
              bottom: 10,
            }}>
            <View style={{width: 150}}>
              <Image
                style={{width:wp(20), height:wp(20),borderRadius:wp(10)}}
                source={{uri: item.event.image}}
                resizeMode="contain"
              />
              <View
                style={{
                  width: 150,
                  height: 100,
                  justifyContent: 'space-evenly',
                }}>
                <View>
                  <Text style={Stylsheet.cardText1}>{item.event.title}</Text>
                  <Text style={Stylsheet.cardText2}>
                    {(item?.event?.dob)}
                  </Text>
                </View>
                <View style={{bottom: 3}}>
                  <Text style={Stylsheet.cardText1}>{age + ' years old'}</Text>
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
                {item.event.description}
              </Text>
            </View>
          </View>
        </ImageBackground>
      </TouchableOpacity>
    ) : index == '1' ? (
      <TouchableOpacity
        onPress={() => {
          setheart(item.color),
            setTempId(item.id),
            setEvenId(item.event.receiver_id);
        }}>
        <ImageBackground
          source={{uri: item.bg_image}}
          borderRadius={20}
          resizeMode="cover"
          style={{
            width: 350,
            height: 200,
            margin: 5,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <View style={{alignSelf: 'flex-end', right: 15, top: 10}}>
            <AntDesign
              name={heart == '#ffce75' ? 'heart' : 'hearto'}
              size={25}
              color={'#EEEEEE'}
            />
          </View>
          <View
            style={{
              width: 300,
              height: 160,
              flexDirection: 'row',
              bottom: 10,
            }}>
            <View style={{width: 150}}>
              <Image
                style={{width:wp(20), height:wp(20),borderRadius:wp(10)}}
                source={{uri: item.event.image}}
                resizeMode="contain"
              />
              <View
                style={{
                  width: 150,
                  height: 100,
                  justifyContent: 'space-evenly',
                }}>
                <View>
                  <Text style={Stylsheet.cardText1}>{item.event.title}</Text>
                  <Text style={Stylsheet.cardText2}>
                    {(item?.event?.dob)}
                  </Text>
                </View>
                <View style={{bottom: 3}}>
                  <Text style={Stylsheet.cardText1}>{age + ' years old'}</Text>
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
                {item.event.description}
              </Text>
            </View>
          </View>
        </ImageBackground>
      </TouchableOpacity>
    ) : index == '2' ? (
      <TouchableOpacity
        onPress={() => {
          setheart(item.color),
            setTempId(item.id),
            setEvenId(item.event.receiver_id);
        }}
        style={{alignSelf: 'center'}}>
        <ImageBackground
          style={{
            width: 350,
            height: 200,
            margin: 5,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          source={{uri: item.bg_image}}
          resizeMode="cover"
          borderRadius={10}>
          <View style={{alignSelf: 'flex-end', right: 15, top: 10}}>
            <AntDesign
              name={heart == '#a16dfe' ? 'heart' : 'hearto'}
              size={25}
              color={'#EEEEEE'}
            />
          </View>
          <View style={{width: 300, height: 170}}>
            <Image
              style={{width:wp(20), height:wp(20),borderRadius:wp(10)}}
              source={{uri: item.event.image}}
              resizeMode="contain"
            />
            <View
              style={[
                Stylsheet.flexdirec,
                {justifyContent: 'space-between', marginTop: 5},
              ]}>
              <View>
                <Text style={Stylsheet.cardText1}>{item.event.title}</Text>
                <Text style={Stylsheet.cardText2}>{(item.event.dob)}</Text>
              </View>
              <View>
                <Text style={Stylsheet.cardText1}>{age + ' years old'}</Text>
                <Text style={[Stylsheet.cardText1, {fontSize: 10}]}>Today</Text>
              </View>
            </View>
            <Text style={[Stylsheet.cardText3, {left: 10, top: 8}]}>
              {item.event.description}
            </Text>
          </View>
        </ImageBackground>
      </TouchableOpacity>
    ) : null;
  };

  return (
    <View style={Stylsheet.container}>
      {Membermodal && <Loading />}
      <View style={Stylsheet.chatlist}>
        <TouchableOpacity onPress={() => navigation.goBack(true)}>
          <Text style={Stylsheet.semibldTxt}>{'      '}</Text>
        </TouchableOpacity>
        <Text style={Stylsheet.semibldTxt}>Select Card Template</Text>
        <TouchableOpacity onPress={() => navigation.navigate('IndexBottom')}>
          <Text style={Stylsheet.skip}>Skip</Text>
        </TouchableOpacity>
      </View>
      <View style={{flex: 1,alignSelf:'center'}}>
        <FlatList data={items} renderItem={renderItem} />
      </View>
      <View style={{marginTop: 8, marginBottom: 5}}>
        <Button
          title={'Send a card'}
          onPress={() => {
            TempPush();
          }}
        />
      </View>
    </View>
  );
};

export default Templates;
