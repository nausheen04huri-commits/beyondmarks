from flask import Flask, jsonify, request 
from flask_cors import CORS 
from db import get_db_connection 
 
app = Flask(__name__) 
CORS(app) 
 
 
# HOME 
@app.route("/") 
def home(): 
    return "BeyondMarks Backend is running!" 
 
 
# GET ALL STUDENTS 
@app.route("/api/test", methods=["GET"]) 
def test_database(): 
    try: 
        db = get_db_connection() 
        cursor = db.cursor(dictionary=True) 
 
        cursor.execute("SELECT * FROM students") 
        students = cursor.fetchall() 
 
        cursor.close() 
        db.close() 
 
        return jsonify(students) 
 
    except Exception as e: 
        return jsonify({"error": str(e)}), 500 
 
 
# GET STUDENTS 
@app.route("/api/students", methods=["GET"]) 
def get_students(): 
    try: 
        db = get_db_connection() 
        cursor = db.cursor(dictionary=True) 
 
        cursor.execute("SELECT * FROM students") 
        students = cursor.fetchall() 
 
        cursor.close() 
        db.close() 
 
        return jsonify(students) 
 
    except Exception as e: 
        return jsonify({"error": str(e)}), 500 
 
 
# ADD STUDENT 
@app.route("/api/students", methods=["POST"]) 
def add_student(): 
    try: 
        data = request.get_json() 
 
        student_id = data["student_id"] 
        name = data["name"] 
        department = data["department"] 
        attendance = data.get("attendance", 0) 
 
        db = get_db_connection() 
        cursor = db.cursor() 
 
        sql = """ 
            INSERT INTO students 
            (student_id, name, department, attendance) 
            VALUES (%s, %s, %s, %s) 
        """ 
 
        cursor.execute( 
            sql, 
            (student_id, name, department, attendance) 
        ) 
 
        db.commit() 
 
        new_id = cursor.lastrowid 
 
        cursor.close() 
        db.close() 
 
        return jsonify({ 
            "message": "Student added successfully!", 
            "id": new_id 
        }), 201 
 
    except Exception as e: 
        return jsonify({"error": str(e)}), 500 
 
 
# ADD ACADEMIC RECORD 
@app.route("/api/academics", methods=["POST"]) 
def add_academic(): 
    try: 
        data = request.get_json() 
 
        student_id = data["student_id"] 
        semester = data["semester"] 
        marks = data.get("marks", 0) 
        cgpa = data.get("cgpa", 0) 
 
        db = get_db_connection() 
        cursor = db.cursor() 
 
        sql = """ 
            INSERT INTO academics 
            (student_id, semester, marks, cgpa) 
            VALUES (%s, %s, %s, %s) 
        """ 
 
        cursor.execute( 
            sql, 
            (student_id, semester, marks, cgpa) 
        ) 
 
        db.commit() 
 
        new_id = cursor.lastrowid 
 
        cursor.close() 
        db.close() 
 
        return jsonify({ 
            "message": "Academic record added successfully!", 
            "id": new_id 
        }), 201 
 
    except Exception as e: 
        return jsonify({"error": str(e)}), 500 
 
 
# GET ACADEMIC RECORDS 
@app.route("/api/academics", methods=["GET"]) 
def get_academics(): 
    try: 
        db = get_db_connection() 
        cursor = db.cursor(dictionary=True) 
 
        cursor.execute("SELECT * FROM academics") 
        academics = cursor.fetchall() 
 
        cursor.close() 
        db.close() 
 
        return jsonify(academics) 
 
    except Exception as e: 
        return jsonify({"error": str(e)}), 500 
 
 
# ADD ACTIVITY 
@app.route("/api/activities", methods=["POST"]) 
def add_activity(): 
    try: 
        data = request.get_json() 
 
        student_id = data["student_id"] 
        activity_name = data["activity_name"] 
        activity_type = data.get("activity_type", "") 
        participation_date = data.get("participation_date") 
 
        db = get_db_connection() 
        cursor = db.cursor() 
 
        sql = """ 
            INSERT INTO activities 
            (student_id, activity_name, activity_type, participation_date) 
            VALUES (%s, %s, %s, %s) 
        """ 
 
        cursor.execute( 
            sql, 
            ( 
                student_id, 
                activity_name, 
                activity_type, 
                participation_date 
            ) 
        ) 
 
        db.commit() 
 
        new_id = cursor.lastrowid 
 
        cursor.close() 
        db.close() 
 
        return jsonify({ 
            "message": "Activity added successfully!", 
            "id": new_id 
        }), 201 
 
    except Exception as e: 
        return jsonify({"error": str(e)}), 500 
 
 
