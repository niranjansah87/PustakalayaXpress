import pyodbc

conn = pyodbc.connect('DRIVER={ODBC Driver 17 for SQL Server};SERVER=localhost;DATABASE=pustakalayaxpress;Trusted_Connection=yes;TrustServerCertificate=yes')
cursor = conn.cursor()
cursor.execute('SELECT @@VERSION')
row = cursor.fetchone()
print(row[0])
