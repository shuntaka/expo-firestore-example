import React, { useEffect, useContext, useState } from "react";
import { Card, CardItem, List, ListItem, Text, Icon } from "native-base";
import {
  View,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  FlatList,
} from "react-native";

import { Context as ScheduleContext } from "../context/ScheduleContext";

import { findBegginEndDateForWeek } from "../utils/utils";

const sortSchedulesArray = (schedulesArray) => {
  schedulesArray.sort((a, b) => {
    return a.lessonDate - b.lessonDate;
  });
};

const groupSchedulesByDate = (schedules) => {
  const groupedSchedules = {};
  schedules.map((schedule) => {
    if (groupedSchedules[schedule.bookingDate] === undefined) {
      groupedSchedules[schedule.bookingDate] = [];
    }
    groupedSchedules[schedule.bookingDate].push(schedule);
    sortSchedulesArray(groupedSchedules[schedule.bookingDate]);
  });
  return groupedSchedules;
};

const HomeScreen = () => {
  const { state, fetchSchedules } = useContext(ScheduleContext);
  const [dateRange, setDateRange] = useState(
    findBegginEndDateForWeek(new Date())
  );
  const increaseDateRange = (week) => {
    const { begginDate, endDate } = dateRange;
    begginDate.setDate(begginDate.getDate() + 7 * week);
    endDate.setDate(endDate.getDate() + 7 * week);

    // console.log("begginDate is:", begginDate);
    // console.log("endDate is:", endDate);
    // console.log("newBegginDate is:", begginDate);
    // console.log("newEndDate is:", endDate);

    setDateRange({
      begginDate: begginDate,
      endDate: endDate,
    });
  };

  useEffect(() => {
    fetchSchedules(dateRange);
  }, [dateRange]);

  const groupedSchedulesObject = groupSchedulesByDate(state);
  // console.log(groupedSchedulesObject);

  console.log(dateRange);

  let flattenedGroupedSchedules = [];
  const dateKeys = Object.keys(groupedSchedulesObject);
  dateKeys.map((dateKey) => {
    flattenedGroupedSchedules.push({
      dateKey: dateKey,
      data: groupedSchedulesObject[dateKey],
    });
  });

  flattenedGroupedSchedules.sort((a, b) => {
    a.data[0].lessonDate - b.data[0].lessonDate;
  });
  console.log(flattenedGroupedSchedules);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.dateRangeControll}>
        <View style={styles.backward}>
          <TouchableOpacity
            style={styles.coveringTouchableOpacity}
            onPress={() => {
              increaseDateRange(-1);
            }}
          >
            <Icon
              type="AntDesign"
              name="leftcircleo"
              style={{ fontSize: 30 }}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.forward}>
          <TouchableOpacity
            style={styles.coveringTouchableOpacity}
            onPress={() => {
              increaseDateRange(1);
            }}
          >
            <Icon
              type="AntDesign"
              name="rightcircleo"
              style={{ fontSize: 30 }}
            />
          </TouchableOpacity>
        </View>
      </View>
      {state.length > 0 ? (
        <View style={styles.schedulesContainer}>
          <FlatList
            data={flattenedGroupedSchedules}
            keyExtractor={(item) => item.dateKey}
            renderItem={({ item }) => {
              return (
                <Card>
                  <CardItem header>
                    <Text>{item.dateKey}</Text>
                  </CardItem>
                  <List>
                    {item.data.map((schedule) => {
                      return (
                        <ListItem
                          key={`${schedule.lessonDate}_${schedule.kidName}`}
                        >
                          <Text>
                            {`${schedule.bookingTime}   `}
                            {`${schedule.kidName} `}
                            {`(${schedule.course}) `}
                          </Text>
                        </ListItem>
                      );
                    })}
                  </List>
                </Card>
              );
            }}
          />
        </View>
      ) : (
        <View style={styles.loading}>
          <Text>loading</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    // borderColor: "red",
    // borderWidth: 5,
    flex: 1,
    // backgroundColor: "#fff",
    alignItems: "stretch",
    // alignItems: "center",
    justifyContent: "flex-start",
    margin: 20,
  },
  dateRangeControll: {
    // borderColor: "red",
    // borderWidth: 5,
    flexDirection: "row",
    flex: 1,
  },
  backward: {
    flex: 1,
    // borderColor: "pink",
    // borderWidth: 5,
  },
  forward: {
    flex: 1,
    // borderColor: "purple",
    // borderWidth: 5,
  },

  schedulesContainer: {
    // borderColor: "blue",
    // borderWidth: 5,
    flex: 10,
  },
  loading: {
    flex: 10,
  },

  coveringTouchableOpacity: {
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "stretch",
    height: "100%",
  },
});

export default HomeScreen;
