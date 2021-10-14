import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import { ScrollView, Image, Text, View } from "react-native";
import { Appbar } from "react-native-paper";
import { MainStackParamList } from "../MainStackScreen";
import { styles } from "./DetailScreen.styles";

interface Props {
  navigation: StackNavigationProp<MainStackParamList, "DetailScreen">;
  route: RouteProp<MainStackParamList, "DetailScreen">;
}

export default function DetailScreen({ route, navigation }: Props) {
  const item = route.params.social;

  const Bar = () => {
    return (
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.navigate("FeedScreen")} />
        <Appbar.Content title="Socials" />
      </Appbar.Header>
    );
  };

  return (
    <>
      <Bar />
      <ScrollView style={styles.container}>
        <View style={styles.view}>
          <Image style={styles.image} source={{ uri: item.eventImage }} />
          <Text style={{ ...styles.h1, marginVertical: 10 }}>
            {item.eventName}
          </Text>
          <Text style={{ ...styles.subtitle, marginBottom: 5 }}>
            {item.eventLocation}
          </Text>
          <Text style={{ ...styles.subtitle, marginTop: 5, marginBottom: 20 }}>
            {new Date(item.eventDate).toLocaleString()}
          </Text>
          <Text style={styles.body}>{item.eventDescription}</Text>
        </View>
      </ScrollView>
    </>
  );
}
