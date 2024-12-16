import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Pressable,
  Image,
  Button,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { router } from "expo-router";
import {
  useCameraPermissions,
  Camera,
  CameraType,
  CameraView,
  CameraMode,
} from "expo-camera";
import { MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import path from "path";
import * as FileSystem from "expo-file-system";
import { Video } from "expo-av";
const CameraScreen = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>("back");
  const [mode, setMode] = useState<CameraMode>("picture");
  const [picture, setPicture] = useState<string | undefined>();
  const [isRecording, setIsRecording] = useState(false);
  const [video, setVideo] = useState<string | undefined>();
  const camera = useRef<CameraView>(null);

  useEffect(() => {
    if (permission && !permission.granted && permission.canAskAgain) {
      requestPermission();
    }
  }, [permission]);

  const toggleCameraFacing = () => {
    setFacing((current) => (current === "back" ? "front" : "back"));
  };
  const toggleCameraMode = () => {
    setMode((camMode) => (camMode === "picture" ? "video" : "picture"));
  };
  if (!permission?.granted) {
    return <ActivityIndicator />;
  }

  const takePicture = async () => {
    try {
      const res = await camera.current?.takePictureAsync();
      if (res) {
        setPicture(res.uri);
      }
    } catch (error) {
      console.error("Error taking picture:", error);
    }
  };

  const startRecording = async () => {
    try {
      setIsRecording(true);
      const res = await camera.current?.recordAsync();
      console.log(res);
      if (res) {
        setVideo(res.uri);
      }

      setIsRecording(false);
    } catch (error) {
      console.error("Error recording video:", error);
      setIsRecording(false);
    }
  };
  console.log(video, "video");
  const stopRecording = async () => {
    try {
      camera.current?.stopRecording();
    } catch (error) {
      console.error("Error stopping recording:", error);
    }
  };

  const saveFile = async (uri: string | undefined) => {
    if (!uri) {
      console.error("Invalid file URI");
      return;
    }
    try {
      const fileName = path.parse(uri).base;
      await FileSystem.copyAsync({
        from: uri,
        to: FileSystem.documentDirectory + fileName,
      });
      setPicture(undefined);
      setVideo(undefined);
      router.back();
    } catch (error) {
      console.error("Error saving file:", error);
    }
  };

  if (picture || video) {
    return (
      <View style={{ flex: 1 }}>
        {picture && (
          <Image source={{ uri: picture }} style={{ width: "100%", flex: 1 }} />
        )}
        {video && (
          <Video
            source={{ uri: video }}
            style={{ width: "100%", flex: 1 }}
            shouldPlay
            isLooping
          />
        )}
        <View style={{ padding: 10 }}>
          <SafeAreaView edges={["bottom"]}>
            <Button title="Save" onPress={() => saveFile(picture || video)} />
          </SafeAreaView>
        </View>
        <MaterialIcons
          name="close"
          color={"white"}
          style={styles.close}
          size={30}
          onPress={() => {
            setPicture(undefined);
            setVideo(undefined);
          }}
        />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <CameraView
        mode={mode}
        ref={camera}
        style={styles.camera}
        facing={facing}
      >
        <View style={styles.footer}>
          <View />
          <View
            style={{ alignItems: "center", justifyContent: "center", gap: 10 }}
          >
            <Pressable onPress={toggleCameraMode}>
              <Text
                style={{
                  color: "white",
                  fontSize: 12,
                  fontWeight: "500",
                  gap: 1,
                }}
              >
                {mode === "picture" ? "Camera" : "Video"}
              </Text>
            </Pressable>
            <Pressable
              style={[
                styles.recordButton,
                { backgroundColor: isRecording ? "crimson" : "white" },
              ]}
              onPress={isRecording ? stopRecording : takePicture}
              onLongPress={startRecording}
            />
          </View>
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
