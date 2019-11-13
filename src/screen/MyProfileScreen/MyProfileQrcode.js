import React from "react";
import axios from "axios";
import QRCode from 'react-native-qrcode';
import { Actions } from 'react-native-router-flux';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { StatusBar, StyleSheet, ScrollView, Image, TouchableHighlight, ActivityIndicator } from "react-native";
import { Container, Header, Title, Left, Right, Button, Body, Content, Text, Footer, FooterTab, Tab, Tabs, TabHeading, View, Fab, Icon } from "native-base";
import Icon1 from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/MaterialIcons';
import { AsyncStorage, Dimensions } from 'react-native';
import { domain } from '../../config/configApp'


export default class MyProfileQrcode extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      phones: '',

      dataProfile: dataProfile,
    }

  }


  componentDidMount = async () => {
    await AsyncStorage.getItem('phone', (err, result) => {
      this.setState({ phones: result })
      console.log('####pageMyprofileQrcode', this.state.phones);
    });
    this.callApiProfile(this.state.phones) //Method for API call
  }

  callApiProfile(phones) {
    axios({
      method: 'get',
      url: `${domain}/myprofile/profile/${phones}`,
      headers: { 'Content-Type': 'application/json' }
    })
      .then(res => {
        const dataProfile = res.data
        this.setState({ loading: false, dataProfile: dataProfile })
      })
      .catch(error => {
        this.setState({ loading: false, error: 'Something just went wrong' })
        alert(error)
        console.log(error)
      });
  }

  render() {
    if (this.state.loading) {
      return (
        <View style={{ width: "100%", height: "100%" }} >
          <ActivityIndicator style={{ color: "#fcfcfc" }} />
        </View>
      );
    }
    return (
      <View style={styles.screen}>

        <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>

          <QRCode
            value={this.state.dataProfile.data.user_id}
            size={wp('40%')}
            bgColor='black'
            fgColor='#fcfcfc' />

          <Text style={{ fontSize: hp('2%') }}>{this.state.phones}</Text>

        </View>

      </View>
    );
  }
}

const dataProfile = {
  "result": "",
  "status": "",
  "message": "",
  "data": {
    "user_id": "",
    "first_name": "",
    "last_name": "",
    "mobile_phone": "",
    "email": "",
    "id_card": "",
    "platform": "",
    "image_url": ""
  }
}

const { height, width } = Dimensions.get('window');
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fcfcfc',
  },
});