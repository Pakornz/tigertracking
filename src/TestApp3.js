/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  AsyncStorage
} from 'react-native';

import IconBadge from 'react-native-icon-badge';
import Icon2 from 'react-native-vector-icons/MaterialIcons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Actions } from 'react-native-router-flux';

export default class TestApp3 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      BadgeCount: null
    }

    AsyncStorage.getItem('badge', (err, result) => {
      this.setState({ BadgeCount: result })
      console.log('####pagesplash-BadgeCount####', this.state.BadgeCount);
    });

  }
  

  render() {
    return (
      <View style={styles.container}>
        <View style={{flexDirection: 'row',alignItems: 'center',justifyContent: 'center',}}>
        <TouchableOpacity style={{ paddingHorizontal: wp('2%'), paddingVertical: hp('1.5%') }}
              transparent>
          <IconBadge
            MainElement={
              <View>

              <Icon2 name="notifications" size={wp('10%')} color='#778899' />
            
              </View>
            }
            BadgeElement={
              <Text style={{color:'#FFFFFF'}}>{this.state.BadgeCount}</Text>
            }

            IconBadgeStyle={
              {width:20,
              height:20,
              backgroundColor: "red"}
            }
            Hidden={this.state.BadgeCount==0 || this.state.BadgeCount==null}
            />
            </TouchableOpacity>
        </View>

        <View style={{flexDirection: 'row',alignItems: 'center',justifyContent: 'center',}}>
            <TouchableOpacity style={{ paddingHorizontal: wp('2%'), paddingVertical: hp('1.5%') }}
              onPress={() => Actions.TestApp2()}>
              <Text>Back</Text>
            </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
