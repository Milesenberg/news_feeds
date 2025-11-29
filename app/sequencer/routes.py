from flask import Blueprint, render_template

sequencer = Blueprint('sequencer', __name__, template_folder='templates', static_folder='static')

@sequencer.route('/')
def index():
    return render_template('sequencer.html')
