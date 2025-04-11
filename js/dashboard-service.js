function navigateTo(page) {
    window.location.href = page;
}
function getServices() {
    return JSON.parse(localStorage.getItem("services")) || [];
} 
function saveServices(data) {
    localStorage.setItem("services", JSON.stringify(data));
}
function navigateTo(page) {
    if (window.location.pathname.includes(page)) {
      window.location.reload(); 
    } else {
      window.location.href = page;
    }
}
  
function initServices() {
    let services = getServices();
    if (services.length === 0) {
      services = [
        {
          name: "Yoga",
          description: "Luyện tập thể chất và tinh thần thông qua Yoga",
          image: "https://shorturl.at/Y3Z6F"
        },
        {
          name: "Gym",
          description: "Tập luyện thể hình và nâng cao sức khỏe",
          image: "https://shorturl.at/yix8Q"
        },
        {
          name: "Zumba",
          description: "Nhảy múa giảm stress và tập thể dục",
          image: "https://shorturl.at/U43QY"
        }
      ];
      saveServices(services);
    }
}
  
function renderServices() {
  let services = getServices();
  let table = document.getElementById("serviceTable");
    table.innerHTML = "";
    services.forEach((s, i) => {
      let tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${s.name}</td>
        <td>${s.description}</td>
        <td><img src="${s.image}" alt="${s.name}"></td>
        <td>
          <button class="btn btn-sm btn-warning me-2" onclick="editService(${i})">Sửa</button>
          <button class="btn btn-sm btn-danger" onclick="deleteService(${i})">Xoá</button>
        </td>`;
      table.appendChild(tr);
    });
}
  
function editService(index) {
  let services = getServices();
  let s = services[index];
    document.getElementById("editIndex").value = index;
    document.getElementById("serviceName").value = s.name;
    document.getElementById("serviceDesc").value = s.description;
    document.getElementById("serviceImage").value = s.image;
    let modal = new bootstrap.Modal(document.getElementById("serviceModal"));
    modal.show();
}
  
let deleteIndex = null;

function deleteService(index) {
  deleteIndex = index;
  const deleteModal = new bootstrap.Modal(document.getElementById("confirmDeleteModal"));
  deleteModal.show();
}

document.getElementById("confirmDeleteBtn").addEventListener("click", function () {
  if (deleteIndex !== null) {
    let services = getServices();
    services.splice(deleteIndex, 1);
    saveServices(services);
    renderServices();
    deleteIndex = null;
    bootstrap.Modal.getInstance(document.getElementById("confirmDeleteModal")).hide();
  }
});

  
document.getElementById("serviceForm").addEventListener("submit", function (e) {
    e.preventDefault();
    let name = document.getElementById("serviceName").value.trim();
    let desc = document.getElementById("serviceDesc").value.trim();
    let image = document.getElementById("serviceImage").value.trim();
    if (!name || !desc || !image) {
      alert("Vui lòng điền đầy đủ thông tin");
      return;
    }
    let services = getServices();
    let index = document.getElementById("editIndex").value;
    if (index === "") {
      services.push({ name, description: desc, image });
    } else {
      services[index] = { name, description: desc, image };
    }
    saveServices(services);
    renderServices();
    document.getElementById("serviceForm").reset();
    document.getElementById("editIndex").value = "";
    bootstrap.Modal.getInstance(document.getElementById("serviceModal")).hide();
});
  
initServices();
renderServices();
  