import React from "react";
import axios from "axios";
import { Actions } from 'react-native-router-flux';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { StatusBar, StyleSheet, ScrollView, Image, TouchableHighlight, ActivityIndicator } from "react-native";
import { Container, Header, Title, Left, Right, Button, Body, Content, Text, Footer, FooterTab, Tab, Tabs, TabHeading, View } from "native-base";
import Icon1 from 'react-native-vector-icons/AntDesign';
import Icon2 from 'react-native-vector-icons/MaterialIcons';
import Icon3 from 'react-native-vector-icons/MaterialCommunityIcons';
import Tab1 from './MyProfileQrcode';
import Tab2 from './MyProfileBarcode';
import ImgUser from '../../assets/user.png';
import ImgQrcode from '../../assets/blackberry-qr-code-variant.png';
import ImgBarcode from '../../assets/barcode.png';
import HeaderCom from "../../components/header/headerCom";
import FooterCom from "../../components/footer/footerCom";
import Profile from "../../components/myprofile/profile";

export default class MyProfileScreen extends React.Component {

  constructor(props) {
    super(props);
    console.disableYellowBox = true
  }

  render() {
    return (
      <View style={styles.screen}>

        <View style={{ justifyContent: 'flex-start' }}>
          <HeaderCom title={"MY PROFILE"} />
        </View>

        <View style={{ flex: 1, justifyContent: 'space-between' }}>

          <View style={styles.screen2}>
            <Profile />
          </View>


          <Tabs>
            <Tab heading={<TabHeading><Icon1 name="qrcode" size={hp('4%')} color='#a4abb2' /><Text style={{ fontSize: hp('2.2%') }}>Qrcode</Text></TabHeading>}>
              <Tab1 />
            </Tab>
            <Tab heading={<TabHeading><Icon1 name="barcode" size={hp('4%')} color='#a4abb2' /><Text style={{ fontSize: hp('2.2%') }}>Barcode</Text></TabHeading>}>
              <Tab2 />
            </Tab>
          </Tabs>

          {/* <Tabs>
            <Tab heading={
              <TabHeading>
                <Image style={{ resizeMode: "contain", width: wp('8%'), height: hp('8%'), marginTop: 0, tintColor: '#a4abb2' }} source={ImgQrcode} />
                <Text>Qrcode</Text>
              </TabHeading>}>
              <Tab1 />
            </Tab>
            <Tab heading={
              <TabHeading>
                <Image style={{ resizeMode: "contain", width: wp('8%'), height: hp('8%'), marginTop: 0, tintColor: '#a4abb2' }} source={ImgBarcode} />
                <Text>Barcode</Text>
              </TabHeading>}>
              <Tab2 />
            </Tab>
          </Tabs> */}

        </View>

        <View style={{ justifyContent: 'flex-end' }}>
          <FooterCom btnSelected={3} iconSelected={3} textSelected={3} />
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
  screen2: {
    backgroundColor: "#fcfcfc",
    borderTopWidth: hp('0.25%'),
    borderTopColor: '#d8d8d8'
  },
});