async function loadIntoTable(url, table) {
  const tableHead = table.querySelector("thead");
  const tableBody = table.querySelector("tbody");

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const { headers, rows } = await response.json();

    // Clear the table
    tableHead.innerHTML = "<tr></tr>";
    tableBody.innerHTML = "";

    // Populate the headers
    for (const headerText of headers) {
      const headerElement = document.createElement("th");
      headerElement.textContent = headerText;
      tableHead.querySelector("tr").appendChild(headerElement);
    }

    // Populate the rows
    for (const row of rows) {
      const rowElement = document.createElement("tr");

      for (const cellText of row) {
        const cellElement = document.createElement("td");
        cellElement.textContent = cellText;
        rowElement.appendChild(cellElement);
      }

      tableBody.appendChild(rowElement);
    }
  } catch (error) {
    console.error("Error loading data:", error);
  }
}

loadIntoTable("././data/data.json", document.querySelector("table"));
