import React from "react";
import { StyleSheet, Text, BackHandler } from "react-native";
import { View } from "native-base";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import HeaderCom from "../../components/header/headerCom"
import NotifyCom from '../../components/notify/notifyCom';

export default class NotifyScreen extends React.Component {

  componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }

  handleBackPress = () => {
    return true;  // Do nothing when back button is pressed
  }

  render() {
    console.disableYellowBox = true
    return (

      <View style={styles.screen}>

        <View style={{ justifyContent: 'flex-start' }}>
          <HeaderCom buttonBack={1} />
        </View>

        <View style={{ flex: 1, justifyContent: 'space-between', backgroundColor: '#fcfcfc' }}>

          <View style={styles.box}>
            <Text style={styles.title}>ข้อความ</Text>
          </View>

          <NotifyCom />

        </View>

      </View>

    );
  }
}


const styles = StyleSheet.create({
  screen: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
  },

  box: {
    padding: wp('3%'),
    paddingLeft: wp('5%'),
    backgroundColor: '#fcfcfc',
    flexDirection: 'row',
    borderBottomWidth: wp('0.75%'),
    borderBottomColor: '#d8d8d8',
    backgroundColor: '#23527c'
  },
  title: {
    fontSize: hp('2.5%'),
    color: "#fff", //474747
  },
});