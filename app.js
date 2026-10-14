// ==========================================
// BOOKNEST - PERSONAL BOOK TRACKER
// ==========================================


// ==========================================
// 1. GET HTML ELEMENTS
// ==========================================

const bookForm = document.getElementById("bookForm");

const titleInput = document.getElementById("bookTitle");
const authorInput = document.getElementById("bookAuthor");
const statusInput = document.getElementById("bookStatus");

const titleError = document.getElementById("titleError");
const authorError = document.getElementById("authorError");

const successMessage = document.getElementById("successMessage");

const bookList = document.getElementById("bookList");

const searchInput = document.getElementById("searchInput");

const emptyMessage = document.getElementById("emptyMessage");

const filterButtons = document.querySelectorAll(".filter-btn");


// ==========================================
// 2. INITIALIZE BOOK DATA
// ==========================================

// Load saved books from localStorage.

const STORAGE_KEY = "booknest_books";

function loadBooks() {

    try {

        const savedBooks = localStorage.getItem(STORAGE_KEY);

        if (!savedBooks) {
            return [];
        }

        const parsedBooks = JSON.parse(savedBooks);

        return Array.isArray(parsedBooks) ? parsedBooks : [];

    } catch (error) {

        console.error("Unable to load saved books:", error);

        return [];

    }

}

let books = loadBooks();

// Default filter
let currentFilter = "All";


// ==========================================
// 3. SAVE BOOKS TO LOCAL STORAGE
// ==========================================

function saveBooks() {

    try {

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(books)
        );

        return true;

    } catch (error) {

        console.error("Unable to save books:", error);

        alert(
            "Your changes could not be saved. Please check your browser storage settings."
        );

        return false;

    }

}


// ==========================================
// 4. ADD NEW BOOK
// ==========================================

bookForm.addEventListener("submit", function(event) {

    // Prevent page refresh on form submission.
    event.preventDefault();

    // Read input values.
    const title = titleInput.value.trim();
    const author = authorInput.value.trim();
    const status = statusInput.value;

    // Clear previous messages.
    titleError.textContent = "";
    authorError.textContent = "";
    successMessage.textContent = "";

    let isValid = true;

    // Validate title.
    if (title === "") {

        titleError.textContent = "Please enter a title";

        isValid = false;

    }

    // Validate author.
    if (author === "") {

        authorError.textContent = "Please enter an author";

        isValid = false;

    }

    // Stop if validation fails.
    if (!isValid) {
        return;
    }

    // Create a new book object.
    const newBook = {

        id: crypto.randomUUID(),

        title: title,

        author: author,

        status: status,

        createdAt: Date.now()

    };

    // Add newest book at the beginning.
    books.unshift(newBook);

    // Save data.
    if (!saveBooks()) {

        books.shift();

        return;

    }

    // Clear form.
    bookForm.reset();

    // Show success message.
    successMessage.textContent =
        "Book added successfully!";

    // Clear search and show all books.
    searchInput.value = "";

    currentFilter = "All";

    updateActiveFilter();

    // Refresh display.
    renderBooks();

    updateStatistics();

});


// ==========================================
// 5. DISPLAY BOOKS
// ==========================================

function renderBooks() {

    // Clear existing book cards.
    bookList.innerHTML = "";

    // Get search text.
    const searchText =
        searchInput.value.trim().toLowerCase();

    // Filter books based on search and status.
    const filteredBooks = books.filter(function(book) {

        const title = book.title.toLowerCase();

        const author = book.author.toLowerCase();

        // Search title or author.
        const matchesSearch =
            title.includes(searchText) ||
            author.includes(searchText);

        // Check selected filter.
        const matchesFilter =
            currentFilter === "All" ||
            book.status === currentFilter;

        return matchesSearch && matchesFilter;

    });

    // Display empty message when necessary.
    if (filteredBooks.length === 0) {

        emptyMessage.style.display = "block";

        if (books.length === 0) {

            emptyMessage.innerHTML = `
                <h3>📚 Your library is empty</h3>
                <p>Add your first book to get started!</p>
            `;

        } else {

            emptyMessage.innerHTML = `
                <h3>🔍 No books found</h3>
                <p>Try another search or filter.</p>
            `;

        }

        return;

    }

    // Hide empty message.
    emptyMessage.style.display = "none";

    // Create cards for matching books.
    filteredBooks.forEach(function(book) {

        const card = document.createElement("div");

        card.className = "book-card";


        // BOOK TITLE

        const title = document.createElement("h3");

        title.className = "book-title";

        title.textContent = "📖 " + book.title;


        // BOOK AUTHOR

        const author = document.createElement("p");

        author.className = "book-author";

        author.textContent = "by " + book.author;


        // BOTTOM SECTION

        const bottom = document.createElement("div");

        bottom.className = "book-bottom";


        // STATUS DROPDOWN

        const statusSelect = document.createElement("select");

        statusSelect.className = "status-select";

        statusSelect.setAttribute(
            "aria-label",
            "Reading status for " + book.title
        );

        const statuses = [
            "To read",
            "Reading",
            "Finished"
        ];

        statuses.forEach(function(status) {

            const option = document.createElement("option");

            option.value = status;

            option.textContent = status;

            statusSelect.appendChild(option);

        });

        // Select current book status.
        statusSelect.value = book.status;

        // Apply status color.
        applyStatusColor(statusSelect, book.status);


        // CHANGE STATUS EVENT

        statusSelect.addEventListener("change", function() {

            updateBookStatus(
                book.id,
                statusSelect.value
            );

        });


        // DELETE BUTTON

        const deleteButton = document.createElement("button");

        deleteButton.type = "button";

        deleteButton.className = "delete-btn";

        deleteButton.textContent = "🗑 Delete";

        deleteButton.setAttribute(
            "aria-label",
            "Delete " + book.title
        );


        // DELETE EVENT

        deleteButton.addEventListener("click", function() {

            deleteBook(book.id);

        });


        // APPEND ELEMENTS

        bottom.appendChild(statusSelect);

        bottom.appendChild(deleteButton);

        card.appendChild(title);

        card.appendChild(author);

        card.appendChild(bottom);

        bookList.appendChild(card);

    });

}


