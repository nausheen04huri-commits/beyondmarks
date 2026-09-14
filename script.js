const API = "https://beyondmarks-1.onrender.com";

let students = [];
let academics = [];
let activities = [];
let skills = [];
let achievements = [];

/* =========================
   PAGE NAVIGATION
========================= */

function showPage(pageId) {
    document.querySelectorAll(".page").forEach(function(page) {
        page.classList.remove("active");
    });

    const page = document.getElementById(pageId);

    if (page) {
        page.classList.add("active");
    }

    document.querySelectorAll(".menu-item").forEach(function(item) {
        item.classList.remove("active");
    });

    const items = document.querySelectorAll(".menu-item");

    items.forEach(function(item) {
        const onclickText = item.getAttribute("onclick");

        if (onclickText && onclickText.indexOf("showPage('" + pageId + "')") !== -1) {
            item.classList.add("active");
        }
    });
}

/* =========================
   SIDEBAR
========================= */

function toggleSidebar() {
    const sidebar = document.querySelector(".sidebar");

    if (sidebar) {
        sidebar.classList.toggle("open");
    }
}

/* =========================
   MODAL
========================= */

function openModal() {
    const modal = document.getElementById("modal");

    if (modal) {
        modal.style.display = "flex";
    }
}

function closeModal() {
    const modal = document.getElementById("modal");

    if (modal) {
        modal.style.display = "none";
    }
}

/* =========================
   HELPERS
========================= */

function numberValue(value) {
    const number = Number(value);

    if (isNaN(number)) {
        return 0;
    }

    return number;
}

function percentage(value) {
    return numberValue(value).toFixed(1);
}

function getInitials(name) {
    if (!name) {
        return "ST";
    }

    const words = String(name).trim().split(" ");

    if (words.length === 1) {
        return words[0].substring(0, 2).toUpperCase();
    }

    return (
        words[0].charAt(0) +
        words[words.length - 1].charAt(0)
    ).toUpperCase();
}

async function getJSON(url, options) {
    const response = await fetch(url, options);

    if (!response.ok) {
        throw new Error("Request failed: " + response.status);
    }

    return await response.json();
}

