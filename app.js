const form = document.getElementById("scanner-form");
const statusText = document.getElementById("status-text");
const reasonList = document.getElementById("reason-list");

const suspiciousKeywords = [
  "deposit",
  "transfer",
  "dp",
  "telegram",
  "admin fee",
  "biaya pendaftaran",
  "bayar",
  "top up",
  "saldo",
  "komisi instan",
  "modal pribadi",
  "paylater"
];

const simpleJobKeywords = [
  "admin",
  "entry",
  "data",
  "chat",
  "operator",
  "part time",
  "freelance",
  "reseller"
];

const normalizeSalary = (salaryRaw) => {
  const parsed = Number((salaryRaw || "").replace(/[^0-9]/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
};

const setStatus = (status, reasons, className) => {
  statusText.textContent = status;
  statusText.className = className;

  reasonList.innerHTML = "";
  reasons.forEach((reason) => {
    const li = document.createElement("li");
    li.textContent = reason;
    reasonList.appendChild(li);
  });
};

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const jobdesk = form.jobdesk.value.toLowerCase();
  const salaryRaw = form.salary.value;
  const position = form.position.value.toLowerCase();
  const company = form.company.value.trim();
  const salary = normalizeSalary(salaryRaw);

  const flags = [];

  const hitKeywords = suspiciousKeywords.filter((word) => jobdesk.includes(word));
  if (hitKeywords.length) {
    flags.push(`Ada kata mencurigakan: ${hitKeywords.join(", ")}.`);
  }

  const isSimpleRole = simpleJobKeywords.some(
    (word) => position.includes(word) || jobdesk.includes(word)
  );
  if (isSimpleRole && salary >= 15000000) {
    flags.push("Gaji terlihat tidak realistis untuk pekerjaan sederhana.");
  }

  if (!company && flags.length) {
    flags.push("Nama perusahaan tidak dicantumkan.");
  }

  if (flags.length >= 2) {
    setStatus("BERPOTENSI PENIPUAN", flags, "status-danger");
  } else if (flags.length === 1) {
    setStatus("HATI-HATI", flags, "status-warn");
  } else {
    setStatus(
      "TERPERCAYA",
      ["Tidak ditemukan indikator scam utama pada input ini."],
      "status-safe"
    );
  }
});
