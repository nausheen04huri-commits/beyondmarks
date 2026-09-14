```javascript
// =====================================================
// BeyondMarks - Frontend JavaScript
// Connected to Render + MySQL Backend
// =====================================================

const API = "https://beyondmarks-1.onrender.com";

// =====================================================
// PAGE NAVIGATION
// =====================================================

function showPage(pageId) {
    document.querySelectorAll(".page").forEach(page => {
        page.classList.remove("active-page");
    });

    const selectedPage = document.getElementById(pageId);

    if (selectedPage) {
        selectedPage.classList.add("active-page");
    }

    document.querySelectorAll(".menu-item").forEach(item => {
        item.classList.remove("active");
    });

    const clickedItem = document.querySelector(
        '.menu-item[onclick="showPage(\'' + pageId + '\')"]'
    );

    if (clickedItem) {
        clickedItem.classList.add("active");
    }

    const sidebar = document.querySelector(".sidebar");

    if (sidebar) {
        sidebar.classList.remove("show");
    }

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


// =====================================================
// MOBILE SIDEBAR
// =====================================================

function toggleSidebar() {
    const sidebar = document.querySelector(".sidebar");

    if (sidebar) {
        sidebar.classList.toggle("show");
    }
}


// =====================================================
// MODAL
// =====================================================

function openModal() {
    const modal = document.getElementById("modal");

    if (modal) {
        modal.classList.add("show");
    }
}

function closeModal() {
    const modal = document.getElementById("modal");

    if (modal) {
        modal.classList.remove("show");
    }
}

document.addEventListener("DOMContentLoaded", () => {

    const modal = document.getElementById("modal");

    if (modal) {
        modal.addEventListener("click", function (event) {
            if (event.target === this) {
                closeModal();
            }
        });
    }

    const notification = document.querySelector(".notification");

    if (notification) {
        notification.addEventListener("click", function () {
            alert("BeyondMarks is connected to the student database.");
        });
    }

    // Load database data when page opens
    refreshAll();
});


// =====================================================
// HELPER FUNCTIONS
// =====================================================

function getInitials(name) {
    return String(name || "")
        .trim()
        .split(/\s+/)
        .map(word => word.charAt(0))
        .join("")
        .substring(0, 2)
        .toUpperCase();
}

function numberValue(value) {
    const n = Number(value);
    return Number.isFinite(n) ? n : 0;
}

function percentage(value) {
    return `${numberValue(value).toFixed(1)}%`;
}

async function getJSON(url) {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
    }

    return await response.json();
}


// =====================================================
// LOAD STUDENTS
// =====================================================

async function loadStudents() {

    try {

        const students = await getJSON(`${API}/api/students`);

        console.log("Students loaded:", students);

        renderStudents(students);
        updateDashboardStats(students);

        return students;

    } catch (error) {

        console.error("Error loading students:", error);

        const table = document.getElementById("studentTable");

        if (table) {
            table.innerHTML = `
                <tr>
                    <td colspan="7">
                        Unable to load students.
                    </td>
                </tr>
            `;
        }

        return [];
    }
}


// =====================================================
// RENDER STUDENT TABLE
// =====================================================

function renderStudents(students) {

    const table = document.getElementById("studentTable");

    if (!table) {
        return;
    }

    table.innerHTML = "";

    if (!students || students.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="7">
                    No students found.
                </td>
            </tr>
        `;

        return;
    }

    students.forEach((student, index) => {

        const initials = getInitials(student.name);

        const attendance = numberValue(student.attendance);
        const cgpa = numberValue(student.cgpa);
        const overall = numberValue(student.overall_score);

        let status = "New";
        let statusClass = "good";

        if (overall >= 85) {
            status = "Excellent";
            statusClass = "excellent";
        } else if (overall >= 70) {
            status = "Good";
            statusClass = "good";
        }

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>
                <div class="student-name">
                    <div class="student-avatar ${index % 4 === 1 ? "avatar-2" : index % 4 === 2 ? "avatar-3" : index % 4 === 3 ? "avatar-4" : ""}">
                        ${initials}
                    </div>

                    <div>
                        <strong>${escapeHTML(student.name)}</strong>
                        <small>${escapeHTML(student.student_id)}</small>
                    </div>
                </div>
            </td>

            <td>${escapeHTML(student.department)}</td>

            <td>${cgpa > 0 ? cgpa.toFixed(2) : "--"}</td>

            <td>${attendance.toFixed(1)}%</td>

            <td>--</td>

            <td>
                <strong>
                    ${overall > 0 ? overall.toFixed(1) : "--"}
                </strong>
            </td>

            <td>
                <span class="badge ${statusClass}">
                    ${status}
                </span>
            </td>
        `;

        table.appendChild(row);
    });

    renderRecentStudents(students);
    renderStudentCards(students);
}


// =====================================================
// RECENT STUDENTS
// =====================================================

function renderRecentStudents(students) {

    const recentTable = document.getElementById("recentStudentTable");

    if (!recentTable) {
        return;
    }

    recentTable.innerHTML = "";

    const recentStudents = students.slice(-4).reverse();

    recentStudents.forEach((student, index) => {

        const initials = getInitials(student.name);

        const attendance = numberValue(student.attendance);
        const cgpa = numberValue(student.cgpa);
        const overall = numberValue(student.overall_score);

        let status = "New";
        let statusClass = "good";

        if (overall >= 85) {
            status = "Excellent";
            statusClass = "excellent";
        } else if (overall >= 70) {
            status = "Good";
            statusClass = "good";
        }

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>
                <div class="student-name">
                    <div class="student-avatar">
                        ${initials}
                    </div>

                    <div>
                        <strong>${escapeHTML(student.name)}</strong>
                        <small>${escapeHTML(student.student_id)}</small>
                    </div>
                </div>
            </td>

            <td>${escapeHTML(student.department)}</td>

            <td>${cgpa > 0 ? cgpa.toFixed(2) : "--"}</td>

            <td>${attendance.toFixed(1)}%</td>

            <td>--</td>

            <td>
                <strong>
                    ${overall > 0 ? overall.toFixed(1) : "--"}
                </strong>
            </td>

            <td>
                <span class="badge ${statusClass}">
                    ${status}
                </span>
            </td>
        `;

        recentTable.appendChild(row);
    });
}


