import React, { Component } from 'react';
import { StyleSheet, ScrollView, Text } from "react-native";
import { Actions } from 'react-native-router-flux';
import { View, Fab } from "native-base";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Icon1 from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/MaterialIcons';
import Icon3 from 'react-native-vector-icons/MaterialCommunityIcons';
import HeaderCom from "../../components/header/headerCom";
import FooterCom from "../../components/footer/footerCom";
import ShippingList from '../../components/address/shippingList';

export default class AddressShowScreen extends Component {


  render() {
    console.disableYellowBox = true
    return (
      <View style={styles.screen}>

        <View style={{ justifyContent: 'flex-start' }}>
          <HeaderCom title={"ADDRESS"} />
        </View>

        <View style={{ flex: 1, justifyContent: 'space-between' }}>
          <View style={styles.box}>
            <Text style={styles.title}>ที่อยู่จัดส่ง</Text>
          </View>
          <ShippingList />
        </View>

        <View style={{ justifyContent: 'flex-end' }}>
          <FooterCom btnSelected={2} iconSelected={2} textSelected={2} />
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