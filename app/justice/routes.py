from flask import render_template
from app.justice import justice

@justice.route('/')
def index():
    return render_template('justice.html')
