/* eslint-disable @typescript-eslint/no-empty-function */
import { customAlphabet, nanoid } from 'nanoid';
import * as os from 'os';

interface MapFields {
  [key: string]: string;
}

export const CommonUtil = {
  // 生产环境警用console
  disableConsole: function (): any {
    const originalConsole = { ...console };
    console.log = () => {};
    console.error = () => {};
    console.warn = () => {};
    console.info = () => {};
    console.debug = () => {};
    return originalConsole;
  },

  nanoidKey: function (size = 10): string {
    return nanoid(size);
  },

  idGenerate: function (): string {
    return nanoid();
  },

  idArrGenerate(arrLength: number): string[] {
    const idArr = [];
    for (let index = 0; index < arrLength; index++) {
      idArr.push(nanoid());
    }
    return idArr;
  },

  getRandomString(length: number): string {
    const placeholder =
      '1234567890qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM';
    const customNanoid = customAlphabet(placeholder, length);
    return customNanoid();
  },

  getRandomCode(length: number): string {
    const placeholder = '1234567890';
    const customNanoid = customAlphabet(placeholder, length);
    return customNanoid();
  },

  getVerSion(): number {
    return new Date().getTime();
  },

  getIPAdress() {
    const networkInterfaces = os.networkInterfaces();
    for (const devname in networkInterfaces) {
      const iface = networkInterfaces[devname];
      if (iface) {
        for (let index = 0; index < iface.length; index++) {
          const alias = iface[index];
          if (
            alias.family === 'IPv4' &&
            alias.address !== '127.0.0.1' &&
            !alias.internal
          ) {
            return alias.address;
          }
        }
      }
    }
  },

  getMac() {
    const networkInterfaces = os.networkInterfaces();
    for (const devname in networkInterfaces) {
      const iface = networkInterfaces[devname];
      if (iface) {
        for (let index = 0; index < iface.length; index++) {
          const alias = iface[index];
          if (
            alias.family === 'IPv4' &&
            alias.address !== '127.0.0.1' &&
            !alias.internal
          ) {
            return alias.mac;
          }
        }
      }
    }
  },

  transRecords(records: any[]): any[] {
    const mapFields: MapFields = {};
    if (records && records.length > 0) {
      const record = records[0];
      for (const field in record) {
        const prop = field.toLowerCase();
        if (field !== prop) {
          mapFields[field] = prop;
        }
      }

      records.forEach((record) => {
        for (const field in mapFields) {
          record[mapFields[field]] = record[field];
          delete record[field];
        }
      });
    }
    return records;
  },
};
