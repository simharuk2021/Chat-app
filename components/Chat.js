import React from 'react';
import { View, Text, StyleSheet} from 'react-native';
import { GiftedChat,Bubble } from 'react-native-gifted-chat';
import { Platform, KeyboardAvoidingView } from 'react-native';
const firebase = require('firebase');
require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyCbjzfg0sF5c62vHzPxPIP9xv1WXSwZ5KQ",
  authDomain: "test-c27b3.firebaseapp.com",
  projectId: "test-c27b3",
  storageBucket: "test-c27b3.appspot.com",
  messagingSenderId: "267899396761",
  appId: "1:267899396761:web:39e97944d99279e93f8e08",
  measurementId: "G-VVH03T8XRX"
};

// The applications Chat component which renders some text at the moment
export default class Chat extends React.Component {
  constructor() {
     
    super();
    this.state = {
      uid: 0,
          user: {
          _id: "",
          name: "",
          avatar: "",
      }
  }
    //initialize firebase
    if (!firebase.apps.length){
        firebase.initializeApp({firebaseConfig});
      }

    // references the Firestore message collection
      this.referenceChatMessages = firebase.firestore().collection("messages").where("uid", "==", this.state.uid);
    }



  componentDidMount() {
    const name = this.props.route.params.name;

   //user authentication
  this.authUnsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
    if (!user) {

    //user can sign in as anonymous
        firebase.auth().signInAnonymously();
    }
  
    this.setState({
      uid: user.uid,
      messages: [],
    });

    this.unsubscribe = this.referenceChatMessages
      .orderBy("createdAt", "desc")
      .onSnapshot(this.onCollectionUpdate)
    });  
  }

    // sets messages to state when updated
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
        }
    });
    });
    this.setState({
    messages: messages
    });
};

  componentWillUnmount() {

    //unsubscribe from collection updates
    this.authUnsubscribe();
    this.unsubscribe();
}
    //add messages to the database
  addMessages() { 
    const message = this.state.messages[0];

    // add a new messages to the collection
    this.referenceChatMessages.add({
    _id: message._id,
    text: message.text || "",
    createdAt: message.createdAt,
    user: this.state.user
    });
  }   

  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }))
  }

  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#000'
          }
        }}
      />
    )
  }
  
  render() {
      const { bgColor } = this.props.route.params;
      let { name } = this.props.route.params;
      this.props.navigation.setOptions({ title: name });
    return (
      <View style={{
        flex: 1,
        alignItems:'center', 
        justifyContent:'center', 
        backgroundColor: bgColor ? bgColor : "white",}}>
          <View style={styles.giftedChat}
          >
      <GiftedChat
        renderBubble={this.renderBubble.bind(this)}
        messages={this.state.messages}
        onSend={messages => this.onSend(messages)}
        user={{
        _id: 1,
  }}
/>
    { Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null}
    {/* end of gifted chat view */}
    </View>
    {/* end of main style view */}
    </View>
    )
}
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
  },
  giftedChat: {
    flex: 1,
    width: "88%",
    paddingBottom: 10,
    justifyContent: "center",
    borderRadius: 5,
},
})