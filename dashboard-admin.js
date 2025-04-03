document.addEventListener("DOMContentLoaded", function () {
    let users = JSON.parse(localStorage.getItem("users")) || [];
    let scheduleData = [
        { class: "Gym", date: "01-04-2025", time: "08:00 - 10:00", name: "Trần Văn A", email: "a@gmail.com" },
        { class: "Yoga", date: "01-04-2025", time: "10:00 - 12:00", name: "Trần Thị B", email: "b@gmail.com" },
        { class: "Zumba", date: "01-04-2025", time: "16:00 - 18:00", name: "Lê Văn C", email: "c@gmail.com" }
    ];

    const scheduleTable = document.getElementById("scheduleTable");
    const totalGym = document.getElementById("totalGym");
    const totalYoga = document.getElementById("totalYoga");
    const totalZumba = document.getElementById("totalZumba");

    const classesFilter = document.getElementById('classes');
    const emailFilter = document.getElementById('email');
    const dayFilter = document.getElementById('day');

    function renderSchedule(filteredData) {
        scheduleTable.innerHTML = "";
        let gymCount = 0, yogaCount = 0, zumbaCount = 0;

        filteredData.forEach(item => {
            if (item.class === "Gym") gymCount++;
            if (item.class === "Yoga") yogaCount++;
            if (item.class === "Zumba") zumbaCount++;

            const row = `<tr>
                <td>${item.class}</td>
                <td>${item.date}</td>
                <td>${item.time}</td>
                <td>${item.name}</td>
                <td>${item.email}</td>
            </tr>`;
            scheduleTable.innerHTML += row;
        });

        totalGym.textContent = gymCount;
        totalYoga.textContent = yogaCount;
        totalZumba.textContent = zumbaCount;

        updateChart(gymCount, yogaCount, zumbaCount);
    }

    function updateChart(gymCount, yogaCount, zumbaCount) {
        const ctx = document.getElementById('myChart').getContext('2d');
        if (window.chart) window.chart.destroy();
        
        window.chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ["Gym", "Yoga", "Zumba"],
                datasets: [{
                    label: 'Số lượng lịch tập',
                    data: [gymCount, yogaCount, zumbaCount],
                    backgroundColor: ['blue', 'red', 'green']
                }]
            }
        });
    }

    function filterSchedule() {
        const classFilter = classesFilter.value.toLowerCase();
        const emailFilter = emailFilter.value.toLowerCase();
        const dayFilter = dayFilter.value;

        const filteredData = scheduleData.filter(item => {
            const matchesClass = classFilter === '' || item.class.toLowerCase().includes(classFilter);
            const matchesEmail = emailFilter === '' || item.email.toLowerCase().includes(emailFilter);
            const matchesDate = dayFilter === '' || item.date.includes(dayFilter); 
            return matchesClass && matchesEmail && matchesDate;
        });

        renderSchedule(filteredData);
    }

    resetFiltersButton.addEventListener('click', function() {
        classesFilter.value = '';
        emailFilter.value = '';
        dayFilter.value = '';
        filterSchedule();
    });

    classesFilter.addEventListener('input', filterSchedule);
    emailFilter.addEventListener('input', filterSchedule);
    dayFilter.addEventListener('input', filterSchedule);

    renderSchedule(scheduleData);
});
