import * as CryptoJS from 'crypto-js';
export const md5 = function (msg: string): string {
  return CryptoJS.MD5(msg).toString();
};
