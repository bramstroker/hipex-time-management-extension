let tableIsRendered = false;
const isProcessingElement = document.querySelector('#DataTables_Table_0_processing');
const observer = new MutationObserver(checkIfTableNeedsToBeRendered)
const observerTable = new MutationObserver(redrawTable);
observer.observe(isProcessingElement, { attributes: true })
observerTable.observe(isProcessingElement, { attributes: true });
checkIfTableNeedsToBeRendered();



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



    for (let i = 0; i < rows.length; i++) {

        if (document.querySelector('total-hours')) {
            document.querySelector('total-hours').remove();
        }

        const from = rows[i].children[1];
        const till = rows[i].children[2];
        // console.log(rows[i].children[3]);
        let amountOfHours, amountOfSeconds = 0;
        if (rows[i].children[3]) {
          amountOfHours = parseInt(rows[i].children[3].innerText.split(":")[0]) * 60 * 60;
          amountOfSeconds = parseInt(rows[i].children[3].innerText.split(":")[1]) * 60;
        }
        
        const totalOfSeconds = amountOfHours + amountOfSeconds;

        const dayOfRow = new Date(from.innerText).getDate();
        const monthOfRow = new Date(from.innerText).getMonth();
        const dayMonthValue = `${dayOfRow}-${monthOfRow}`

        const preTableRow = document.createElement('tr');
        const preTableRowTd = document.createElement('th');
        preTableRowTd.classList.add('info-table')
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
      const dataDay = rowDays[i].getAttribute("data-day");
      document.querySelector(
        
        `[data-day='${dataDay}']`
      
      ).innerHTML = helper.getTimeInHoursAndMinutes(dayTotal[dataDay],  dataDay);
    }
    
}


// Hide elements (Options_page)
chrome.storage.local.get(['hide_discount', 'hide_billable', 'hide_visible'], function(result) {
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

