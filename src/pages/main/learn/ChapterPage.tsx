import React, { useEffect, useContext, useState } from "react";
import {
  IonPage,
  IonHeader,
  IonContent,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonText,
  IonSpinner,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonIcon,
  IonGrid,
  IonRow,
  IonCol,
} from "@ionic/react";
import { playCircle, checkmarkCircle, reloadCircle } from "ionicons/icons";
import { withRouter, useParams } from "react-router";

import ErrorContent from "../../../components/ErrorContent";
import {
  LearnContext,
  UserProgressContext,
} from "../../../components/providers";

import { Chapter } from "../../../models";

function ChapterPage() {
  const { chapters } = useContext(LearnContext);
  const { progress } = useContext(UserProgressContext);

  const [chapter, setChapter] = useState<Chapter>();
  const [busy, setBusy] = useState<boolean>(true);

  const { chapter__id } = useParams();

  useEffect(() => {
    setChapter(chapters.find((chapter) => chapter.id === chapter__id));
    setBusy(false);
  }, [chapters, progress, chapter__id]);

  return (
    <IonPage>
      {busy ? (
        <IonSpinner />
      ) : chapter ? (
        <>
          <IonHeader>
            <IonToolbar>
              <IonButtons slot="start">
                <IonBackButton />
              </IonButtons>
              <IonTitle>{chapter.title}</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonContent class="ion-padding">
            <IonGrid>
              <IonRow>
                {chapter.subModules.map((subModule, index) => {
                  let bestScore = null;
                  let locked = index === 0 ? false : true;
                  let passed = false;

                  progress.forEach((progress) => {
                    if (
                      progress.chapterId === chapter.id &&
                      progress.subModuleId === chapter.subModules[index].id
                    ) {
                      bestScore = progress.score;
                      passed = progress.passed;
                    }
                    if (index > 0) {
                      if (
                        progress.subModuleId ===
                          chapter.subModules[index - 1].id &&
                        progress.passed === true
                      ) {
                        locked = false;
                      }
                    }
                  });

                  return (
                    <IonCol
                      class="ion-align-items-center"
                      sizeXs="12"
                      sizeSm="6"
                      key={index}
                    >
                      <IonCard
                        disabled={locked}
                        routerLink={`/learn/${chapter.id}/${subModule.id}`}
                      >
                        <img src={subModule.thumbnail} alt={subModule.title} />
                        <IonCardHeader>
                          <IonCardTitle>{subModule.title}</IonCardTitle>
                          <IonCardSubtitle>
                            {subModule.subtitle}
                          </IonCardSubtitle>
                        </IonCardHeader>
                        <IonCardContent>
                          {bestScore !== null ? (
                            <IonText class="">
                              <h3 style={{ verticalAlign: "middle" }}>
                                {passed ? (
                                  <IonIcon
                                    icon={checkmarkCircle}
                                    color="success"
                                    size="large"
                                  />
                                ) : (
                                  <IonIcon
                                    icon={reloadCircle}
                                    color="warning"
                                    size="large"
                                  />
                                )}
                                {subModule.quiz ? (
                                  <>
                                    <p>Best Score : {bestScore * 100}%</p>
                                    {passed ? null : (
                                      <p>
                                        Dapatkan skor kuis yang lebih baik untuk
                                        membuka modul berikutnya.
                                      </p>
                                    )}
                                  </>
                                ) : null}
                              </h3>
                            </IonText>
                          ) : (
                            <IonIcon
                              icon={playCircle}
                              color="primary"
                              size="large"
                            />
                          )}
                        </IonCardContent>
                      </IonCard>
                    </IonCol>
                  );
                })}
              </IonRow>
            </IonGrid>
          </IonContent>
        </>
      ) : (
        <ErrorContent />
      )}
    </IonPage>
  );
}

export default withRouter(ChapterPage);
