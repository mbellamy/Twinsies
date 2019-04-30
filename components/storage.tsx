import { AsyncStorage } from 'react-native';
import { TImage } from './models';
import { StorageType, StorageKey } from './constants';


export class Storage {
//set data
_storeData = async (object: TImage[]) => {
    try {
      await AsyncStorage.setItem(`@${StorageType.general}:${StorageKey.images}`, JSON.stringify(object));
    } catch (error) {
      // Error saving data
    }
  };

//retrieve data
_retrieveData = async () => {
  try {
      const value = await AsyncStorage.getItem(`@${StorageKey.images}`);
      if (value !== null) {
      // We have data!!
      return value
      }
  } catch (error) {
      return error
      // Error retrieving data
  }
};



}