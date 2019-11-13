import React from "react";
import axios from "axios";
import { Actions } from 'react-native-router-flux';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import {
  StatusBar, StyleSheet, ScrollView, Image, TouchableHighlight, ActivityIndicator, RefreshControl,
  TouchableOpacity,
  Dimensions,
  Modal, Text, View, FlatList, BackHandler, PixelRatio
} from "react-native";
import { } from "native-base";
import HeaderCom from "../../components/header/headerCom";
import FooterCom from "../../components/footer/footerCom";
import HomeList from '../../components/home/homeList';
import HomeProfile from '../../components/home/homePofile';

export default class HomeScreen extends React.Component {

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
          <HeaderCom title={"HOME"} />
        </View>

        <View style={{ flex: 1, justifyContent: 'space-between' }}>
          <HomeProfile />
          <HomeList />
        </View>

        <View style={{ justifyContent: 'flex-end' }}>
          <FooterCom btnSelected={1} iconSelected={1} textSelected={1} />
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
});