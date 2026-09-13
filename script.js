// ================= PAGE NAVIGATION =================

function showPage(pageId) {
    const pages = document.querySelectorAll(".page");

    pages.forEach(page => {
        page.classList.remove("active-page");
    });

    const selectedPage = document.getElementById(pageId);

    if (selectedPage) {
        selectedPage.classList.add("active-page");
    }

    const menuItems = document.querySelectorAll(".menu-item");

    menuItems.forEach(item => {
        item.classList.remove("active");
    });

    const clickedItem = document.querySelector(
        `.menu-item[onclick="showPage('${pageId}')"]`
    );

    if (clickedItem) {
        clickedItem.classList.add("active");
    }

    document.querySelector(".sidebar").classList.remove("show");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


// ================= MOBILE SIDEBAR =================

function toggleSidebar() {
    const sidebar = document.querySelector(".sidebar");
    sidebar.classList.toggle("show");
}


// ================= MODAL =================

function openModal() {
    const modal = document.getElementById("modal");
    modal.classList.add("show");
}

function closeModal() {
    const modal = document.getElementById("modal");
    modal.classList.remove("show");
}


// Close modal when clicking outside

document.getElementById("modal").addEventListener("click", function(event) {
    if (event.target === this) {
        closeModal();
    }
});


// ================= ADD STUDENT =================

async function addStudent(event) {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const studentId = document.getElementById("studentId").value.trim();
    const department = document.getElementById("department").value;
    const attendance = document.getElementById("attendance").value;

    if (!name || !studentId || !attendance) {
        alert("Please fill in all fields.");
        return;
    }

    try {
        const response = await fetch(
            "https://beyondmarks-1.onrender.com/api/students",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    student_id: studentId,
                    name: name,
                    department: department,
                    attendance: Number(attendance)
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            alert("Error: " + (data.error || "Could not add student."));
            return;
        }

        alert(name + " has been added successfully!");

        document.getElementById("studentForm").reset();

        closeModal();

        await loadStudents();

    } catch (error) {
        console.error(error);
        alert("Could not connect to the backend.");
    }
}


// ================= STUDENT SEARCH =================

function searchStudent() {
    const input = document
        .getElementById("studentSearch")
        .value
        .toLowerCase();

    const rows = document.querySelectorAll("#studentTable tr");

    rows.forEach(row => {
        const text = row.innerText.toLowerCase();

        if (text.includes(input)) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }
    });
}


// ================= NOTIFICATION =================

document
    .querySelector(".notification")
    .addEventListener("click", function() {
        alert("You have 3 new student development updates.");
    });


// ================= LOAD STUDENTS =================

async function loadStudents() {

    try {

        const response = await fetch(
            "https://beyondmarks-1.onrender.com/api/students"
        );

        const students = await response.json();

        const table = document.getElementById("studentTable");
        const recentTable = document.getElementById("recentStudentTable");

        // Clear tables
        table.innerHTML = "";
        recentTable.innerHTML = "";

        students.forEach(student => {

            const initials = student.name
                .split(" ")
                .map(word => word[0])
                .join("")
                .substring(0, 2)
                .toUpperCase();

            const row = document.createElement("tr");

            row.innerHTML = `
                <td>
                    <div class="student-name">
                        <div class="student-avatar">${initials}</div>
                        <div>
                            <strong>${student.name}</strong>
                            <small>${student.student_id}</small>
                        </div>
                    </div>
                </td>

                <td>${student.department}</td>

                <td>${student.cgpa}</td>

                <td>${student.attendance}%</td>

                <td>0 Events</td>

                <td><strong>${student.overall_score}</strong></td>

                <td>
                    <span class="badge excellent">Excellent</span>
                </td>
            `;

            // Students page
            table.appendChild(row);

            // Dashboard recent students
            recentTable.appendChild(row.cloneNode(true));
        });

        console.log("Students displayed successfully!");

    } catch (error) {

        console.error("Could not load students:", error);

    }
}

loadStudents();
// ================= LOAD DASHBOARD =================

async function loadDashboard() {

    try {

        const studentsResponse = await fetch(
            "https://beyondmarks-1.onrender.com/api/students"
        );

        const students = await studentsResponse.json();

        // Total students
        document.getElementById("totalStudents").textContent =
            students.length;

        // Average attendance
        if (students.length > 0) {

            const totalAttendance = students.reduce(
                (sum, student) => sum + Number(student.attendance),
                0
            );

            const averageAttendance =
                totalAttendance / students.length;

            document.getElementById("averageAttendance").textContent =
                averageAttendance.toFixed(1) + "%";
        }


        // Activities
        const activitiesResponse = await fetch(
            "https://beyondmarks-1.onrender.com/api/activities"
        );

        const activities = await activitiesResponse.json();

        document.getElementById("totalActivities").textContent =
            activities.length;


        // Achievements
        const achievementsResponse = await fetch(
            "https://beyondmarks-1.onrender.com/api/achievements"
        );

        const achievements = await achievementsResponse.json();

        document.getElementById("totalAchievements").textContent =
            achievements.length;

    } catch (error) {

        console.error("Could not load dashboard:", error);

    }
}