// =====================================================
// STUDENT CARDS
// =====================================================

function renderStudentCards(students) {

    const grid = document.querySelector(".student-grid");

    if (!grid) {
        return;
    }

    grid.innerHTML = "";

    students.forEach(student => {

        const initials = getInitials(student.name);

        const attendance = numberValue(student.attendance);
        const cgpa = numberValue(student.cgpa);
        const overall = numberValue(student.overall_score);

        const card = document.createElement("div");

        card.className = "student-profile-card";

        card.innerHTML = `
            <div class="big-avatar">
                ${initials}
            </div>

            <h3>${escapeHTML(student.name)}</h3>

            <p>${escapeHTML(student.department)}</p>

            <span class="student-id">
                ${escapeHTML(student.student_id)}
            </span>

            <div class="profile-stats">

                <div>
                    <strong>
                        ${cgpa > 0 ? cgpa.toFixed(2) : "--"}
                    </strong>
                    <span>CGPA</span>
                </div>

                <div>
                    <strong>
                        ${attendance.toFixed(1)}%
                    </strong>
                    <span>Attendance</span>
                </div>

                <div>
                    <strong>
                        ${overall > 0 ? overall.toFixed(1) : "--"}
                    </strong>
                    <span>Overall</span>
                </div>

            </div>

            <button class="view-profile"
                    onclick="alert('Student: ${escapeJS(student.name)}')">
                View Full Profile
            </button>
        `;

        grid.appendChild(card);
    });
}


// =====================================================
// DASHBOARD STATISTICS
// =====================================================

function updateDashboardStats(students) {

    const statCards = document.querySelectorAll(".stat-card h3");

    if (!statCards.length) {
        return;
    }

    const totalStudents = students.length;

    const attendanceValues = students.map(student =>
        numberValue(student.attendance)
    );

    const averageAttendance =
        attendanceValues.length > 0
            ? attendanceValues.reduce((a, b) => a + b, 0) /
              attendanceValues.length
            : 0;

    if (statCards[0]) {
        statCards[0].textContent = totalStudents;
    }

    if (statCards[1]) {
        statCards[1].textContent =
            `${averageAttendance.toFixed(1)}%`;
    }

    // Activities and achievements are updated separately
}


// =====================================================
// LOAD ACADEMICS
// =====================================================

async function loadAcademics() {

    try {

        const data = await getJSON(`${API}/api/academics`);

        console.log("Academics loaded:", data);

        renderAcademics(data);

        return data;

    } catch (error) {

        console.error("Error loading academics:", error);

        return [];
    }
}


