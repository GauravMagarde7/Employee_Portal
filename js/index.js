let id = "no";
// localStorage.clear();
selectData();


// This function is responsible for deleting an entry from the array based on the provided rid. 
function deleteData(rid) {
    let arr = getCrudData();
    if (arr[rid]) {
        const confirmation = window.confirm('Are you sure you want to delete this entry?');
        if (confirmation) {
            let deletedArr = getDeletedData();
            deletedArr.push(arr[rid]);
            arr.splice(rid, 1);
            setCrudData(arr);
            setDeletedData(deletedArr);
            selectData();
        }
    }
}


// This function retrieves the previously deleted data array from localStorage.
// It parses the JSON string stored under the key 'deletedCrud' and returns the array.
// If there is no data or an error occurs during parsing, an empty array is returned.
function getDeletedData() {
    return JSON.parse(localStorage.getItem('deletedCrud')) || [];
}


// This function stores the modified deleted data array back into localStorage.
// It converts the deletedArr array into a JSON string and stores it under the key 'deletedCrud'.
function setDeletedData(deletedArr) {
    localStorage.setItem('deletedCrud', JSON.stringify(deletedArr));
}


// This function displays an error message next to the specified input field.
// It takes two parameters: inputId, which is the ID of the input field to show the error message for,
// and errorMessage, which is the error message to be displayed.
function showError(inputId, errorMessage) {
    const errorSpan = document.getElementById(inputId + "Error");
    if (errorSpan) {
        errorSpan.textContent = errorMessage;
    }
}


// This function clears all error messages displayed on the form. 
// It sets the text content of elements whose IDs end with "Error" to an empty string, effectively clearing the error messages.
function clearErrors() {
    document.getElementById("msg").textContent = "";
    const errorSpans = document.querySelectorAll("[id$='Error']");
    errorSpans.forEach(span => span.textContent = "");
}


// This function is responsible for managing the data submitted via the form. 
// It performs various validations on the input fields (e.g., SID, name, age) to ensure the data is in the correct format.
// If the data passes the validation, it either adds a new entry to the CRUD data array or updates an existing entry based
// on the value of the id variable. The id variable is initially set to "no" and is changed when editing an existing entry.
function manageData() {
    clearErrors();

    let sid = document.getElementById('sid').value;
    let name = document.getElementById('name').value;
    let age = document.getElementById('age').value;
    let designation = document.getElementById('designation').value;
    let url = document.getElementById('url').value;
    let gender = document.getElementById('gender').value;

    if (sid === '' || name === '' || age === '' || designation === '' || url === '' || gender === '') {
        document.getElementById('msg').textContent = 'Please enter all the details';
        return;
    }

    const parsedAge = parseInt(age, 10);
    if (isNaN(parsedAge) || parsedAge < 18 || parsedAge > 60) {
        showError('age', 'Age must be a number between 18 and 60');
        return;
    }

    const nameRegex = /^[A-Za-z]+$/;
    if (!name.match(nameRegex)) {
        showError('name', 'Name must contain only characters');
        return;
    }

    if (!Number.isInteger(Number(sid)) || Number(sid) <= 0) {
        showError('sid', 'SID must be a positive integer');
        return;
    }

    let arr = getCrudData() || [];
    let foundIndex = arr.findIndex(entry => entry.sid === sid && !entry.deleted);
    const deletedArr = getDeletedData();
    const isSidDeleted = deletedArr.some(entry => entry.sid === sid);

    if (id === 'no') {
        if (foundIndex === -1 && !isSidDeleted) {
            let data = {
                sid: sid,
                name: name,
                age: parsedAge,
                designation: designation,
                url: url,
                gender: gender,
                deleted: false
            };
            arr.push(data);
            setCrudData(arr);
            alert('Data added');
        } else {
            document.getElementById('msg').textContent = 'please enter a different SID, SID already Used.';
        }
    } else {
        if ((foundIndex === -1 || foundIndex === id) && !isSidDeleted) {
            arr[id].sid = sid;
            arr[id].name = name;
            arr[id].age = parsedAge;
            arr[id].designation = designation;
            arr[id].url = url;
            arr[id].gender = gender;
            setCrudData(arr);
            alert('Data updated');
        } else {
            document.getElementById('msg').textContent = 'please enter a different SID, SID already Used.';
        }
    }

    document.getElementById('sid').value = '';
    document.getElementById('name').value = '';
    document.getElementById('age').value = '';
    document.getElementById('designation').value = '';
    document.getElementById('url').value = '';
    document.getElementById('gender').value = '';
    id = 'no';
    selectData();
}


