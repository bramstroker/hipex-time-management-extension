const isProcessingElement = document.querySelector('#DataTables_Table_0_processing');
const observer = new MutationObserver(() => {
    if (isProcessingElement.style.visibility ==='hidden') {
        renderTable();
    }
})

observer.observe(isProcessingElement, { attributes: true })

function renderTable() {
    const tbody = document.querySelector('tbody');
    const rows = tbody.querySelectorAll('tr');

    const days = [];
    const dayTotal = {};

    for (let i = 0; i < rows.length; i++) {

        const from = rows[i].children[1];
        const till = rows[i].children[2];
        const amountOfHours = parseInt(rows[i].children[3].innerText.split(':')[0]) * 60 * 60;
        const amountOfSeconds = parseInt(rows[i].children[3].innerText.split(':')[1]) * 60;
        const totalOfSeconds = amountOfHours + amountOfSeconds;

        const dayOfRow = new Date(from.innerText).getDate();
        const monthOfRow = new Date(from.innerText).getMonth();
        const dayMonthValue = `${dayOfRow}-${monthOfRow}`

        const preTableRow = document.createElement('tr');
        const preTableRowTd = document.createElement('th');
        preTableRow.classList.add('tableRow');
        preTableRow.setAttribute('data-day', dayMonthValue);
        preTableRowTd.classList.add('tableRowTd');
        preTableRow.appendChild(preTableRowTd);
        if (dayTotal[dayMonthValue] === undefined) {
            dayTotal[dayMonthValue] = 0;
        }
        dayTotal[dayMonthValue] += totalOfSeconds;
        if (!days.find((value) => value === dayMonthValue)) {
            tbody.insertBefore(preTableRow, rows[i]);
            days.push(dayMonthValue);
        }
        
        from.innerText = new Date(from.innerText).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});                
        till.innerText = new Date(till.innerText).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});                
    }

    const rowDays = document.querySelectorAll("[data-day]");
    for (let i = 0; i < rowDays.length; i++) {
        const dataDay = rowDays[i].getAttribute('data-day');
        document.querySelector(`[data-day='${dataDay}']`).innerHTML = getTimeInHoursAndMinutes(dayTotal[dataDay], dataDay);
    }
}


function getTimeInHoursAndMinutes(seconds, dayValue) {
    const quarters = Math.floor((seconds / 900));

    function getTimeInQuarters(quarters) {
        const showQuarters = quarters % 4 ? ',' + ((quarters % 4) * 25) + ' uur' : ' uur';
        const showHours = Math.floor(quarters/4) ? Math.floor(quarters/4) : '0';
        return {
            hours: showHours,
            quarters: showQuarters
        }
    }
    const hours = Math.floor(seconds / 3600);
    
    // console.log('hours', hours);
    // console.log('quarters', quarters);
    // console.log('quarters/4', quarters / 4);

    let addition = "-";
    let color = "grey";
    if (quarters > 32) {
        addition = `<span class="additionSign">+</span>${(quarters / 4) - 8}`;
    }
    if (quarters < 32) {
        addition = `
            <span class="additionSign">-</span>${8 - (quarters / 4)}
        `;
        color = `red`;
    }
    const RoundTime = getTimeInQuarters(quarters).hours + getTimeInQuarters(quarters).quarters; //return the contents of the cell;
    
    return `
    <th class="th-container">
        <span>
            <span class="date-styling">${dayValue.split('-')[0]+' '+helper.MONTHS_SHORT[dayValue.split('-')[1]]}</span>
            <span class="time-styling"><i class="icon-time"></i> ${RoundTime}</span>
            <span class="addition-styling addition-styling-${color}">${addition}</span>
        </span>                
    </th>`;

}

chrome.storage.local.get(['hide_discount', 'hide_billable', 'hide_visible'], function(result) {
    console.log(result);
    const discount = document.querySelector(".input-append:nth-child(8)")
    const billable = document.querySelector(".checkbox[for='billible']")
    const visible = document.querySelector(".checkbox[for='visible']")
    if (result.hide_discount) {
        discount.style.display = 'none';
    }
    if (result.hide_billable) {
        billable.style.display = 'none';
    }
    if (result.hide_visible) {
        visible.style.display = 'none';
    }
});

