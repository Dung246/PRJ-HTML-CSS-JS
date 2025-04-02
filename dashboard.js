document.addEventListener("DOMContentLoaded", function () {
    let users = JSON.parse(localStorage.getItem("users")) || [];
    let userTable = document.getElementById("userList");

    function renderUsers() {
        userTable.innerHTML = "";
        users.forEach((user, index) => {
            if (user.email !== "admin@gym.com") {
                let row = document.createElement("tr");
                row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${user.name}</td>
                    <td>${user.email}</td>
                    <td><button class="delete-btn" data-index="${index}">Xóa</button></td>
                `;
                userTable.appendChild(row);
            }
        });

        document.querySelectorAll(".delete-btn").forEach(button => {
            button.addEventListener("click", function () {
                let index = this.getAttribute("data-index");
                users.splice(index, 1);
                localStorage.setItem("users", JSON.stringify(users));
                renderUsers();
            });
        });
    }
    const scheduleData = [
        { class: "Gym", date: "01-04-2025", time: "08:00 - 10:00", name: "Trần Văn A", email: "a@gmail.com" },
        { class: "Yoga", date: "01-04-2025", time: "10:00 - 12:00", name: "Trần Thị B", email: "b@gmail.com" },
        { class: "Zumba", date: "01-04-2025", time: "16:00 - 18:00", name: "Lê Văn C", email: "c@gmail.com" }
    ];
    
    function loadSchedule() {
        const table = document.getElementById("scheduleTable");
        table.innerHTML = "";
        let gymCount = 0;
        scheduleData.forEach(item => {
            if (item.class === "Gym") gymCount++;
            const row = `<tr>
                <td>${item.class}</td>
                <td>${item.date}</td>
                <td>${item.time}</td>
                <td>${item.name}</td>
                <td>${item.email}</td>
            </tr>`;
            table.innerHTML += row;
        });
        document.getElementById("totalGym").innerText = gymCount;
    }
    
    function loadChart() {
        const ctx = document.getElementById('myChart').getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ["Gym", "Yoga", "Zumba"],
                datasets: [{
                    label: 'Số lượng lịch tập',
                    data: [1, 1, 1],
                    backgroundColor: ['blue', 'red', 'green']
                }]
            }
        });
    }
    
    loadSchedule();
    loadChart();
    renderUsers();
});
