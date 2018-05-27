from flask import Flask, render_template, request, redirect, jsonify
from flask_sqlalchemy import SQLAlchemy
import datetime

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:daler@localhost:3307/Flask_test' # MySql Config
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app) # connect mysql to Flask

# Model for Tasks
class Tasks(db.Model):
    id = db.Column(db.Integer, primary_key=True) # id - int auto increment field
    title = db.Column(db.String(100), nullable=False) # title of the taks, cannot be empty
    notes = db.Column(db.String(200)) # additional notes of task, shows up in Tooltip
    status = db.Column(db.Boolean, default=False) # status of task, default is False
    deadline = db.Column(db.Date, nullable=False, 
                         default=datetime.date.today()) # date for taks completions


# homepage
@app.route('/')
def index():
    results = Tasks.query.all() # get all tasks
    return render_template('index.html', tasks=results) #  send result to render


@app.route('/add_task', methods=['POST']) # only post method accepted
def add_task():
    title = request.json['title']
    comment = request.json['comment']
    deadline = request.json['deadline'] # get all send data
    task = Tasks(notes=comment, deadline=deadline, title=title) # create Task object with passed data
    success = True
    id = 0
    try:
        db.session.add(task)
        db.session.commit() # add to database
        result = Tasks.query.order_by('-id').first() # get last added id
        id = result.id # to use it in .js file
    except Exception as e:
        db.session.rollback()
        db.session.flush()  # for resetting non-commited
        print(e)
        success = False # indicate if any exception in database insertion

    return jsonify({"success": success, "id": id}) # send status of query and id 


@app.route('/complete_task', methods=['POST'])  # only post method accepted
def task_complete():
    task_id = request.json['id'] # which taks should be completed
    success = True
    try:
        result = Tasks.query.filter_by(id=task_id).first() # get that task
        result.status = True # make it completed
        db.session.commit() # update
    except Exception as e:
        db.session.rollback()
        db.session.flush()
        print(e)
        success = False
    return jsonify(result=success) # send status of query

if __name__ == '__main__':
    app.run(debug=True)
