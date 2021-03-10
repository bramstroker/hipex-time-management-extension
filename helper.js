const helper = {
  year: {},
  table: undefined,
  activeMonth: new Date().getMonth(),
  workingDays: 0,
  workingHours: 0,
  sumWorkingHours: undefined,
  activeYear: new Date().getUTCFullYear(),
  DAYS_SHORT: ["zo", "ma", "di", "wo", "do", "vr", "za"],
  DAYS_LONG: [
    "zondag",
    "maandag",
    "dinsdag",
    "woensdag",
    "donderdag",
    "vrijdag",
    "zaterdag",
  ],
  MONTHS_SHORT: [
    "jan",
    "feb",
    "maa",
    "apr",
    "mei",
    "jun",
    "jul",
    "aug",
    "sep",
    "okt",
    "nov",
    "dec",
  ],
  MONTHS_LONG: [
    "januari",
    "februari",
    "maart",
    "april",
    "mei",
    "juni",
    "juli",
    "augustus",
    "september",
    "oktober",
    "nov",
    "dec",
  ],
  getTimeInQuartersFormat(seconds) {
    const quarters = helper.getQuarters(seconds);
    const showQuarters =
      quarters % 4 ? "," + (quarters % 4) * 25 + " uur" : " uur";
    const showHours = Math.floor(quarters / 4) ? Math.floor(quarters / 4) : "0";
    return {
      hours: showHours,
      quarters: showQuarters,
    };
  },
  getQuarters(seconds) {
    return Math.floor(seconds / 900);
  },
  getTimeInHoursAndMinutes(seconds, dayValue) {
    let addition = "-";
    let showAddition = true;
    let color = "grey";
    const quarters = helper.getQuarters(seconds);
    if (quarters > 32) {
      addition = `<span class="additionSign">+</span>${quarters / 4 - 8}`;
      color = `green`;
    }
    if (quarters < 32) {
      addition = `
            <span class="additionSign">-</span>${8 - quarters / 4}
        `;
      color = `red`;
    }
    if (quarters === 32) {
      showAddition = false;
    }
    const RoundTime = `
        ${
          helper.getTimeInQuartersFormat(seconds).hours +
          helper.getTimeInQuartersFormat(seconds).quarters
        } 
    `;

    return `
    <th class="th-container">
        <span>
            <span class="date-styling">${
              dayValue.split("-")[0] +
              " " +
              helper.MONTHS_LONG[dayValue.split("-")[1]]
            }</span>
            <span class="time-styling"><i class="icon-time"></i> ${RoundTime}</span>
            <span class="addition-styling addition-styling-${color}" ${!showAddition ? 'style="display:none;"' : ''}>${addition}</span>
        </span>                
    </th>`;
  },
  amount(item){
    return item.roundTime;
  },
  sum(prev, next){
    return prev + next;
  },
  getDay(value) { return new Date(value).getDate(); },
  getDayInTheWeek(value) { return new Date(value).getDay(); },
  getMonth(value) { return new Date(value).getMonth(); },
  createOverview(totalHoursSum, totalHours, sumHours, percentage) {
    console.log(sumHours);
    return `
            <span class="overviewContainer">
                <span class="overviewContainerRow">
                    <span class="overview-title">Uren geschreven:</span>
                    <span class="overview-content">${totalHoursSum} uur</span>
                </span>
                <span class="overviewContainerRow">
                    <span class="overview-title">Totaal uren:</span>
                    <span class="overview-content">${totalHours} uur</span>
                </span>
                <span class="overviewContainerRow">
                    <span class="overview-title">${
                      sumHours > 0 ? "Overuren:" : "Uren te weinig:"
                    }</span>
                    <span class="overview-content ${
                      sumHours > 0
                        ? "overview-content-positive"
                        : "overview-content-negative"
                    }">${sumHours} uur</span>
                </span>
                <span class="overviewContainerRow">
                    <span class="overview-title">Percentage:</span>
                    <span class="overview-content ${
                      percentage > 100
                        ? "overview-title-positive"
                        : "overview-title-negative"
                    }">${percentage}%</span>
                </span>
            </span>
        `;
  },
  getAllData() {
    var xhr = new XMLHttpRequest();
    const url = 'https://service.hipex.io/time/data?';
    xhr.open(
      "GET",
      `${url}sEcho=1&iColumns=9&sColumns=&iDisplayStart=0&iDisplayLength=-1&mDataProp_0=__edit&mDataProp_1=startTime&mDataProp_2=endTime&mDataProp_3=time&mDataProp_4=roundTime&mDataProp_5=customer.__string&mDataProp_6=childCustomer.name&mDataProp_7=ticket&mDataProp_8=description&sSearch=&bRegex=false&sSearch_0=&bRegex_0=false&bSearchable_0=true&sSearch_1=&bRegex_1=false&bSearchable_1=true&sSearch_2=&bRegex_2=false&bSearchable_2=true&sSearch_3=&bRegex_3=false&bSearchable_3=true&sSearch_4=&bRegex_4=false&bSearchable_4=true&sSearch_5=&bRegex_5=false&bSearchable_5=true&sSearch_6=&bRegex_6=false&bSearchable_6=true&sSearch_7=&bRegex_7=false&bSearchable_7=true&sSearch_8=&bRegex_8=false&bSearchable_8=true&iSortCol_0=1&sSortDir_0=desc&iSortingCols=1&bSortable_0=false&bSortable_1=true&bSortable_2=true&bSortable_3=false&bSortable_4=false&bSortable_5=true&bSortable_6=true&bSortable_7=true&bSortable_8=true`,
      true
    );
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            window.localStorage.setItem('HOURS', xhr.responseText)
        }
    }
    xhr.send();
  }

};