# GET ACTIVITIES 
@app.route("/api/activities", methods=["GET"]) 
def get_activities(): 
    try: 
        db = get_db_connection() 
        cursor = db.cursor(dictionary=True) 
 
        cursor.execute("SELECT * FROM activities") 
        activities = cursor.fetchall() 
 
        cursor.close() 
        db.close() 
 
        return jsonify(activities) 
 
    except Exception as e: 
        return jsonify({"error": str(e)}), 500 
 
 
# ADD SKILLS 
@app.route("/api/skills", methods=["POST"]) 
def add_skills(): 
    try: 
        data = request.get_json() 
 
        student_id = data["student_id"] 
        communication = data.get("communication", 0) 
        teamwork = data.get("teamwork", 0) 
        leadership = data.get("leadership", 0) 
        technical = data.get("technical", 0) 
 
        db = get_db_connection() 
        cursor = db.cursor() 
 
        sql = """ 
            INSERT INTO skills 
            (student_id, communication, teamwork, leadership, technical) 
            VALUES (%s, %s, %s, %s, %s) 
        """ 
 
        cursor.execute( 
            sql, 
            ( 
                student_id, 
                communication, 
                teamwork, 
                leadership, 
                technical 
            ) 
        ) 
 
        db.commit() 
 
        new_id = cursor.lastrowid 
 
        cursor.close() 
        db.close() 
 
        return jsonify({ 
            "message": "Skills added successfully!", 
            "id": new_id 
        }), 201 
 
    except Exception as e: 
        return jsonify({"error": str(e)}), 500 
 
 
# GET SKILLS 
@app.route("/api/skills", methods=["GET"]) 
def get_skills(): 
    try: 
        db = get_db_connection() 
        cursor = db.cursor(dictionary=True) 
 
        cursor.execute("SELECT * FROM skills") 
        skills = cursor.fetchall() 
 
        cursor.close() 
        db.close() 
 
        return jsonify(skills) 
 
    except Exception as e: 
        return jsonify({"error": str(e)}), 500 
 
 
# ADD ACHIEVEMENT 
@app.route("/api/achievements", methods=["POST"]) 
def add_achievement(): 
    try: 
        data = request.get_json() 
 
        student_id = data["student_id"] 
        title = data["title"] 
        level = data.get("level", "") 
        year = data.get("year") 
 
        db = get_db_connection() 
        cursor = db.cursor() 
 
        sql = """ 
            INSERT INTO achievements 
            (student_id, title, level, year) 
            VALUES (%s, %s, %s, %s) 
        """ 
 
        cursor.execute( 
            sql, 
            (student_id, title, level, year) 
        ) 
 
        db.commit() 
 
        new_id = cursor.lastrowid 
 
        cursor.close() 
        db.close() 
 
        return jsonify({ 
            "message": "Achievement added successfully!", 
            "id": new_id 
        }), 201 
 
    except Exception as e: 
        return jsonify({"error": str(e)}), 500 
 
 
# GET ACHIEVEMENTS 
@app.route("/api/achievements", methods=["GET"]) 
def get_achievements(): 
    try: 
        db = get_db_connection() 
        cursor = db.cursor(dictionary=True) 
 
        cursor.execute("SELECT * FROM achievements") 
        achievements = cursor.fetchall() 
 
        cursor.close() 
        db.close() 
 
        return jsonify(achievements) 
 
    except Exception as e: 
        return jsonify({"error": str(e)}), 500 
 
@app.route("/api/env-test")
def env_test():
    import os

    return {
        "DB_HOST": os.getenv("DB_HOST"),
        "DB_PORT": os.getenv("DB_PORT"),
        "DB_USER": os.getenv("DB_USER"),
        "DB_NAME": os.getenv("DB_NAME"),
        "RENDER": os.getenv("RENDER"),
        "PATH_EXISTS": "PATH" in os.environ
        "TEST_VALUE": os.getenv("TEST_VALUE")
    }
if __name__ == "__main__": 
    app.run(debug=True)  
