import {
  View,
  Text,
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
import Pdf from 'react-native-pdf';
import Stylsheet from '../../constant/Stylsheet';
import AntDesign from 'react-native-vector-icons/AntDesign';

const ViewPDF = ({route, navigation}) => {
  const {pdfFile} = route.params;

  const [dataFile, setDatafile] = useState(pdfFile[0].mediafile);

  return (
    <View style={{flex: 1}}>
      <View style={{
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
        style={{left:10}}
        onPress={() => navigation.goBack()}>
          <AntDesign name="arrowleft" size={22} style={{color: '#000'}} />
        </TouchableOpacity>
        <Text style={Stylsheet.semibldTxt}>Document’s</Text>
        <Text style={Stylsheet.semibldTxt}>{'    '}</Text>
      </View>

      {dataFile.map(item => {
        return (
          <Pdf
            trustAllCerts={false}
            source={{uri: item.file}}
            scale={1.0}
            minScale={0.5}
            maxScale={3.0}
            renderActivityIndicator={() => (
              <ActivityIndicator colo="#D92835" size="large" />
            )}
            spacing={2}
            enablePaging={true}
            onLoadProgress={percentage => console.log(`Loading :${percentage}`)}
            style={{flex: 1, width: Dimensions.get('window').width}}
         

            onError={error => {
              console.log(error);
            }}
          />
        );
      })}
    </View>
  );
};

export default ViewPDF;
