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
} from "@ionic/react";
import { Chapter, Quiz, Question, Scoring } from "../models/chapters";
import { LearnContext } from "../components/providers/LearnProvider";
import { updateUserLearnProgress } from "../firebaseConfig";
import ErrorContent from "../components/ErrorContent";
import shuffleSet from "../functions/shuffle";

export default function QuizPage(props: any) {
  const { chapters }: { chapters: Chapter[] } = useContext(LearnContext);
  const [score, setScore] = useState<number>(0);

  const [busy, setBusy] = useState<boolean>(true);
  const [quiz, setQuiz] = useState<Question[]>([]);
  const [quizPassingScore, setQuizPassingScore] = useState<Scoring[]>([]);
  const [index, setIndex] = useState<number>(0);

  const [streak, setStreak] = useState<number>(0);

  const [busyUpdate, setBusyUpdate] = useState<boolean>(false);
  const [finish, setFinish] = useState<boolean>(false);

  useEffect(() => {
    const chapter = chapters.find(
      (chapter) => chapter.id === props.match.params.chapterId
    );
    if (chapter) {
      const subModule = chapter.subModules.find(
        (subModule) => subModule.id === props.match.params.subModuleId
      );
      if (subModule) {
        if (subModule.quiz) {
          setQuiz(shuffleSet(subModule.quiz.contents, subModule.quiz.pick));
          setQuizPassingScore(subModule.quiz.passingScore);
        }
      }
    }
    setBusy(false);
  }, [chapters, props.match.params.chapterId, props.match.params.subModuleId]);

  useEffect(() => {
    if (finish === true) {
      updateLearnProgress();
      setFinish(false); //Re-initialize finish state
    }
  }, [finish]);

  function updateLearnProgress() {
    // Value Streak and Points
    console.log("Score:", score, "Index: ", index, "Streak: ", streak);
    const newScore = score / (index + 1);
    const newStreak = streak;

    setBusyUpdate(true);

    let points = 0;
    let passed = false;

    for(let i=0; i<quizPassingScore.length; i++){
      if (newScore >= quizPassingScore[i].value) {
        points = quizPassingScore[i].points 
        passed = quizPassingScore[i].passed
        break;
      }
    }

    setTimeout(()=>{
      updateUserLearnProgress(
        props.match.params.subModuleId,
        props.match.params.chapterId,
        newScore,
        passed,
        newStreak
      );
    }, 500);

    setTimeout(() => {
      setBusyUpdate(false);

      // Re-initialize states
      setScore(0);
      setIndex(0);
      setStreak(0);
      props.history.replace(`/learn/${props.match.params.chapterId}`);
      setQuiz([]);
      setQuizPassingScore([]);
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
            <IonGrid>
              <IonRow>
                <IonCol class="ion-text-center">Skor : {score}</IonCol>
              </IonRow>
              <IonRow>
                <IonCol class="ion-text-center">
                  <h3>{quiz[index].question}</h3>
                </IonCol>
              </IonRow>
              <IonRow>
                {shuffleSet(quiz[index].answers).map((answer, ind) => {
                  return (
                    <IonCol key={ind} size="12">
                      <IonButton
                        class="quizAnswerButton"
                        shape="round"
                        expand="block"
                        onClick={() => {
                          if (answer.correct) {
                            setScore(score + 1);
                            setStreak(streak + 1);
                          } else {
                            setStreak(0);
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
            {/* <IonAlert
              isOpen={alertSubmitQuiz}
              onDidDismiss={() => setAlertSubmitQuiz(false)}
              header="Quiz Selesai"
              message="Hebat! Yuk lanjutkan materi berikutnya."
              buttons={[
                {
                  text: "Lanjut",
                  handler: () =>
                    props.history.replace(
                      `/learn/${props.match.params.chapterId}`
                    ),
                },
              ]}
            /> */}
          </IonContent>
        </>
      ) : (
        <ErrorContent />
      )}
    </IonPage>
  );
}
