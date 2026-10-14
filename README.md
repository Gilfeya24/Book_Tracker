# 📚 BookNest – Personal Book Tracker

BookNest is a simple, responsive web application designed to help users organize their personal reading lists and track their reading progress.

## Features

- Add books with title, author, and reading status.
- Validate required input fields.
- Display newly added books first.
- Search books by title or author.
- Filter books by reading status.
- Update reading status.
- Delete books from the library.
- View reading statistics.
- Automatically save data using browser localStorage.
- Responsive design for desktop and mobile devices.

## Technologies Used

- HTML5
- CSS3
- JavaScript
- Browser localStorage

## How to Run

1. Clone or download this repository.
2. Open the project folder in Visual Studio Code.
3. Open `index.html` using Live Server.
4. Start adding and managing books.

No backend or database setup is required.

## How It Works

BookNest stores each book as a JavaScript object containing a unique ID, title, author, reading status, and creation timestamp.

Books are maintained in an array and saved in browser localStorage using JSON.

Whenever a book is added, deleted, or updated, the application saves the latest data and refreshes the interface.

## Project Structure

```text
BookNest/
├── index.html
├── style.css
├── app.js
├── README.md
└── docs/
    └── PROMPT.md
```

## Data Storage

BookNest uses browser localStorage to preserve book information between page refreshes.

Data is stored locally in the user's browser and is not synchronized across different devices.

## Future Improvements

- Edit book titles and authors.
- Add book cover images.
- Track reading goals.
- Add book ratings and reviews.
- Export reading lists.

## Live Website

Add the deployed website link here.

## GitHub Repository

Add the repository link here.