let booksData = [];
let showAll = false;

const sheetURL =
"https://docs.google.com/spreadsheets/d/e/2PACX-1vTLN7BSGfS_-Dqu76XVpgftgyGY5_F2V_9ZrWzMegtvQsGQ4bpUQTfCrsmv2iWdj7ltnZufMdweyVU_/pub?output=csv";

function loadBooks() {

    booksData = [];

    fetch(sheetURL)
    .then(response => response.text())
    .then(csv => {

        let rows = csv.trim().split("\n").slice(1);

        rows.forEach(row => {

            let cols = row.split(",");

            booksData.push({
                name: cols[0] || "",
                author: cols[1] || "",
                price: cols[2] || "",
                image: cols[3] || "",
                stock: cols[4] || ""
            });

        });

        displayBooks();

    })

    .catch(error => {
        console.log(error);
    });

}

function displayBooks() {

    let search = document
    .getElementById("searchBox")
    .value
    .toLowerCase();

    let filteredBooks = booksData.filter(book =>
        book.name.toLowerCase().includes(search) ||
        book.author.toLowerCase().includes(search)
    );

    if (search === "" && !showAll) {
        filteredBooks = filteredBooks.slice(0, 9);
    }

    let booksHTML = "";

    filteredBooks.forEach(book => {

        let status =
        Number(book.stock) > 0
        ? `${book.stock} copies available`
        : "Out of Stock";

        booksHTML += `
        <div class="card">

            <img src="${book.image}"
onerror="this.src='images/default-book.png'">

            <h2 class="title">${book.name}</h2>

            <p>Author : ${book.author}</p>

            <p>₹${book.price}</p>

            <span>${status}</span>

        </div>
        `;
    });

    document.getElementById("books").innerHTML = booksHTML;

    // Suggestions
    let html = "";

    if(search !== ""){

        filteredBooks.forEach(book => {

            html += `
            <div class="suggestion-item"
            onclick="
            document.getElementById('searchBox').value='${book.name}';
            document.getElementById('suggestions').innerHTML='';
            displayBooks();
            ">
            ${book.name}
            </div>
            `;
        });
    }

    document.getElementById("suggestions").innerHTML = html;

    // Show More Button
    let toggleBtn = document.getElementById("toggleBtn");

    if (booksData.length <= 9 || search !== "") {

        toggleBtn.style.display = "none";

    } else {

        toggleBtn.style.display = "inline-block";
        toggleBtn.innerText =
        showAll ? "Show Less" : "Show More";
    }

}

document.getElementById("searchBox")
.addEventListener("keyup", displayBooks);

document.getElementById("toggleBtn")
.addEventListener("click", () => {

    showAll = !showAll;

    displayBooks();

});

loadBooks();