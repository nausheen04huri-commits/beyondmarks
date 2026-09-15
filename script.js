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
        page.classList.remove("active-page");
    });

    const page = document.getElementById(pageId);

    if (page) {
        page.classList.add("active-page");
    }

    document.querySelectorAll(".menu-item").forEach(function(item) {
        item.classList.remove("active");
    });

    document.querySelectorAll(".menu-item").forEach(function(item) {
        const text = item.getAttribute("onclick") || "";

        if (text.indexOf("showPage('" + pageId + "')") !== -1) {
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
        sidebar.classList.toggle("show");
    }
}

/* =========================
   MODAL
========================= */

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

/* =========================
   HELPERS
========================= */

function num(value) {
    const n = Number(value);
    return isNaN(n) ? 0 : n;
}

function esc(value) {
    return String(value == null ? "" : value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function initials(name) {
    if (!name) {
        return "ST";
    }

    const parts = String(name).trim().split(/\s+/);

    if (parts.length === 1) {
        return parts[0].substring(0, 2).toUpperCase();
    }

    return (
        parts[0][0] +
        parts[parts.length - 1][0]
    ).toUpperCase();
}

async function getData(url, options) {
    const response = await fetch(url, options);

    if (!response.ok) {
        throw new Error("HTTP " + response.status);
    }

    return await response.json();
}

/* =========================
   STUDENTS
========================= */

async function loadStudents() {
    try {
        students = await getData(API + "/api/students");

        renderStudentTable();
        renderRecentStudents();
        renderStudentCards();
        updateDashboard();
    } catch (error) {
        console.error("Students:", error);
    }
}

function renderStudentTable() {
    const table = document.getElementById("studentTable");

    if (!table) {
        return;
    }

    table.innerHTML = "";

    students.forEach(function(student) {
        const row = document.createElement("tr");

        const academic =
            num(student.overall_score) > 0
                ? num(student.overall_score).toFixed(0) + "%"
                : "-";

        row.innerHTML =
            "<td>" +
                "<div class='student-name'>" +
                    "<div class='student-avatar'>" +
                        esc(initials(student.name)) +
                    "</div>" +
                    "<div>" +
                        "<strong>" + esc(student.name) + "</strong>" +
                        "<small>" + esc(student.student_id) + "</small>" +
                    "</div>" +
                "</div>" +
            "</td>" +
            "<td>" + esc(student.department) + "</td>" +
            "<td>" + academic + "</td>" +
            "<td>" + num(student.attendance).toFixed(1) + "%</td>" +
            "<td>-</td>" +
            "<td>" + academic + "</td>" +
            "<td><span class='badge good'>Active</span></td>";

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

        const academic =
            num(student.overall_score) > 0
                ? num(student.overall_score).toFixed(0) + "%"
                : "-";

        row.innerHTML =
            "<td>" +
                "<div class='student-name'>" +
                    "<div class='student-avatar'>" +
                        esc(initials(student.name)) +
                    "</div>" +
                    "<div>" +
                        "<strong>" + esc(student.name) + "</strong>" +
                        "<small>" + esc(student.student_id) + "</small>" +
                    "</div>" +
                "</div>" +
            "</td>" +
            "<td>" + esc(student.department) + "</td>" +
            "<td>" + academic + "</td>" +
            "<td>" + num(student.attendance).toFixed(1) + "%</td>" +
            "<td>-</td>" +
            "<td>" + academic + "</td>" +
            "<td><span class='badge good'>Active</span></td>";

        table.appendChild(row);
    });
}

function renderStudentCards() {
    const grid = document.getElementById("studentGrid");

    if (!grid) {
        return;
    }

    grid.innerHTML = "";

    students.forEach(function(student) {
        const card = document.createElement("div");

        card.className = "student-profile-card";

        card.innerHTML =
            "<div class='big-avatar'>" +
                esc(initials(student.name)) +
            "</div>" +
            "<h3>" + esc(student.name) + "</h3>" +
            "<p>" + esc(student.department) + "</p>" +
            "<span class='student-id'>" +
                esc(student.student_id) +
            "</span>" +
            "<div class='profile-stats'>" +
                "<div>" +
                    "<strong>" + num(student.cgpa).toFixed(2) + "</strong>" +
                    "<span>CGPA</span>" +
                "</div>" +
                "<div>" +
                    "<strong>" +
                        num(student.attendance).toFixed(1) +
                        "%" +
                    "</strong>" +
                    "<span>Attendance</span>" +
                "</div>" +
                "<div>" +
                    "<strong>" +
                        num(student.overall_score).toFixed(0) +
                    "</strong>" +
                    "<span>Overall</span>" +
                "</div>" +
            "</div>";

        grid.appendChild(card);
    });
}

/* =========================
   DASHBOARD
========================= */

function updateDashboard() {
    const total = document.getElementById("totalStudents");
    const attendance = document.getElementById("averageAttendance");

    if (total) {
        total.textContent = students.length;
    }

    let avgAttendance = 0;

    if (students.length > 0) {
        let sum = 0;

        students.forEach(function(student) {
            sum += num(student.attendance);
        });

        avgAttendance = sum / students.length;
    }

    if (attendance) {
        attendance.textContent = avgAttendance.toFixed(1) + "%";
    }

    const attendanceDashboard =
        document.getElementById("dashboardAttendance");

    const attendanceBar =
        document.getElementById("dashboardAttendanceBar");

    if (attendanceDashboard) {
        attendanceDashboard.textContent =
            avgAttendance.toFixed(1) + "%";
    }

    if (attendanceBar) {
        attendanceBar.style.width =
            Math.min(avgAttendance, 100) + "%";
    }

    const overallValues = students
        .map(function(student) {
            return num(student.overall_score);
        })
        .filter(function(value) {
            return value > 0;
        });

    let overall = 0;

    if (overallValues.length > 0) {
        overall =
            overallValues.reduce(function(a, b) {
                return a + b;
            }, 0) / overallValues.length;
    }

    const overallElement =
        document.getElementById("overallDevelopment");

    if (overallElement) {
        overallElement.textContent = overall.toFixed(0);
    }
}

/* =========================
   ACADEMICS
========================= */

async function loadAcademics() {
    try {
        academics = await getData(API + "/api/academics");

        renderAcademics();
    } catch (error) {
        console.error("Academics:", error);
    }
}

function renderAcademics() {
    const bars = document.querySelector(".academic-bars");

    if (!bars) {
        return;
    }

    const existingRows = bars.querySelectorAll(":scope > div");

    let totalMarks = 0;
    let totalCgpa = 0;

    academics.forEach(function(record) {
        totalMarks += num(record.marks);
        totalCgpa += num(record.cgpa);
    });

    const avgMarks =
        academics.length > 0
            ? totalMarks / academics.length
            : 0;

    const avgCgpa =
        academics.length > 0
            ? totalCgpa / academics.length
            : 0;

    const averageScore =
        document.getElementById("averageScore");

    const averageCgpa =
        document.getElementById("averageCgpa");

    if (averageScore) {
        averageScore.textContent =
            avgMarks.toFixed(1) + "%";
    }

    if (averageCgpa) {
        averageCgpa.textContent =
            avgCgpa.toFixed(2);
    }

    const dashboardAcademic =
        document.getElementById("dashboardAcademic");

    const dashboardAcademicBar =
        document.getElementById("dashboardAcademicBar");

    if (dashboardAcademic) {
        dashboardAcademic.textContent =
            avgMarks.toFixed(1) + "%";
    }

    if (dashboardAcademicBar) {
        dashboardAcademicBar.style.width =
            Math.min(avgMarks, 100) + "%";
    }

    if (existingRows.length > 0) {
        const cseBar = document.getElementById("cseBar");
        const cseScore = document.getElementById("cseScore");

        if (cseBar && cseScore) {
            cseBar.style.width =
                Math.min(avgMarks, 100) + "%";

            cseScore.textContent =
                avgMarks.toFixed(1) + "%";
        }
    }
}

/* =========================
   ACTIVITIES
========================= */

async function loadActivities() {
    try {
        activities = await getData(API + "/api/activities");

        const total = document.getElementById("totalActivities");

        if (total) {
            total.textContent = activities.length;
        }

        const technical =
            document.getElementById("technicalClubs");

        const events =
            document.getElementById("eventsCount");

        const team =
            document.getElementById("teamActivities");

        let technicalCount = 0;
        let eventCount = 0;
        let teamCount = 0;

        activities.forEach(function(activity) {
            const type =
                String(activity.activity_type || "")
                .toLowerCase();

            if (type.indexOf("technical") !== -1) {
                technicalCount++;
            } else if (type.indexOf("team") !== -1) {
                teamCount++;
            } else {
                eventCount++;
            }
        });

        if (technical) {
            technical.textContent = technicalCount;
        }

        if (events) {
            events.textContent = eventCount;
        }

        if (team) {
            team.textContent = teamCount;
        }

        const dashboardActivities =
            document.getElementById("dashboardActivities");

        const dashboardActivitiesBar =
            document.getElementById("dashboardActivitiesBar");

        const activityPercent =
            students.length > 0
                ? Math.min(
                    (activities.length / students.length) * 100,
                    100
                )
                : 0;

        if (dashboardActivities) {
            dashboardActivities.textContent =
                activityPercent.toFixed(1) + "%";
        }

        if (dashboardActivitiesBar) {
            dashboardActivitiesBar.style.width =
                activityPercent + "%";
        }
    } catch (error) {
        console.error("Activities:", error);
    }
}

/* =========================
   SKILLS
========================= */

async function loadSkills() {
    try {
        skills = await getData(API + "/api/skills");

        if (skills.length === 0) {
            return;
        }

        let communication = 0;
        let teamwork = 0;
        let leadership = 0;
        let technical = 0;

        skills.forEach(function(skill) {
            communication += num(skill.communication);
            teamwork += num(skill.teamwork);
            leadership += num(skill.leadership);
            technical += num(skill.technical);
        });

        communication /= skills.length;
        teamwork /= skills.length;
        leadership /= skills.length;
        technical /= skills.length;

        setSkill("communicationScore", communication);
        setSkill("teamworkScore", teamwork);
        setSkill("leadershipScore", leadership);
        setSkill("technicalScore", technical);

        const dashboardSkills =
            document.getElementById("dashboardSkills");

        const dashboardSkillsBar =
            document.getElementById("dashboardSkillsBar");

        const avg =
            (communication +
                teamwork +
                leadership +
                technical) / 4;

        if (dashboardSkills) {
            dashboardSkills.textContent =
                avg.toFixed(1) + "%";
        }

        if (dashboardSkillsBar) {
            dashboardSkillsBar.style.width =
                avg + "%";
        }

        const overallSkills =
            document.getElementById("overallSkills");

        if (overallSkills) {
            overallSkills.textContent =
                avg.toFixed(0);
        }
    } catch (error) {
        console.error("Skills:", error);
    }
}

function setSkill(id, value) {
    const element = document.getElementById(id);

    if (element) {
        element.textContent =
            value.toFixed(1) + "%";

        const row = element.parentElement;

        if (row) {
            const bar =
                row.querySelector(".skill-progress div");

            if (bar) {
                bar.style.width =
                    Math.min(value, 100) + "%";
            }
        }
    }
}

/* =========================
   ACHIEVEMENTS
========================= */

async function loadAchievements() {
    try {
        achievements =
            await getData(API + "/api/achievements");

        const total =
            document.getElementById("totalAchievements");

        if (total) {
            total.textContent =
                achievements.length;
        }

        renderAchievements();
    } catch (error) {
        console.error("Achievements:", error);
    }
}

function renderAchievements() {
    const grid =
        document.querySelector(".achievement-grid");

    if (!grid) {
        return;
    }

    grid.innerHTML = "";

    if (achievements.length === 0) {
        grid.innerHTML =
            "<div class='achievement-card'>" +
                "<div class='medal'>🥇</div>" +
                "<h3>No achievement yet</h3>" +
                "<p>No student</p>" +
                "<small>-</small>" +
            "</div>";

        return;
    }

    achievements.forEach(function(achievement) {
        const card =
            document.createElement("div");

        card.className =
            "achievement-card";

        card.innerHTML =
            "<div class='medal'>🏆</div>" +
            "<h3>" +
                esc(achievement.title) +
            "</h3>" +
            "<p>" +
                esc(
                    achievement.name ||
                    achievement.student_name ||
                    "Student"
                ) +
            "</p>" +
            "<small>" +
                esc(achievement.level || "") +
                " • " +
                esc(achievement.year || "") +
            "</small>";

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

    const name =
        document.getElementById("name");

    const studentId =
        document.getElementById("studentId");

    const department =
        document.getElementById("department");

    const attendance =
        document.getElementById("attendance");

    if (!name || !studentId || !department || !attendance) {
        return;
    }

    const data = {
        name: name.value.trim(),
        student_id: studentId.value.trim(),
        department: department.value,
        attendance: num(attendance.value)
    };

    try {
        await getData(API + "/api/students", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        document.getElementById("studentForm").reset();

        closeModal();

        await loadStudents();

        alert("Student added successfully.");
    } catch (error) {
        console.error("Add student:", error);
        alert("Unable to add student.");
    }
}

/* =========================
   SEARCH
========================= */

function searchStudent() {
    const input =
        document.getElementById("studentSearch");

    if (!input) {
        return;
    }

    const value =
        input.value.toLowerCase().trim();

    document.querySelectorAll(".student-profile-card")
        .forEach(function(card) {
            const text =
                card.textContent.toLowerCase();

            card.style.display =
                text.indexOf(value) !== -1
                    ? ""
                    : "none";
        });
}

/* =========================
   START
========================= */

async function refreshAll() {
    await loadStudents();
    await loadAcademics();
    await loadActivities();
    await loadSkills();
    await loadAchievements();
    renderNotifications();
}

document.addEventListener(
    "DOMContentLoaded",
    function() {
        refreshAll();
    }
);

/* ================= HEADER FUNCTIONALITY ================= */

const HEADER_SETTINGS_KEY = "beyondmarks_settings";
const HEADER_SESSION_KEY = "beyondmarks_signed_out";

function getHeaderSettings() {
    try {
        return JSON.parse(localStorage.getItem(HEADER_SETTINGS_KEY)) || {
            notifications: true,
            compact: false
        };
    } catch (error) {
        return { notifications: true, compact: false };
    }
}

function closeHeaderMenus() {
    const notificationPanel = document.getElementById("notificationPanel");
    const profileMenu = document.getElementById("profileMenu");
    const notificationButton = document.getElementById("notificationButton");
    const profileButton = document.getElementById("profileButton");

    if (notificationPanel) notificationPanel.hidden = true;
    if (profileMenu) profileMenu.hidden = true;
    if (notificationButton) notificationButton.setAttribute("aria-expanded", "false");
    if (profileButton) profileButton.setAttribute("aria-expanded", "false");
    if (profileButton) profileButton.classList.remove("open");
}

function toggleNotifications(event) {
    if (event) event.stopPropagation();

    const panel = document.getElementById("notificationPanel");
    const button = document.getElementById("notificationButton");
    const profileMenu = document.getElementById("profileMenu");

    if (!panel || !button) return;

    const willOpen = panel.hidden;
    if (profileMenu) profileMenu.hidden = true;
    const profileButton = document.getElementById("profileButton");
    if (profileButton) {
        profileButton.setAttribute("aria-expanded", "false");
        profileButton.classList.remove("open");
    }

    panel.hidden = !willOpen;
    button.setAttribute("aria-expanded", String(willOpen));

    if (willOpen) renderNotifications();
}

function toggleProfileMenu(event) {
    if (event) event.stopPropagation();

    const menu = document.getElementById("profileMenu");
    const button = document.getElementById("profileButton");
    const notificationPanel = document.getElementById("notificationPanel");
    const notificationButton = document.getElementById("notificationButton");

    if (!menu || !button) return;

    const willOpen = menu.hidden;
    if (notificationPanel) notificationPanel.hidden = true;
    if (notificationButton) notificationButton.setAttribute("aria-expanded", "false");

    menu.hidden = !willOpen;
    button.setAttribute("aria-expanded", String(willOpen));
    button.classList.toggle("open", willOpen);
}

function buildNotifications() {
    const items = [];

    if (Array.isArray(students)) {
        students.forEach(function(student) {
            const attendance = num(student.attendance);
            if (attendance > 0 && attendance < 75) {
                items.push({
                    title: "Low attendance",
                    text: (student.name || "A student") + " has " + attendance + "% attendance.",
                    icon: "fa-user-clock",
                    page: "students"
                });
            }
        });
    }

    if (Array.isArray(achievements)) {
        achievements.slice(-3).reverse().forEach(function(achievement) {
            items.push({
                title: "New achievement",
                text: (achievement.student_name || achievement.name || "A student") + " received an achievement.",
                icon: "fa-medal",
                page: "achievements"
            });
        });
    }

    if (Array.isArray(activities) && activities.length) {
        items.push({
            title: "Activities updated",
            text: activities.length + " activity record" + (activities.length === 1 ? " is" : "s are") + " available.",
            icon: "fa-trophy",
            page: "activities"
        });
    }

    return items.slice(0, 8);
}

function renderNotifications() {
    const list = document.getElementById("notificationList");
    const count = document.getElementById("notificationCount");
    const badge = document.getElementById("notificationBadge");
    const settings = getHeaderSettings();

    if (!list) return;

    const items = buildNotifications();

    if (!settings.notifications) {
        list.innerHTML = '<div class="empty-notifications">Notifications are disabled in Settings.</div>';
        if (count) count.textContent = "Disabled";
        if (badge) badge.style.display = "none";
        return;
    }

    if (!items.length) {
        list.innerHTML = '<div class="empty-notifications"><i class="fa-regular fa-circle-check"></i><br><br>You\'re all caught up.</div>';
    } else {
        list.innerHTML = items.map(function(item) {
            return '<button type="button" class="notification-item" onclick="openNotification(\'' + esc(item.page) + '\')">' +
                '<span class="notification-icon"><i class="fa-solid ' + esc(item.icon) + '"></i></span>' +
                '<span class="notification-copy"><strong>' + esc(item.title) + '</strong><small>' + esc(item.text) + '</small></span>' +
            '</button>';
        }).join("");
    }

    if (count) count.textContent = items.length + " new update" + (items.length === 1 ? "" : "s");
    if (badge) badge.style.display = items.length ? "block" : "none";
}

function openNotification(pageId) {
    closeHeaderMenus();
    showPage(pageId);
}

function markNotificationsRead() {
    const badge = document.getElementById("notificationBadge");
    const count = document.getElementById("notificationCount");
    if (badge) badge.style.display = "none";
    if (count) count.textContent = "No new updates";
}

function openProfile() {
    closeHeaderMenus();
    const modal = document.getElementById("profileModal");
    if (modal) {
        modal.hidden = false;
        modal.classList.add("show");
        document.body.classList.add("modal-open");
    }
}

function openSettings() {
    closeHeaderMenus();
    const modal = document.getElementById("settingsModal");
    const settings = getHeaderSettings();
    const notificationToggle = document.getElementById("notificationsToggle");
    const compactToggle = document.getElementById("compactToggle");

    if (notificationToggle) notificationToggle.checked = settings.notifications !== false;
    if (compactToggle) compactToggle.checked = settings.compact === true;
    if (modal) {
        modal.hidden = false;
        modal.classList.add("show");
        document.body.classList.add("modal-open");
    }
}

function showHelp() {
    closeHeaderMenus();
    const modal = document.getElementById("helpModal");
    if (modal) {
        modal.hidden = false;
        modal.classList.add("show");
        document.body.classList.add("modal-open");
    }
}

function closeUtilityModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
        modal.hidden = true;
        modal.classList.remove("show");
    }
    if (!["profileModal", "settingsModal", "helpModal"].some(function(modalId) {
        const element = document.getElementById(modalId);
        return element && !element.hidden;
    })) {
        document.body.classList.remove("modal-open");
    }
}

function saveSetting(key, value) {
    const settings = getHeaderSettings();
    settings[key] = value;
    localStorage.setItem(HEADER_SETTINGS_KEY, JSON.stringify(settings));

    if (key === "compact") {
        document.body.classList.toggle("compact-mode", value);
    }

    renderNotifications();
}

function logoutUser() {
    closeHeaderMenus();
    sessionStorage.setItem(HEADER_SESSION_KEY, "true");
    const screen = document.getElementById("signedOutScreen");
    if (screen) screen.hidden = false;
}

function signInAgain() {
    sessionStorage.removeItem(HEADER_SESSION_KEY);
    const screen = document.getElementById("signedOutScreen");
    if (screen) screen.hidden = true;
}

function showHelpOnEscape(event) {
    if (event.key !== "Escape") return;
    closeHeaderMenus();
    ["profileModal", "settingsModal", "helpModal"].forEach(closeUtilityModal);
}

document.addEventListener("DOMContentLoaded", function() {
    const notificationButton = document.getElementById("notificationButton");
    const profileButton = document.getElementById("profileButton");
    const settings = getHeaderSettings();

    if (notificationButton) notificationButton.addEventListener("click", toggleNotifications);
    if (profileButton) profileButton.addEventListener("click", toggleProfileMenu);

    document.addEventListener("click", function() {
        closeHeaderMenus();
    });

    ["notificationPanel", "profileMenu"].forEach(function(id) {
        const element = document.getElementById(id);
        if (element) element.addEventListener("click", function(event) { event.stopPropagation(); });
    });

    document.addEventListener("keydown", showHelpOnEscape);

    document.querySelectorAll(".modal-overlay").forEach(function(modal) {
        modal.addEventListener("click", function(event) {
            if (event.target === modal && modal.id !== "modal") {
                closeUtilityModal(modal.id);
            }
        });
    });

    document.body.classList.toggle("compact-mode", settings.compact === true);
    renderNotifications();

    if (sessionStorage.getItem(HEADER_SESSION_KEY) === "true") {
        const screen = document.getElementById("signedOutScreen");
        if (screen) screen.hidden = false;
    }
});
