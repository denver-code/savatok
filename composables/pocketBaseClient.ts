import PocketBase from 'pocketbase';
const pb = new PocketBase('http://192.168.1.207:8090/');

// 'https://sapi.savenko.tech/'
export const usePocketBaseClient = () => {
  return pb as PocketBase;
}
