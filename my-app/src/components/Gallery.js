import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const GALLERY_STORAGE_KEY = '@gallery_images';

export default function Gallery({ navigation }) {
  const [images, setImages] = useState([
    require('../../assets/icon.png'),
    require('../../assets/splash-icon.png'),
    require('../../assets/adaptive-icon.png'),
  ]);

  useEffect(() => {
    loadGallery();
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'We need camera roll permissions to add images!');
    }
  };

  const loadGallery = async () => {
    try {
      const stored = await AsyncStorage.getItem(GALLERY_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setImages(prev => [...prev, ...parsed]);
      }
    } catch (error) {
      console.error('Error loading gallery:', error);
    }
  };

  const saveGallery = async (newImages) => {
    try {
      await AsyncStorage.setItem(GALLERY_STORAGE_KEY, JSON.stringify(newImages));
    } catch (error) {
      console.error('Error saving gallery:', error);
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const newImage = { uri: result.assets[0].uri };
        const newImages = [...images, newImage];
        setImages(newImages);
        
        // Save only URI images (not require() assets) to storage
        const uriImages = images.filter(img => img.uri).concat([newImage]);
        await saveGallery(uriImages);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Gallery</Text>
        <TouchableOpacity onPress={pickImage} style={styles.addButton}>
          <Ionicons name="add-circle" size={28} color="#1D7CF2" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={images}
        keyExtractor={(_, i) => i.toString()}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        renderItem={({ item, index }) => (
          <View style={styles.imageContainer}>
            <Image source={item} style={styles.image} />
            {item.uri && (
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => {
                  const newImages = images.filter((_, i) => i !== index);
                  setImages(newImages);
                  const uriImages = newImages.filter(img => img.uri);
                  saveGallery(uriImages);
                }}
              >
                <Ionicons name="close-circle" size={24} color="#E11D48" />
              </TouchableOpacity>
            )}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F7FB',
    paddingTop: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#222',
  },
  addButton: {
    padding: 5,
  },
  listContent: {
    padding: 10,
  },
  imageContainer: {
    width: '47%',
    margin: '1.5%',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    backgroundColor: '#E5E7EB',
  },
  deleteButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'white',
    borderRadius: 12,
  },
});

