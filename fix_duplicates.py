import sqlite3

# Path to your SQLite database
db_path = 'db.sqlite3'

# Connect to the database
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# Fetch all employees
cursor.execute("SELECT id, employee_id FROM employees_employee")
rows = cursor.fetchall()

# Dictionary to track duplicates
unique_employee_ids = {}
duplicates = []

# Identify duplicates
for row in rows:
    employee_id = row[1]
    if employee_id in unique_employee_ids:
        duplicates.append(row[0])  # Storing the ID of the duplicate row
    else:
        unique_employee_ids[employee_id] = row[0]

# Handle duplicates by updating their employee_id
for emp_id in duplicates:
    new_id = f"{emp_id}_dup"
    cursor.execute("UPDATE employees_employee SET employee_id = ? WHERE id = ?", (new_id, emp_id))

# Commit changes and close connection
conn.commit()
conn.close()
print("Duplicates fixed!")


