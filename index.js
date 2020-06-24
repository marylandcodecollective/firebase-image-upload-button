import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import React from "react";
import Constants from "expo-constants";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";

class FirebaseImageUploadButton extends React.Component {
  state = {
    loading: false,
    uploadedPhoto: null,
  };
  componentDidMount = () => {
    this.getPermissionAsync();
  };

  getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
      }
    }
  };

  startUploadPhoto = () => {
    this.props.onFinish("tara here");
    // this.setState({ loading: true });
    // ImagePicker.launchImageLibraryAsync({
    //   mediaTypes: ImagePicker.MediaTypeOptions.All,
    //   allowsEditing: true,
    //   aspect: [3, 3],
    //   quality: 1,
    // }).then((result) => {
    //   // if (!result.cancelled) {
    //   Alert.alert("tara here", result.uri);
    //   // let uploadUrl = await this.uploadImageAsync(result.uri);
    //   // this.props.onFinish(uploadUrl);
    //   // this.setState({ uploadedPhoto: uploadUrl });
    //   // this.setState({ loading: false });
    //   // }
    // });
  };

  uploadImageAsync = async (uri) => {
    console.log("uploadImageAsync", uri);
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {};
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send(null);
    });

    const num = Math.floor(Math.random() * 90000) + 10000;
    const filename = `${num}.jpg`;

    const ref = this.props.storage.ref().child(`images/${filename}`);
    const snapshot = await ref.put(blob);

    blob.close();

    let url = await snapshot.ref.getDownloadURL();
    return url;
  };

  render = () => {
    return (
      <View
        style={{
          ...this.props.buttonContainerStyles,
        }}
      >
        <TouchableOpacity
          style={{
            width: "100%",
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={() => this.startUploadPhoto()}
        >
          {this.state.loading ? (
            <ActivityIndicator
              animating={true}
              size={"large"}
              color={"white"}
            />
          ) : (
            this.props.icon
          )}
        </TouchableOpacity>
      </View>
    );
  };
}

export default FirebaseImageUploadButton;
