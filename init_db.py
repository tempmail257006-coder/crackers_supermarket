import sqlite3
import os

DB_FOLDER = "database"
DB_FILE = os.path.join(DB_FOLDER, "crackers.db")

def initialize_database():
    # Ensure database folder exists
    if not os.path.exists(DB_FOLDER):
        os.makedirs(DB_FOLDER)

    conn = sqlite3.connect(DB_FILE)
    cur = conn.cursor()

    print("Creating tables...")

    # 1. Users Table (For Customer Login)
    cur.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
    )
    """)

    # 2. Products Table
    cur.execute("""
    CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        category TEXT,
        price REAL,
        stock INTEGER,
        image TEXT
    )
    """)

    # 3. Orders Table
    cur.execute("""
    CREATE TABLE IF NOT EXISTS orders (
        order_id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_name TEXT,
        order_date TEXT,
        total REAL,
        payment_mode TEXT,
        delivery_type TEXT
    )
    """)

    # 4. Order Items Table
    cur.execute("""
    CREATE TABLE IF NOT EXISTS order_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id INTEGER,
        product_name TEXT,
        quantity INTEGER,
        price REAL
    )
    """)

    # 5. Admin Table
    cur.execute("""
    CREATE TABLE IF NOT EXISTS admin (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT,
        password TEXT
    )
    """)

    # 6. Enquiries Table
    cur.execute("""
    CREATE TABLE IF NOT EXISTS enquiries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        mobile TEXT,
        message TEXT
    )
    """)

    # --- SEED DATA ---
    print("Seeding data...")
    
    # Add Admin
    cur.execute("DELETE FROM admin")
    cur.execute("INSERT INTO admin (username, password) VALUES (?, ?)", ('admin', 'admin123'))

    # Add Products
    cur.execute("DELETE FROM products")
    products = [
        ("Sparkler (Box)", "Kids", 50, 100, "sparkler.jpg"),
        ("Ground Chakkar", "Ground", 120, 80, "chakkar.jpg"),
        ("Rocket (Packet)", "Sky", 200, 60, "rocket.jpg"),
        ("Flower Pot", "Ground", 150, 90, "flowerpot.jpg"),
        ("Family Combo", "Combo", 1500, 20, "cracker_combo.jpg"),
        ("kurivi(packet)","Gound",50,100,"kurivi.jpg"),
        ("Bombs(box)","Gound",50,100,"bombs.jpg"),
        (" Gold lakshmi(packet)","Gound",70,100,"lakshmi.jpg"),
        (" Delux Elephant(packet)","Gound",50,100,"delux.jpg"),
        ("Madurai Malli (packet)","Gound",50,100,"madurai malli.jpg"),
        ("12-Shot(packet)","Gound",50,100,"12-shot.jpg"),
        ("Red Bijli (packet)","Gound",50,100,"red bijli.jpg"),
        ("Lunik Express Rocket(packet)","Gound",50,100,"lunik express rocket.jpg"),
        ("Colour Koti Delux(packet)","Gound",50,100,"colour koti delux.jpg"),
        ("Chakkar Delux(packet)","Gound",50,100,"chakkar delux.jpg"),
    ]
    cur.executemany("INSERT INTO products (name, category, price, stock, image) VALUES (?, ?, ?, ?, ?)", products)

    conn.commit()
    conn.close()
    print("Database initialized successfully!")

if __name__ == "__main__":
    initialize_database()
