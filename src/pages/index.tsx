import { useState } from "react";
import moment from "moment";
import "moment/locale/zh-cn";
import type { Moment } from "moment";
import styles from "./index.module.less";

moment.updateLocale('zh-cn', {
  week: {
    dow: 7, // 周日为一周的起始日
  },
})

const MiniCalendar = () => {
  const [currentDate, setCurrentDate] = useState(moment());
  const [selectedDate, setSelectedDate] = useState<null | Moment>(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [events, setEvents] = useState<Record<string, string>>({}); // 所有事件
  const [currentEvent, setCurrentEvent] = useState("");
  const [slideDirection, setSlideDirection] = useState("");

  const generateCalendarData = () => {
    const startDay = currentDate.clone().startOf("month").startOf("week");
    const endDay = currentDate.clone().endOf("month").endOf("week");
    const days = [];

    let day = startDay.clone();
    while (day.isSameOrBefore(endDay)) {
      days.push(day.clone());
      day.add(1, "day");
    }

    return days;
  };

  const handleDateSelect = (date: Moment) => {
    setSelectedDate(date);
    setShowEventModal(true);
  };

  const handleMonthChange = (direction: number) => {
    setSlideDirection(direction > 0 ? "slide-left" : "slide-right");
    setTimeout(() => {
      setCurrentDate(currentDate.clone().add(direction, "month"));
      setTimeout(() => {
        setSlideDirection("");
      }, 300);
    }, 10);
  };

  const saveEvent = () => {
    if (currentEvent.trim() && selectedDate) {
      const dateKey = selectedDate.format("YYYY-MM-DD");
      setEvents((prev) => ({
        ...prev,
        [dateKey]: currentEvent,
      }));
    }
    setCurrentEvent("");
    setShowEventModal(false);
  };

  const hasEvent = (date: Moment) => {
    return !!events[date.format("YYYY-MM-DD")];
  };

  const getEventForDate = (date: Moment) => {
    return events[date.format("YYYY-MM-DD")];
  };

  console.log("generateCalendarData()", generateCalendarData());

  return (
    <div className={styles.calendarContainer}>
      <div className={styles.calendar}>
        <div className={styles.header}>
          <button
            className={styles.navButton}
            onClick={() => handleMonthChange(-1)}
          >
            ←
          </button>
          <h2 className={styles.monthYear}>
            {currentDate.format("YYYY年 MM月")}
          </h2>
          <button
            className={styles.navButton}
            onClick={() => handleMonthChange(1)}
          >
            →
          </button>
        </div>

        <div className={styles.weekdays}>
          {moment.weekdaysShort(true).map((day, i) => (
            <div key={day} className={styles.weekday}>
              {day.replace('周', '')}
            </div>
          ))}
        </div>

        <div className={`${styles.daysWrapper} ${styles[slideDirection]}`}>
          <div className={styles.days}>
            {generateCalendarData().map((date, index) => (
              <div
                key={index}
                className={`${styles.day} 
                  ${
                    date.month() !== currentDate.month()
                      ? styles.otherMonth
                      : ""
                  }
                  ${
                    selectedDate && date.isSame(selectedDate, "day")
                      ? styles.selected
                      : ""
                  }
                  ${date.isSame(moment(), "day") ? styles.today : ""}`}
                onClick={() => handleDateSelect(date)}
              >
                <span className={styles.dayNumber}>{date.date()}</span>
                {hasEvent(date) && <span className={styles.eventDot}></span>}
              </div>
            ))}
          </div>
        </div>

        {selectedDate && (
          <div className={styles.selectedInfo}>
            当前选择的日期是：{selectedDate.format("YYYY-MM-DD")}
            {hasEvent(selectedDate) && (
              <div className={styles.eventInfo}>
                事件: {getEventForDate(selectedDate)}
              </div>
            )}
          </div>
        )}
      </div>

      {showEventModal && (
        <div className={styles.modal} onClick={() => setShowEventModal(false)}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <h3>添加事件{selectedDate ? selectedDate.format("YYYY年MM月DD日") : ''}</h3>
            <textarea
              className={styles.eventInput}
              value={currentEvent}
              onChange={(e) => setCurrentEvent(e.target.value)}
              placeholder="请输入事件内容"
            />
            <div className={styles.modalButtons}>
              <button
                className={styles.cancelButton}
                onClick={() => setShowEventModal(false)}
              >
                取消
              </button>
              <button className={styles.saveButton} onClick={saveEvent}>
                保存
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MiniCalendar;
