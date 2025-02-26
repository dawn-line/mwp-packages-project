import * as CryptoJS from 'crypto-js';

const key = 'yearrow88227793@';
const iv = '1234567887654321';

export const CryptoUtil = {
  /**
   * AES加密
   *
   * @param {string} text 要加密的文本
   * @return {string} 加密后的字符串
   */
  Encrypt(text: string): string {
    return CryptoJS.AES.encrypt(text, CryptoJS.enc.Utf8.parse(key), {
      iv: CryptoJS.enc.Utf8.parse(iv),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    }).toString();
  },

  /**
   * AES解密
   *
   * @param {string} text 要解密的文本
   * @return {string} 解密后的字符串
   */
  Decrypt(text: string): string {
    const decrypted = CryptoJS.AES.decrypt(text, CryptoJS.enc.Utf8.parse(key), {
      iv: CryptoJS.enc.Utf8.parse(iv),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    return decrypted.toString(CryptoJS.enc.Utf8);
  },
  /**
   * MD5加密
   * @param {string} msg
   * @return {*}  {string}
   */
  MD5(msg: string): string {
    return CryptoJS.MD5(msg).toString();
  },

  /**
   * HmacSHA512
   * @param {string} msg
   * @return {*}  {string}
   */
  HmacSHA512(msg: string, key: string): string {
    return CryptoJS.HmacSHA512(msg, key).toString();
  },
};
