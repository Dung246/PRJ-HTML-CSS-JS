document.addEventListener("DOMContentLoaded", () => {
  let scheduleData = JSON.parse(localStorage.getItem("schedules")) || [
    { class: "Gym", date: "2025-04-18", time: "08:00 - 10:00", name: "Trần Văn A", email: "Vana@gmail.com" },
    { class: "Yoga", date: "2025-04-19", time: "10:00 - 12:00", name: "Trần Thị B", email: "Tranb@gmail.com" },
    { class: "Zumba", date: "2025-04-20", time: "16:00 - 18:00", name: "Lê Văn C", email: "Lec@gmail.com" },
    { class: "Gym", date: "2025-04-21", time: "20:00 - 22:00", name: "Nguyễn Tiến D", email: "Nguyend@gmail.com"}
  ];
  
  let editIndex = null;
  let scheduleTable = document.getElementById("scheduleTable");
  let totalGym = document.getElementById("totalGym");
  let totalYoga = document.getElementById("totalYoga");
  let totalZumba = document.getElementById("totalZumba");

  let filters = {
    classes: document.getElementById("classes"),
    email: document.getElementById("email"),
    day: document.getElementById("day")
  };

  let modal = document.getElementById("editModal");
  let inputs = {
    class: document.getElementById("editClass"),
    date: document.getElementById("editDate"),
    time: document.getElementById("editTime"),
    name: document.getElementById("editName"),
    email: document.getElementById("editEmail")
  };

function renderSchedule(data) {
  scheduleTable.innerHTML = "";
  let gym = 0, yoga = 0, zumba = 0;
  let now = new Date();
  data.forEach((item, index) => {
    let itemDateTime = new Date(`${item.date}T${item.time.split(" - ")[0]}`);
    if (itemDateTime >= now) {
      if (item.class === "Gym") gym++;
      if (item.class === "Yoga") yoga++;
      if (item.class === "Zumba") zumba++;

      let row = document.createElement("tr");
      row.innerHTML = `
        <td>${item.class}</td>
        <td>${item.date}</td>
        <td>${item.time}</td>
        <td>${item.name}</td>
        <td>${item.email}</td>
        <td>
          <button onclick="editSchedule(${index})">Sửa</button>
          <button onclick="deleteSchedule(${index})" style="margin-left: 5px; color: white; background-color: red;">Xoá</button>
        </td>
      `;
      scheduleTable.appendChild(row);
    }
  });

  totalGym.textContent = gym;
  totalYoga.textContent = yoga;
  totalZumba.textContent = zumba;
  updateChart(gym, yoga, zumba);
}

  function updateChart(g, y, z) {
    let ctx = document.getElementById("myChart").getContext("2d");
    if (window.chart) window.chart.destroy();
    window.chart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["Gym", "Yoga", "Zumba"],
        datasets: [{
          label: "Số lượng lịch tập",
          data: [g, y, z],
          backgroundColor: ['#2563EB', '#059669', '#7C3AED']
        }]
      }
    });
  }

  function filterSchedule() {
    let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;

    let now = new Date();
    let filtered = scheduleData.filter(item => {
      let itemDateTime = new Date(`${item.date}T${item.time.split(" - ")[0]}`);
      let byClass = filters.classes.value === "Tất cả" || item.class.toLowerCase().includes(filters.classes.value.toLowerCase());
      let byEmail = filters.email.value === "" || item.email.toLowerCase().includes(filters.email.value.toLowerCase());
      let byDate = filters.day.value === "" || item.date === filters.day.value;
      let byNow = itemDateTime >= now;
      return byClass && byEmail && byDate && byNow;
    });

    renderSchedule(filtered);
    window.scrollTo(0, scrollTop);
  }
  filters.classes.addEventListener("input", filterSchedule);
  filters.email.addEventListener("input", filterSchedule);
  filters.day.addEventListener("input", filterSchedule);
  window.editSchedule = function(index) {
    editIndex = index;
    let item = scheduleData[index];
    inputs.class.value = item.class;
    inputs.date.value = item.date;
    inputs.time.value = item.time;
    inputs.name.value = item.name;
    inputs.email.value = item.email;
    modal.style.display = "flex";
  };
  window.saveEdit = function () {
    scheduleData[editIndex] = {
      class: inputs.class.value,
      date: inputs.date.value,
      time: inputs.time.value,
      name: inputs.name.value,
      email: inputs.email.value
    };
    localStorage.setItem("schedules", JSON.stringify(scheduleData));
    modal.style.display = "none";
    filterSchedule();
  };
   
  window.closeModal = function () {
    modal.style.display = "none";
  };
  window.deleteSchedule = function(index) {
    if (confirm("Bạn có chắc muốn xoá lịch này không?")) {
      scheduleData.splice(index, 1);
      localStorage.setItem("schedules", JSON.stringify(scheduleData));
      filterSchedule();
    }
  };
  renderSchedule(scheduleData);
});
