from flask import render_template
from app.picard import picard

@picard.route('/')
def index():
    return render_template('picard.html')
