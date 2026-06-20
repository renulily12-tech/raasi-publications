const sheetURL =
"https://docs.google.com/spreadsheets/d/e/2PACX-1vTLN7BSGfS_-Dqu76XVpgftgyGY5_F2V_9ZrWzMegtvQsGQ4bpUQTfCrsmv2iWdj7ltnZufMdweyVU_/pub?output=csv";

const webAppURL =
"https://script.google.com/macros/s/AKfycbyZi-sJcIVLECxZGgU3-YBr3T6CS3WEgoc7rvBfpVeDEiVfgGyQ_ZJTBxSAQuTdFOQN5w/exec";

let books = [];
let selectedBook = null;

fetch(sheetURL)
.then(response => response.text())
.then(csv => {

    let rows = csv.trim().split("\n").slice(1);

    rows.forEach(row => {

        let cols = row.split(",");

        books.push({
            name: cols[0] || "",
            author: cols[1] || "",
            image: cols[3] || "",
            stock: Number(cols[4]) || 0
        });

    });

});

document.getElementById("searchBook")
.addEventListener("keyup", function(){

    let search = this.value.toLowerCase();

    let html = "";

    if(search !== ""){

        books.forEach(book => {

            if(book.name.toLowerCase().includes(search)){

                html += `
                <div class="suggestion"
                onclick="selectBook('${book.name}')">
                    📚 ${book.name}
                </div>
                `;

            }

        });

    }

    document.getElementById("suggestions").innerHTML = html;

});


function selectBook(bookName){

    selectedBook = books.find(book =>
        book.name === bookName
    );

    document.getElementById("searchBook").value =
    selectedBook.name;

    document.getElementById("bookImage").src =
    selectedBook.image;

    document.getElementById("bookName").innerHTML =
    selectedBook.name;

    document.getElementById("author").innerHTML =
    "Author : " + selectedBook.author;

    document.getElementById("currentStock").innerHTML =
    selectedBook.stock;

    document.getElementById("newStock").innerHTML =
    selectedBook.stock;

    document.getElementById("suggestions").innerHTML = "";

}


document.getElementById("soldQty")
.addEventListener("input", function(){

    if(selectedBook == null)
        return;

    let sold = Number(this.value);

    let newStock = selectedBook.stock - sold;

    if(newStock < 0)
        newStock = 0;

    document.getElementById("newStock").innerHTML =
    newStock;

});


function updateStock(){

    if(selectedBook == null){

        alert("Please select a book");
        return;

    }

    let soldQty =
    Number(document.getElementById("soldQty").value);

    if(soldQty <= 0){

        alert("Enter copies sold today");
        return;

    }

    let updatedStock =
    selectedBook.stock - soldQty;

    if(updatedStock < 0){

        alert("Sold quantity exceeds stock");
        return;

    }

    fetch(webAppURL,{

        method:"POST",

        body:JSON.stringify({

            name:selectedBook.name,

            stock:updatedStock

        })

    })

    .then(response => response.text())

    .then(data => {

        alert("✅ Stock Updated Successfully");

        selectedBook.stock = updatedStock;

        document.getElementById("currentStock").innerHTML =
        updatedStock;

        document.getElementById("newStock").innerHTML =
        updatedStock;

        document.getElementById("soldQty").value = "";

    });

}