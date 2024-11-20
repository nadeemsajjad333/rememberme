import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import Stylsheet from '../../constant/Stylsheet';
import AntDesign from 'react-native-vector-icons/AntDesign';
import ReadMore from '@fawazahmed/react-native-read-more';
import {FontsFmily} from '../../constant/fonts';

const Term_Cndtn = ({navigation}) => {
  return (
    <View style={Stylsheet.container}>
      <View style={[Stylsheet.flexHead, {marginTop: 20}]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AntDesign name="arrowleft" size={22} style={{color: '#000'}} />
        </TouchableOpacity>
        <Text style={Stylsheet.semibldTxt}>Terms & Conditions</Text>
        <Text style={Stylsheet.semibldTxt}>{'    '}</Text>
      </View>

      <View>
        <ReadMore
          numberOfLines={14}
          style={{
            marginTop: 50,
            marginHorizontal: 10,
            fontFamily: FontsFmily.Regular,
            fontSize: 14,
            letterSpacing: 1,
            lineHeight: 20,
            color:'black'
          }}
          seeMoreStyle={{color: '#D92835'}}
          seeLessStyle={{color: '#D92835'}}>
          În ciuda opiniei publice, Lorem Ipsum nu e un simplu text fără sens.
          El îşi are rădăcinile într-o bucată a literaturii clasice latine din
          anul 45 î.e.n., făcând-o să aibă mai bine de 2000 ani. Profesorul
          universitar de latină de la colegiul Hampden-Sydney din Virginia,
          Richard McClintock, a căutat în bibliografie unul din cele mai rar
          folosite cuvinte latine "consectetur", întâlnit în pasajul Lorem
          Ipsum, şi căutând citate ale cuvântului respectiv în literatura
          clasică, a descoperit la modul cel mai sigur sursa provenienţei
          textului. Lorem Ipsum provine din secţiunile 1.10.32 şi 1.10.33 din
          "de Finibus Bonorum et Malorum" (Extremele Binelui şi ale Răului) de
          Cicerone, scrisă în anul 45 î.e.n. Această carte este un tratat în
          teoria eticii care a fost foarte popular în perioada Renasterii.
          Primul rând din Lorem Ipsum, "Lorem ipsum dolor sit amet...", a fost
          luat dintr-un rând din secţiunea 1.10.32. Pasajul standard de Lorem
          Ipsum folosit încă din secolul al XVI-lea este reprodus mai jos pentru
          cei interesaţi. Secţiunile 1.10.32 şi 1.10.33 din "de Finibus Bonorum
          et Malorum" de Cicerone sunt de asemenea reproduse în forma lor
          originală, impreună cu versiunile lor în engleză din traducerea de
          către H. Rackham din 1914.
        </ReadMore>
      </View>
    </View>
  );
};

export default Term_Cndtn;
