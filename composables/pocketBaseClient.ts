import PocketBase from 'pocketbase';
const pb = new PocketBase('https://sapi.savenko.tech/');


export const usePocketBaseClient = () => {
  return pb as PocketBase;
}
