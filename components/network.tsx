import {Buffer} from 'buffer'
import { _apiKey } from './keys';

export class Network {
    _apiKey = _apiKey
    _baseUrl = 'https://eastus.api.cognitive.microsoft.com/face/v1.0/'
    _detect = 'detect?detect?returnFaceId=true'
    _verify = 'verify'


    //send to server to check for faces
    _sendImageForDetection = (base64: string) => {
        const buffer = Buffer.from(base64, 'base64')
        return fetch(this._baseUrl + this._detect , {
            method: 'POST',
            headers: {
                Accept: 'application/octet-stream',
                'Content-Type': 'application/octet-stream',
                'Ocp-Apim-Subscription-Key': this._apiKey
            },
            body: buffer,
            });
       
    }

    //send to server to compare images
    _compareImages = (faceId1: string, faceId2: string) => {
        return fetch(this._baseUrl + this._verify , {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Ocp-Apim-Subscription-Key': this._apiKey
            },
            body: JSON.stringify({faceId1: faceId1, faceId2: faceId2}),
            });
    }
}