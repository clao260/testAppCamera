import React, { PureComponent } from 'react';
import { AppRegistry, StyleSheet, Text, TouchableOpacity, View, PermissionsAndroid } from 'react-native';
import { RNCamera } from 'react-native-camera';
import RNFetchBlob from 'rn-fetch-blob';

export default class CameraComponent extends PureComponent {

    constructor(props) {
        super(props)
        this.state = {
            photo: [],
            photoNumber: 1
        }
    }

    componentDidMount = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                {
                    title: "Cool Photo App Camera Permission",
                    message:
                        "Cool Photo App needs access to your camera " +
                        "so you can take awesome pictures.",
                    buttonNeutral: "Ask Me Later",
                    buttonNegative: "Cancel",
                    buttonPositive: "OK"
                }
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log("You can use the camera");

                const data = await this.camera.takePictureAsync();
                let saveResult = CameraRoll.saveToCameraRoll(data.uri);
                console.warn("takePicture ", saveResult);
                console.warn("picture url ", data.uri);
            } else {
                console.log("Camera permission denied");
            }
        } catch (err) {
            console.warn(err);
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <RNCamera
                    ref={ref => {
                        this.camera = ref;
                    }}
                    style={styles.preview}
                    type={RNCamera.Constants.Type.back}
                    flashMode={RNCamera.Constants.FlashMode.on}
                    // captureTarget={RNCamera.Constants.CaptureTarget.disk}
                    androidCameraPermissionOptions={{
                        title: 'Permission to use camera',
                        message: 'We need your permission to use your camera',
                        buttonPositive: 'Ok',
                        buttonNegative: 'Cancel',
                    }}


                />
                <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center' }}>
                    <TouchableOpacity onPress={this.takePicture} style={styles.capture}>
                        <Text style={{ fontSize: 14 }}> SNAP </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.UploadPhoto} style={styles.capture}>
                        <Text style={{ fontSize: 14 }}> upload </Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
    
    UploadPhoto = async (path) => {
        // const url = 'http://ptsv2.com/t/clao260/post'
        const url = '*********************';
        
        RNFetchBlob.fetch('POST', url, {
            // Authorization : "Bearer access-token",
            // otherHeader : "foo",
            // this is required, otherwise it won't be process as a multipart/form-data request
            'Content-Type' : 'multipart/form-data',
          }, [
            // append field data from file path
            {
              name : 'test',
              filename : 'test.jpg',
              type : 'image/jpg',
              // Change BASE64 encoded data to a file path with prefix `RNFetchBlob-file://`.
              // Or simply wrap the file path with RNFetchBlob.wrap().
              data: RNFetchBlob.wrap(path)
              //voir librairie https://github.com/joltup/rn-fetch-blob
              //Voir API de test : http://ptsv2.com/t/clao260#
            }
           
          ]).then((resp) => {
            console.log(resp)
          }).catch((err) => {
            console.warn(err)
          })
    }


    takePicture = async () => {

        if (this.camera) {
            const options = {
                base64: true,
                exif: true
            };
            const dirs = RNFetchBlob.fs.dirs
            const data = await this.camera.takePictureAsync(options);

            const cachePath = data.uri
            console.log(data);
            console.log(data.uri)

            const path = dirs.SDCardDir + '/DCIM/';
            const name = 'test_' + this.state.photoNumber + '.jpg';
            console.log('path', data.uri)
            try {
                RNFetchBlob.fs.writeFile(path + name, data.base64, 'base64')
                this.UploadPhoto(data.uri)
                this.setState({ photoNumber: this.state.photoNumber + 1 })
            }
            catch (error) {
                console.log(error.message)
            }
        }
    };
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'black',
    },
    preview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    capture: {
        flex: 0,
        backgroundColor: '#fff',
        borderRadius: 5,
        padding: 15,
        paddingHorizontal: 20,
        alignSelf: 'center',
        margin: 20,
    },
});