function escapeHTML(value) {
    return String(value == null ? "" : value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

/* =========================
   STUDENTS
========================= */

async function loadStudents() {
    try {
        students = await getJSON(API + "/api/students");

        renderStudents();
        renderRecentStudents();
        renderStudentCards();
        updateDashboardStats();
    } catch (error) {
        console.error("Students error:", error);
    }
}

function renderStudents() {
    const table = document.getElementById("studentTable");

    if (!table) {
        return;
    }

    table.innerHTML = "";

    students.forEach(function(student) {
        const row = document.createElement("tr");

        row.innerHTML =
            "<td>" + escapeHTML(student.student_id) + "</td>" +
            "<td>" + escapeHTML(student.name) + "</td>" +
            "<td>" + escapeHTML(student.department) + "</td>" +
            "<td>" + percentage(student.attendance) + "%</td>";

        table.appendChild(row);
    });
}

function renderRecentStudents() {
    const table = document.getElementById("recentStudentTable");

    if (!table) {
        return;
    }

    table.innerHTML = "";

    students.slice(0, 5).forEach(function(student) {
        const row = document.createElement("tr");

        row.innerHTML =
            "<td>" + escapeHTML(student.student_id) + "</td>" +
            "<td>" + escapeHTML(student.name) + "</td>" +
            "<td>" + escapeHTML(student.department) + "</td>" +
            "<td>" + percentage(student.attendance) + "%</td>";

        table.appendChild(row);
    });
}

function renderStudentCards() {
    const grid = document.querySelector(".student-grid");

    if (!grid) {
        return;
    }

    grid.innerHTML = "";

    students.forEach(function(student) {
        const card = document.createElement("div");

        card.className = "student-card";

        card.innerHTML =
            "<div class=\"student-avatar\">" +
                escapeHTML(getInitials(student.name)) +
            "</div>" +
            "<div>" +
                "<h3>" + escapeHTML(student.name) + "</h3>" +
                "<p>" + escapeHTML(student.student_id) + "</p>" +
                "<p>" + escapeHTML(student.department) + "</p>" +
                "<p>Attendance: " + percentage(student.attendance) + "%</p>" +
            "</div>";

        grid.appendChild(card);
    });
}

function updateDashboardStats() {
    const totalStudents = document.getElementById("totalStudents");
    const averageAttendance = document.getElementById("averageAttendance");

    if (totalStudents) {
        totalStudents.textContent = students.length;
    }

    if (averageAttendance) {
        if (students.length === 0) {
            averageAttendance.textContent = "0%";
        } else {
            let total = 0;

            students.forEach(function(student) {
                total += numberValue(student.attendance);
            });

            averageAttendance.textContent =
                (total / students.length).toFixed(1) + "%";
        }
    }

    const totalStudentsElements =
        document.querySelectorAll(".stat-card");

    if (totalStudentsElements.length > 0) {
        const first = totalStudentsElements[0]
            .querySelector(".stat-number, h2, h3");

        if (first) {
            first.textContent = students.length;
        }
    }
}

/* =========================
   ACADEMICS
========================= */

async function loadAcademics() {
    try {
        academics = await getJSON(API + "/api/academics");
        renderAcademics();
    } catch (error) {
        console.error("Academics error:", error);
    }
}

function renderAcademics() {
    const container = document.getElementById("academicBars");

    if (!container) {
        return;
    }

    container.innerHTML = "";

    if (academics.length === 0) {
        container.innerHTML = "<p>No academic records available.</p>";
        return;
    }

    academics.forEach(function(record) {
        const item = document.createElement("div");

        item.className = "academic-bar";

        item.innerHTML =
            "<div>" +
                "<strong>Semester " +
                escapeHTML(record.semester) +
                "</strong>" +
                "<span>" +
                numberValue(record.marks).toFixed(1) +
                "%</span>" +
            "</div>" +
            "<div class=\"bar\">" +
                "<div class=\"fill\" style=\"width:" +
                Math.min(numberValue(record.marks), 100) +
                "%\"></div>" +
            "</div>";

        container.appendChild(item);
    });
}

/* =========================
   ACTIVITIES
========================= */

async function loadActivities() {
    try {
        activities = await getJSON(API + "/api/activities");
        renderActivities();

        const element = document.getElementById("totalActivities");

        if (element) {
            element.textContent = activities.length;
        }
    } catch (error) {
        console.error("Activities error:", error);
    }
}

function renderActivities() {
    const grid = document.getElementById("activityGrid");

    if (!grid) {
        return;
    }

    grid.innerHTML = "";

    if (activities.length === 0) {
        grid.innerHTML = "<p>No activities available.</p>";
        return;
    }

    activities.forEach(function(activity) {
        const card = document.createElement("div");

        card.className = "activity-card";

        card.innerHTML =
            "<h3>" +
            escapeHTML(activity.activity_name) +
            "</h3>" +
            "<p>" +
            escapeHTML(activity.activity_type || "Activity") +
            "</p>";

        grid.appendChild(card);
    });
}

/* =========================
   SKILLS
========================= */

async function loadSkills() {
    try {
        skills = await getJSON(API + "/api/skills");
        renderSkills();
    } catch (error) {
        console.error("Skills error:", error);
    }
}

function renderSkills() {
    const container = document.getElementById("skillsContainer");

    if (!container) {
        return;
    }

    container.innerHTML = "";

    if (skills.length === 0) {
        container.innerHTML = "<p>No skill records available.</p>";
        return;
    }

    skills.forEach(function(skill) {
        const card = document.createElement("div");

        card.className = "skill-card";

        card.innerHTML =
            "<h3>" +
            escapeHTML(skill.name || "Student") +
            "</h3>" +
            "<p>Communication: " +
            numberValue(skill.communication) +
            "%</p>" +
            "<p>Teamwork: " +
            numberValue(skill.teamwork) +
            "%</p>" +
            "<p>Leadership: " +
            numberValue(skill.leadership) +
            "%</p>" +
            "<p>Technical: " +
            numberValue(skill.technical) +
            "%</p>";

        container.appendChild(card);
    });
}

/* =========================
   ACHIEVEMENTS
========================= */

async function loadAchievements() {
    try {
        achievements = await getJSON(API + "/api/achievements");
        renderAchievements();

        const element =
            document.getElementById("totalAchievements");

        if (element) {
            element.textContent = achievements.length;
        }
    } catch (error) {
        console.error("Achievements error:", error);
    }
}

function renderAchievements() {
    const grid = document.getElementById("achievementGrid");

    if (!grid) {
        return;
    }

    grid.innerHTML = "";

    if (achievements.length === 0) {
        grid.innerHTML = "<p>No achievements available.</p>";
        return;
    }

    achievements.forEach(function(achievement) {
        const card = document.createElement("div");

        card.className = "achievement-card";

        card.innerHTML =
            "<h3>" +
            escapeHTML(achievement.title) +
            "</h3>" +
            "<p>" +
            escapeHTML(achievement.level || "") +
            "</p>" +
            "<p>" +
            escapeHTML(achievement.year || "") +
            "</p>";

        grid.appendChild(card);
    });
}

/* =========================
   ADD STUDENT
========================= */

async function addStudent(event) {
    if (event) {
        event.preventDefault();
    }

    const nameElement = document.getElementById("studentName");
    const idElement = document.getElementById("studentId");
    const departmentElement = document.getElementById("department");
    const attendanceElement = document.getElementById("attendance");

    if (!nameElement || !idElement || !departmentElement || !attendanceElement) {
        return;
    }

    const data = {
        name: nameElement.value.trim(),
        student_id: idElement.value.trim(),
        department: departmentElement.value,
        attendance: numberValue(attendanceElement.value)
    };

    if (!data.name || !data.student_id || !data.department) {
        alert("Please fill all required fields.");
        return;
    }

    try {
        await getJSON(API + "/api/students", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        closeModal();

        if (nameElement) nameElement.value = "";
        if (idElement) idElement.value = "";
        if (attendanceElement) attendanceElement.value = "";

        await loadStudents();

        alert("Student added successfully.");
    } catch (error) {
        console.error("Add student error:", error);
        alert("Unable to add student.");
    }
}

/* =========================
   SEARCH
========================= */

function searchStudent() {
    const searchElement = document.getElementById("search");

    if (!searchElement) {
        return;
    }

    const value = searchElement.value.toLowerCase().trim();

    document.querySelectorAll(".student-card").forEach(function(card) {
        const text = card.textContent.toLowerCase();

        if (text.indexOf(value) !== -1) {
            card.style.display = "";
        } else {
            card.style.display = "none";
        }
    });
}

/* =========================
   REFRESH EVERYTHING
========================= */

async function refreshAll() {
    await loadStudents();
    await loadAcademics();
    await loadActivities();
    await loadSkills();
    await loadAchievements();
}

/* =========================
   START
========================= */

document.addEventListener("DOMContentLoaded", function() {
    refreshAll();
});
