// apiService.js

import axios from 'axios';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './firebase'; // Import your Firebase configuration

// API endpoint configurations
const API_ENDPOINTS = {
  IMAGE_CLASSIFICATION: `https://vision.googleapis.com/v1/images:annotate?key=3bfd69182eee122726aa2243bb1c5840b5e6bc21	`, // Replace YOUR_GOOGLE_API_KEY
  RECIPE_SUGGESTIONS: `https://api.spoonacular.com/recipes/complexSearch?apiKey=e3163804576a4f7b826a0f2b105620fa `, // Replace YOUR_SPOONACULAR_API_KEY
};

// Upload image to Firebase Storage and return the download URL
export const uploadImage = async (file) => {
  try {
    const storageRef = ref(storage, `images/${file.name}`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    return url;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw new Error('Error uploading image');
  }
};

// Classify image using Google Cloud Vision API
export const classifyImage = async (imageUrl) => {
  try {
    const response = await axios.post(API_ENDPOINTS.IMAGE_CLASSIFICATION, {
      requests: [
        {
          image: {
            source: { imageUri: imageUrl }
          },
          features: [
            { type: 'LABEL_DETECTION', maxResults: 10 }
          ]
        }
      ]
    });
    return response.data;
  } catch (error) {
    console.error('Error classifying image:', error);
    throw new Error('Error classifying image');
  }
};

// Get recipe suggestions based on pantry contents using Spoonacular API
export const getRecipeSuggestions = async (ingredients) => {
  try {
    const response = await axios.get(API_ENDPOINTS.RECIPE_SUGGESTIONS, {
      params: {
        query: ingredients.join(', '),
        number: 5, // Number of recipes to return
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error getting recipe suggestions:', error);
    throw new Error('Error getting recipe suggestions');
  }
};
