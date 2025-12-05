from flask import Blueprint

time = Blueprint('time', __name__, template_folder='templates', static_folder='static')

from app.time import routes, consequence_api, test_endpoint
