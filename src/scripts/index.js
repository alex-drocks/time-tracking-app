import {format} from 'date-fns';
import {nanoid} from 'nanoid';


window.addEventListener("DOMContentLoaded", () => {
  initApp();
});


const state = {
  timeTrackingData: [],
  timerIsActive: false,
  timerInterval: null,
  dateTimeStart: null,
  dateTimeEnd: null,
};


const html = {
  timeCounter: document.getElementById("timeCounter"),
  toggleTimerBtn: document.getElementById("toggleTimerBtn"),
  timeTrackingForm: document.getElementById("timeTrackingForm"),
  startTimeInput: document.getElementById("startTimeInput"),
  endTimeInput: document.getElementById("endTimeInput"),
  timeTrackingRows: document.getElementById("timeTrackingRows"),
  resetApplication: document.getElementById("resetApplication"),
};


function initApp() {
  registerEventHandlers();
  resetTimer();
  loadTimeTrackingData();
}


function registerEventHandlers() {
  html.toggleTimerBtn.onclick = toggleTimer;
  html.timeTrackingForm.onsubmit = addTimeRow;
  html.timeTrackingForm.onreset = resetTimer;
  html.resetApplication.onclick = resetApplication;
}


function resetTimer() {
  state.timerInterval && clearInterval(state.timerInterval);

  state.timerIsActive = false;
  state.timerInterval = null;
  state.dateTimeStart = null;
  state.dateTimeEnd = null;

  html.toggleTimerBtn.className = "start-timer";
  html.startTimeInput.value = "";
  html.endTimeInput.value = "";
  html.timeCounter.textContent = "0h 0m 0s";
}


function toggleTimer() {
  if (state.timerIsActive) {
    stopTimer();
    state.timerIsActive = false;
  } else {
    startTimer();
    state.timerIsActive = true;
  }
}


function startTimer() {
  const now = new Date();
  state.dateTimeStart = now;
  state.timerInterval = setInterval(updateTimerDisplay, 1000);
  html.startTimeInput.value = format(now, "yyyy-MM-dd'T'kk:mm");
  html.toggleTimerBtn.className = "stop-timer";
}


function stopTimer() {
  state.timerInterval && clearInterval(state.timerInterval);
  const now = new Date();
  state.dateTimeEnd = now;
  html.endTimeInput.value = format(now, "yyyy-MM-dd'T'kk:mm");
  addTimeRow(null);

  html.toggleTimerBtn.className = "start-timer";
}


function updateTimerDisplay() {
  const now = new Date();
  // const hours = differenceInHours(now, state.dateTimeStart);
  // const mins = differenceInMinutes(now, state.dateTimeStart);
  // const secs = differenceInSeconds(now, state.dateTimeStart);

  let diffTime = now.valueOf() - state.dateTimeStart.valueOf();
  let days = diffTime / (24 * 60 * 60 * 1000);
  let hours = (days % 1) * 24;
  let minutes = (hours % 1) * 60;
  let secs = (minutes % 1) * 60;
  [days, hours, minutes, secs] = [Math.floor(days), Math.floor(hours), Math.floor(minutes), Math.floor(secs)];

  html.timeCounter.textContent = `${hours}h ${minutes}m ${secs}s`;
}


function addTimeRow(event = null) {
  event?.preventDefault(); // do not reload browser page when its a form submit event
  const formData = new FormData(html.timeTrackingForm);

  const startTime = new Date(formData.get("startTime").toString());
  const endTime = new Date(formData.get("endTime").toString());
  const totalHours = calculateElapsedHours(endTime, startTime);

  const timeTrackingDataRow = {
    startTime: format(startTime, "yyyy-MM-dd, kk:mm"),
    endTime: format(endTime, "yyyy-MM-dd, kk:mm"),
    totalHours: totalHours,
  };

  state.timeTrackingData.push(timeTrackingDataRow);
  createTimeRowElement(timeTrackingDataRow);
  saveTimeTrackingData(timeTrackingDataRow);
}


function deleteTimeRow(rowElement) {
  rowElement.remove();
}


function createTimeRowElement(timeTrackingDataRow) {
  const row = document.createElement("tr");
  const uniqueId = nanoid();
  row.id = `timeRow-${uniqueId}`;

  const start = document.createElement("td");
  start.id = `startTime-${uniqueId}`;
  start.className = "start-time";
  start.textContent = timeTrackingDataRow.startTime;

  const end = document.createElement("td");
  end.id = `endTime-${uniqueId}`;
  end.className = "end-time";
  end.textContent = timeTrackingDataRow.endTime;

  const total = document.createElement("td");
  total.id = `totalHours-${uniqueId}`;
  total.className = "total-hours";
  total.textContent = timeTrackingDataRow.totalHours;

  const deleteBtn = document.createElement("td");
  deleteBtn.className = "delete-btn";
  deleteBtn.id = `deleteBtn-${uniqueId}`;
  deleteBtn.innerHTML = `<svg class="delete-btn-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M3 6v18h18V6H3zm5 14c0 .552-.448 1-1 1s-1-.448-1-1V10c0-.552.448-1 1-1s1 .448 1 1v10zm5 0c0 .552-.448 1-1 1s-1-.448-1-1V10c0-.552.448-1 1-1s1 .448 1 1v10zm5 0c0 .552-.448 1-1 1s-1-.448-1-1V10c0-.552.448-1 1-1s1 .448 1 1v10zm4-18v2H2V2h5.711c.9 0 1.631-1.099 1.631-2h5.315c0 .901.73 2 1.631 2H22z"/></svg>`;
  deleteBtn.onclick = () => deleteTimeRow(row);

  row.append(start, end, total, deleteBtn);
  html.timeTrackingRows.append(row);
}


function calculateElapsedHours(dateEnd, dateStart) {
  const differenceInMilliseconds = dateEnd.getTime() - dateStart.getTime();
  return roundToX(differenceInMilliseconds / 3600000, 2);
}


function roundToX(num, X) {
  return +(Math.round(num + "e+" + X) + "e-" + X);
}


function saveTimeTrackingData() {
  localStorage.setItem("time-tracking-data", JSON.stringify(state.timeTrackingData));
}


function loadTimeTrackingData() {
  const savedData = localStorage.getItem("time-tracking-data");
  if (savedData) {
    const dataRows = JSON.parse(savedData);
    if (Array.isArray(dataRows)) {
      state.timeTrackingData = dataRows;
      dataRows.forEach(dataRow => {
        createTimeRowElement(dataRow);
      });
    }
  }
}


function resetApplication() {
  localStorage.removeItem("time-tracking-data");
  window.location.reload();
}
