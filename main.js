// Thêm target="_blank" cho tất cả các thẻ <a>
document.querySelectorAll('a').forEach(link => {
    link.setAttribute('target', '_blank');
});

// Lấy các phần tử liên quan
const toggleSwitch = document.getElementById("toggle-edit");
let links = document.querySelectorAll(".link");
const container = document.querySelector(".container");
let selectedLink = null; // Lưu trữ link được chọn


// Bật/Tắt chế độ chỉnh sửa
toggleSwitch.addEventListener('change', function() {
    if (this.checked) {
        // Bật chế độ chỉnh sửa
        document.body.classList.add('edit-mode');
    } else {
        // Tắt chế độ chỉnh sửa
        document.body.classList.remove('edit-mode');
        if (selectedLink) {
            selectedLink.classList.remove('selected');
            selectedLink = null;
        }
        
        saveLayout(); // Lưu lại vị trí sau khi thay đổi
    }
});

// Hàm để lưu vị trí các div vào localStorage
function saveLayout() {
    let linksOrder = [];
    let links = document.querySelectorAll(".link");
    links.forEach(link => {
        linksOrder.push(link.id); // Lưu id của mỗi div
    });
    localStorage.setItem('linksOrder', JSON.stringify(linksOrder)); // Lưu vào localStorage
}

// Chọn div khi click vào
links.forEach(link => {
    link.addEventListener('click', function(e) {
        if (document.body.classList.contains('edit-mode')) {
            // Nếu ở chế độ chỉnh sửa, chọn div và vô hiệu hóa liên kết
            if (selectedLink) {
                selectedLink.classList.remove('selected');
            }
            selectedLink = this;
            selectedLink.classList.add('selected');
            e.preventDefault(); // Vô hiệu hóa liên kết
        } else {
            // Nếu không ở chế độ chỉnh sửa, tự động click vào link bên trong div
            const anchor = this.querySelector('a');
            if (!e.target.closest('a') && anchor) {
                anchor.click(); // Kích hoạt sự kiện click của thẻ <a>
            }
        }
    });
});

// Dịch chuyển các div khi dùng phím mũi tên
document.addEventListener('keydown', function(e) {
    if (document.body.classList.contains('edit-mode') && selectedLink) {
        links = document.querySelectorAll(".link");
        let currentIndex = Array.from(links).indexOf(selectedLink);
        let targetLink;
        // Lấy giá trị của thuộc tính 'grid-template-columns' từ CSS
        let gridStyle = getComputedStyle(container);
        // Lấy chuỗi giá trị của 'grid-template-columns' và tách nó thành một mảng
        let columns = gridStyle.getPropertyValue('grid-template-columns').split(' ');
        // Số lượng cột sẽ là độ dài của mảng columns
        let numberOfColumns = columns.length;

        // Cập nhật vị trí theo hướng mũi tên
        if (e.key === "ArrowUp" && currentIndex - numberOfColumns >= 0) {
            // Tráo đổi với div phía trên
            targetLink = links[currentIndex - numberOfColumns];
            swapPositions(selectedLink, targetLink);
            swapPositions(links[currentIndex - numberOfColumns], links[currentIndex+1]);
        } else if (e.key === "ArrowDown" && currentIndex + numberOfColumns + 1 <= links.length) {
            // Tráo đổi với div phía dưới
            targetLink = links[currentIndex + numberOfColumns+1];
            swapPositions(links[currentIndex + numberOfColumns], links[currentIndex]);
            swapPositions(selectedLink, targetLink);
            
        } else if (e.key === "ArrowLeft" && currentIndex > 0 && currentIndex % numberOfColumns !==0) {
            // Tráo đổi với div phía trái (cùng hàng)
            targetLink = links[currentIndex - 1];
            swapPositions(selectedLink, targetLink);
        } else if (e.key === "ArrowRight" && currentIndex < links.length - 1 && (currentIndex+1) % numberOfColumns !==0) {
            // Tráo đổi với div phía phải (cùng hàng)
            targetLink = links[currentIndex + 2];
            swapPositions(selectedLink, targetLink);
        }
    }
});

function swapPositions(link1, link2) {
    let parent = link1.parentNode;
    parent.insertBefore(link1, link2); // Di chuyển link1 lên trước link2
    
}


// Đọc vị trí đã lưu và sắp xếp lại các div
function restoreLayout() {
    let savedOrder = JSON.parse(localStorage.getItem('linksOrder'));
    if (savedOrder && savedOrder.length > 0) {
        let parent = container;
        savedOrder.forEach(id => {
            let link = document.getElementById(id);
            if (link) {
                parent.appendChild(link); // Đặt lại các div theo thứ tự đã lưu
            }
        });
    }
}

// Gọi restoreLayout khi trang được tải lại
document.addEventListener('DOMContentLoaded', restoreLayout);
window.addEventListener('pageshow', restoreLayout);
