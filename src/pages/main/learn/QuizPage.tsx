import React, { useState, useContext, useEffect } from "react";
import {
  IonPage,
  IonHeader,
  IonContent,
  IonToolbar,
  IonTitle,
  IonGrid,
  IonRow,
  IonCol,
  IonButton,
  IonSpinner,
  IonLoading,
  IonText,
} from "@ionic/react";
import { useParams, useHistory } from "react-router";

import { LearnContext } from "../../../components/providers";
import ErrorContent from "../../../components/ErrorContent";
import { presentToast } from "../../../components/Toast";

import { shuffleSet } from "../../../functions";
import {
  updateUserLeaderBoardPoints,
  updateUserLearnProgress,
} from "../../../firebase";

import { Chapter, Question, Scoring } from "../../../models";

export default function QuizPage() {
  const { chapters }: { chapters: Chapter[] } = useContext(LearnContext);
  const [score, setScore] = useState<number>(0);

  const [busy, setBusy] = useState<boolean>(true);
  const [quiz, setQuiz] = useState<Question[]>([]);
  const [quizPassingScore, setQuizPassingScore] = useState<Scoring[]>([]);
  const [index, setIndex] = useState<number>(0);

  const [streak, setStreak] = useState<number>(0);

  const [busyUpdate, setBusyUpdate] = useState<boolean>(false);
  const [finish, setFinish] = useState<boolean>(false);

  const { chapter_id, subModule_id } = useParams();
  const history = useHistory();

  useEffect(() => {
    const chapter = chapters.find((chapter) => chapter.id === chapter_id);
    if (chapter) {
      const subModule = chapter.subModules.find(
        (subModule) => subModule.id === subModule_id
      );
      if (subModule) {
        if (subModule.quiz) {
          setQuiz([]);
          setQuizPassingScore([]);
          setQuiz(shuffleSet(subModule.quiz.contents, subModule.quiz.pick));
          setQuizPassingScore(subModule.quiz.passingScore);
        }
      }
    }
    setBusy(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (finish === true) {
      updateLearnProgress();
      setFinish(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function updateLearnProgress() {
    // Value Streak and Points
    // console.log("Score:", score, "Index: ", index, "Streak: ", streak);
    const newScore = score / (index + 1);
    const newStreak = streak;

    setBusyUpdate(true);

    let points = 0;
    let passed = false;

    for (let i = 0; i < quizPassingScore.length; i++) {
      if (newScore >= quizPassingScore[i].value) {
        points = quizPassingScore[i].points;
        passed = quizPassingScore[i].passed;
        break;
      }
    }

    setTimeout(() => {
      updateUserLearnProgress(
        subModule_id!,
        chapter_id!,
        newScore,
        passed,
        newStreak
      );
      // console.log(points);
      updateUserLeaderBoardPoints(points);
    }, 500);

    setTimeout(() => {
      setBusyUpdate(false);

      // Re-initialize states
      setScore(0);
      setIndex(0);
      setStreak(0);
      history.replace(`/learn/${chapter_id}`);
      // setQuiz([]);
      // setQuizPassingScore([]);
    }, 2000);
  }

  return (
    <IonPage>
      {busy ? (
        <IonSpinner />
      ) : quiz.length > 0 ? (
        <>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Quiz</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <IonLoading message={"Mohon Tunggu..."} isOpen={busyUpdate} />
            <IonGrid class="ion-padding quizContainer">
              <IonRow>
                <IonCol size="12" class="ion-text-center">
                  Skor : {score}
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol class="ion-text-center">
                  <h3>{quiz[index].question}</h3>
                </IonCol>
              </IonRow>
              {quiz[index].img ? (
                <IonRow>
                  <IonCol>
                    <img src={quiz[index].img?.url} alt="" />
                    {quiz[index].img?.caption ? (
                      <IonText>
                        <p>{quiz[index].img?.caption}</p>
                      </IonText>
                    ) : null}
                  </IonCol>
                </IonRow>
              ) : null}

              <IonRow>
                {shuffleSet(quiz[index].answers).map((answer, ind) => {
                  return (
                    <IonCol class="ion-no-padding" key={ind} size="12">
                      <IonButton
                        class="quizAnswerButton ion-text-wrap"
                        shape="round"
                        size="large"
                        expand="block"
                        onClick={() => {
                          if (answer.correct) {
                            setScore(score + 1);
                            setStreak(streak + 1);
                          } else {
                            setStreak(0);
                            presentToast(`Kurang tepat.`, 1500, `tertiary`);
                          }

                          if (index === quiz.length - 1) {
                            // console.log(quiz.contents.length, index)
                            setFinish(true);
                          } else {
                            setIndex(index + 1);
                            // console.log(index, 'lah');
                          }
                        }}
                      >
                        {answer.content}
                      </IonButton>
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
