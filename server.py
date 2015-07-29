from flask import Flask, render_template, request, redirect, url_for
from flask.ext.sqlalchemy import SQLAlchemy
from flask.ext.login import LoginManager, login_required, flash, current_user, login_user

app = Flask(__name__)
app.config.from_object('config')
db = SQLAlchemy(app)
login_manager = LoginManager()
login_manager.init_app(app)

from models import *

@login_manager.user_loader
def load_user(userid):
    return SiteUsers.query.get(int(userid))

@app.route('/')
def index():
    return render_template('index.html')


if __name__ == '__main__':
    app.run()


@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'GET':
        return render_template('login.html')

    email = request.form['email']
    password = request.form['password']
    registered_user = SiteUsers.query.filter_by(email=email, password=password).first()
    if registered_user is None:
        return redirect(url_for('login'))

    login_user(registered_user)
    return redirect(url_for('index'))


