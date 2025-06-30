import * as CryptoJS from 'crypto-js';

const SECRET_KEY = process.env.AES_SECRET_KEY; 


export const AES = {
  encrypt: (data: any): string => {
    const json = typeof data === 'string' ? data : JSON.stringify(data);
    return CryptoJS.AES.encrypt(json, SECRET_KEY).toString();
  },

  decrypt: (cipherText: string): string => {
    const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  },
};
