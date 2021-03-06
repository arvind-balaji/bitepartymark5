import React, { useContext, useState, useEffect } from 'react';
import { View, Image, StyleSheet, Share } from 'react-native';
import {Text} from 'galio-framework';
import {Button, Provider, Portal, Avatar, Modal} from 'react-native-paper';
import {AuthContext} from '../navigation/AuthProvider.js';
import {Input, ListItem, Overlay} from 'react-native-elements';
import firestore, { firebase } from "@react-native-firebase/firestore";
import LinearGradient from 'react-native-linear-gradient';
import TouchableScale from 'react-native-touchable-scale';
import { TouchableOpacity } from "react-native-gesture-handler";
import AsyncStorage from '@react-native-community/async-storage';
import dynamicLinks from '@react-native-firebase/dynamic-links';

const AddDuosViewController = ({navigation}) => {
    const [duosmember, setDuosMember] = useState([]);
    const [query, setQuery] = useState("");
    const { user } = useContext(AuthContext);
    const [isVisible, setIsVisible] = useState(false);

    const [count, setCount] = useState(0);
    const showPanel = () => setIsVisible(true);
    const hidePanel = () => setIsVisible(false);

    const [userHandle, setUserHandle] = useState("");
    const [imagePath, setImagePath] = useState("");
    const [handleval, setHandleVal] = useState("");

    useEffect(() => {
        const main = async () => {
          const refVal = firestore().collection("Users").doc(user.uid);
          const doc = await refVal.get();
          const {handle} = doc.data();
          const {imageUrl} = doc.data();
          setUserHandle(handle)
          setImagePath(imageUrl);
        };
        main();
    }, []);

    useEffect(() => {
        firestore()
          .collection("Users")
          .doc(user.uid)
          .collection("friends")
          .where("handle", "==", query)
          .get()
          .then((res) => {
            const results = res.docs.map((x) => x.data());
            setDuosMember(results);
          })
          .catch((err) => alert(err));
    }, [query]);
    

    const generateLink = async (groupId) => {
        const link = await dynamicLinks().buildShortLink({
            link: `https://biteparty.app/join?id=${groupId}`,
            // domainUriPrefix is created in your Firebase console
            domainUriPrefix: 'https://biteparty.page.link',
            // optional setup which updates Firebase analytics campaign
            // "banner". This also needs setting up before hand
            // analytics: {
            //   campaign: 'banner',
            // },
            androidInfo: {
                androidPackageName: "com.kastech.biteparty"
            },
            iosInfo: {
                iosBundleId: "com.kastech.biteparty"
            }
        });
        // alert(link)
        console.log(link)

        return link;
    }

    const onShare = async ({url}) => {
        try {
          const result = await Share.share({
            message: `BiteParty | Join the party! ${url}`,
          });
        //   if (result.action === Share.sharedAction) {
        //     if (result.activityType) {
        //       // shared with activity type of result.activityType
        //     } else {
        //       // shared
        //     }
        //   } else if (result.action === Share.dismissedAction) {
        //     // dismissed
        //   }
        } catch (error) {
          alert(error.message);
        }
      };
    
    return(
        <View style={styles.container}>
            <Text h3 style={styles.title}>Who's coming?</Text>
            <Input 
                placeholder="Pick a partner"
                onChangeText={(txt) => setQuery(txt)}
                autoCapitalize="none"
                value={query}
                containerStyle={{width: "90%",marginLeft: "4%"}}
            />
           
            {duosmember.map((item) => (           
                <View style={{marginTop: "-2%"}}>
                    <ListItem
                        Component={TouchableScale}
                        friction={90}
                        tension={100}
                        activeScale={0.95}
                        onPress={showPanel}
                        style={{borderBottomColor: "lightgray", borderBottomWidth: 1, borderTopColor: "lightgray", borderTopWidth: 1}}
                    >
                        <Avatar.Image size={45} source={{uri: item.imageUrlPath}}/>
                        <ListItem.Content style={styles.queryContent}>                    
                            <ListItem.Title style={styles.querytitle}>{"@"+item.handle}</ListItem.Title>
                            <ListItem.Subtitle style={styles.querysubtitle}>{item.firstName+" "+item.lastName}</ListItem.Subtitle>                   
                        </ListItem.Content>
                    </ListItem>
                </View>
            ))}
            {duosmember.map((item1) => ( 
                <Provider>
                    <Portal>
                        <Modal visible={isVisible} onDismiss={hidePanel} contentContainerStyle={styles.modalStyling}>
                            <Text h4 style={styles.modalTitle}>Invite {item1.firstName} to your duo?</Text>
                                <TouchableOpacity
                                    style={styles.button}
                                    activeOpacity={0.9}
                                    onPress={() => {
                                        firestore()
                                            .collection("Users")
                                            .doc(user.uid)
                                            .collection("pastParties")
                                            .doc(item1.handle)
                                            .set({
                                                location: "To be decided",
                                                isDuos: true,
                                                buddy: item1.handle,
                                            })
                                            .then(() => {
                                                return AsyncStorage.setItem('handlequeryval', item1.handle);
                                            })
                                            .then(() => {
                                                firestore()
                                                    .collection("Users")
                                                    .doc(item1.uidvalue)
                                                    .collection("invitations")
                                                    .doc("invitation from "+userHandle)
                                                    .set({
                                                        inviter: userHandle,
                                                        isDuo: true,
                                                        accepted: false,
                                                        imagePath: imagePath,
                                                    })
                                            })
                                            .then(
                                                navigation.navigate("Filters", {paramKey: handleval}),
                                            )
                                    }}
                                    style={{width: "100%", height: "50%", marginTop: "3%"}}
                                >
                                    <LinearGradient
                                        start={{x:0, y:0}}
                                        end={{x:1, y:0}}
                                        colors={['#7f00ff', '#e100ff', '#ffaf7b']}
                                        style={{height: "100%", justifyContent: "center", alignItems: "center", borderRadius: 15, width: "110%", marginLeft: "-5%"}}
                                        Component={TouchableScale}
                                        friction={90}
                                        tension={100}
                                        activeScale={0.95}>
                                        <Text style={{color: "white", fontFamily: "PingFangHK-Medium", fontSize: 17, fontWeight: "400"}}>Yep, let's go.</Text>
                                    </LinearGradient>
                                </TouchableOpacity>
                        </Modal>
                    </Portal>
                </Provider>
            ))}
             <TouchableOpacity
                    style={styles.button}
                    activeOpacity={0.9}
                    onPress={async () => onShare({url: await generateLink('foo')})}
                    style={{height: 50, marginHorizontal: "20%", marginVertical: 15}}
                    >
                    <LinearGradient
                        start={{x:0, y:0}}
                        end={{x:1, y:0}}
                        colors={["#ee0979","#f76f6d",'#ff6a00']}
                        style={{height: "100%", justifyContent: "center", alignItems: "center", borderRadius: 15}}>
                        <Text style={{color: "white", fontFamily: "PingFangHK-Regular", fontSize: 17, }}>Share link 🔗</Text>
                    </LinearGradient>
            </TouchableOpacity>

        </View>
    );
}
1
export default AddDuosViewController;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white"
    },
    queryView: {
        flex: 0.13,
        backgroundColor: "#16335e",
        marginTop: 20
    },
    queryContent: {
        width: "80%"
    },
    containercolumn: {
        flex: 0.25,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        marginTop: "15%",
    },
    button: {
        marginTop: 20,
        height: 37,
        width:"50%",
        backgroundColor: "#F76F6D",
        borderRadius: 15,
     },
    title: {
        padding: "5%",
        fontFamily: "PingFangHK-Medium",
        color: "#f76f6d",
        textAlign: "center",
        marginTop: "10%"
    },
    queryResults: {
        marginTop: 20,
        backgroundColor: "#16335e"
    },
    pfp: {
      alignItems: "center"
    },
    querytitle: {
      fontWeight: "bold",
      color: "black",
      textAlign: "center"
    },
    querysubtitle: {
      color: "black"
    },
    modalStyling: {
        display: "flex",
        backgroundColor: "white",
        position: "absolute",
        padding: "20%",
        bottom: "-7%",
        left: 0,
        right: "-2.5%"
    },
    modalTitle: {
        padding: "5%",
        fontFamily: "PingFangHK-Medium",
        color: "#f76f6d",
        textAlign: "center",
    },
});