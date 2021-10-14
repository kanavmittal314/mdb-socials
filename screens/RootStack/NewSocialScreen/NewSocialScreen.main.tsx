import React, { useState, useEffect } from "react";
import { Platform, View, StyleSheet } from "react-native";
import { Appbar, TextInput, Snackbar, Button } from "react-native-paper";
import { getFileObjectAsync, uuid } from "../../../Utils";

// See https://github.com/mmazzarolo/react-native-modal-datetime-picker
// Most of the date picker code is directly sourced from the example.
import DateTimePickerModal from "react-native-modal-datetime-picker";

// See https://docs.expo.io/versions/latest/sdk/imagepicker/
// Most of the image picker code is directly sourced from the example.
import * as ImagePicker from "expo-image-picker";
import { styles } from "./NewSocialScreen.styles";

import firebase from "firebase/app";
import "firebase/firestore";
import { SocialModel } from "../../../models/social";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../RootStackScreen";


interface Props {
  navigation: StackNavigationProp<RootStackParamList, "NewSocialScreen">;
}

export default function NewSocialScreen({ navigation }: Props) {
  /* TODO: Declare state variables for all of the attributes 
           that you need to keep track of on this screen.

    
     HINTS:

      1. There are five core attributes that are related to the social object.
      2. There are two attributes from the Date Picker.
      3. There is one attribute from the Snackbar.
      4. There is one attribute for the loading indicator in the submit button.
  
  */

  //Snackbar
  const [visible, setVisible] = useState(false);

  //Loading Indicator
  const [loading, setLoading] = useState(false);

  //Date Picker
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [eventDate, setEventDate] = useState(null);
  const [datePickerText, setDatePickerText] = useState("Choose a Date");

  //Core Attributes
  const [eventName, setEventName] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [image, setImage] = useState("");
  const [imagePickerText, setImagePickerText] = useState("Pick an Image");

  // TODO: Follow the Expo Docs to implement the ImagePicker component.
  // https://docs.expo.io/versions/latest/sdk/imagepicker/

  // TODO: Follow the GitHub Docs to implement the react-native-modal-datetime-picker component.
  // https://github.com/mmazzarolo/react-native-modal-datetime-picker

  // TODO: Follow the SnackBar Docs to implement the Snackbar component.
  // https://callstack.github.io/react-native-paper/snackbar.html

  const saveEvent = async () => {
    // TODO: Validate all fields (hint: field values should be stored in state variables).
    // If there's a field that is missing data, then return and show an error
    // using the Snackbar.

    if (
      !eventName &&
      !eventLocation &&
      !eventDescription &&
      !eventDate &&
      !image
    ) {
      onShowSnackBar();
      return;
    }

    // Otherwise, proceed onwards with uploading the image, and then the object.

    try {
      // NOTE: THE BULK OF THIS FUNCTION IS ALREADY IMPLEMENTED FOR YOU IN HINTS.TSX.
      // READ THIS TO GET A HIGH-LEVEL OVERVIEW OF WHAT YOU NEED TO DO, THEN GO READ THAT FILE!
      // (0) Firebase Cloud Storage wants a Blob, so we first convert the file path
      // saved in our eventImage state variable to a Blob.
      // (1) Write the image to Firebase Cloud Storage. Make sure to do this
      // using an "await" keyword, since we're in an async function. Name it using
      // the uuid provided below.
      // (2) Get the download URL of the file we just wrote. We're going to put that
      // download URL into Firestore (where our data itself is stored). Make sure to
      // do this using an async keyword.
      // (3) Construct & write the social model to the "socials" collection in Firestore.
      // The eventImage should be the downloadURL that we got from (3).
      // Make sure to do this using an async keyword.
      // (4) If nothing threw an error, then go back to the previous screen.
      //     Otherwise, show an error.
      setLoading(true);
      const object = await getFileObjectAsync(image);
      const result = await firebase
        .storage()
        .ref()
        .child(uuid() + ".jpg")
        .put(object as Blob);
      const downloadURL = await result.ref.getDownloadURL();
      const doc: SocialModel = {
        eventName: eventName,
        eventDate: eventDate.getTime(),
        eventLocation: eventLocation,
        eventDescription: eventDescription,
        eventImage: downloadURL,
      };
      await firebase.firestore().collection("socials").doc().set(doc);
      console.log("Finished social creation.");
      setLoading(false);
      navigation.goBack();
    } catch (e) {
      console.log("Error while writing social:", e);
      setLoading(false);
    }
  };

  const Bar = () => {
    return (
      <Appbar.Header>
        <Appbar.Action onPress={navigation.goBack} icon="close" />
        <Appbar.Content title="Socials" />
      </Appbar.Header>
    );
  };

  const showDatePicker = () => {
    console.log("Date Picker Selected");
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date: any) => {
    console.warn("A date has been picked: ", date);
    setEventDate(date);
    hideDatePicker();
  };

  const onToggleSnackBar = () => setVisible(!visible);

  const onDismissSnackBar = () => setVisible(false);

  const onShowSnackBar = () => {
    setVisible(true);
  };

  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!");
        }
      }
    })();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      setImage(result.uri);
      setImagePickerText("Change Image");
    }
  };

  useEffect(() => {
    if (!eventDate) {
      setDatePickerText("Choose a Date");
    } else {
      console.log(eventDate);
      setDatePickerText(eventDate.toLocaleString());
    }
  }, [eventDate]);

  const stringDateConvert = (date : Date) => {
    
    //  return `${date.getMonth()}/${date.getDate()}/${date.getFullYear()} ${date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}`
  }

  return (
    <>
      <Bar />

      <View style={{ ...styles.container, padding: 20 }}>
        <View style = {paddingStyle.padding}>
        <TextInput
          label="Event Name"
          value={eventName}
          onChangeText={(text) => setEventName(text)}
        /></View>
        <View style = {paddingStyle.padding}>
        <TextInput 
          label="Event Location"
          value={eventLocation}
          onChangeText={(text) => setEventLocation(text)}
        />
        </View>
        <View style = {paddingStyle.padding}> 
        <TextInput
          label="Event Description"
          value={eventDescription}
          onChangeText={(text) => setEventDescription(text)}
        />
        </View>
        <View style = {paddingStyle.padding}> 
        <Button mode="outlined" onPress={() => showDatePicker()}>
          {datePickerText}
          
        </Button>
        </View>
        <View style = {paddingStyle.padding}> 
        <Button mode="outlined" onPress={() => pickImage()}>
          {imagePickerText}
        </Button>
        </View>
        <View style = {paddingStyle.padding}> 
        <Button mode="contained" onPress={() => saveEvent()} loading={loading}>
          Save Event
        </Button>
        </View>
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="datetime"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
        />
        <Snackbar visible={visible} onDismiss={onDismissSnackBar}>
          Invalid Entry
        </Snackbar>
      </View>
    </>
  );
}

const paddingStyle = StyleSheet.create({
  padding: {
    padding: 10
  }
});
