 
import React from 'react';
import { View, Text, StyleSheet, Platform, KeyboardAvoidingView, LogBox } from 'react-native';
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat';
import * as firebase from 'firebase';
import "firebase/firestore";
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import CustomActions from './CustomActions';
import MapView from 'react-native-maps';


export default class Chat extends React.Component {
    constructor(props){
        super();
        this.state = {
            messages: [],
            uid: 0,
            user: {
                _id: "",
                name: "",
                avatar: "",
            },
            isConnected: false, 
            image: null,
            location: null
        };
    
        //initializing firebase
        if (!firebase.apps.length){
          firebase.initializeApp({
            apiKey: "AIzaSyCbjzfg0sF5c62vHzPxPIP9xv1WXSwZ5KQ",
            authDomain: "test-c27b3.firebaseapp.com",
            projectId: "test-c27b3",
            storageBucket: "test-c27b3.appspot.com",
            messagingSenderId: "267899396761",
            appId: "1:267899396761:web:39e97944d99279e93f8e08",
            measurementId: "G-VVH03T8XRX"
          });
        };
        // reference to the Firestore messages collection
        this.referenceChatMessages = firebase.firestore().collection("messages");
    
         // To remove warning message in the console 
        // LogBox.ignoreLogs([
        //     'Setting a timer',
        //     'Warning: ...',
        //     'undefined',
        //     'Animated.event now requires a second argument for options',
        // ]);
    
    }
    componentDidMount() {
        // Set the page title once Chat is loaded
        let { name } = this.props.route.params
        // Adds the name to top of screen
        this.props.navigation.setOptions({ title: name })
    
        //To find out user's connection status
     NetInfo.fetch().then(connection => {
        //actions when user is online
        if (connection.isConnected) {
            this.setState({ isConnected: true });
            console.log('online');

        // user can sign in anonymously
            this.authUnsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
                if (!user) {
                await firebase.auth().signInAnonymously();
            }

        // listens for updates in the collection
            this.unSubscribe = this.referenceChatMessages
                .orderBy("createdAt", "desc")
                .onSnapshot(this.onCollectionUpdate);
    
        
        //update user state with currently active user data
            this.setState({
                uid: user.uid,
                messages: [],
                user: {
                    _id: user.uid,
                    name: name,
                    avatar: "https://placeimg.com/140/140/any",
                },
            });

        });
            //save messages when online
            this.saveMessages();
            } else {
                this.setState({ isConnected: false });
                console.log('offline');

            //retrieve chat from asyncstorage
            this.getMessages();
            }   
        });
    }   
    
            //unsubscribe from collection updates
            componentWillUnmount() {
                this.authUnsubscribe();
                this.unSubscribe();
            }

            // calback function for when user sends a message
            onSend(messages = []) {
                this.setState(previousState => ({
                    messages: GiftedChat.append(previousState.messages, messages),
                }), () => {
                    this.addMessages();
                    this.saveMessages();
                });
            }

            // when updated set the messages state with the current data 
            onCollectionUpdate = (querySnapshot) => { 
                const messages = [];
                // go through each document
                querySnapshot.forEach((doc) => {
                    // get the QueryDocumentSnapshot's data
                    let data = doc.data();
                    messages.push({
                        _id: data._id,
                        text: data.text,
                        createdAt: data.createdAt.toDate(),
                        user: {
                            _id: data.user._id,
                            name: data.user.name,
                            avatar: data.user.avatar
                        },
                        image: data.image || null,
                        location: data.location || null,
                    });
                });
        this.setState({
            messages: messages
        });
    };
    
    // Add messages to database
    addMessages() { 
        const message = this.state.messages[0];
        // add a new messages to the collection
        this.referenceChatMessages.add({
            _id: message._id,
            text: message.text || "",
            createdAt: message.createdAt,
            user: this.state.user,
            image: message.image || "",
            location: message.location || null,
        });
    }
    getMessages = async () =>{
        let messages = '';
        try {
            //wait until asyncStorage promise settles
            messages = await AsyncStorage.getItem('messages') || [];//set empty if there is no storage item
            this.setState({
                messages: JSON.parse(messages)//convert the saved string back into an object
            });
        } catch (error) {
            console.log(error.message);
        }
    }
        //save newly added messages to state.messgaes
      saveMessages = async () => {
        try {
          await AsyncStorage.setItem('messages', JSON.stringify(this.state.messages));
          }catch (error) {
          console.log(error.message);
          }
      }
  
      deleteMessages = async () => {
        try {
          await AsyncStorage.removeItem('messages');
          this.setState({
            messages: []
          })
        } catch (error) {
          console.log(error.message);
        }
      } 
    
    
        renderBubble(props) {
            return (
                <Bubble
                    {...props}
                    wrapperStyle={{
                        right: {
                            backgroundColor: '#000',
                            opacity: 0.75
                        },
                    }}
                />
            )
        }
        //render InputToolbar only when online
        renderInputToolbar(props) {
            if (this.state.isConnected == false) {
            } else {
                return(
                    <InputToolbar
                    {...props}
                    />
                );
            }
        }
            //to access CustomActions
            renderCustomActions = (props) => {
                return <CustomActions {...props} />;
            };
            
            //return a MapView when surrentMessage contains location data
    renderCustomView (props) {
        const { currentMessage} = props;
        if (currentMessage.location) {
            return (
                <MapView
                    style={{width: 150,
                    height: 100,
                    borderRadius: 13,
                    margin: 3}}
                    region={{
                    latitude: currentMessage.location.latitude,
                    longitude: currentMessage.location.longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                    }}
                />
            );
        }
        return null;
    }

    render() {
        // Set the background color selected from start screen
        const { bgColor } = this.props.route.params;
        return (
            <View style={{
                flex: 1,
                alignItems:'center', 
                justifyContent:'center', 
                backgroundColor: bgColor ? bgColor : "#fff",}}>
                <View style={styles.giftedChat}>
                <GiftedChat
                    messages={this.state.messages}
                    onSend={messages => this.onSend(messages)}
                    renderBubble={this.renderBubble}
                    renderInputToolbar={this.renderInputToolbar.bind(this)}
                    renderActions={this.renderCustomActions}
                    renderCustomView={this.renderCustomView}
                    user={{
                        _id: this.state.user._id,
                        name: this.state.name,
                        avatar: this.state.user.avatar
                    }}
                    />
                    { Platform.OS === 'android' ? (
                        <KeyboardAvoidingView behavior="height" />
                    ) : null}
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems:'center', 
        justifyContent:'center'
    },
    giftedChat: {
        flex: 1,
        width: "88%",
        paddingBottom: 10,
        justifyContent: "center",
        borderRadius: 5,
    },
})
