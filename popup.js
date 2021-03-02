var xhr = new XMLHttpRequest();
const url = 'https://service.hipex.io/time/data?';
xhr.open("GET", `${url}data?sEcho=1&iColumns=9&sColumns=&iDisplayStart=0&iDisplayLength=100&mDataProp_0=__edit&mDataProp_1=startTime&mDataProp_2=endTime&mDataProp_3=time&mDataProp_4=roundTime&mDataProp_5=customer.__string&mDataProp_6=childCustomer.name&mDataProp_7=ticket&mDataProp_8=description&sSearch=&bRegex=false&sSearch_0=&bRegex_0=false&bSearchable_0=true&sSearch_1=&bRegex_1=false&bSearchable_1=true&sSearch_2=&bRegex_2=false&bSearchable_2=true&sSearch_3=&bRegex_3=false&bSearchable_3=true&sSearch_4=&bRegex_4=false&bSearchable_4=true&sSearch_5=&bRegex_5=false&bSearchable_5=true&sSearch_6=&bRegex_6=false&bSearchable_6=true&sSearch_7=&bRegex_7=false&bSearchable_7=true&sSearch_8=&bRegex_8=false&bSearchable_8=true&iSortCol_0=1&sSortDir_0=desc&iSortingCols=1&bSortable_0=false&bSortable_1=true&bSortable_2=true&bSortable_3=false&bSortable_4=false&bSortable_5=true&bSortable_6=true&bSortable_7=true&bSortable_8=true`, true);
xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
        window.localStorage.setItem('HOURS', xhr.responseText)
    }
}
xhr.send();

function amount(item){
    return item.roundTime;
} 
function sum(prev, next){
    return prev + next;
}
function getDay(value) { return new Date(value).getDate(); }
function getDayInTheWeek(value) { return new Date(value).getDay(); }
function getMonth(value) { return new Date(value).getMonth(); }

document.addEventListener("DOMContentLoaded", function() {

    const response = JSON.parse(window.localStorage.getItem('HOURS'));
    let welcomeText = '';
    if (response) {

        var table = new Tabulator("#hours-table", {
            data:response.data,
            selectable:false,
            groupBy:function(data){

                const day = getDay(data.startTime);
                const dayInTheWeek = getDayInTheWeek(data.startTime);
                const month = getMonth(data.startTime);

                return `${helper.DAYS_SHORT[dayInTheWeek]} ${day}-${helper.MONTHS_SHORT[month]}`;
            },
            groupHeader:function(value, count, data, group){
                const msValue = data.map(amount).reduce(sum);
                const quarters = msValue / 900

                function getTimeInQuarters(quarters) {
                    const showQuarters = quarters % 4 ? ',' + ((quarters % 4) * 25) + ' uur' : ' uur';
                    const showHours = Math.floor(quarters/4) ? Math.floor(quarters/4) : '0';
                    return {
                        hours: showHours,
                        quarters: showQuarters
                    }
                }
                const hours = (msValue / 3600);

                let addition = '';
                let color = 'green';
                if (hours > 8) {
                    addition = `+${hours - 8}`;
                    color = 'green';
                }
                if (hours < 8) {
                    addition = `-${8 - hours}`;
                    color = 'red';
                }
                const RoundTime =  getTimeInQuarters(quarters).hours + getTimeInQuarters(quarters).quarters; //return the contents of the cell;

                return `
                <span class="th-container">
                    <span class="date-styling">${value}</span>
                    <span class="time-styling"><i class="icon-time"></i> ${RoundTime}</span>
                    <span class="addition-styling addition-styling-${color}">${addition}</span>
                </span>
                `; 
                
            },
            columns:[
                {title:"Dag", field:"startTime", width:100, formatter:function(cell) {
                    const day = getDay(cell.getValue());
                    const dayInTheWeek = getDayInTheWeek(cell.getValue());
                    const month = getMonth(cell.getValue());
                    return `${helper.DAYS_SHORT[dayInTheWeek]} ${day}-${helper.MONTHS_SHORT[month]}`;
                },
                },
                {title:"Begin", field:"startTime", width:60, headerSort:false, hozAlign:"center", formatter:function(cell){
                    const time = new Date(cell.getValue()).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});                
                    return `${time}`;
                    },
                },
                {title:"Eind", field:"endTime", width:60, headerSort:false, hozAlign:"center", formatter:function(cell){
                    const time = new Date(cell.getValue()).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});                
                    return `${time}`;
                    },
                },
                {title:"Tijd afgerond", field:"roundTime", width:140, hozAlign:"center", formatter:function(cell, formatterParams, onRendered){
                    const quarters = cell.getValue() / 900
                    const showQuarters = quarters % 4 ? ',' + ((quarters % 4) * 25) + ' uur' : ' uur';
                    const showHours = Math.floor(quarters/4) ? Math.floor(quarters/4) : '0';
                    return showHours + showQuarters; //return the contents of the cell;
                    },
                },
                {title:"Omschrijving", field:"description"}, 
                {title:"project", field:"customer", headerSort:false, formatter:function(cell) {
                    return cell.getValue().name;
                },
                },
                {title:'TicketNr', field:"ticket", width:100, headerSort: false}
            ]
            
        });

        const groups = table.getGroups();
        
        const overviewTable = document.querySelector('.total-hours')
        const totalHoursSum = (response.data.map(amount).reduce(sum) / 3600);
        const totalHours = (groups.length * 8); 
        // totalHours.textContent = `${totalHoursSum}/${amountDays} uur (${totalHoursSum - amountDays}) (${Math.floor((100 * totalHoursSum) / amountDays)}%)`;
        const sumHours = totalHoursSum - totalHours;
        const percentage = Math.floor((100 * totalHoursSum) / totalHours);
        overviewTable.innerHTML = `
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
                    <span class="overview-title">${!!sumHours ? 'Overuren:' : 'Uren te weinig:'}</span>
                    <span class="overview-content ${!!sumHours ? 'overview-content-positive' : 'overview-content-negative'}">${sumHours} uur</span>
                </span>
                <span class="overviewContainerRow">
                    <span class="overview-title">Percentage:</span>
                    <span class="overview-content ${percentage > 100 ? 'overview-title-positive' : 'overview-title-negative'}">${percentage}%</span>
                </span>
            </span>
        `;
        welcomeText = `Welkom ${response.data[0].user.displayName}!`;
        document.querySelector('.welcome').textContent = welcomeText;
    } else {
        welcomeText = `Log eerst in op https://service.hipex.io/`;
        document.querySelector('.welcome').textContent = welcomeText;
    }

    
    document.querySelector('.settings').addEventListener('click', function() {
        if (chrome.runtime.openOptionsPage) {
            chrome.runtime.openOptionsPage();
        } else {
            window.open(chrome.runtime.getURL('options.html'));
        }
    });

});