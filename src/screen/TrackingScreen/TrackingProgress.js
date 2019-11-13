import React from "react";
import { StatusBar,StyleSheet,ScrollView,Image,TouchableHighlight} from "react-native";
import { Actions } from 'react-native-router-flux';
import { Container, Header, Title, Left, Right, Button, Body, Content,Text,Footer, FooterTab,Tab, Tabs, TabHeading, View,Fab,Icon } from "native-base";
import Icon1 from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/MaterialIcons';
import SendProgress from '../../components/tracking/sendProgress';

export default class TrackingProgress extends React.Component {
  constructor(props) {
    super(props)
      this.state = {
        active: 'true'
      };
    }
  render() {
    return (
      <View style={styles.screen}>

          <SendProgress />
          
      </View>
    );
  }
}

const styles = StyleSheet.create({
  screen: {
    flex:1,
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
  },
});