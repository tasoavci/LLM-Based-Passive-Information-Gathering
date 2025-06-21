// renderer/renderer.js
const frm = document.getElementById('frm');
const container = document.getElementById('table-holder'); // div where table will be inserted
const companyInput = document.getElementById('company');
const domainInput = document.getElementById('domain');

frm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Clear previous table
    container.innerHTML = '';

    // Create a fresh table skeleton
    const table = document.createElement('table');
    table.innerHTML = `
    <thead>
      <tr><th>İsim</th><th>Title</th><th>E‑posta</th></tr>
    </thead>
    <tbody>
      <tr><td colspan="3">Yükleniyor…</td></tr>
    </tbody>`;
    container.appendChild(table);
    const tbody = table.querySelector('tbody');

    // Request OSINT data from main process
    const res = await window.api.runOSINT({
        company: companyInput.value.trim(),
        domain: domainInput.value.trim(),
    });

    const { results, format, mailCount } = res;
    document.getElementById('info').innerText =
        `Found ${mailCount} sample emails; detected format "${format}".`;

    if (!results || results.length === 0) {
        tbody.innerHTML =
            '<tr><td colspan="3" class="no-results">Sonuç bulunamadı.</td></tr>';
        return;
    }

    // Populate table with rows
    tbody.innerHTML = results
        .map(
            (r) =>
                `<tr><td>${r.first} ${r.last}</td><td>${r.title}</td><td>${r.email}</td></tr>`
        )
        .join('');
});