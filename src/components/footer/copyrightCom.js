import React, { Component } from 'react';
import { Text, Image, View, StyleSheet } from 'react-native';

export default class copyrightCom extends Component {
   render() {

    var CurrentYear = new Date().getFullYear();

      return (
        <View style={styles.footer}>
            <Text style={styles.footerText}>©:{CurrentYear} Tiger Distribution & Logistics Company Limited.</Text>
        </View>
      )
   }
}

const styles = StyleSheet.create ({
    footer: {
        justifyContent: 'flex-end',
        // backgroundColor: '#F5F5F5',
      },
    footerText:{
        padding: 15,
        color: '#999999',
        fontSize: 14,
        textAlign: 'center',
        fontFamily: 'kanit',
      }
})