from flask import Blueprint, render_template

cyber = Blueprint('cyber', __name__, template_folder='templates', static_folder='static')

@cyber.route('/')
def index():
    return render_template('cyber.html')
