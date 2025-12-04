from flask import Blueprint

dnd = Blueprint('dnd', __name__, template_folder='templates')

from app.dnd import routes
