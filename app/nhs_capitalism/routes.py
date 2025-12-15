from flask import render_template
from app.nhs_capitalism import nhs_capitalism

@nhs_capitalism.route('/')
def index():
    return render_template('nhs_capitalism/index.html')
