// app/screens/SelectImageScreen.tsx
import React, { useState } from 'react';
import { View, Text, Button, Image, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const SelectImageScreen = () => {
  const [image, setImage] = useState<string | null>(null);
  const [permission, setPermission] = useState<boolean | null>(null);

  // Function to request camera and photo gallery permissions
  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();

    setPermission(status === 'granted' && cameraStatus.status === 'granted');
  };

  // Function to open the image picker
  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });
      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image: ', error);
    }
  };

  // Function to take a photo using the camera
  const takePhoto = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 1,
      });
      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error taking photo: ', error);
    }
  };

  // Request permissions when the component mounts
  React.useEffect(() => {
    requestPermissions();
  }, []);

  if (permission === null) {
    return <Text>Requesting permission...</Text>;
  }

  if (permission === false) {
    return <Text>Permission to access camera or media library is required.</Text>;
  }

  return (
    <View style={styles.container}>
      <Text>Select or Take a Photo</Text>
      <Button title="Select Image" onPress={pickImage} />
      <Button title="Take a Photo" onPress={takePhoto} />
      {image && <Image source={{ uri: image }} style={styles.image} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 200,
    marginTop: 20,
    borderRadius: 10,
  },
});

export default SelectImageScreen;
