import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Pressable,
  Image,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { Link, router, Stack } from "expo-router";
import {
  useCameraPermissions,
  CameraView,
  CameraType,
  CameraCapturedPicture,
} from "expo-camera";
import { MaterialIcons } from "@expo/vector-icons";
const CameraScreen = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>("back");
  const [picture, setPicture] = useState<CameraCapturedPicture>();
  const camera = useRef<CameraView>(null);

  useEffect(() => {
    if (permission && !permission.granted && permission.canAskAgain) {
      requestPermission();
    }
  }, [permission]);
  const toggleCameraFacing = () => {
    setFacing((current) => (current === "back" ? "front" : "back"));
  };
  if (!permission?.granted) {
    return <ActivityIndicator />;
  }
  const takePicture = async () => {
    const res = await camera.current?.takePictureAsync();
    setPicture(res);
  };
  if (picture) {
    return (
      <View>
        <Image
          source={{ uri: picture.uri }}
          style={{ width: "100%", height: "100%" }}
        />
        <MaterialIcons
          name="close"
          color={"white"}
          style={styles.close}
          size={30}
          onPress={() => setPicture(undefined)}
        />
      </View>
    );
  }
  return (
    <View>
      <CameraView ref={camera} style={styles.camera} facing={facing}>
        <View style={styles.footer}>
          <View />
          <Pressable style={styles.recordButton} onPress={takePicture} />
          <MaterialIcons
            name="flip-camera-android"
            color={"white"}
            size={30}
            onPress={toggleCameraFacing}
          />
        </View>
      </CameraView>
      <MaterialIcons
        name="close"
        color={"white"}
        style={styles.close}
        size={30}
        onPress={() => router.back()}
      />
    </View>
  );
};

export default CameraScreen;

const styles = StyleSheet.create({
  camera: {
    width: "100%",
    height: "100%",
  },
  recordButton: {
    width: 50,
    height: 50,
    borderRadius: 50,
    backgroundColor: "white",
  },
  footer: {
    marginTop: "auto",
    padding: 20,
    paddingBottom: 50,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#00000099",
  },
  close: {
    position: "absolute",
    top: 10,
    left: 20,
  },
});
