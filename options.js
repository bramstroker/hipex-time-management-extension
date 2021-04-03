// Saves options to chrome.storage
function save_options() {
    const hide_discount = document.getElementById('hide_discount').checked;
    const hide_visible = document.getElementById('hide_visible').checked;
    const hide_billable = document.getElementById('hide_billable').checked;
    const customer = document.getElementById("customer").selectedOptions[0]
      .value;
    const proceeding = document.getElementById("proceeding").selectedOptions[0]
      .value;
      
    // const workingHours = document.getElementById('workingHours').selectedOptions[0].value;
    // const workingDays = document.getElementById('workingDays').selectedOptions[0].value;
    chrome.storage.local.set(
      {
        hide_discount: hide_discount,
        hide_visible: hide_visible,
        hide_billable: hide_billable,
        customer: customer,
        proceeding: proceeding,
        // workingHours: workingHours,
        // workingDays: workingDays
      },
      function () {
        // Update status to let user know options were saved.
        var status = document.getElementById("status");
        status.textContent = "Options saved.";
        setTimeout(function () {
          status.textContent = "";
        }, 750);
      }
    );
  }
  
  // Restores select box and checkbox state using the preferences
  // stored in chrome.storage.
  function restore_options() {
    // Use default value color = 'red' and likesColor = true.
    chrome.storage.local.get(
      {
        hide_discount,
        hide_visible,
        hide_billable,
        customer,
        proceeding,
        // workingHours,
        // workingDays
      },
      function (items) {
        document.getElementById("hide_discount").checked = items.hide_discount;
        document.getElementById("hide_visible").checked = items.hide_visible;
        document.getElementById("hide_billable").checked = items.hide_billable;
        document.getElementById("customer").value = items.customer;
        document.getElementById("proceeding").value = items.proceeding;
        // document.getElementById('proceeding').value = items.workingHours;
        // document.getElementById('workingDays').value = items.workingDays;
      }
    );
  }
  document.addEventListener('DOMContentLoaded', restore_options);
  document.getElementById('save').addEventListener('click',
      save_options);