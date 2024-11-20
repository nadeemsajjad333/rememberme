import Toast from 'react-native-simple-toast';
import {Colors} from '../constant/colors';

export default function AndroidToast(msg) {
  Toast.show(msg, Toast.LONG, {
    backgroundColor: 'black',
  });
}
