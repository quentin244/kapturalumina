import React from "react";
import {
  IonMenu,
  IonContent,
  IonList,
  IonListHeader,
  IonMenuToggle,
  IonItem,
  IonLabel,
  IonIcon,
  IonText,
  IonTextarea,
} from "@ionic/react";
import "./SideMenu.css";
import {
  homeSharp,
  listSharp,
  personSharp,
  logInSharp,
  logOutSharp,
  codeSharp,
  informationCircleSharp,
  openSharp,
} from "ionicons/icons";
import { logoutUser } from "../firebaseConfig";
import { Redirect, withRouter } from "react-router";
import RegisterPage from "../pages/RegisterPage";
import { presentToast } from "./Toast";

function SideMenu(props: any) {
  function logout(){
    logoutUser().then(
      props.history.push('/login')
    );
    presentToast('Anda telah keluar.');
  }

  return (
    <IonMenu type="overlay" contentId="main">
      <IonContent>
        <IonList lines="none">
          <IonListHeader>📷ShootNow</IonListHeader>
          <IonMenuToggle auto-hide="false">
            <IonItem routerLink="/main/home">
              <IonIcon slot="start" icon={homeSharp} />
              <IonLabel>Home</IonLabel>
            </IonItem>
          </IonMenuToggle>
          <IonMenuToggle auto-hide="false">
            <IonItem routerLink="/main/leaderboards">
              <IonIcon slot="start" icon={listSharp} />
              <IonLabel>Papan Peringkat</IonLabel>
            </IonItem>
          </IonMenuToggle>
          <IonMenuToggle auto-hide="false">
            <IonItem routerLink="/main/profile">
              <IonIcon slot="start" icon={personSharp} />
              <IonLabel>Profil</IonLabel>
            </IonItem>
          </IonMenuToggle>
        </IonList>
        <IonList lines="none">
          <IonListHeader>Akun</IonListHeader>
          <IonMenuToggle auto-hide="false">
            <IonItem onClick={logout}>
              <IonIcon slot="start" icon={logOutSharp} />
              <IonLabel>Keluar</IonLabel>
            </IonItem>
          </IonMenuToggle>
        </IonList>
        <IonList lines="none">
          <IonListHeader>Hello</IonListHeader>
          <IonMenuToggle auto-hide="false">
            <IonItem routerLink="/about">
              <IonIcon slot="start" icon={informationCircleSharp} />
              <IonLabel>Tentang ShootNow</IonLabel>
            </IonItem>
          </IonMenuToggle>
          <IonItem>
            <p
              style={{
                letterSpacing: "0.1em",
                fontWeight: 450,
                fontSize: "0.8em",
              }}
            >
              Jika Anda telah mencoba menggunakan aplikasi ini, silakan mengisi
              form di bawah ini. Terima Kasih
            </p>
          </IonItem>
          <IonItem onClick={() => window.open("https://google.com")}>
            <IonIcon slot="start" icon={openSharp} />
            <IonLabel>Isi Form</IonLabel>
          </IonItem>
        </IonList>
      </IonContent>
    </IonMenu>
  );
}

export default withRouter(SideMenu);