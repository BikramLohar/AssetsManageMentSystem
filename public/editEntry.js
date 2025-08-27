let currentAssetCode = '';
let OriginalData = {};


function fetchAsset() {
    const assetCode = document.getElementById('searchAssestCodeEdit').value.trim();

    if (!assetCode) return showPopUpMessage('Please Enter an Asset Code');

    //alert('Please Enter a Asset Code');

    fetch('http://localhost:3000/search', {
        method: 'POST',
        headers: {
            'content-Type': 'application/json'
        },
        body: JSON.stringify({ assetCode: assetCode })

    }).then(async response => {
        const text = await response.text();
        const data = text ? JSON.parse(text) : {};

        console.log('Response Text', data);

        if (data.message) return showPopUpMessage(data.message);

        currentAssetCode = assetCode;
        OriginalData = data;
        document.getElementById('searchAssestCodeEdit').value = '';
        document.getElementById('editForm').style.display = 'block';
        // console.log(document.getElementById('editForm'));
        // console.log(document.getElementById('employee_id'));
        // console.log("📦 Received asset data:", data);
        // console.log("👉 Calling fillFormFields now...");
        fillFormFields(data, true);

        document.getElementById('editBtn').style.display = 'inline-block';
        document.getElementById('editSubmitBtn').style.display = 'none';



    }).catch(err => alert('Error Fetching Asset' + err.message));

}


function fillFormFields(data, disable) {
    const fields = ["employee_id", "asset_code", "current_user_name", "site", "previous_user",
        "employee_status", "system_name", "system_model", "os_name", "make",
        "system_manufacturer", "serial_no", "processor_config", "department", "ram", "monitor", "upgradation_items",
        "upgradation_date", "upgradation_price", "vendor_name", "big_mind_install", "windows_activation",
        "o_install", "host_rename",
        "remarks"];

    fields.forEach(field => {
        const input = document.getElementById(field);
        if (input) {
            //console.log(`Setting field ${field} to:`, data[field]);
            input.value = data[field] || '';
            input.disabled = disable
        } else {
            console.warn(`Missing Input with id ${field}`)
        }

    });
}

function enableEditing() {
    fillFormFields(OriginalData, false);
    document.getElementById('editBtn').style.display = 'none';
    document.getElementById('editSubmitBtn').style.display = 'block';

    // const fields = ["employee_id", "current_user_name", "system_model"]

    // fields.forEach((field) => {
    //     const input = document.getElementById('field')

    //     if (input) {
    //         input.disabled = false;
    //         console.log(`Enable Field: ${field}`)
    //     } else {
    //         console.warn(`Missing Input with id ${field}`)
    //     }
    // })
    // document.getElementById('editBtn').style.display = 'none';
    // document.getElementById('editSubmitBtn').style.display = 'block';
}

function formatDateForInput(dateString) {
    if (!dateString) return ''
    const date = new Date(dateString);
    const offsetDate = new Date(date.getTime() + (date.getTimezoneOffset() * 60000)); // Fix timezone offset
    return offsetDate.toISOString().split('T')[0]; // → 'YYYY-MM-DD'

}


