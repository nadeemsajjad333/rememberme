import {
  View,
  Text,
  Image,
  ScrollView,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Calendar,
  CalendarList,
  Agenda,
  LocaleConfig,
} from 'react-native-calendars';
import moment from 'moment';
import Stylsheet from '../../constant/Stylsheet';
import { Colors } from '../../constant/colors';
import { FontsFmily } from '../../constant/fonts';
import { ImagesCom } from '../../constant/images';
import { AddEventAPI, AllGetAPI } from '../../component/APIscreen';
import { useSelector } from 'react-redux';
import Loading from '../../component/Loading';
import { useIsFocused, useFocusEffect } from '@react-navigation/native';
import crashlytics from '@react-native-firebase/crashlytics';

const Calender = ({ navigation }) => {
  const user = useSelector(state => state.user.user);
  const [Membermodal, setMembermodal] = useState(false);
  const isFocused = useIsFocused();
  const [markedDates, setMarkedDates] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEventData, setSelectedEventData] = useState([]);
  const [formattedDate, setFormattedDate] = useState('');
  const [previousSelectedDate, setPreviousSelectedDate] = useState(null);
  const [Allevents, setAllevents] = useState([]);

  useEffect(() => {
    if (isFocused) {
      GetEvents();
    }
  }, [isFocused]);

  useFocusEffect(
    useCallback(() => {
      if (Allevents.length > 0) {
        updateMarkedDates();
        console.log('Screen is focused');
      }
    }, [Allevents])
  );

  const GetEvents = async () => {
    setMembermodal(true);

    try {
      const res = await AllGetAPI({ url: 'all-event', Auth: user?.userdata?.api_token });
      if (res.status === 'success') {
        setAllevents(res?.events);
        updateMarkedDates(res?.events);
      }
    } catch (err) {
      console.log('err in article-list', err);
    } finally {
      setMembermodal(false);
    }
  };

  const handleDateSelect = date => {
    const updatedMarkedDates = { ...markedDates };

    if (selectedDate) {
      updatedMarkedDates[selectedDate] = {
        ...updatedMarkedDates[selectedDate],
        selected: false,
      };
    }

    setSelectedDate(date.dateString);

    const eventData = Allevents?.filter(
      event => event?.current_year === date?.dateString,
    );
    setSelectedEventData(eventData);

    updatedMarkedDates[date.dateString] = {
      ...updatedMarkedDates[date.dateString],
      selected: true,
      selectedColor: '#F28F8F',
    };

    setMarkedDates(updatedMarkedDates);
  };

  const updateMarkedDates = (events = Allevents) => {
    const updatedMarkedDates = {};

    events?.forEach(event => {
      updatedMarkedDates[event?.current_year] = {
        dots: [{ key: event.current_year, color: '#D92835' }],
      };
    });

    const currentDate = moment().format('YYYY-MM-DD');
    updatedMarkedDates[currentDate] = {
      selected: true,
      selectedColor: '#C83037',
    };

    console.log('updatedMarkedDates', updatedMarkedDates);

    setMarkedDates(updatedMarkedDates);
  };

  useEffect(() => {
    if (selectedDate) {
      const currentDate = moment();
      const birthdayDate = moment(selectedDate);

      const formattedBirthday = birthdayDate.isSame(currentDate, 'day')
        ? `Today, ${birthdayDate.format('MMMM DD')}`
        : `${birthdayDate.format('dddd, MMMM DD')}`;

      setFormattedDate(formattedBirthday);
    }
  }, [selectedDate]);

  return (
    <View style={Stylsheet.container}>
      {Membermodal && <Loading />}
      <View style={Stylsheet.chatlist}>
        <Text style={Stylsheet.semibldTxt}>{'      '}</Text>

        <Text style={Stylsheet.semibldTxt}>Events</Text>
        <TouchableOpacity onPress={() => navigation.navigate('CreateEvent')}>
          <Image
            style={{ width: 25, height: 25, right: 15 }}
            source={ImagesCom.addevnt}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      <View style={{ marginTop: 10 }}>
        <Calendar
          markedDates={markedDates}
          markingType={'multi-dot'}
          onDayPress={handleDateSelect}
          onMonthChange={updateMarkedDates}
          theme={{
            backgroundColor: '#ffffff',
            calendarBackground: '#ffffff',
            textSectionTitleColor: '#74A0FF',
            selectedDayBackgroundColor: '#C83037',
            selectedDayTextColor: '#ffffff',
            todayTextColor: '#C83037',
            dayTextColor: '#000',
            textDisabledColor: 'gray',
            arrowColor: 'black',
            textDayFontFamily: FontsFmily.Medium,
            textDayFontSize: 14,
            textMonthFontSize: 12,
            textMonthFontFamily: FontsFmily.Semibold,
            textDayHeaderFontSize: 14,
            textDayHeaderFontFamily: FontsFmily.Medium,
          }}
        />
      </View>
      <ScrollView>
        <View style={Stylsheet.eventDetails}>
          {selectedEventData.length > 0 ? (
            selectedEventData.map(event => (
              <View
                key={event.id}
                style={[
                  Stylsheet.eventContainer,
                  { backgroundColor: '#FCCCCE', borderRadius: 10 },
                ]}
              >
                <View style={Stylsheet.flexdirec}>
                  <Image
                    style={{ width: 70, height: 70, borderRadius: 10 }}
                    source={{ uri: event?.image }}
                    resizeMode="contain"
                  />
                  <Text style={Stylsheet.eventTitle}>{event?.title}</Text>
                </View>
                <View>
                  <Text
                    style={[
                      Stylsheet.eventDescription,
                      { width: 130, textAlign: 'center', lineHeight: 18 },
                    ]}
                  >
                    {formattedDate}
                    {'\n'}
                    <Text
                      style={{
                        color: '#000000',
                        fontSize: 12,
                        fontFamily: FontsFmily.Semibold,
                      }}
                    >
                      {event?.age}
                    </Text>
                  </Text>
                </View>
              </View>
            ))
          ) : (
            <Text style={[Stylsheet.b0ldTxt, { textAlign: 'center' }]}>
              No Events
            </Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default Calender;
