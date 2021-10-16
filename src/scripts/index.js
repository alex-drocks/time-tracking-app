import {differenceInMilliseconds, format} from 'date-fns';
import {nanoid} from 'nanoid';


window.addEventListener("DOMContentLoaded", () => {
  initApp();
});


const state = {
  timerIsActive: false
};


const html = {
  toggleTimerBtn: document.getElementById("toggleTimerBtn"),
  timeTrackingForm: document.getElementById("timeTrackingForm"),
  startTimeInput: document.getElementById("startTimeInput"),
  endTimeInput: document.getElementById("endTimeInput"),
  timeTrackingRows: document.getElementById("timeTrackingRows"),
};

const playSVG = `<svg class="play" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M3 22V2l18 10L3 22z"/></svg>`;
const stopSVG = `<svg class="stop" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M2 2h20v20H2z"/></svg>`;


function initApp() {
  html.toggleTimerBtn.className = "play";
  html.toggleTimerBtn.innerHTML = playSVG;
  html.startTimeInput.value = "";
  html.endTimeInput.value = "";
  registerEventHandlers();
}


function registerEventHandlers() {
  html.toggleTimerBtn.onclick = toggleTimer;
  html.timeTrackingForm.onsubmit = addTimeRow;
}


function toggleTimer() {
  // YYYY-MM-DDThh:mm
  const validDateString = format(new Date(), "yyyy-MM-dd'T'kk:mm");
  if (state.timerIsActive) {
    html.endTimeInput.value = validDateString;
    html.toggleTimerBtn.className = "play";
    html.toggleTimerBtn.innerHTML = playSVG;
    state.timerIsActive = false;
    addTimeRow(null);
  } else {
    html.startTimeInput.value = validDateString;
    html.toggleTimerBtn.className = "stop";
    html.toggleTimerBtn.innerHTML = stopSVG;
    state.timerIsActive = true;
  }
}


function addTimeRow(event = null) {
  event?.preventDefault(); // do not reload browser page when its a form submit event
  const formData = new FormData(html.timeTrackingForm);
  const startTime = new Date(formData.get("startTime").toString());
  const endTime = new Date(formData.get("endTime").toString());
  const totalHours = getTimeDifferenceInHours(endTime, startTime);
  createTimeRowElement(startTime, endTime, totalHours);
}


function deleteTimeRow(rowElement) {
  rowElement.remove();
}


function createTimeRowElement(startTime, endTime, totalHours) {
  const row = document.createElement("tr");
  const uniqueId = nanoid();
  row.id = `timeRow-${uniqueId}`;

  const start = document.createElement("td");
  start.id = `startTime-${uniqueId}`;
  start.textContent = format(startTime, "yyyy-MM-dd @ kk:mm");

  const end = document.createElement("td");
  end.id = `endTime-${uniqueId}`;
  end.textContent = format(endTime, "yyyy-MM-dd @ kk:mm");

  const total = document.createElement("td");
  total.id = `totalTime-${uniqueId}`;
  total.textContent = totalHours;

  const deleteBtn = document.createElement("td");
  deleteBtn.className = "delete-btn";
  deleteBtn.id = `deleteBtn-${uniqueId}`;
  deleteBtn.innerHTML = `<svg class="delete-btn-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M3 6v18h18V6H3zm5 14c0 .552-.448 1-1 1s-1-.448-1-1V10c0-.552.448-1 1-1s1 .448 1 1v10zm5 0c0 .552-.448 1-1 1s-1-.448-1-1V10c0-.552.448-1 1-1s1 .448 1 1v10zm5 0c0 .552-.448 1-1 1s-1-.448-1-1V10c0-.552.448-1 1-1s1 .448 1 1v10zm4-18v2H2V2h5.711c.9 0 1.631-1.099 1.631-2h5.315c0 .901.73 2 1.631 2H22z"/></svg>`;
  deleteBtn.onclick = () => deleteTimeRow(row);

  row.append(start, end, total, deleteBtn);
  html.timeTrackingRows.append(row);
}


function getTimeDifferenceInHours(dateEnd, dateStart) {
  return roundToX(differenceInMilliseconds(dateEnd, dateStart) / 3600000, 2);
}


function roundToX(num, X) {
  return +(Math.round(num + "e+" + X) + "e-" + X);
}