// ==========================================
// 6. CHANGE STATUS COLOR
// ==========================================

function applyStatusColor(element, status) {

    element.classList.remove(
        "to-read",
        "reading",
        "finished"
    );

    if (status === "To read") {

        element.classList.add("to-read");

    } else if (status === "Reading") {

        element.classList.add("reading");

    } else if (status === "Finished") {

        element.classList.add("finished");

    }

}


// ==========================================
// 7. UPDATE BOOK STATUS
// ==========================================

function updateBookStatus(bookId, newStatus) {

    // Find the selected book.
    const book = books.find(function(item) {

        return item.id === bookId;

    });

    if (!book) {
        return;
    }

    // Remember old status in case saving fails.
    const oldStatus = book.status;

    // Update status.
    book.status = newStatus;

    // Save updated book list.
    if (!saveBooks()) {

        book.status = oldStatus;

    }

    // Refresh UI and statistics.
    renderBooks();

    updateStatistics();

}


// ==========================================
// 8. DELETE BOOK
// ==========================================

function deleteBook(bookId) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this book?"
    );

    if (!confirmDelete) {
        return;
    }

    const previousBooks = books;

    // Remove selected book.
    books = books.filter(function(book) {

        return book.id !== bookId;

    });

    // Save updated list.
    if (!saveBooks()) {

        books = previousBooks;

        return;

    }

    // Refresh UI.
    renderBooks();

    updateStatistics();

}


// ==========================================
// 9. SEARCH BOOKS
// ==========================================

searchInput.addEventListener("input", function() {

    renderBooks();

});


// ==========================================
// 10. FILTER BOOKS
// ==========================================

filterButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        currentFilter = button.dataset.filter;

        updateActiveFilter();

        renderBooks();

    });

});


// ==========================================
// 11. UPDATE ACTIVE FILTER BUTTON
// ==========================================

function updateActiveFilter() {

    filterButtons.forEach(function(button) {

        if (button.dataset.filter === currentFilter) {

            button.classList.add("active");

        } else {

            button.classList.remove("active");

        }

    });

}


// ==========================================
// 12. UPDATE READING STATISTICS
// ==========================================

function updateStatistics() {

    const total = books.length;

    const toRead = books.filter(function(book) {

        return book.status === "To read";

    }).length;

    const reading = books.filter(function(book) {

        return book.status === "Reading";

    }).length;

    const finished = books.filter(function(book) {

        return book.status === "Finished";

    }).length;


    // Update dashboard numbers.

    document.getElementById("totalBooks").textContent =
        total;

    document.getElementById("toReadBooks").textContent =
        toRead;

    document.getElementById("readingBooks").textContent =
        reading;

    document.getElementById("finishedBooks").textContent =
        finished;

}


// ==========================================
// 13. CLEAR VALIDATION ERRORS ON INPUT
// ==========================================

titleInput.addEventListener("input", function() {

    titleError.textContent = "";

});

authorInput.addEventListener("input", function() {

    authorError.textContent = "";

});


// ==========================================
// 14. INITIAL PAGE LOAD
// ==========================================

// Display saved books when website opens.
renderBooks();

// Display saved statistics.
updateStatistics();