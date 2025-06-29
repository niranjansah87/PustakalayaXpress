import pyodbc

conn = pyodbc.connect(
    "DRIVER={ODBC Driver 17 for SQL Server};"
    "SERVER=localhost\\SQLEXPRESS;"
    "DATABASE=pustakalayaxpress;"
    "Trusted_Connection=yes;"
)
print("✅ Connected to SQL Server!")
