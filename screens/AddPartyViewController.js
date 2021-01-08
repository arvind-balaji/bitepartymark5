import React, { useContext, useState, useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import {Text} from 'galio-framework';
import {Input} from 'react-native-elements';
import {Card} from 'react-native-paper';
import { AuthContext } from "../navigation/AuthProvider.js";
import TouchableScale from 'react-native-touchable-scale';


const AddPartyViewController = ({navigation}) => {
    return(
        <View style={styles.container}>
            <Text h3 style={styles.title}>Pick a mode</Text>
            <Card style={styles.card} 
                onPress={() => navigation.navigate("Duos")} 
                Component={TouchableScale}
                friction={90}
                tension={100}
                activeScale={0.95}>
                <Card.Content>
                    <Text h4 style={{fontFamily: "PingFangHK-Medium", fontWeight: "bold", color: "#f76f6d", textAlign: "center"}}>Duos</Text>
                    <Image source={require('../images/duos.png')} style={{width: 150, height: 150, alignItems: "center"}}/>
                </Card.Content>
            </Card>

            <Card style={styles.card1} onPress={() => {}}>
                <Card.Content>
                    <Text h4 style={{fontFamily: "PingFangHK-Medium", fontWeight: "bold", color: "#f76f6d", textAlign: "center"}}>Parties</Text>
                    <Image source={require('../images/squads.png')} style={{width: 150, height: 150, alignItems: "center"}}/>
                </Card.Content>
            </Card>
        </View>
    );
}

export default AddPartyViewController;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        backgroundColor: "white"
    },
    input: {
        color: "white"
    },
    title: {
        padding: "5%",
        fontFamily: "PingFangHK-Light",
        color: "#f76f6d",
        textAlign: "center",
    },
    button: {
        marginTop: 20,
        height: 37,
        width:"50%",
        backgroundColor: "#F76F6D",
        borderRadius: 15
     },
    card: {
        height: "30%",
        width: "80%",
        borderRadius: 25,
        shadowRadius: 40,
        marginBottom: "5%",
        backgroundColor: "white", 
    }, 
    card1: {
        height: "30%",
        width: "80%",
        borderRadius: 25,
        shadowRadius: 40,
        marginBottom: "5%",
        marginTop: "10%",
        backgroundColor: "white", 
    },  
});