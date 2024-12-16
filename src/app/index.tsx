import {
  View,
  Text,
  Pressable,
  StyleSheet,
  FlatList,
  Image,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { Link, useFocusEffect } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";
import { getMediaType, MediaType } from "../utlis/media";
import { ResizeMode, Video } from "expo-av";
type Media = {
  name: string;
  uri: string;
  type: MediaType;
};
const HomeScreen = () => {
  const [image, setImage] = useState<Media[]>([]);
  useFocusEffect(
    useCallback(() => {
      loadFiles();
    }, [])
  );
  const loadFiles = async () => {
    if (!FileSystem.documentDirectory) {
      return null;
    }
    const res = await FileSystem.readDirectoryAsync(
      FileSystem.documentDirectory
    );

    setImage(
      res.map((file) => ({
        name: file,
        uri: FileSystem.documentDirectory + file,
        type: getMediaType(file),
      }))
    );
  };
  console.log(JSON.stringify(image, null, 2));
  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={image}
        contentContainerStyle={{ gap: 1 }}
        columnWrapperStyle={{ gap: 1 }}
        numColumns={3}
        renderItem={({ item }) => (
          <Link href={`/${item.name}`} asChild>
            <Pressable style={{ flex: 1, maxWidth: "33.33%" }}>
              {item.type === "image" && (
                <Image
                  source={{ uri: item.uri }}
                  style={{ aspectRatio: 3 / 4, borderRadius: 5 }}
                />
              )}
              {item.type === "video" && (
                <>
                  <Video
                    source={{ uri: item.uri }}
                    style={{ aspectRatio: 3 / 4, borderRadius: 5 }}
                    resizeMode={ResizeMode.COVER}
                    positionMillis={100}
                  />
                  <MaterialIcons
                    name="play-circle-outline"
                    color="white"
                    style={{ position: "absolute" }}
                    size={30}
                  />
                </>
              )}
              {item.type === null && null}
            </Pressable>
          </Link>
        )}
      />
      <Link href="/camera" asChild>
        <Pressable style={styles.floatingButton}>
          <MaterialIcons name="photo-camera" size={30} color="white" />
        </Pressable>
      </Link>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  floatingButton: {
    backgroundColor: "royalblue",
    padding: 15,
    borderRadius: 50,
    position: "absolute",
    bottom: 10,
    right: 10,
  },
});
