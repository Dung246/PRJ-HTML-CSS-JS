document.addEventListener("DOMContentLoaded", () => {
    let homePageBtn = document.getElementById("homePage");
    let bookingPageBtn = document.getElementById("bookingPage");

    homePageBtn.addEventListener("click", (event) => {
        event.preventDefault();
        window.location.href = "gymWeb.html";
    });

    bookingPageBtn.addEventListener("click", (event) => {
        event.preventDefault();
        window.location.href = "booking.html";
    });

    let modal = document.getElementById("scheduleModal");
    let openModalBtn = document.getElementById("openModal");
    let closeModalBtn = document.querySelector(".close");
    let scheduleForm = document.getElementById("scheduleForm");
    let scheduleList = document.getElementById("scheduleList");

    let currentUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!currentUser) {
        alert("Vui lòng đăng nhập trước.");
        window.location.href = "index.html";
    }
    let fullName = currentUser.name;
    let email = currentUser.email;
    
    
    

    let schedules = JSON.parse(localStorage.getItem("schedules")) || [];

    if (schedules.length === 0) {
        schedules = [
            { classType: "Gym", date: "01-04-2025", time: "10:00", fullName: fullName, email: email },
            { classType: "Yoga", date: "02-04-2025", time: "18:00", fullName: fullName, email: email },
            { classType: "Zumba", date: "03-04-2025", time: "07:30", fullName: fullName, email: email }
        ];
        localStorage.setItem("schedules", JSON.stringify(schedules));
    }

    let editingIndex = null;

    function renderScheduleList() {
        scheduleList.innerHTML = "";
        schedules.forEach((schedule, index) => {
            let row = document.createElement("tr");
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
        document.getElementById("fullName").value = fullName;
        document.getElementById("email").value = email;

        scheduleForm.reset();
        editingIndex = null;
        resetErrors();
        
        let today = new Date().toISOString().split("T")[0]; 
        document.getElementById("date").setAttribute("min", today); 
        document.getElementById("date").value = today; 

        modal.style.display = "flex";
    });

    closeModalBtn.addEventListener("click", () => modal.style.display = "none");
    scheduleForm.addEventListener("submit", (event) => {
        event.preventDefault();

        let classType = document.getElementById("classType").value.trim();
        let date = document.getElementById("date").value.trim();
        let time = document.getElementById("time").value.trim();

        let isValid = true;
        resetErrors();
        if (!classType || !date || !time) {
            isValid = false;
            showError("dateError", "Ngày tập không được để trống");
            showError("timeError", "Khung giờ không được để trống");
        }
        let isDuplicate = schedules.some((schedule, index) =>
            index !== editingIndex &&
            schedule.classType === classType &&
            schedule.date === date &&
            schedule.time === time
        );

        if (isDuplicate) {
            isValid = false;
            showError("dateError", "Lịch này đã tồn tại. Vui lòng chọn thời gian khác");
        }
        if (isValid) {
            let newSchedule = { classType, date, time, fullName, email };

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
        let schedule = schedules[index];
        document.getElementById("classType").value = schedule.classType;
        document.getElementById("date").value = schedule.date;
        document.getElementById("time").value = schedule.time;
        let today = new Date().toISOString().split("T")[0];
        document.getElementById("date").setAttribute("min", today); 
        if (new Date(schedule.date) < new Date(today)) {
            document.getElementById("date").value = today;
        }

        editingIndex = index;
        modal.style.display = "flex";
    };

    window.confirmDelete = (index) => {
        let confirmModal = document.getElementById("deleteModal");
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
        let errorMessages = document.querySelectorAll(".error-message");
        errorMessages.forEach((error) => error.textContent = "");
    }

    function showError(id, message) {
        document.getElementById(id).textContent = message;
    }
    renderScheduleList();
});
