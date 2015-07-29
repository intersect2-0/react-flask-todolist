from flask import Flask, render_template, request, redirect, url_for
from flask.ext.sqlalchemy import SQLAlchemy
from flask.ext.login import LoginManager, login_required,\
    flash, current_user, login_user, logout_user
import json

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

    next = request.args.get('next')
    #TODO validate next
    login_user(registered_user)
    return redirect(next or url_for('index'))


@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('index'))


@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'GET':
        return render_template('signup.html')

    username = request.form['username']
    email = request.form['email']
    password = request.form['password']
    user = SiteUsers(username=username, email=email, password=password)
    db.session.add(user)
    db.session.commit()
    return redirect(url_for('login'))


@app.route('/todolist')
@login_required
def todolist():
    class MyEncoder(json.JSONEncoder):
        def default(self, o):
            if isinstance(o, Todo):
                mydict = {}
                mydict['id'] = o.id
                mydict['text'] = o.text
                mydict['done'] = o.done
                mydict['date'] = o.created_on.isoformat()
                return mydict
            # Let the base class default method raise the TypeError
            return json.JSONEncoder.default(self, o)
    return json.dumps(current_user.todos.all(), cls=MyEncoder)