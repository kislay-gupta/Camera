import { View, Text } from "react-native";
import React from "react";
import { Link, useLocalSearchParams } from "expo-router";

const ImageScreen = () => {
  const { name } = useLocalSearchParams<{ name: string }>();
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text style={{ fontSize: 24, fontWeight: 600 }}>image Screen:{name}</Text>
      <Link href="/">Home</Link>
    </View>
  );
};

export default ImageScreen;
