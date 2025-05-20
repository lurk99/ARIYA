const scriptURL = 'https://script.google.com/macros/s/AKfycbw6DSLPnFHI8SRzwGjopwY3zSX2gLz1Uwgs0oSMQOw7WlCndZwwQGX7hrPiM2kBDGhCug/exec';
function submitForm(event) {
  event.preventDefault();
  const submitBtn = document.getElementById("submitBtn");
  submitBtn.disabled = true;
  const nama = document.getElementById("nama").value.trim().toUpperCase();
  const telefon = document.getElementById("telefon").value.trim();
  const unit = document.getElementById("unit").value.toUpperCase();
  const jalan = document.getElementById("jalan").value.toUpperCase();
  const status = document.getElementById("status").value.toUpperCase();
  if (!nama || !telefon || !unit || !jalan || !status) {
    alert("Sila lengkapkan semua maklumat yang diperlukan.");
    submitBtn.disabled = false;
    return;
  }
  if (!isNumeric(telefon)) {
    alert("Sila masukkan nombor telefon tanpa simbol, ruang atau huruf.");
    submitBtn.disabled = false;
    return;
  }
  if (telefon.length < 9 || telefon.length > 15) {
    alert("Nombor telefon mesti antara 9 hingga 15 digit.");
    submitBtn.disabled = false;
    return;
  }
  const formData = new URLSearchParams();
  formData.append("nama", nama);
  formData.append("telefon", telefon);
  formData.append("unit", unit);
  formData.append("jalan", jalan);
  formData.append("status", status);
  fetch(scriptURL, {
    method: 'POST',
    body: formData
  })
  .then(res => res.json())
  .then(response => {
    if (response.success) {
      alert("MAKLUMAT BERJAYA DIHANTAR!");
      document.getElementById("undiForm").reset();
    } else {
      alert("Ralat: " + response.message);
    }
    submitBtn.disabled = false;
  })
  .catch(error => {
    console.error("Error:", error);
    alert("Ralat semasa menghantar data.");
    submitBtn.disabled = false;
  });
}
function isNumeric(value) {
  return /^\d+$/.test(value);
}
function validateTelefon(input) {
  const errorEl = document.getElementById("telefonError");
  const valid = /^0\d{8,14}$/.test(input.value); 
  if (!valid && input.value !== "") {
    errorEl.style.display = "block";
  } else {
    errorEl.style.display = "none";
  }
}
window.onload = () => {
  fetch(scriptURL + '?action=getOptions')
    .then((res) => res.json())
    .then((data) => {
      const unitSelect = document.getElementById("unit");
      const jalanSelect = document.getElementById("jalan");

      const defaultOptionUnit = document.createElement("option");
      defaultOptionUnit.value = "";
      defaultOptionUnit.textContent = "-- PILIH --";
      defaultOptionUnit.disabled = true;
      defaultOptionUnit.selected = true;
      unitSelect.appendChild(defaultOptionUnit);

      const defaultOptionJalan = document.createElement("option");
      defaultOptionJalan.value = "";
      defaultOptionJalan.textContent = "-- PILIH --";
      defaultOptionJalan.disabled = true;
      defaultOptionJalan.selected = true;
      jalanSelect.appendChild(defaultOptionJalan);

      data.units.forEach((u) => {
        const option = document.createElement("option");
        option.value = u;
        option.textContent = u;
        unitSelect.appendChild(option);
      });

      data.jalans.forEach((j) => {
        const option = document.createElement("option");
        option.value = j;
        option.textContent = j;
        jalanSelect.appendChild(option);
      });
    })
    .catch(() => {
      alert("Gagal muatkan data dropdown. Sila cuba lagi.");
    });
};

window.addEventListener('load', function () {
  // Delay 5 saat sebelum paparkan kandungan utama
  setTimeout(function () {
    const loadingScreen = document.getElementById('loading-screen');
    const mainContent = document.getElementById('main-content');

    if (loadingScreen) loadingScreen.style.display = 'none';
    if (mainContent) mainContent.style.display = 'block';
  }, 3000);
});
