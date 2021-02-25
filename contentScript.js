const tbody = document.querySelector('tbody');
const rows = tbody.querySelectorAll('tr');

const days = [];

for (let i = 0; i < rows.length; i++) {

    const from = rows[i].children[1];
    const till = rows[i].children[2];
    const dayOfRow = new Date(from.innerText).getDate();
    const monthOfRow = new Date(from.innerText).getMonth()+1;
    const dayMonthValue = `${dayOfRow}-${monthOfRow}`

    const preTableRow = document.createElement('tr');
    const preTableRowTd = document.createElement('th');
    preTableRowTd.innerText = `${dayOfRow} - ${helper.MONTHS_LONG[monthOfRow]}`;
    preTableRow.appendChild(preTableRowTd);
    if (!days.find((value) => value === dayMonthValue)) {
        tbody.insertBefore(preTableRow, rows[i]);
        days.push(dayMonthValue);
    }
    
    from.innerText = new Date(from.innerText).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});                
    till.innerText = new Date(till.innerText).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});                
}
