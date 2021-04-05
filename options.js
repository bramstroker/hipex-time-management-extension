// Saves options to chrome.storage
function save_options() {
    const hide_discount = document.getElementById('hide_discount').checked;
    const hide_visible = document.getElementById('hide_visible').checked;
    const hide_billable = document.getElementById("hide_billable").checked;
    chrome.storage.local.set(
      {
        hide_discount: hide_discount,
        hide_visible: hide_visible,
        hide_billable: hide_billable,
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
      },
      function (items) {
        document.getElementById("hide_discount").checked = items.hide_discount;
        document.getElementById("hide_visible").checked = items.hide_visible;
        document.getElementById("hide_billable").checked = items.hide_billable;
      }
    );
  }
  document.addEventListener('DOMContentLoaded', restore_options);
  document.getElementById('save').addEventListener('click',
      save_options);