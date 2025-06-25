function sendLeetcodeReminders() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = sheet.getDataRange().getValues();
  const today = new Date();
  const targetDays = 21;

  function formatMonth(monthIndex) {
    const neverAbbreviated = ["March", "April", "May", "June", "July"];
    const fullMonths = [
      "January", "February", "March", "April", "May", "June", "July",
      "August", "September", "October", "November", "December"
    ];
    if (neverAbbreviated.includes(fullMonths[monthIndex])) {
      return fullMonths[monthIndex];
    } else {
      const abbreviations = {
        0: "Jan.",
        1: "Feb.",
        7: "Aug.",
        8: "Sept.",
        9: "Oct.",
        10: "Nov.",
        11: "Dec."
      };
      return abbreviations[monthIndex] || fullMonths[monthIndex];
    }
  }

  const month = formatMonth(today.getMonth());
  const day = today.getDate();
  const year = today.getFullYear();

  const subject = `🔁 LeetCode Review Reminder - ${month} ${day} ${year}`;

  const colorMap = {
    "#00ff00": "🟩",  
    "#ffff00": "🟨", 
    "#ff0000": "🟥",
  };

  let reminders = [];

  for (let i = 1; i < data.length; i++) {
    const dateStr = data[i][0];
    const richTextCell = sheet.getRange(i + 1, 2);
    const richText = richTextCell.getRichTextValue();

    if (!dateStr || !richText) continue;

    const solvedDate = new Date(dateStr);
    const diffDays = Math.floor((today - solvedDate) / (1000 * 60 * 60 * 24));

    if (Math.abs(diffDays - targetDays) <= 1) {
      const text = richText.getText();
      const url = richText.getLinkUrl();

      // Get background color of the problem cell, normalized to lowercase
      const bgColor = richTextCell.getBackground().toLowerCase();

      // Find matching emoji, default to empty if none found
      const difficultyEmoji = colorMap[bgColor] || "";

      reminders.push(`${reminders.length + 1}. ${difficultyEmoji} <a href="${url}">${text}</a>`);
    }
  }


  if (reminders.length > 0) {
    const body = reminders.join("<br>");
    MailApp.sendEmail({
      to: Session.getActiveUser().getEmail(),
      subject: subject,
      htmlBody: `<p>🧠 Time to redo these LeetCode problems, make sure to update Tracker!</p><p>${body}</p>`
    });
  }

}
