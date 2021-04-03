let tableIsRendered = false;
const isProcessingElement = document.querySelector('#DataTables_Table_0_processing');
const observer = new MutationObserver(checkIfTableNeedsToBeRendered)
const observerTable = new MutationObserver(redrawTable);
observer.observe(isProcessingElement, { attributes: true })
observerTable.observe(isProcessingElement, { attributes: true });
checkIfTableNeedsToBeRendered();


window.setInterval(
  setCurrentWorkedTime,
  30000,
  document.querySelector('[name="start_time"]').value
);

function setCurrentWorkedTime(startTime) {
  const endTime = `${new Date().getHours()}:${
    (new Date().getMinutes() < 10 ? "0" : "") + new Date().getMinutes()
  }`;
  const startTimeHoursInMinutes = parseInt(startTime.split(":")[0]) * 60;
  const startTimeMinutes = parseInt(startTime.split(":")[1]);

  const endTimeHoursInMinutes = parseInt(endTime.split(":")[0]) * 60;
  const endTimeMinutes = parseInt(endTime.split(":")[1]);

  const totalEndTime = endTimeMinutes + endTimeHoursInMinutes;
  const totalStartTime = startTimeMinutes + startTimeHoursInMinutes;

  const differenceInMinutes = totalEndTime - totalStartTime;

  const hours = Math.floor(differenceInMinutes / 60);
  const minutes = differenceInMinutes % 60;

  const currentWorkedTimeContainer = document.createElement("div");
  currentWorkedTimeContainer.className = "currentWorkedTimeContainer";
  const statusTimeToday = document
    .querySelector(".tableRow")
    .querySelector(".th-container")
    .querySelector(".addition-styling").innerText;
  const checkIfNegative = statusTimeToday.includes("-");

  console.log(checkIfNegative);

  let retMinutes = 0;
  let retHours = 0;
  if (checkIfNegative) {
    statusTimeTodayWithoutNegative = statusTimeToday.replace("-", "");
    const timeMadeHoursInMinutes =
      parseInt(statusTimeTodayWithoutNegative.split(":")[0]) * 60;
    const timeMadeInMinutes = parseInt(
      statusTimeTodayWithoutNegative.split(":")[1]
    );
    const totalTimeMadeTodayInMinutes =
      timeMadeInMinutes + timeMadeHoursInMinutes;

    const needsToWorkInMinutes =
      totalTimeMadeTodayInMinutes - differenceInMinutes;

    retHours = Math.floor(needsToWorkInMinutes / 60);
    retMinutes = needsToWorkInMinutes % 60;
  }

  const dayOfTheWeek = helper.getDayInTheWeek(new Date());

  if (startTimeHoursInMinutes && endTimeHoursInMinutes && dayOfTheWeek < 6) {
    currentWorkedTimeContainer.innerHTML = `${hours}:${
      (minutes < 10 ? "0" : "") + minutes
    } gewerkt je moet nog: ${retHours}:${
      (retMinutes < 10 ? "0" : "") + retMinutes
    }`;
  }

  if (!document.querySelector(".currentWorkedTimeContainer")) {
    document
      .querySelector("#time-management")
      .insertBefore(currentWorkedTimeContainer, document.querySelector("hr"));
  } else {
    document.querySelector(
      ".currentWorkedTimeContainer"
    ).innerHTML = `${hours}:${
      (minutes < 10 ? "0" : "") + minutes
    } gewerkt je moet nog: ${retHours}:${
      (retMinutes < 10 ? "0" : "") + retMinutes
    }`;
  }
}


function checkIfTableNeedsToBeRendered() {
    if (!tableIsRendered && isProcessingElement.style.visibility ==='hidden') {
        helper.getAllData();  
        setTimeout(() => {
            renderTable();
            tableIsRendered = true;
        }, 500);
    }
}

function redrawTable() {
  helper.getAllData();    
  setTimeout(() => {
      renderTable();
  }, 500);
}

function renderTable() {
    const tbody = document.querySelector('tbody');
    const rows = tbody.querySelectorAll('tr');

    const days = [];
    const dayTotal = {};



    for (let i = 0; i < rows.length - 1; i++) {
      const from = rows[i].children[1];
      const till = rows[i].children[2];
      let amountOfHours,
        amountOfSeconds = 0;
      if (rows[i].children[3]) {
        amountOfHours =
          parseInt(rows[i].children[3].innerText.split(":")[0]) * 60 * 60;
        amountOfSeconds =
          parseInt(rows[i].children[3].innerText.split(":")[1]) * 60;
      }

      const totalOfSeconds = amountOfHours + amountOfSeconds;
      let dayOfRow = "";
      let monthOfRow = "";
      let dayMonthValue = "";
      dayOfRow = new Date(from.innerText).getDate();
      monthOfRow = new Date(from.innerText).getMonth();
      dayMonthValue = `${dayOfRow}-${monthOfRow}`;

      const preTableRow = document.createElement("tr");
      const preTableRowTd = document.createElement("th");
      preTableRowTd.classList.add("info-table");
      preTableRow.classList.add("tableRow");
      preTableRow.setAttribute("data-day", dayMonthValue);
      preTableRowTd.classList.add("tableRowTd");
      preTableRow.appendChild(preTableRowTd);
      if (dayTotal[dayMonthValue] === undefined) {
        dayTotal[dayMonthValue] = 0;
      }
      dayTotal[dayMonthValue] += totalOfSeconds;
      if (!days.find((value) => value === dayMonthValue)) {
        tbody.insertBefore(preTableRow, rows[i]);
        days.push(dayMonthValue);
      }
      from.innerText = new Date(from.innerText).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      till.innerText = new Date(till.innerText).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    const rowDays = document.querySelectorAll("[data-day]");
    for (let i = 0; i < rowDays.length; i++) {
      const dataDay = rowDays[i].getAttribute("data-day");
      document.querySelector(
        
        `[data-day='${dataDay}']`
      
      ).innerHTML = helper.getTimeInHoursAndMinutes(dayTotal[dataDay],  dataDay);
    }

    setCurrentWorkedTime(document.querySelector('[name="start_time"]').value);
    
}


// Hide elements (Options_page)
chrome.storage.local.get(
  ["hide_discount", "hide_billable", "hide_visible", "customer", "proceeding"],
  function (result) {
    const discount = document.querySelector(".input-append:nth-child(8)");
    const billable = document.querySelector(".checkbox[for='billible']");
    const visible = document.querySelector(".checkbox[for='visible']");
    const customerSelect = document.querySelector("[name='customer']");
    const proceedingSelect = document.querySelector("[name='proceeding']");
    if (result.hide_discount) {
      discount.style.display = "none";
    }
    if (result.hide_billable) {
      billable.style.display = "none";
    }
    if (result.hide_visible) {
      visible.style.display = "none";
    }
    if (result.customer) {
      customerSelect.value = result.customer;
    }
    if (result.proceeding) {
      proceedingSelect.value = result.proceeding;
    }
  }
);

