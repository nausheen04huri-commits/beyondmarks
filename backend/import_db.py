import mysql.connector

conn = mysql.connector.connect(
    host="sakura.proxy.rlwy.net",
    port=45791,
    user="root",
    password="mXEkqakmyYRzphNrQchffIqERNroEnvp",
    database="railway"
)

cursor = conn.cursor()

sql_file = r"C:\Users\maahi\OneDrive\Documents\dumps\beyondmarks.sql"

with open(sql_file, "r", encoding="utf-8") as f:
    sql = f.read()

statements = sql.split(";\n")

for statement in statements:
    if statement.strip():
        try:
            cursor.execute(statement)
        except Exception as e:
            print("Error:", e)

conn.commit()

cursor.execute("SHOW TABLES")
print("Tables:", cursor.fetchall())

cursor.close()
conn.close()

print("Import completed!")