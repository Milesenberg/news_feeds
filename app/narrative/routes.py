from flask import render_template
from app.narrative import narrative

@narrative.route('/')
def index():
    return render_template('narrative.html')
