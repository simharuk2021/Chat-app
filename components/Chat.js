import React from 'react';
import { View, Text, StyleSheet} from 'react-native';
import { GiftedChat,Bubble } from 'react-native-gifted-chat';
import { Platform, KeyboardAvoidingView } from 'react-native';

// The applications Chat component which renders some text at the moment
export default class Chat extends React.Component {
  constructor() {
    super();
    this.state = {
      messages: [],
    }
  }

  componentDidMount() {
    const name = this.props.route.params.name;
    this.setState({
      messages: [
        {
          _id: 1,
          text: 'Hello developer',
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'React Native',
            avatar: 'https://placeimg.com/140/140/any',
          },
        },
        {
          _id: 2,
      text: name + ' has joined the chat',
      createdAt: new Date(),
      system: true,
   },
      ],
    })
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