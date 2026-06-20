const sheetURL =
"https://docs.google.com/spreadsheets/d/e/2PACX-1vTLN7BSGfS_-Dqu76XVpgftgyGY5_F2V_9ZrWzMegtvQsGQ4bpUQTfCrsmv2iWdj7ltnZufMdweyVU_/pub?output=csv";

let allBooks = [];

function loadBooks(){

fetch(sheetURL)
.then(response => response.text())
.then(csv => {

allBooks = [];

let rows = csv.trim().split("\n").slice(1);

rows.forEach(row => {

let cols = row.split(",");

allBooks.push({
    name: cols[0] || "",
    author: cols[1] || "",
    price: cols[2] || "",
    image: cols[3] || "",
    stock: cols[4] || "",
    category: cols[5] || "",
    medium: cols[6] || "",
    subject: cols[7] || "",
    language: cols[8] || ""
});

});

displayBooks();

});

}

function displayBooks(){

let search =
document.getElementById("searchBox")
.value
.toLowerCase();

let booksHTML = "";

let filteredBooks = allBooks.filter(book =>

(book.language || "")
.toLowerCase()
.trim() === "english"

&&

(
(book.name || "")
.toLowerCase()
.includes(search)

||

(book.author || "")
.toLowerCase()
.includes(search)
)

);

filteredBooks.forEach(book => {

let status =
Number(book.stock) > 0
? `${book.stock} copies available`
: "Out of Stock";

booksHTML += `

<div class="card">

<img
src="${book.image}"
onerror="this.src='https://via.placeholder.com/150x220?text=Book'">

<h2>${book.name}</h2>

<p>Author : ${book.author}</p>

<p>₹${book.price}</p>

<p>${status}</p>

</div>

`;

});

document.querySelector(".books").innerHTML = booksHTML;

document.getElementById("bookCount").innerHTML =
filteredBooks.length + " Books Found";

}

document.getElementById("searchBox")
.addEventListener("keyup", displayBooks);

loadBooks();

setInterval(loadBooks,10000);