// This function retrieves the data from the CRUD data array and dynamically generates an HTML table with the data. 
// It iterates through the array and creates rows in the table with clickable icons to view, edit, and delete each entry.
function selectData() {
    let arr = getCrudData();
    if (arr != null) {
        let html = '';
        for (let k in arr) {
            if (!arr[k].deleted) {
                html += `<td>${arr[k].sid}</td><td>${arr[k].name}</td><td>${arr[k].age}</td><td>${arr[k].designation}</td><td>${arr[k].url}</td><td>${arr[k].gender}</td><td>            
                <a href="javascript:void(0)" onclick="viewData(${k})">
                    <i class="fa fa-eye" style="color: blue;" ></i></a>
                <a href="javascript:void(0)" onclick="editData(${k})"> 
                    <i class="fa fa-edit" style="color: orange;" ></i></a>&nbsp;
                <a href="javascript:void(0)" onclick="deleteData(${k})">
                    <i class="fa fa-trash" style="color: red;" ></i></a>&nbsp;
                </td></tr>`;
            }
        }
        document.getElementById('root').innerHTML = html;
    }
}


// This function allows editing an existing entry in the CRUD data array. 
// It retrieves the data for the specified rid, and if the entry is not deleted, 
// it populates the form fields with the data to enable editing. 
// The id variable is set to the rid to indicate that an existing entry is being edited.
function editData(rid) {
    let arr = getCrudData();
    if (arr[rid]) {
        if (!arr[rid].deleted) {
            const deletedArr = getDeletedData();
            const currentSid = arr[rid].sid;
            const isSidDeleted = deletedArr.some(entry => entry.sid === currentSid);
            if (!isSidDeleted) {
                id = rid;
                document.getElementById('sid').value = arr[rid].sid;
                document.getElementById('name').value = arr[rid].name;
                document.getElementById('age').value = arr[rid].age;
                document.getElementById('designation').value = arr[rid].designation;
                document.getElementById('url').value = arr[rid].url;
                document.getElementById('gender').value = arr[rid].gender;
            } else {
                document.getElementById('msg').textContent = 'Cannot edit a deleted entry.';
            }
        } else {
            document.getElementById('msg').textContent = 'Cannot edit a deleted entry.';
        }
    }
}


// This function allows viewing details of an entry in the CRUD data array. 
// It retrieves the data for the specified rid, and if the entry exists, it displays a modal with the entry details.
function viewData(rid) {
    let arr = getCrudData();
    if (arr[rid]) {
        const entry = arr[rid];
        document.getElementById('viewUrl').innerHTML = `<br><img src="${entry.url}" alt="Image" style="width:120px; height:120px; border-radius:50%;"><br><br>`;
        document.getElementById('viewName').textContent = entry.name;
        document.getElementById('viewAge').textContent = entry.age;
        document.getElementById('viewDesignation').textContent = entry.designation;
        document.getElementById('viewGender').textContent = entry.gender;
        const modal = document.getElementById('viewModal');
        modal.style.display = 'block';
    }
}


// This function closes the modal that displays the details of an entry when viewing an entry's details.
function closeModal() {
    const modal = document.getElementById('viewModal');
    modal.style.display = 'none';
}


// This function retrieves the main CRUD data array from localStorage. 
// It parses the JSON string stored under the key 'crud' and returns the array. 
// If there is no data or an error occurs during parsing, null is returned.
function getCrudData() {
    return JSON.parse(localStorage.getItem('crud'));
}


// This function stores the modified main CRUD data array back into localStorage.
// It converts the arr array into a JSON string and stores it under the key 'crud'.
function setCrudData(arr) {
    localStorage.setItem('crud', JSON.stringify(arr));
}