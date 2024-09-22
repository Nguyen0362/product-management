// bộ lọc
const boxFilter = document.querySelector("[box-filter]");

if(boxFilter){
    let url = new URL(location.href);


    boxFilter.addEventListener("change", () => {
        const value = boxFilter.value;

        if(value){
            url.searchParams.set("status", value);
        } else {
            url.searchParams.delete("status");
        }

        location.href = url.href;
    });

    // Hiển thị lựa chọn mặc định
    const statusCurrent = url.searchParams.get("status");
    if(statusCurrent){
        boxFilter.value = statusCurrent;
    }
    // Hết hiển thị lựa chọn mặc định
}
// Hết bộ lọc

//Tìm kiếm
const formSearch = document.querySelector("[form-search]");

if(formSearch){
    let url = new URL(location.href); //Nhân bản url

    formSearch.addEventListener("submit", (event) => {
        event.preventDefault(); // Ngăn chặn hành vi mặc định: submit form
        const value = formSearch.keyword.value;

        if(value) {
        url.searchParams.set("keyword", value);
        } else {
        url.searchParams.delete("keyword");
        }

        location.href = url.href;
    });

    // Hiển thị từ khóa mặc định
    const valueCurrent = url.searchParams.get("keyword");
    if(valueCurrent){
        formSearch.keyword.value = valueCurrent;
    }
    // Hết hiển thị từ khóa mặc định
}
// Hết tìm kiếm

//Phân trang
const listButtonPagination = document.querySelectorAll("[button-pagination]");

if(listButtonPagination.length > 0){
    let url = new URL(location.href);

    listButtonPagination.forEach(button => {
        button.addEventListener("click", () => {
            const page = button.getAttribute("button-pagination");

            if(page){
                url.searchParams.set("page", page);
            } else {
                url.searchParams.delete("page");
            }

            location.href = url.href;
        })
    })

    // Hiển thị trang mặc định
    const pageCurrent = url.searchParams.get("page") || 1;
    const buttonCurrent = document.querySelector(`[button-pagination="${pageCurrent}"]`);

    if(buttonCurrent){
        buttonCurrent.parentNode.classList.add("active");
    }
// Hết hiển thị trang mặc định
}
// Hết phân trang

//Đổi trạng thái
const listButtonChangeStatus = document.querySelectorAll("[button-change-status]");

if(listButtonChangeStatus.length > 0){
    listButtonChangeStatus.forEach(button => {
        button.addEventListener("click", () => {
            const itemId = button.getAttribute("item-id");
            const statusChange = button.getAttribute("button-change-status");
            const patch = button.getAttribute("data-patch");

            const data = {
                id: itemId,
                status: statusChange
            }

            fetch(patch, {
                headers: {
                    "Content-Type": "application/json",
                },
                method: "PATCH",
                body: JSON.stringify(data)
            })
                .then(res => res.json())
                .then(data => {
                    if(data.code == "success"){
                        location.reload();
                    }
                })
        })
    })
}
// Hết đổi trạng thái

//Đổi trạng thái cho nhiều bảng ghi
const formChangeMulti = document.querySelector("[form-change-multi]");
if(formChangeMulti){
    formChangeMulti.addEventListener("submit", (event) => {
        event.preventDefault();

        const patch = formChangeMulti.getAttribute("data-path");
    
        const status = formChangeMulti.status.value;

        const ids = [];

        if(status == "delete"){
            const isConfrim = confirm(" Bạn chắc chắn muốn xóa những bản ghi này")
            if(!isConfrim){
                return;
            }
        }
        
        const listInputChange = document.querySelectorAll("[input-change]:checked");
        
        listInputChange.forEach(input => {
            const id = input.getAttribute("input-change");
            ids.push(id);
        });

        const data = {
            id: ids,
            status: status
        }

        fetch(patch, {
            headers: {
                "Content-Type": "application/json",
            },
            method: "PATCH",
            body: JSON.stringify(data)
        })

            .then(res => res.json())
            .then(data => {
                if(data.code == "success"){
                    location.reload();
                }
        })
    })
}
// Hết đổi trạng thái cho nhiều bảng ghi

// Xóa bản ghi
const listButtonDelete = document.querySelectorAll("[button-delete]");

if(listButtonDelete.length > 0){
    listButtonDelete.forEach(button => {
        button.addEventListener("click", () => {
            isConfrim = confirm("Bạn có chắc chắn muốn xóa bản ghi này?");

            if(isConfrim){
                const id = button.getAttribute("button-id");
                const patch = button.getAttribute("data-patch");

                console.log(id);
                console.log(patch);

                const data = {
                    id: id
                }

                fetch(patch, {
                    headers: {
                        "Content-Type": "application/json",
                    },

                    method: "PATCH",
                    body: JSON.stringify(data)  
                })
                
                .then(res => res.json())
                .then(data => {
                    if(data.code == "success"){
                        location.reload();
                    }
                })
            }
        })
    })
}
// Hết xóa bản ghi

// Đổi vị trí
const listInputPosition = document.querySelectorAll("[input-position]");
if(listInputPosition.length > 0){
    listInputPosition.forEach(input => {
        input.addEventListener("change", () => {
            const value = parseInt(input.value)
            const id = input.getAttribute("item-id");
            const patch = input.getAttribute("data-patch");

            fetch(patch, {
                headers: {
                    "Content-Type": "application/json",
                },

                method: "PATCH",
                body: JSON.stringify({
                    id: id,   
                    position: value
                })  
            })
            
            .then(res => res.json())
            .then(data => {
                if(data.code == "success"){
                    location.reload();
                }
            })
        })
    })
}
// Hết đổi vị trí

// Alert message 
const alertMessage = document.querySelector("[alert-message]");
if(alertMessage){
    setTimeout(() => {
        alertMessage.style.display = "none";
    }, 3000);
}
// End alert message 

// Preview ảnh
const uploadImage = document.querySelector("[upload-image]");
console.log(uploadImage);
if(uploadImage) {
    const uploadImageInput = uploadImage.querySelector("[upload-image-input]");
    const uploadImagePreview = uploadImage.querySelector("[upload-image-preview]");
    uploadImageInput.addEventListener("change", () => {
        const file = uploadImageInput.files[0];
        if(file) {
        uploadImagePreview.src = URL.createObjectURL(file);
        }
    });
}
// Hết preview ảnh
