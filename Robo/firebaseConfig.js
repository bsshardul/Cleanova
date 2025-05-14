// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase, ref, set, push, remove, onValue } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyD_M6yuzszdfPpG5eawvi-pUE939AqASfA",
  authDomain: "impetus2025.firebaseapp.com",
  projectId: "impetus2025",
  storageBucket: "impetus2025.appspot.com",
  messagingSenderId: "309126068158",
  appId: "1:309126068158:web:9ec4358e71313b9377ebef",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
//export const auth = getAuth(app);
const database = getDatabase(app); 

export { auth };
export { database, ref, set, push, remove, onValue };
