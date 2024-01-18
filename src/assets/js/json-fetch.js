fetch("../data/informasi.json")
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    let placeholder = document.querySelector("#data-output");
    let out = "";
    for (let informasi_masuk of data) {
      out += `
        <tr>
            <td>${informasi_masuk.id}</td>
            <td>${informasi_masuk.nama}</td>
            <td>${informasi_masuk.nomorTelepon}</td>
            <td>${informasi_masuk.alamat}</td>
            <td>${informasi_masuk.status}</td>
        </tr>
      `;
    }

    placeholder.innerHTML = out;
  });
