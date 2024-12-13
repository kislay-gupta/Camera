import { View, Text } from "react-native";
import React from "react";
import { Link } from "expo-router";

const CameraScreen = () => {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text style={{ fontSize: 24, fontWeight: 600 }}>CameraScreen</Text>
      <Link href="/">Home</Link>
    </View>
  );
};

export default CameraScreen;
