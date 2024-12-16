import { View, Text, Image } from "react-native";
import React from "react";
import { Link, router, Stack, useLocalSearchParams } from "expo-router";
import * as FileSystem from "expo-file-system";
import { MaterialIcons } from "@expo/vector-icons";
import { getMediaType } from "../utlis/media";
import { ResizeMode, Video } from "expo-av";
const ImageScreen = () => {
  const { name } = useLocalSearchParams<{ name: string }>();
  const fullUri = (FileSystem.documentDirectory || "") + (name || "");
  const type = getMediaType(fullUri);
  const onDelete = async () => {
    await FileSystem.deleteAsync(fullUri);
    router.back();
  };
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Stack.Screen
        options={{
          title: "Media",

          headerRight: () => (
            <View style={{ gap: 10, flexDirection: "row" }}>
              <MaterialIcons
                onPress={onDelete}
                name="delete"
                size={26}
                color="crimson"
              />
              <MaterialIcons
                onPress={() => {}}
                name="save"
                size={26}
                color="dimgray"
              />
            </View>
          ),
        }}
      />
      {type === "image" && (
        <Image
          source={{ uri: fullUri }}
          style={{ width: "100%", height: "100%" }}
        />
      )}
      {type === "video" && (
        <Video
          source={{ uri: fullUri }}
          style={{ width: "100%", height: "100%" }}
          shouldPlay
          isLooping
          useNativeControls
        />
      )}
    </View>
  );
};

export default ImageScreen;
