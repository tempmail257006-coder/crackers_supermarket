from flask import Flask, render_template, request, redirect, session, send_file, url_for, flash
import sqlite3
import os
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from datetime import datetime

app = Flask(__name__)
app.secret_key = "crackers_supermarket_secret_key"
DB = "database/crackers.db"

# --- Database Connection ---
def get_db():
    conn = sqlite3.connect(DB)
    conn.row_factory = sqlite3.Row
    return conn

# --- Routes ---

@app.route("/")
def intro():
    # Intro page with Social Login buttons
    return render_template("intro.html")

@app.route("/home")
def home():
    return render_template("home.html")

# --- Authentication Routes ---

@app.route("/register", methods=["GET", "POST"])
def register():
    return render_template("register.html")

@app.route("/login", methods=["GET", "POST"])
def login():
    return render_template("login.html")

@app.route("/social_login/<provider>")
def social_login(provider):
    flash("Email/password authentication only. Please sign in.")
    return redirect(url_for('login'))

@app.route("/logout")
def logout():
    session.pop('user', None)
    return redirect(url_for('login'))

# --- Shop Routes ---

@app.route("/products")
def products():
    con = get_db()
    products = con.execute("SELECT * FROM products").fetchall()
    return render_template("products.html", products=products)

@app.route("/cart")
def cart():
    return render_template("cart.html")

@app.route("/checkout", methods=["GET", "POST"])
def checkout():
    if request.method == "POST":
        items = request.form.get("items") # Ensure your JS sends this
        total = request.form["total"]
        payment = request.form["payment"]
        delivery = request.form["delivery"] 

        con = get_db()
        cur = con.cursor()
        cur.execute(
            "INSERT INTO orders (order_date, total, payment_mode, delivery_type) VALUES (?,?,?,?)",
            (datetime.datetime.now().strftime("%Y-%m-%d %H:%M"), total, payment, delivery)
        )
        order_id = cur.lastrowid
        # Save Items
        if items:
            item_list = items.split(",")
            for i in item_list:
                name, qty, price = i.split("|")
                cur.execute(
                    "INSERT INTO order_items (order_id, product_name, quantity, price) VALUES (?,?,?,?)",
                    (order_id, name, qty, price)
                )

        con.commit()
        generate_invoice_pdf(order_id)
        return render_template("order_success.html", order_id=order_id)
    
    return render_template("checkout.html")

# --- PDF Generation ---
def generate_invoice_pdf(order):
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    invoice_dir = os.path.join(BASE_DIR, "reports", "invoices")
    os.makedirs(invoice_dir, exist_ok=True)

    file_path = os.path.join(invoice_dir, f"order_{order['order_id']}.pdf")

    c = canvas.Canvas(file_path, pagesize=A4)
    width, height = A4

    c.setFont("Helvetica-Bold", 18)
    c.drawString(200, height - 50, "INVOICE")

    c.setFont("Helvetica", 12)
    c.drawString(50, height - 100, f"Order ID: {order['order_id']}")
    c.drawString(50, height - 130, f"Customer: {order['user_name']}")
    c.drawString(50, height - 160, f"Date: {order['order_date']}")
    c.drawString(50, height - 190, f"Payment Mode: {order['payment_mode']}")
    c.drawString(50, height - 220, f"Delivery Type: {order['delivery_type']}")
    c.drawString(50, height - 260, f"Total Amount: ₹{order['total']}")

    c.drawString(50, height - 320, "Thank you for shopping with Crackers Supermarket!")

    c.showPage()
    c.save()

@app.route("/download_invoice/<int:order_id>")
def download_invoice(order_id):
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    invoice_dir = os.path.join(BASE_DIR, "reports", "invoices",)
    invoice_path = os.path.join(invoice_dir, f"order_{order_id}.pdf")

    os.makedirs(invoice_dir, exist_ok=True)


    if not os.path.exists(invoice_path):
        con= get_db()
        order = con.execute("SELECT * FROM orders WHERE order_id=?", (order_id,)).fetchone()
        if not order:
            return "Invoice not found", 404
        
        generate_invoice_pdf(order)

    return send_file(invoice_path, as_attachment=True, download_name=f"invoice_order_{order_id}.pdf", mimetype="application/pdf")

# --- Admin Routes ---

@app.route("/admin", methods=["GET", "POST"])
def admin_login():
    if request.method == "POST":
        username = request.form.get('username')
        password = request.form.get('password')
        
        if not username or not password:
            flash("Please enter both username and password")
            return render_template("admin_login.html")
        
        con = get_db()
        admin = con.execute("SELECT * FROM admin WHERE username=? AND password=?", (username, password)).fetchone()
        
        if admin:
            session['admin'] = True
            return redirect(url_for('admin_dashboard'))
        else:
            flash("Invalid Admin Credentials")
    return render_template("admin_login.html")

@app.route("/admin/dashboard")
def admin_dashboard():
    if 'admin' not in session:
        return redirect(url_for('admin_login'))
    
    con = get_db()
    orders = con.execute("SELECT * FROM orders ORDER BY order_id DESC").fetchall()
    return render_template("admin_dashboard.html", orders=orders)

@app.route("/contact_us", methods=["GET", "POST"])
def contact_us():
    if request.method == "POST":
        name = request.form['name']
        mobile = request.form['mobile']
        message = request.form['message']
        
        con = get_db()
        cur = con.cursor()
        cur.execute("INSERT INTO enquiries (name, mobile, message) VALUES (?, ?, ?)", 
                    (name, mobile, message))
        con.commit()
        flash("Message Sent Successfully! We will contact you soon.")
        return redirect(url_for('contact_us'))
        
    return render_template("contact_us.html")

if __name__ == "__main__":
    app.run(debug=True)
