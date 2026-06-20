const sheetURL =
"https://docs.google.com/spreadsheets/d/e/2PACX-1vTLN7BSGfS_-Dqu76XVpgftgyGY5_F2V_9ZrWzMegtvQsGQ4bpUQTfCrsmv2iWdj7ltnZufMdweyVU_/pub?output=csv";

fetch(sheetURL)
.then(response => response.text())
.then(csv => {

    let rows = csv.trim().split("\n").slice(1);

    let total = rows.length;
    let available = 0;
    let out = 0;

    let tableHTML = "";

    rows.forEach((row,index)=>{

        let cols = row.split(",");

        let bookName = cols[0];

        let stock = Number(cols[4]);

        if(stock > 0){
            available++;
        }
        else{
            out++;
        }

        if(index < 5){

            tableHTML += `
            <tr>
                <td>${bookName}</td>
                <td>${stock}</td>
            </tr>
            `;

        }

    });

    document.getElementById("totalBooks").innerHTML = total;

    document.getElementById("availableBooks").innerHTML = available;

    document.getElementById("outBooks").innerHTML = out;

    document.getElementById("recentBooks").innerHTML = tableHTML;

});

function logout(){

    let confirmLogout =
    confirm("Are you sure you want to logout?");

    if(confirmLogout){

        alert("Logged out successfully");

        window.location.href = "login.html";

    }

}