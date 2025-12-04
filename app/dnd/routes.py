from flask import render_template
from app.dnd import dnd

@dnd.route('/')
def index():
    return render_template('dnd.html')
