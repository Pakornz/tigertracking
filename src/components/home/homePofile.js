import React from "react";
import axios from "axios";
import { Actions } from 'react-native-router-flux';
import StepIndicator from 'react-native-step-indicator';
import Modal from "react-native-modal";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import {
  StatusBar, StyleSheet, ScrollView, Image, TouchableHighlight, ActivityIndicator, RefreshControl,
  TouchableOpacity,
  Dimensions, View, FlatList, PixelRatio
} from "react-native";
import { Text } from 'native-base';
import Icon1 from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/MaterialIcons';
import Icon3 from 'react-native-vector-icons/MaterialCommunityIcons';
import ImgUser from './../../assets/user.png';
import ImgBox from "./../../assets/box.png";
import ImgBox2 from "./../../assets/box2.png";
import { AsyncStorage } from 'react-native';
import { domain } from '../../config/configApp'
export default class homeList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      phones: "",
      dataProfile: dataProfile,
    }

    // Text.defaultProps.allowFontScaling = false;

  }
  componentDidMount = async () => {
    await AsyncStorage.getItem('phone', (err, result) => {
      this.setState({ phones: result })
      console.log('####pageHomeProfile', this.state.phones);
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
          <ActivityIndicator style={{ color: "#fff" }} />
        </View>
      );
    }
    return (

      <View style={styles.screen}>
        <View style={styles.box}>
          <View style={styles.boxAvatar}>
            <View
              style={[
                styles.avatar,
                styles.avatarContainer,
                { marginLeft: 0 },
              ]}
            >
              {this.state.dataProfile.data.image_url == null ? (
                <Image style={styles.imageUser} source={ImgUser} />
              ) : (
                  <Image style={styles.avatar} source={{ uri: this.state.dataProfile.data.image_url + '?' + Math.random() }} />
                )}
            </View>
          </View>
          <View style={styles.boxContent}>
            <Text style={styles.title}>{this.state.dataProfile.data.user_id}</Text>
            <Text style={styles.description}>{this.state.dataProfile.data.first_name} {this.state.dataProfile.data.last_name}</Text>
          </View>
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
//////////////////////////////////////////////////////
const styles = StyleSheet.create({
  screen: {
    backgroundColor: "#fcfcfc",
    borderTopWidth: hp('0.25%'),
    borderTopColor: '#d8d8d8'
  },
  imageUser: {
    width: width > 320 ? 120 : 80,
    height: height > 570 ? 120 : 80,
    resizeMode: 'contain',
    // marginLeft: 15
  },
  box: {
    paddingHorizontal: '5%',
    paddingTop: '2%',
    paddingBottom: '7%',
    // marginTop:5,
    // marginBottom:10,
    backgroundColor: '#fff',
    flexDirection: 'row',
    borderBottomWidth: wp('0.75%'),
    borderColor: '#F5F5F5',
  },
  boxContent: {
    width: wp('50%'),
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 0,
  },
  title: {
    fontSize: hp('2.5%'),
    color: "#474747",
  },
  description: {
    fontSize: hp('2%'),
    color: "#646464",
  },
  /////////////////////UploadPic/////////////////
  boxAvatar: {
    width: wp('40%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarContainer: {
    borderColor: '#9B9B9B',
    borderWidth: 1 / PixelRatio.get(),
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    borderRadius: width > 320 ? 60 : 40,
    width: width > 320 ? 120 : 80,
    height: height > 570 ? 120 : 80,
  },
});