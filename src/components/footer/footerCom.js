import React, { Component } from 'react';
import { StyleSheet, Platform } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { withNavigation, StackActions, NavigationActions } from 'react-navigation';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Content, Button, Text, Footer, FooterTab, View } from "native-base";
import Icon1 from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/MaterialIcons';
import Icon3 from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon4 from 'react-native-vector-icons/FontAwesome5';

class footerCom extends Component {

  constructor(props) {
    super(props)
    this.state = {
      btnSelected: this.props.btnSelected,
      iconSelected: this.props.iconSelected,
      textSelected: this.props.textSelected,
    }

    // Text.defaultProps.allowFontScaling = false;
  }
  render() {
    return (
      <View>
        <Footer style={{ borderTopWidth: hp('0.3%'), borderColor: '#d8d8d8' }}>
          <FooterTab style={{ backgroundColor: '#fcfcfc' }}>

            <Button vertical style={(this.state.btnSelected == 1) ? styles.btnSelected : styles.notSelected}
              onPress={() => { this.props.navigation.navigate('DrawerHomeScreen') }}>
              <Icon1 name="home" size={wp('7.5%')} style={(this.state.iconSelected == 1) ? styles.iconSelected : styles.iconnotSelected} />
              <Text style={(this.state.textSelected == 1) ? styles.textSelected : styles.textnotSelected}>Home</Text>
            </Button>

            <Button vertical style={(this.state.btnSelected == 2) ? styles.btnSelected : styles.notSelected}
              onPress={() => { this.props.navigation.navigate('DrawerAddressShowScreen') }}>
              <Icon3 name="map-marker-multiple" size={wp('7%')} style={(this.state.iconSelected == 2) ? styles.iconSelected : styles.iconnotSelected} />
              <Text style={(this.state.textSelected == 2) ? styles.textSelected : styles.textnotSelected}>Address</Text>
            </Button>

            <Button vertical style={(this.state.btnSelected == 3) ? styles.btnSelected : styles.notSelected}
              onPress={() => { this.props.navigation.navigate('DrawerMyProfileScreen') }}>
              <Icon2 name="person-pin" size={wp('7.5%')} style={(this.state.iconSelected == 3) ? styles.iconSelected : styles.iconnotSelected} />
              <Text style={(this.state.textSelected == 3) ? styles.textSelected : styles.textnotSelected}>Profile</Text>
            </Button>

            <Button vertical style={(this.state.btnSelected == 4) ? styles.btnSelected : styles.notSelected}
              onPress={() => { this.props.navigation.navigate('DrawerTrackingTabScreen') }}>
              <Icon2 name="local-shipping" size={wp('7.5%')} style={(this.state.iconSelected == 4) ? styles.iconSelected : styles.iconnotSelected} />
              <Text style={(this.state.textSelected == 4) ? styles.textSelected : styles.textnotSelected}>Tracking</Text>
            </Button>

          </FooterTab>
        </Footer>

      </View>
    )
  }
}

export default withNavigation(footerCom)

const platform = Platform.OS;

const styles = StyleSheet.create({
  btnSelected: {
    backgroundColor: '#fcfcfc', //4682b4
    height: platform === 'ios' ? hp('8%') : hp('9%'),
  },
  notSelected: {
  },
  iconSelected: {
    color: '#23527c'
  },
  iconnotSelected: {
    color: '#a4abb2'
  },
  textSelected: {
    color: '#23527c',
    fontSize: platform === 'ios' ? hp('1.5%') : hp('1.4%'),
    fontWeight: 'bold',
    // fontFamily: 'kanit',
  },
  textnotSelected: {
    color: '#a4abb2',
    fontSize: platform === 'ios' ? hp('1.5%') : hp('1.4%'),
    fontWeight: 'bold',
    // fontFamily: 'kanit',
  },
  imageBox: {
    width: wp('20%'),
    height: hp('10%'),
    resizeMode: 'contain'
  },
});