function renderAcademics(data) {

    const academicBars =
        document.querySelector(".academic-bars");

    if (!academicBars) {
        return;
    }

    academicBars.innerHTML = "";

    if (!data || data.length === 0) {

        academicBars.innerHTML =
            "<p>No academic records available.</p>";

        return;
    }

    const departments = {};

    data.forEach(record => {

        const department =
            record.department || "Other";

        if (!departments[department]) {
            departments[department] = [];
        }

        departments[department].push(
            numberValue(record.marks)
        );
    });

    Object.keys(departments).forEach(department => {

        const marks = departments[department];

        const average =
            marks.reduce((a, b) => a + b, 0) /
            marks.length;

        const value = Math.min(100, Math.max(0, average));

        const item = document.createElement("div");

        item.innerHTML = `
            <span>${escapeHTML(department)}</span>

            <div class="progress">
                <div style="width:${value}%"></div>
            </div>

            <b>${value.toFixed(1)}%</b>
        `;

        academicBars.appendChild(item);
    });

    const cgpaValues = data
        .map(item => numberValue(item.cgpa))
        .filter(value => value > 0);

    const markValues = data
        .map(item => numberValue(item.marks))
        .filter(value => value > 0);

    const averageCgpa =
        cgpaValues.length
            ? cgpaValues.reduce((a, b) => a + b, 0) /
              cgpaValues.length
            : 0;

    const averageMarks =
        markValues.length
            ? markValues.reduce((a, b) => a + b, 0) /
              markValues.length
            : 0;

    const boxes =
        document.querySelectorAll(".academic-box strong");

    if (boxes[0]) {
        boxes[0].textContent =
            averageCgpa > 0
                ? averageCgpa.toFixed(2)
                : "--";
    }

    if (boxes[1]) {
        boxes[1].textContent =
            averageMarks > 0
                ? `${averageMarks.toFixed(1)}%`
                : "--";
    }
}


// =====================================================
// LOAD ACTIVITIES
// =====================================================

async function loadActivities() {

    try {

        const data =
            await getJSON(`${API}/api/activities`);

        console.log("Activities loaded:", data);

        renderActivities(data);

        return data;

    } catch (error) {

        console.error("Error loading activities:", error);

        return [];
    }
}


function renderActivities(data) {

    const grid =
        document.querySelector(".activity-grid");

    if (!grid) {
        return;
    }

    grid.innerHTML = "";

    const activities = data || [];

    const total = activities.length;

    const technical =
        activities.filter(item =>
            String(item.activity_type || "")
                .toLowerCase()
                .includes("technical")
        ).length;

    const other =
        total - technical;

    const cards = [
        {
            icon: "fa-code",
            title: "Technical Clubs",
            value: technical,
            text: "Students participated"
        },
        {
            icon: "fa-microphone",
            title: "Events",
            value: total,
            text: "Activities recorded"
        },
        {
            icon: "fa-people-group",
            title: "Other Activities",
            value: other,
            text: "Activities recorded"
        }
    ];

    cards.forEach(cardData => {

        const card = document.createElement("div");

        card.className = "activity-card";

        card.innerHTML = `
            <div class="activity-icon">
                <i class="fa-solid ${cardData.icon}"></i>
            </div>

            <h3>${cardData.title}</h3>

            <strong>${cardData.value}</strong>

            <p>${cardData.text}</p>
        `;

        grid.appendChild(card);
    });

    const statCards =
        document.querySelectorAll(".stat-card h3");

    if (statCards[2]) {
        statCards[2].textContent = total;
    }
}


// =====================================================
// LOAD SKILLS
// =====================================================

async function loadSkills() {

    try {

        const data =
            await getJSON(`${API}/api/skills`);

        console.log("Skills loaded:", data);

        renderSkills(data);

        return data;

    } catch (error) {

        console.error("Error loading skills:", error);

        return [];
    }
}


function renderSkills(data) {

    const container =
        document.querySelector(".skills-container");

    if (!container) {
        return;
    }

    container.innerHTML = "";

    if (!data || data.length === 0) {

        container.innerHTML =
            "<p>No skill records available.</p>";

        return;
    }

    const fields = [
        {
            key: "communication",
            name: "Communication",
            description: "Presentation & speaking"
        },
        {
            key: "teamwork",
            name: "Teamwork",
            description: "Collaboration"
        },
        {
            key: "leadership",
            name: "Leadership",
            description: "Leadership activities"
        },
        {
            key: "technical",
            name: "Technical Skills",
            description: "Programming & technology"
        }
    ];

    fields.forEach(field => {

        const values = data
            .map(item => numberValue(item[field.key]))
            .filter(value => value >= 0);

        const average =
            values.length
                ? values.reduce((a, b) => a + b, 0) /
                  values.length
                : 0;

        const value =
            Math.min(100, Math.max(0, average));

        const row = document.createElement("div");

        row.className = "skill-row";

        row.innerHTML = `
            <div>
                <strong>${field.name}</strong>
                <small>${field.description}</small>
            </div>

            <div class="skill-progress">
                <div style="width:${value}%"></div>
            </div>

            <b>${value.toFixed(1)}%</b>
        `;

        container.appendChild(row);
    });
}


