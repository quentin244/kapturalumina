import * as firebase from "firebase/app";
import "firebase/database";
import "firebase/auth";
import { presentToast } from "./components/Toast";

require("dotenv").config();

const config = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

const fbase = firebase.initializeApp(config);

export default fbase;

export async function loginUser(userEmail: string, userPassword: string) {
  // Auth with firebase
  try {
    await fbase.auth().signInWithEmailAndPassword(userEmail, userPassword);
    return true;
  } catch (error) {
    presentToast(
      "Email atau Kata Sandi yang kamu masukkan salah. Silakan coba lagi.",
      4000,
      "warning"
    );
    return false;
  }

  // If present, use can access app
  // If not, error
}

export async function logoutUser() {
  try {
    await fbase.auth().signOut();
    presentToast("Anda telah keluar", 2500, "warning");
    return true;
  } catch (error) {
    return false;
  }
}

export async function registerUser(
  name: string,
  userEmail: string,
  userPassword: string
) {
  try {
    await fbase.auth().createUserWithEmailAndPassword(userEmail, userPassword);
    const user = fbase.auth().currentUser;
    user?.updateProfile({
      displayName: name,
    });
    if (user !== null) {
      fbase.database().ref("users").child(user.uid).set({
        id: user.uid,
        email: userEmail,
        name: name,
        level: 0,
      });
    }
    return true;
  } catch (error) {
    // TODO : try to handle error message in localized language
    presentToast(error.message, 4000, "warning");
    return false;
  }
}

export function getCurrentUser() {
  // return new Promise((resolve, reject) => {
  //   const unsubscribe = fbase.auth().onAuthStateChanged(function (user) {
  //     if (user) {
  //       resolve(user);
  //       return true;
  //     }
  //     reject(null);
  //     unsubscribe();
  //     return false;
  //   });
  // });

  const user = fbase.auth().currentUser;
  if (user) {
    return user;
  } else {
    return null;
  }
}

export function getCurrentUserProfileName() {
  const user = fbase.auth().currentUser;
  if (user) {
    return user.displayName;
  } else {
    return "Belum Login";
  }
}

export function updateUserLearnProgress(
  subModuleId: string,
  chapterId: string,
  score: number,
  passed: boolean,
  streak?: number
) {
  // const currentDate = new Date().toString();
  const user = fbase.auth().currentUser;
  let found = false;
  if (user !== null) {
    const userProgress = fbase
      .database()
      .ref("users/" + user.uid + "/progress");
    userProgress.on("value", (snap) => {
      if (snap.exists()) {
        // Check Previous Score
        // console.log("checking...");
        snap.forEach((row) => {
          if (
            row.val().subModuleId === subModuleId &&
            row.val().chapterId === chapterId
          ) {
            found = true;
            if (score > row.val().score) {
              fbase
                .database()
                .ref("users/" + user.uid + "/progress/" + row.key)
                .update({
                  score: score,
                  passed: passed,
                });
            }
          }
        });
      }
    });
    setTimeout(() => {
      if (!found) {
        // New
        userProgress.push({
          subModuleId: subModuleId,
          chapterId: chapterId,
          score: score,
          passed: passed,
        });
      }
    }, 1000);

    if (streak) {
      const userStreak = fbase
        .database()
        .ref("users")
        .child(user.uid)
        .child("streaks");
      userStreak.on("value", (snap) => {
        if (snap.exists()) {
          const lastStreak = streak;
          let newBestStreak: number, prevBestStreak: number;
          if (streak > snap.val().bestStreak) {
            newBestStreak = streak;
            prevBestStreak = snap.val().bestStreak;
            userStreak.update({
              bestStreak: newBestStreak,
              prevBestStreak: prevBestStreak,
              lastStreak: streak,
            });
          } else if (streak > snap.val().prevBestStreak) {
            prevBestStreak = streak;
            userStreak.update({
              prevBestStreak: prevBestStreak,
              lastStreak: streak,
            });
          } else {
            userStreak.update({
              lastStreak: streak,
            });
          }
        } else {
          userStreak.set({
            lastStreak: streak,
            prevBestStreak: streak,
            bestStreak: streak,
          });
        }
      });
      //
    }
  }
}
