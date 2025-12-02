from flask import render_template
from app.cyber import cyber

@cyber.route('/')
def index():
    return render_template('cyber.html')