loadDashboard();



// ================= LOAD ACADEMICS =================

async function loadAcademics() {

    try {

        const response = await fetch(
            "https://beyondmarks-1.onrender.com/api/academics"
        );

        const academics = await response.json();

        console.log("Academic records:", academics);

        if (academics.length > 0) {

            const totalCgpa = academics.reduce(
                (sum, record) => sum + Number(record.cgpa),
                0
            );

            const totalMarks = academics.reduce(
                (sum, record) => sum + Number(record.marks),
                0
            );

            const averageCgpa = totalCgpa / academics.length;
            const averageScore = totalMarks / academics.length;

            document.getElementById("averageCgpa").textContent =
                averageCgpa.toFixed(2);

            document.getElementById("averageScore").textContent =
                averageScore.toFixed(0) + "%";


            // CSE performance

            const cseRecords = academics.filter(
                record => record.student_id == 3
            );

            if (cseRecords.length > 0) {

                const cseAverage =
                    cseRecords.reduce(
                        (sum, record) => sum + Number(record.marks),
                        0
                    ) / cseRecords.length;

                document.getElementById("cseBar").style.width =
                    cseAverage + "%";

                document.getElementById("cseScore").textContent =
                    cseAverage.toFixed(0) + "%";
            }


            // Other department values

            document.querySelector(".academic-bars").children[1]
                .querySelector(".progress div").style.width = "82%";

            document.querySelector(".academic-bars").children[1]
                .querySelector("b").textContent = "82%";

            document.querySelector(".academic-bars").children[2]
                .querySelector(".progress div").style.width = "79%";

            document.querySelector(".academic-bars").children[2]
                .querySelector("b").textContent = "79%";

            document.querySelector(".academic-bars").children[3]
                .querySelector(".progress div").style.width = "76%";

            document.querySelector(".academic-bars").children[3]
                .querySelector("b").textContent = "76%";


            // Improvement

            if (academics.length >= 2) {

                const firstMarks = Number(academics[0].marks);
                const lastMarks =
                    Number(academics[academics.length - 1].marks);

                const improvement = lastMarks - firstMarks;

                document.getElementById("improvement").textContent =
                    (improvement >= 0 ? "+" : "") +
                    improvement.toFixed(1) +
                    "%";
            }
        }

    } catch (error) {

        console.error("Could not load academics:", error);

    }
}

loadAcademics();


// ================= LOAD ACTIVITIES =================

async function loadActivities() {

    try {

        const response = await fetch(
            "https://beyondmarks-1.onrender.com/api/activities"
        );

        const activities = await response.json();

        const technicalClubs = activities.filter(
            activity => activity.activity_type === "Technical"
        ).length;

        const teamActivities = activities.filter(
            activity => activity.activity_type === "Team"
        ).length;

        const eventsCount = activities.length;

        document.getElementById("technicalClubs").textContent =
            technicalClubs;

        document.getElementById("eventsCount").textContent =
            eventsCount;

        document.getElementById("teamActivities").textContent =
            teamActivities;

    } catch (error) {

        console.error("Could not load activities:", error);

    }
}

loadActivities();


// ================= LOAD SKILLS =================

async function loadSkills() {

    try {

        const response = await fetch(
            "https://beyondmarks-1.onrender.com/api/skills"
        );

        const skills = await response.json();

        if (skills.length > 0) {

            const skill = skills[skills.length - 1];

            document.getElementById("communicationScore").textContent =
                Number(skill.communication).toFixed(0) + "%";

            document.getElementById("teamworkScore").textContent =
                Number(skill.teamwork).toFixed(0) + "%";

            document.getElementById("leadershipScore").textContent =
                Number(skill.leadership).toFixed(0) + "%";

            document.getElementById("technicalScore").textContent =
                Number(skill.technical).toFixed(0) + "%";
        }

    } catch (error) {

        console.error("Could not load skills:", error);

    }
}

loadSkills();


// ================= LOAD ACHIEVEMENTS =================

async function loadAchievements() {

    try {

        const response = await fetch(
            "https://beyondmarks-1.onrender.com/api/achievements"
        );

        const achievements = await response.json();

        if (achievements.length > 0) {

            const achievement =
                achievements[achievements.length - 1];

            document.getElementById("achievementTitle").textContent =
                achievement.title;

            document.getElementById("achievementStudent").textContent =
                "Student ID: " + achievement.student_id;

            document.getElementById("achievementDetails").textContent =
                achievement.level + " • " + achievement.year;
        }

    } catch (error) {

        console.error("Could not load achievements:", error);

    }
}

loadAchievements();
