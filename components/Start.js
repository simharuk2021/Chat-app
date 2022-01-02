import React from 'react';
import { 
  Image,
  ImageBackground,
  View, 
  Text, 
  Button,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  TextInput
} from 'react-native';

const image = require('../project_assets/Background_image.png');
const icon = require('../project_assets/icon.svg');
export default class Start extends React.Component {

  constructor(props) {
    super(props);
    this.state = { 
    name: '',
    bgColor:''
 };
}

changeBgColor = (newColor) => {
  this.setState({ bgColor: newColor });
};

//color choices
colors = {
  black: "#090C08",
  independence: "#474056",
  duskGray: "#8A95A5",
  composedGreen: "#B9C6AE",
};

  render() {
       return (
      
      <View style={styles.container}>
        <ImageBackground source={image} resizeMode='cover' style={styles.image}>
          <View>
            <Text style={styles.title}>Chat App</Text>    
          </View>
          {/* end chat app title view */}

          <View style={styles.box}>
          <View style={styles.inputbox}>

          <Image source={icon} style={styles.userIcon}/>
       <TextInput
         style={styles.input}
         onChangeText={(text) => this.setState({name: text})}
         value={this.state.name}
         placeholder='Enter your name here'
       ></TextInput>
       </View>
       {/* end of input box view */}

       </View>
       {/* end of styles box view */}

          <View style={styles.colorBox}>

<Text style={styles.colorText}>Choose Background Color</Text>

<View style={styles.colorPalette}>
    <TouchableOpacity
      onPress={() =>{ this.changeBgColor(this.colors.black)}}
    style={ styles.colorSelection}
    >
        <View style={styles.color1}>
        </View>
    </TouchableOpacity>

    <TouchableOpacity
       onPress={() =>{ this.changeBgColor(this.colors.independence)}}
    style={ styles.colorSelection}
    >
        <View style={styles.color2}>
        </View>
    </TouchableOpacity>

    <TouchableOpacity
      onPress={() =>{ this.changeBgColor(this.colors.duskGray)}}
    style={ styles.colorSelection}
    >
        <View style={styles.color3}>
        </View>
    </TouchableOpacity>

    <TouchableOpacity                 
    onPress={() =>{ this.changeBgColor(this.colors.composedGreen)}}
    style={ styles.colorSelection}
    >
        <View style={styles.color4}>
        </View>
    </TouchableOpacity>
    </View>
    {/* end of color pallete view */}

    </View>
    {/* end of styles color box view */}

        <Pressable
          style={styles.button}  
          onPress={() => this.props.navigation.navigate('Chat', { 
            name: this.state.name, 
            bgColor: this.state.bgColor, 
          })}
        >
         <Text style={styles.buttontext}>Start chatting</Text>
        </Pressable>
        </ImageBackground>
      </View>
      //end of container view
    )
  }
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
  },
  box: {
    marginBottom: 30,
    backgroundColor: "white",
    flexGrow: 1,
    flexShrink: 0,
    flexDirection: "column",
    justifyContent: "space-evenly",
    alignItems: "center",
    paddingTop: 15,
    paddingBottom: 15,
    borderRadius: 10,
    height: 260,
    minHeight: 260,
    maxHeight: 300,
    height: "44%",
    width: "88%"
},

image: {
  flex: 1,
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
},

inputbox: {
    marginBottom: 30,
    backgroundColor: "white",
    flexGrow: 1,
    flexShrink: 0,
    flexDirection: "column",
    justifyContent: "space-evenly",
    alignItems: "center",
    paddingTop: 15,
    paddingBottom: 15,
    borderRadius: 10,
    height: 100,
    minHeight: 100,
    maxHeight: 300,
    height: "22%",
    width: "44%"
},

title: {
  fontSize: 45,
  fontWeight: "bold",
  color: 'white',
  textAlign: "center",
  padding: 20
},

input: {
  fontSize: 15,
  fontWeight: "300",
  color: '#757083',
  opacity: 1
},

colorBox:{
  flexDirection: 'column',
  padding: 20,
  width: "88%"
},

colorPalette: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  padding: 5,
},

colorSelection:{

  alignSelf: 'center',
  borderRadius: 40,
  borderWidth: 2,
  borderColor: 'white'
},

colorText:{
  fontSize: 16,
  fontWeight: "300",
  color: 'white',
  opacity: 1,
  padding: 5,
},

color1:{
  flexDirection: 'row',
  backgroundColor: '#090C08',
  width: 40,
  height: 40,
  borderRadius: 20,
  margin: 2,
},
color2:{
  flexDirection: 'row',
  backgroundColor: '#474056',
  width: 40,
  height: 40,
  borderRadius: 20,
  margin: 2
},
color3:{
  flexDirection: 'row',
  backgroundColor: '#8A95A5',
  width: 40,
  height: 40,
  borderRadius: 20,
  margin: 2
},
color4:{
  flexDirection: 'row',
  backgroundColor: '#B9C6AE',
  width: 40,
  height: 40,
  borderRadius: 20,
  margin: 2
},
button: {
  flexDirection: 'column',
  backgroundColor: "#757083", 
  width: "88%",
  borderRadius: 10,
},

buttontext: {
  fontSize: 16,
  fontWeight: "bold",
  color: 'white',
  textAlign: "center",
  padding: 20
}

});