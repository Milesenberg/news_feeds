from flask import render_template
from app.time import time

@time.route('/')
def index():
    return render_template('time_machine.html')
