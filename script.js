let tableData = JSON.parse(localStorage.getItem("tableData")) || [
    { image: 'resources/CSK.png', color: '#E4D00A'},
    { image: 'resources/MI.png', color: '#0096FF' },
    { image: 'resources/KKR.png', color: '#702963' },
    { image: 'resources/GT.png', color: '#1C2E4A' },
    { image: 'resources/RCB.png', color: '#D2042D' },
    { image: 'resources/LSG.png', color: '#1434A4' },
    { image: 'resources/SRH.png', color: '#CC5500' },
    { image: 'resources/DC.png', color: '#0047AB' },
    { image: 'resources/RR.png', color: '#FF69B4' },
    { image: 'resources/PKBS.png', color: '#FF0000' }
];

function saveTableData() {
    let tables = document.querySelectorAll("table");
    let updatedData = [];
    tables.forEach((table, index) => {
        let rows = table.querySelectorAll("tr");
        let rowData = [];
        rows.forEach((row, rowIndex) => {
            if (rowIndex > 1) { // Skip header rows
                let cells = row.querySelectorAll("td");
                rowData.push([cells[0].innerText, cells[1].innerText]);
            }
        });
        updatedData.push({
            image: tableData[index].image,
            color: tableData[index].color,
            content: rowData
        });
    });
    localStorage.setItem("tableData", JSON.stringify(updatedData));
}
