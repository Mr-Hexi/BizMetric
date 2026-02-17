
# 📘 Python Assignment Repository

This repository contains two completed assignments:

1️⃣ A **Python practice assignment** covering ~53 questions on core Python concepts  
2️⃣ A **mini project – Food Ordering System** built using Python and SQL Server

The work demonstrates understanding of Python fundamentals, data structures, exception handling, file handling, OOP concepts, and database connectivity.

---

# 📂 Folder Structure

```
.
├── FoodOrdering.py
├── Python_Assignment.ipynb
└── README.md
```

---

# 📝 Files Description

## 📓 Python_Assignment.ipynb
This notebook contains solutions to a collection of ~53 Python questions covering:

- List slicing and indexing
- String operations
- Dictionaries and nested dictionaries
- Conditional statements (if–elif–else)
- Loops and iteration
- Exception handling
- Functions
- Data extraction and transformation
- Basic logic building exercises
- Basic Classes and  Objects
It serves as a structured practice notebook for Python fundamentals.

---

## 🍽️ FoodOrdering.py — Mini Project

A console-based **Food Ordering System** built using:

- Python (OOP based design)
- SQL Server database
- `pyodbc` for database connectivity
- File handling for receipt generation

### ✅ Features

- Connects to SQL Server database
- Fetches food menu dynamically from DB
- Displays formatted menu
- Accepts user orders with quantity
- Generates unique order ID using timestamp
- Calculates total bill
- Stores orders in database table
- Handles invalid inputs using exceptions
- Generates printable receipt file (`.txt`)
- Uses class inheritance (`Menu → Foodies`)

---

# 🧱 Project Design

## Class: `Menu`
- Connects to SQL Server
- Reads `FoodMenu` table
- Builds menu dictionary
- Displays formatted menu

## Class: `Foodies` (inherits Menu)
- Generates order ID
- Takes user orders
- Validates inputs
- Tracks quantities and prices
- Inserts order records into DB
- Generates bill
- Writes receipt to text file

---

# 🗄️ Database Requirements

The project expects a SQL Server database with:

## Database
```
Foodiess
```

## Table: FoodMenu
Example structure:

```sql
id INT PRIMARY KEY,
food VARCHAR(100),
price FLOAT
```

## Table: FoodOrders

```sql
orderID INT,
food_id INT,
food VARCHAR(100),
quantity INT,
price FLOAT,
order_date DATETIME
```

---

# ⚙️ Requirements

Install dependencies:

```bash
pip install pyodbc
```

Also required:

- SQL Server / SQL Server Express
- ODBC Driver for SQL Server
- Windows Trusted Connection enabled (or modify connection string)

---

# ▶️ How to Run

```bash
python FoodOrdering.py
```

Program flow:

1. Connect to database
2. Display menu
3. Ask for order input
4. Store order
5. Deliver order
6. Generate bill
7. Optionally print receipt file

---

# 🧪 Concepts Demonstrated

- Python OOP
- Inheritance
- Dictionary-based data storage
- Exception handling
- Database CRUD operations
- File writing
- Date & time handling
- Input validation
- Console formatting

---

# 📌 Notes

- Connection string currently uses local SQL Server instance — update if needed.
- Receipt files are generated using order timestamp as filename.
- Exception handling is added for user input and DB operations.

---

**Author:** Huzaifa Ansari  
**Assignment Type:** Python Practice + Mini Project
