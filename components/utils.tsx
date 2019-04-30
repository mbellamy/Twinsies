import  RNFS  from 'react-native-fs'

export class Util {

    //hash image so we dont have to send to server everytime
    _hashImage = (path: string) => {
        return RNFS.hash(path, 'md5')
    }

    _getImagehash = (path: string) => {
        return new Promise<string>((resolve, reject) => {
          this._hashImage(path)
            .then(hash => {
            resolve(hash)
          })
          .catch(err => {
            reject(err)
          })
        })
      }
    
}