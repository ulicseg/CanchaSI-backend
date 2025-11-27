import { initializeApp } from "firebase-admin/app";
import { getDatabase } from "firebase-admin/database";
import { getFirestore } from "firebase-admin/firestore";

initializeApp();
export const db = getFirestore();
export const rtdb = getDatabase();
