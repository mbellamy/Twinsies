/**
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */
import ActionSheet from 'react-native-actionsheet'
import React, {Component} from 'react';
import {StyleSheet, Alert, Text, View, TouchableOpacity, ImageBackground} from 'react-native';
import { Images } from './components/logic';
import { Network } from './components/network';
import { Util } from './components/utils';
import { TImage } from './components/models';




export interface Props {}
export interface State {
  faceOne: string
  faceTwo: string
  faceId1: string
  faceId2: string
  archive: TImage[]
  index: number,
  accuracy: number
}

//i do declare
const images = new Images()
const network = new Network()
const util = new Util()

export default class App extends Component<Props, State> {
  network: any;
  constructor(props: Props) {
    super(props)
  
    this.state = {
      faceOne: '',
      faceTwo: '',
      faceId1: '',
      faceId2: '',
      archive: [],
      index: 0,
      accuracy: 0
       
    };
  };


  //load camera or lbrary
  _showCameraOptions = () => {
    this.refs.actionsheet.show()
  }


 
  _setFaceId = (faceId: string) => {
    switch (this.state.index) {
      case 0: {
        this.setState({faceId1: faceId})
        break
      }
      case 1: {
        this.setState({faceId2: faceId})
        break
      }
    }
  }



  //process hash of image
  _processResult = (image: {}) => {

    //hash image
    util._getImagehash(image.path)
      .then(hash => {

          //check for hash of image
          const hashes = this.state.archive
          const result = hashes.filter( image => image.hash == hash)

          if (result.length > 0) {
            //if we found an image use it
            this._setFaceId(result[0].faceId)
          } else {
            //if we havent found an image send to server to detect faces
            this._detectFace(image, hash)
          }
      })
      .catch(err => {
          //if there was an error hashing image detect face anyway
          this._detectFace(image, '')
      })
  }

  //send to server to detect face
  _detectFace = (image: {}, hash: string) => {
    network._sendImageForDetection(image.data)
            .then((response) => response.json())
            .then((responseJson) => {
              // //check response to make sure there is a value
                if (responseJson.length > 1 || responseJson.length < 1 || responseJson == undefined) {
                  Alert.alert('Either too many or not enough faces..')
                  return
                }

                //get faceid
                const faceId = responseJson[0].faceId
                
                //set faceid 
                this._setFaceId(faceId)

                //if no hash stop here
                if (hash == '') {
                  return
                }

                //create TIMage object
                const tImage: TImage = {hash: hash, faceId: faceId, date: new Date().getTime()}

                //get archive and add image
                const hashes = this.state.archive
                hashes.push(tImage)

                this.setState({archive: hashes})
            })
            .catch((error) => {
              console.error(error);
            });
  }
  //handle selection
  _processSelection = (index: number) => {
    switch (index) {
      case 0: {
        images._showCameraPicker()
        .then((image) => {

          //process image
          this._processResult(image)

          //set imagein ui
          switch (this.state.index) {
            case 0: {
              this.setState({faceOne: image.path})
              break
            }
            case 1: {
              this.setState({faceTwo: image.path})
              break
            }
          }
        })
        .catch(err => {
          console.log(err)
        })
        break
      }
      case 1: {
        images._showLibraryPicker()
        .then((image) => {

          //process image
          this._processResult(image)

          //set imagein ui
          switch (this.state.index) {
            case 0: {
              this.setState({faceOne: image.path})
              break
            }
            case 1: {
              this.setState({faceTwo: image.path})
              break
            }
          }
        })
        .catch(err => {
          console.log(err)
        })
        break
      }
    }
  }

  _compare = () => {
    //stop if we dont have two faces to compare.
    if (this.state.faceId1 == '' || this.state.faceId2 == '') {
      return
    }

    //send to sever to compare
    network._compareImages(this.state.faceId1, this.state.faceId2)
        .then((response) => response.json())
        .then((responseJson) => {
          //set accuracy and reset faceids
          this.setState({accuracy: responseJson.confidence, faceId1: '', faceId2: ''})
        })
        .catch((error) => {
          console.error(error);
          Alert.alert(error.message)
        });
  }

  render() {
    return (
      <View style={styles.container}>
        <ActionSheet
            ref={'actionsheet'}
            title={'Which one do you like ?'}
            options={['Camera', 'Library', 'Cancel']}
            cancelButtonIndex={2}
            destructiveButtonIndex={2}
            onPress={(index: number) => {
               this._processSelection(index)
            }}
          />
        <View style={styles.frame}>
          <View style={styles.compareContainer}>
            <TouchableOpacity
              onPress={() => {
                this.setState({index: 0})
                this._showCameraOptions()
              }}>
              <View style={styles.image}>
                <ImageBackground 
                  resizeMode={'cover'}
                  style={{width: '100%', height: '100%'}} 
                  source={{uri: this.state.faceOne}}>
                  <Text style={[{opacity: this.state.faceId1 == '' ? 0 : 1,}, styles.text]}>✓</Text>
                </ImageBackground>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              disabled={this.state.faceId1 == ''}
              onPress={() => {
                this.setState({index: 1})
                this._showCameraOptions()
              }}>
              <View style={styles.image}>
                <ImageBackground
                  resizeMode={'cover'}
                  style={{width: '100%', height: '100%'}} 
                  source={{uri: this.state.faceTwo}}>
                  <Text style={[{opacity: this.state.faceId2 == '' ? 0 : 1, }, styles.text]}>✓</Text>
                </ImageBackground>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.accuracy}>
              <Text style={styles.text}>{Math.floor(this.state.accuracy * 100)}%</Text>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
                disabled={this.state.faceId2 == ''}
                style={styles.button}
                onPress={() => {
                  this._compare()
                }} >
                <Text style={styles.buttonText}> Compare </Text>
              </TouchableOpacity>
          </View>
        </View>
        
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#02a9ea',
  },
  frame: {
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  compareContainer: {
    height: '40%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 288,
    height: 160,
    margin: 5,
    borderColor: '#fff000',
    borderWidth: 5,
    borderRadius: 5,
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  text: {
    fontSize: 60, 
    color: 'white', 
    fontWeight: 'bold', 
    fontFamily: 'copperplate',
  },
  accuracy: {
    height: 100, 
    width: '100%', 
    justifyContent: 'center', 
    alignItems: 'center',
  },
  buttonContainer: {
    marginTop: 20, 
    height: 50, 
    width: '100%', 
    justifyContent: 'center', 
    alignItems: 'center',
  },
  button: {
    justifyContent: 'center', 
    width: '80%', 
    height: 50, 
    marginTop: 20,
    borderRadius: 30, 
    backgroundColor: '#fff000'
  },
  buttonText: {
    textAlign: 'center', 
    fontWeight: 'bold', 
    color: 'white',
  }
});
