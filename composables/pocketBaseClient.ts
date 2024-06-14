import PocketBase from 'pocketbase';
const pb = new PocketBase('http://140.238.84.114:8080');


export const usePocketBaseClient = () => {
  return pb as PocketBase;
}
