import React from 'react';
import { View, Text, StyleSheet} from 'react-native';

// The applications Chat component which renders some text at the moment
export default class Chat extends React.Component {
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
        <Text style={styles.title}>Chat will be here</Text>
    </View>
    )
}
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
  },
  title: {
      fontSize: 45,
      fontWeight: "bold",
      color: 'white',
      textAlign: "center",
      padding: 20
  },
})