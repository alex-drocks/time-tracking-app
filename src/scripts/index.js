import {nanoid} from 'nanoid';

window.addEventListener("DOMContentLoaded", async () => {
  await console.log("DOMContentLoaded");
  registerEventHandlers();
});


const html = {
  timeTrackingForm: document.getElementById("timeTrackingForm"),
  timeTrackingRows: document.getElementById("timeTrackingRows"),
};


function registerEventHandlers() {
  html.timeTrackingForm.onsubmit = addTimeRow;
}


function addTimeRow(ev) {
  ev.preventDefault(); // do not reload browser page
  const formData = new FormData(html.timeTrackingForm);
  const startTime = new Date(formData.get("startTime").toString());
  const endTime = new Date(formData.get("endTime").toString());
  const totalHours = getTimeDifferenceInHours(endTime, startTime);
  createTimeRowElement(startTime, endTime, totalHours);
}


function deleteTimeRow(rowElement) {
  console.log(rowElement);
  rowElement.remove();
}


function createTimeRowElement(startTime, endTime, totalHours) {
  const row = document.createElement("tr");
  const uniqueId = nanoid();
  row.id = `timeRow-${uniqueId}`;

  const start = document.createElement("td");
  start.id = `startTime-${uniqueId}`;
  start.textContent = formatDate(startTime);

  const end = document.createElement("td");
  end.id = `endTime-${uniqueId}`;
  end.textContent = formatDate(endTime);

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
  const differenceInMilliseconds = dateEnd.getTime() - dateStart.getTime();
  return roundToX(differenceInMilliseconds / 3600000, 2);
}


function roundToX(num, X) {
  return +(Math.round(num + "e+" + X) + "e-" + X);
}


function formatDate(date) {
  return date.toLocaleTimeString("fr-CA", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour12: false,
    hour: "2-digit",
    minute: "2-digit"
  });
}
