from flask import Blueprint

narrative = Blueprint('narrative', __name__, template_folder='templates', static_folder='static')

from app.narrative import routes