document.getElementById('editForm').addEventListener('submit',
    function (e) {
        e.preventDefault();

        // const upgradationDateInput=document.getElementById('upgradation_date').value;
        // const formattedUpgradationDate = upgradationDateInput ===""?OriginalData.upgradation_date:upgradationDateInput;
        const updatedData = {
            assetCode: currentAssetCode,
            // 'slNo': document.getElementById('slNo').value,
            'employee_id': document.getElementById('employee_id').value,
            'asset_code': document.getElementById('asset_code').value,
            'current_user_name': document.getElementById('current_user_name').value,
            'site': document.getElementById('site').value,
            'previous_user': document.getElementById('previous_user').value,
            'employee_status': document.getElementById('employee_status').value,
            'system_name': document.getElementById('system_name').value,
            'system_model': document.getElementById('system_model').value,
            'os_name': document.getElementById('os_name').value,
            'make': document.getElementById('make').value,
            'system_manufacturer': document.getElementById('system_manufacturer').value,
            'serial_no': document.getElementById('serial_no').value,
            'processor_config': document.getElementById('processor_config').value,
            'department': document.getElementById('department').value,
            'ram':document.getElementById('ram').value,
            'monitor':document.getElementById('monitor').value,
            'upgradation_items': document.getElementById('upgradation_items').value,
            'upgradation_date': document.getElementById('upgradation_date').value || formatDateForInput(OriginalData.upgradation_date),
            'upgradation_price': document.getElementById('upgradation_price').value,
            'vendor_name': document.getElementById('vendor_name').value,
            'big_mind_install': document.getElementById('big_mind_install').value,
            'windows_activation': document.getElementById('windows_activation').value,
            'o_install': document.getElementById('o_install').value,
            'host_rename': document.getElementById('host_rename').value,
            'remarks': document.getElementById('remarks').value
        }

        fetch('http://localhost:3000/update', {
            method: 'PUT',
            headers: {
                'content-Type': 'application/json'
            },
            body: JSON.stringify(updatedData)
        }).then(res => res.json())
            .then(resp => {
                alert(resp.message)
                document.getElementById('editBtn').style.display = 'none';
                document.getElementById('editSubmitBtn').style.display = 'inline-block';
                document.getElementById('editSubmitBtn').disabled = true;
                fillFormFields(updatedData, true);
            }).catch(err => alert('error updating Asset' + err.message));
        console.log(updatedData);
    });

function deleteAsset() {

    if (!currentAssetCode) {
        alert('No asset Selected');
        return;
    }
    if (!confirm("are you sure want to delete this asset?")) {
        return;
    }

    fetch('http://localhost:3000/delete', {
        method: 'DELETE',
        headers: {
            'content-Type': 'application/json'
        },
        body: JSON.stringify({ assetCode: currentAssetCode })

    }).then(response => response.json()).then(response => {
        alert(response.message);
        document.getElementById('editForm').value = '';
        document.getElementById('editForm').style.display = 'none';
        currentAssetCode = '';
    }).catch(err => alert('Delete Failed', err.message));
}



function showPopUpMessage(mesaage) {
    document.getElementById('popUpMsg').textContent = mesaage;
    document.getElementById('customPopUP').style.display = 'flex';
    document.getElementById('customPopUP').style.justifyContent = 'center';
    document.getElementById('customPopUP').style.alignContent = 'center';
    //document.getElementById('customPopUP').style.display = 'block';
    document.getElementById('popOverLay').style.display = 'block'
}

function closePopUpMessage() {
    document.getElementById('customPopUP').style.display = 'none';
    document.getElementById('popOverLay').style.display = 'none';

}
function showPasswordBox() {
    const closeBtn = document.getElementById('closeEditBtn');
    document.getElementById('passwordModalEdit').style.display = 'flex';
    document.getElementById('editErrorMsg').style.display = 'none';
    document.getElementById('EditpasscodeInput').value = '';
    document.getElementById('EditpasscodeInput').style.marginTop = '10px';
    document.getElementById('verifyEdit').style.marginTop = '13px';
    closeBtn.style.position = 'absolute';
    closeBtn.style.top = '10px';
    closeBtn.style.left = '10px';
    closeBtn.style.width = '30px'


}

function closeEditBox() {
    document.getElementById('passwordModalEdit').style.display = 'none';
    document.getElementById('editErrorMsg').style.display = 'none';
    document.getElementById('EditpasscodeInput').value = '';
}
function verifyEditPasscode() {
    const password = 1001;
    const passInput = document.getElementById('EditpasscodeInput').value;
    const errEditmsg = document.getElementById('editErrorMsg');
    const close = document.getElementById('closeEditBtn');

    if (password !== parseInt(passInput)) {
        errEditmsg.style.display = 'block';
        errEditmsg.style.color = 'red';
        close.style.position = 'absolute';
        close.style.top = '10px';
        close.style.left = '10px';

    } else {
        errEditmsg.style.display = 'none';
        document.getElementById('passwordModalEdit').style.display = 'none';
        enableEditing();
    }

    if (passInput === '') {
        errEditmsg.style.display = 'block';
        errEditmsg.textContent = 'please enter the password';
    }

}

const popUp = document.getElementById('customPopUP');




document.getElementById('searchAssestCodeEdit').addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        fetchAsset();
    }
});


