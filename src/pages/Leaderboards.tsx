import React from 'react'
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonMenuButton } from '@ionic/react'

function Leaderboards() {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Papan Peringkat</IonTitle>
          <IonButtons slot="start">
            <IonMenuButton/>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Papan Peringkat</IonTitle>
          </IonToolbar>
        </IonHeader>
      </IonContent>
    </IonPage>
  )
}

export default Leaderboards;