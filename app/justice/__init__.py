from flask import Blueprint

justice = Blueprint('justice', __name__, template_folder='templates', static_folder='static')

from app.justice import routes
