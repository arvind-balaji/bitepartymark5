import React, {useState} from 'react';
import {createContext} from 'react';
import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
export const AuthContext = createContext();


export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    return(
        <AuthContext.Provider
            value={{
                user,
                setUser,
                login: async(email, password) => {
                    try {
                        await auth().signInWithEmailAndPassword(email, password);

                    } catch(e) {
                        console.log(e);
                    }
                },
                register: async(email, password, first, last, handle) => {
                    try {
                        await auth().createUserWithEmailAndPassword(email, password)
                            .then(() => {
                                var uidval = firebase.auth().currentUser.uid;
                                firestore()
                                    .collection('Users')
                                    .doc(uidval)
                                    .set({
                                        firstName: first,
                                        lastName: last,
                                        handle: handle,
                                        friends: [],
                                        pastParties: [],
                                        flavorProfileCreated: false,
                                    })
                            })
                            .catch(function (e) {
                                console.log(e)
                            })
                    } catch(e) {
                        console.log(e);
                    }
                },

                logout: async() => {
                    try{
                        await auth().signOut();
                    } catch(e) {
                        console.log(e);
                    }
                },
            }}>
            {children}
        </AuthContext.Provider>
    );
};

