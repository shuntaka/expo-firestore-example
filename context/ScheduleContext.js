import CreateDataContext from "./CreateDataContext";
import * as firebase from "firebase";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_SCHEDULE":
      return action.payload;
    default:
      return state;
  }
};

const fetchSchedules = (dispatch) => async (dateRange) => {
  const begginDateString = dateRange.begginDate.getTime();
  const endDateString = dateRange.endDate.getTime();
  const db = firebase.firestore();

  let snapShot = await db
    .collection("teachername_schedules")
    .orderBy("lessonDate", "asc")
    .startAt(begginDateString)
    .endAt(endDateString)
    .get();

  const data = snapShot.docs.map((doc) => {
    return doc.data();
  });

  // let allBookings = await bookingsRef.get();
  // for (const doc of allBookings.docs) {
  //   schedules.push(doc);
  //   console.log((doc.id, "=>", doc.data()));
  //   console.log(schedules);
  // }
  // console.log(schedules);
  dispatch({ type: "FETCH_SCHEDULE", payload: data });

  // const querySnapshot = await db.collection("高宮 葉月_booking").get();
  // querySnapshot.forEach((doc) => schedule.push(doc));
  // dispatch({ type: "FETCH_SCHEDULE", payload: schedule });

  // const schedule = ["schedule1", "schedule2"];
  // dispatch({ type: "FETCH_SCHEDULE", payload: schedule });
};

export const { Context, Provider } = CreateDataContext(
  reducer,
  { fetchSchedules },
  []
);
