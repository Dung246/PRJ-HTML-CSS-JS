document.addEventListener("DOMContentLoaded", () => {
    const homePageBtn = document.getElementById("homePage");
    const bookingPageBtn = document.getElementById("bookingPage");

    homePageBtn.addEventListener("click", (event) => {
        event.preventDefault();
        window.location.href = "gymWeb.html";
    });

    bookingPageBtn.addEventListener("click", (event) => {
        event.preventDefault();
        window.location.href = "booking.html";
    });

    const modal = document.getElementById("scheduleModal");
    const openModalBtn = document.getElementById("openModal");
    const closeModalBtn = document.querySelector(".close");
    const scheduleForm = document.getElementById("scheduleForm");
    const scheduleList = document.getElementById("scheduleList");

    let schedules = JSON.parse(localStorage.getItem("schedules")) || [];

    if (schedules.length === 0) {
        schedules = [
            { classType: "Gym", date: "2025-04-10", time: "09:00", fullName: "Nguyễn Văn A", email: "a@example.com" },
            { classType: "Yoga", date: "2025-04-11", time: "18:00", fullName: "Trần Thị B", email: "b@example.com" },
            { classType: "Zumba", date: "2025-04-12", time: "07:30", fullName: "Lê Thị C", email: "c@example.com" }
        ];
        localStorage.setItem("schedules", JSON.stringify(schedules));
    }

    let editingIndex = null;

    function renderScheduleList() {
        scheduleList.innerHTML = "";
        schedules.forEach((schedule, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${schedule.classType}</td>
                <td>${schedule.date}</td>
                <td>${schedule.time}</td>
                <td>${schedule.fullName}</td>
                <td>${schedule.email}</td>
                <td class="thao-tac">
                    <button class="edit-btn" onclick="editSchedule(${index})">Sửa</button>
                    <button class="delete-btn" onclick="confirmDelete(${index})">Xóa</button>
                </td>
            `;
            scheduleList.appendChild(row);
        });
    }

    openModalBtn.addEventListener("click", () => {
        scheduleForm.reset();
        editingIndex = null;
        resetErrors();
        modal.style.display = "flex";
    });

    closeModalBtn.addEventListener("click", () => modal.style.display = "none");

    scheduleForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const classType = document.getElementById("classType").value.trim();
        const date = document.getElementById("date").value.trim();
        const time = document.getElementById("time").value.trim();
        const fullName = document.getElementById("fullName").value.trim();
        const email = document.getElementById("email").value.trim();

        let isValid = true;
        resetErrors();

        if (!classType || !date || !time || !fullName || !email) {
            isValid = false;
            showError("dateError", "Ngày tập không được để trống.");
            showError("timeError", "Khung giờ không được để trống.");
            showError("nameError", "Họ tên không được để trống.");
            showError("emailError", "Email không được để trống.");
        }

        const isDuplicate = schedules.some((schedule, index) =>
            index !== editingIndex &&
            schedule.classType === classType &&
            schedule.date === date &&
            schedule.time === time
        );

        if (isDuplicate) {
            isValid = false;
            showError("dateError", "Lịch này đã tồn tại! Vui lòng chọn thời gian khác.");
        }

        if (isValid) {
            const newSchedule = { classType, date, time, fullName, email };

            if (editingIndex !== null) {
                schedules[editingIndex] = newSchedule;
            } else {
                schedules.push(newSchedule);
            }

            localStorage.setItem("schedules", JSON.stringify(schedules));
            modal.style.display = "none";
            renderScheduleList();
        }
    });

    window.editSchedule = (index) => {
        const schedule = schedules[index];
        document.getElementById("classType").value = schedule.classType;
        document.getElementById("date").value = schedule.date;
        document.getElementById("time").value = schedule.time;
        document.getElementById("fullName").value = schedule.fullName;
        document.getElementById("email").value = schedule.email;

        editingIndex = index;
        modal.style.display = "flex";
    };

    window.confirmDelete = (index) => {
        const confirmModal = document.getElementById("deleteModal");
        confirmModal.style.display = "flex";

        document.getElementById("confirmDelete").onclick = () => {
            schedules.splice(index, 1);
            localStorage.setItem("schedules", JSON.stringify(schedules));
            confirmModal.style.display = "none";
            renderScheduleList();
        };

        document.getElementById("cancelDelete").onclick = () => {
            confirmModal.style.display = "none";
        };
    };

    function resetErrors() {
        const errorMessages = document.querySelectorAll(".error-message");
        errorMessages.forEach((error) => error.textContent = "");
    }

    function showError(id, message) {
        document.getElementById(id).textContent = message;
    }

    renderScheduleList();
});
