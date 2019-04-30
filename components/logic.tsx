import React from "react";
import ImagePicker from 'react-native-image-crop-picker';
import { Network } from "./network";

export class Images {
    //show image picker
    _showCameraPicker = () => {
      return ImagePicker.openPicker({
        width: 300,
        height: 400,
        includeBase64: true,
      })
    }

    _showLibraryPicker = () => {
      return ImagePicker.openCamera({
        includeBase64: true,
      })
    }
}