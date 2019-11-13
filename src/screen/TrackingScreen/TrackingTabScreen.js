import React, { Component } from 'react';
import { StatusBar, StyleSheet, ScrollView, Image, TouchableHighlight } from "react-native";
import { Actions } from 'react-native-router-flux';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Container, Header, Title, Left, Right, Button, Body, Content, Text, Footer, FooterTab, Tab, Tabs, TabHeading, View, Fab, Icon } from "native-base";
import Icon1 from 'react-native-vector-icons/FontAwesome5';
import Icon2 from 'react-native-vector-icons/MaterialIcons';
import Icon3 from 'react-native-vector-icons/MaterialCommunityIcons';
import Tab1 from './TrackingProgress';
import Tab2 from './TrackingComplete';
import Img from '../../assets/delivery.png';
import Img2 from '../../assets/shipped.png';
import HeaderCom from "../../components/header/headerCom";
import FooterCom from "../../components/footer/footerCom";

export default class TrackingTabScreen extends Component {
  constructor(props) {
    super(props)
    console.disableYellowBox = true
  }
  render() {
    return (
      <View style={styles.screen}>

        <View style={{ justifyContent: 'flex-start' }}>
          <HeaderCom title={"TRACKING"} />
        </View>

        <View style={{ flex: 1, justifyContent: 'space-between', backgroundColor: "#fcfcfc", borderTopWidth: hp('0.25%'), borderTopColor: '#d8d8d8' }}>

          <Tabs>
            <Tab heading={<TabHeading><Icon3 name="truck-fast" size={hp('4%')} color='#a4abb2' /><Text style={{ fontSize: hp('2.2%') }}>อยู่ระหว่างจัดส่ง</Text></TabHeading>}>
              <Tab1 />
            </Tab>
            <Tab heading={<TabHeading><Icon3 name="truck" size={hp('4%')} color='#a4abb2' /><Text style={{ fontSize: hp('2.2%') }}>จัดส่งแล้ว</Text></TabHeading>}>
              <Tab2 />
            </Tab>
          </Tabs>

          {/* <Tabs>
            <Tab heading={<TabHeading><Icon name="camera" /><Text>1</Text></TabHeading>}>
              <Tab1 />
            </Tab>
            <Tab heading={<TabHeading><Icon name="camera" /><Text>2</Text></TabHeading>}>
              <Tab2 />
            </Tab>
            <Tab heading={<TabHeading><Icon name="camera" /><Text>3</Text></TabHeading>}>
              <Tab1 />
            </Tab>
            <Tab heading={<TabHeading><Icon name="camera" /><Text>4</Text></TabHeading>}>
              <Tab2 />
            </Tab>
          </Tabs> */}

        </View>

        <View style={{ justifyContent: 'flex-end' }}>
          <FooterCom btnSelected={4} iconSelected={4} textSelected={4} />
        </View>

      </View>


    );
  }
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#000',
  },
});