// 1. Halaman utama
function doGet() {
  return HtmlService.createHtmlOutputFromFile('index')
    .setTitle('Lurk - Sistem Daftar Pelawat');
}

// 2. Dapatkan hasil carian berdasarkan nombor plate
function getSearchResults(query) {
  const sheetId = "19z7ckq0wptPvZEJSq4wAyVqKCFwlbhPOv-nN7Jc7QWk"; // Gantikan dengan ID Google Sheet anda
  const ss = SpreadsheetApp.openById(sheetId);
  const sheet = ss.getSheetByName('ariyavisitor');
  const data = sheet.getDataRange().getValues();

  let hasilCarian = "<h3>Hasil Carian untuk: " + query.toString().toUpperCase() + "</h3><table style='width: 100%;'>";

  const queryLower = (query || "").toString().toLowerCase();
  let found = false;

  const matchingPlateRows = data.filter(function(row, index) {
    if (index === 0) return false; // Skip header
    const plate = row[4];
    return plate && plate.toString().toLowerCase() === queryLower;
  });

  if (matchingPlateRows.length > 0) {
    matchingPlateRows.sort(function(a, b) {
      return new Date(b[6]) - new Date(a[6]);
    });
    hasilCarian += formatRow(matchingPlateRows[0]);
    hasilCarian += "</table>";
    found = true;
  }

  if (!found) {
    // Update mesej Tiada Maklumat
    hasilCarian = `<div class="no-result">TIADA MAKLUMAT DITEMUI UNTUK CARIAN TERSEBUT : ${query.toString().toUpperCase()}</div>`;
  }

  return hasilCarian;
}

// 3. Format baris untuk dipaparkan
function formatRow(row) {
  const userDate = new Date(row[6]);
  const monthsInMalay = [
    "JANUARI", "FEBRUARI", "MAC", "APRIL", "MEI", "JUN",
    "JULAI", "OGOS", "SEPTEMBER", "OKTOBER", "NOVEMBER", "DISEMBER"
  ];

  const month = userDate.getMonth();
  const formattedDate = Utilities.formatDate(userDate, Session.getScriptTimeZone(), "dd") + " " + monthsInMalay[month] + " " + Utilities.formatDate(userDate, Session.getScriptTimeZone(), "yyyy");

  return `
    <tr><td class="key"><b>TARIKH</b></td><td class="value">${formattedDate}</td></tr>
<tr>
  <td class="key"><b>NOMBOR PLATE KENDERAAN</b></td>
  <td class="value" style="text-align: center;">
    <span class="plate-animated-strong">
      ${row[4].toString().toUpperCase()}
    </span>
  </td>
</tr>
    <tr><td class="key"><b>NAMA PELAWAT</b></td><td class="value">${row[2].toString().toUpperCase()}</td></tr>
    <tr><td class="key"><b>NOMBOR TELEFON PELAWAT</b></td><td class="value">${row[3].toString().toUpperCase()}</td></tr>
    <tr><td class="key"><b>BILANGAN PELAWAT</b></td><td class="value">${row[5].toString().toUpperCase()}</td></tr>
    <tr><td class="key"><b>TUJUAN LAWATAN</b></td><td class="value">${row[7].toString().toUpperCase()}</td></tr>
    <tr><td class="key"><b>NAMA PEMILIK</b></td><td class="value">${row[8].toString().toUpperCase()}</td></tr>
    <tr><td class="key"><b>NO.UNIT & JALAN PEMILIK</b></td><td class="value">${row[9].toString().toUpperCase()}, ${row[10].toString().toUpperCase()}</td></tr>
    <tr><td class="key"><b>NOMBOR TELEFON PEMILIK</b></td><td class="value">${row[11].toString().toUpperCase()}</td></tr>
  `;
}