// =====================================================
// LOAD ACHIEVEMENTS
// =====================================================

async function loadAchievements() {

    try {

        const data =
            await getJSON(`${API}/api/achievements`);

        console.log("Achievements loaded:", data);

        renderAchievements(data);

        return data;

    } catch (error) {

        console.error("Error loading achievements:", error);

        return [];
    }
}


function renderAchievements(data) {

    const grid =
        document.querySelector(".achievement-grid");

    if (!grid) {
        return;
    }

    grid.innerHTML = "";

    if (!data || data.length === 0) {

        grid.innerHTML =
            "<p>No achievements recorded.</p>";

        return;
    }

    const medals = ["🥇", "🏆", "🥈", "🏅"];

    data.forEach((achievement, index) => {

        const card =
            document.createElement("div");

        card.className = "achievement-card";

        const year =
            achievement.year || "N/A";

        const level =
            achievement.level || "Achievement";

        const studentName =
            achievement.name ||
            achievement.student_name ||
            achievement.student ||
            "Student";

        card.innerHTML = `
            <div class="medal">
                ${medals[index % medals.length]}
            </div>

            <h3>
                ${escapeHTML(
                    achievement.title || "Achievement"
                )}
            </h3>

            <p>
                ${escapeHTML(studentName)}
            </p>

            <small>
                ${escapeHTML(level)} • ${year}
            </small>
        `;

        grid.appendChild(card);
    });

    const statCards =
        document.querySelectorAll(".stat-card h3");

    if (statCards[3]) {
        statCards[3].textContent = data.length;
    }
}


// =====================================================
// ADD STUDENT
// =====================================================

async function addStudent(event) {

    event.preventDefault();

    const name =
        document.getElementById("name").value.trim();

    const studentId =
        document.getElementById("studentId").value.trim();

    const department =
        document.getElementById("department").value;

    const attendance =
        document.getElementById("attendance").value || 0;

    if (!name || !studentId) {

        alert("Please enter student name and student ID.");

        return;
    }

    const studentData = {
        name: name,
        student_id: studentId,
        department: department,
        attendance: Number(attendance)
    };

    try {

        const response = await fetch(
            `${API}/api/students`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(studentData)
            }
        );

        const result = await response.json();

        if (!response.ok) {

            throw new Error(
                result.error ||
                result.message ||
                "Failed to add student"
            );
        }

        console.log("Student added:", result);

        alert(`${name} has been added successfully!`);

        document.querySelector("#modal form").reset();

        closeModal();

        await loadStudents();

        showPage("students");

    } catch (error) {

        console.error("Add student error:", error);

        alert(
            "Unable to add student.\n\n" +
            error.message
        );
    }
}


// =====================================================
// SEARCH STUDENT
// =====================================================

function searchStudent() {

    const input =
        document.getElementById("studentSearch");

    if (!input) {
        return;
    }

    const searchText =
        input.value.toLowerCase().trim();

    const rows =
        document.querySelectorAll("#studentTable tr");

    rows.forEach(row => {

        const text =
            row.innerText.toLowerCase();

        row.style.display =
            text.includes(searchText)
                ? ""
                : "none";
    });
}


// =====================================================
// REFRESH EVERYTHING
// =====================================================

async function refreshAll() {

    console.log("Connecting to BeyondMarks backend...");

    try {

        const students = await loadStudents();

        await Promise.all([
            loadAcademics(),
            loadActivities(),
            loadSkills(),
            loadAchievements()
        ]);

        console.log(
            "BeyondMarks connected successfully.",
            students
        );

    } catch (error) {

        console.error(
            "Refresh error:",
            error
        );
    }
}


// =====================================================
// SECURITY HELPERS
// =====================================================

function escapeHTML(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function escapeJS(value) {

    return String(value ?? "")
        .replace(/\\/g, "\\\\")
        .replace(/'/g, "\\'")
        .replace(/"/g, '\\"')
        .replace(/\n/g, "\\n")
        .replace(/\r/g, "\\r");
}
```
