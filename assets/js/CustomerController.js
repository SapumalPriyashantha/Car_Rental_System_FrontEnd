var customerBaseUrl = "http://localhost:8080/Car_Rental_System_war/api/v1/customer";

$("#btnSaveCustomer").click(function () {
    saveCustomer();
});

function saveCustomer() {
    var data = new FormData();
    let License_file = $("#License_image")[0].files[0];
    let License_fileName = $("#License_image")[0].files[0].name;

    let nic_file = $("#nic_img")[0].files[0];
    let nic_fileName = $("#nic_img")[0].files[0].name;

    data.append("file", License_file, License_fileName);
    data.append("file", nic_file, nic_fileName);

    let nic =$("#nic").val();
    let user_name=$("#userName").val();
    let password=$("#password").val();
    let re_password=$("#retypePassword").val();
    let customer_name=$("#name").val();
    let license_no=$("#LiNumber").val();
    let address=$("#address").val();
    let con_number=$("#con_number").val();
    let email=$("#InputEmail1").val();
    let register_date=$("#customer_regi_date").val();

    const  customerOB = {
        nic : nic,
        user_name : user_name,
        password :  password,
        customer_name :  customer_name,
        license_no :  license_no,
        license_img :  null,
        nic_img :  null,
        address :  address,
        con_number : con_number,
        email :  email,
        register_date :  register_date
    };

    if(password==re_password){
        data.append("customer", new Blob([JSON.stringify(customerOB)], {type : "application/json"}));
        $.ajax({
            url: customerBaseUrl,
            method: 'post',
            async: true,
            contentType: false,
            processData: false,
            data: data,
            success: function (res) {
                if (res.code == 200) {
                    alert(res.message);
                    clearInputFields();
                }
            },
            error: function (err) {
                console.log(err);
            }
        });
    }else {
       alert("Password and Retype Password are not matching");
    }
}

function clearInputFields() {
    $("#nic").val(null);
    $("#userName").val(null);
    $("#password").val(null);
    $("#retypePassword").val(null);
    $("#name").val(null);
    $("#LiNumber").val(null);
    $("#address").val(null);
    $("#con_number").val(null);
    $("#InputEmail1").val(null);
    $("#customer_regi_date").val(null);
    $("#customer_regi_dateSelected").val(null);
    $("#License_image").val(null);
    $("#nic_img").val(null);
}

/////////////////////////////////////////////////////////////////////////////////////
// customer Panel

let checkCustomerUsername;
let checkCustomerPassword;

let correctCustomer;

//check customer
$("#bthCheckLogin").click(function () {
    // let nic =$("#nic").val();
    checkCustomerUsername=$("#loginCheckCustomerUserName").val();
    checkCustomerPassword=$("#loginCheckCustomerPassword").val();

    checkDataIsItVaildCustomer();
});

function checkDataIsItVaildCustomer() {

    $.ajax({
        // http://localhost:8080/Car_Rental_System_war/api/v1/customer/getCustomer?userName=sapumal&password=123
        url: customerBaseUrl + "/getCustomer?userName="+checkCustomerUsername+"&password="+checkCustomerPassword,
        method: 'GET',
        success: function (res) {
            if (res.code == 200) {
                alert(res.message);
                correctCustomer=res.data;
               showCustomerPanel();
            }
        },
        error: function (err) {
            alert("No such a valid Customer, Enter correct username and password");
        }
    });
}

function showCustomerPanel() {
    $("#loginCustomerHeader").css("display", "block");
    // $("#customerReservation").css("display", "block");
    $("#loginCheckCustomer").css("display", "none");
}

/////////////////////////////////////
$("#btnCustomerAcceptReservation").click(function () {
    // let nic =$("#nic").val();
    // checkCustomerUsername=$("#loginCheckCustomerUserName").val();
    // checkCustomerPassword=$("#loginCheckCustomerPassword").val();
    //
    // checkDataIsItVaildCustomer();
    $("#customerReservation").css("display", "block");
    $("#CustomerDenyReservationsDiv").css("display", "none");
    $("#CustomerPendingReservationsDiv").css("display", "none");
    $("#CustomerAcceptReservationsDiv").css("display", "block");
    loadAllAcceptReservation();
});

function loadAllAcceptReservation() {
    $("#tbl_customerAcceptReservation").empty();

    $.ajax({
        // http://localhost:8080/Car_Rental_System_war/api/v1/reservation/acceptReservation?nic=0001&accept_status=Accept
        url: reservationBaseUrl + "/acceptReservation?nic="+correctCustomer.nic+"&accept_status=Accept",
        method: 'GET',
        success: function (res) {
            if (res.code == 200) {
                for (const a of res.data) {
                    console.log(a);
                    let row = `<tr><td>${a.reservation_id}</td><td>${a.reservation_date}</td><td>${a.pick_up_date}</td><td>${a.return_date}</td><td>${a.reservation_status}</td><td>${a.reason}</td><td>${a.customer.customer_name}</td><td>${a.car.brand}</td><td>${a.driver.driver_name}</td><td>${a.driver.con_number}</td></tr>`;
                    $("#tbl_customerAcceptReservation").append(row);
                }
            }
        },
        error: function (err) {
            alert(" Accept reservation loading Error.....");
        }
    });
}

///////////////////////////////////////////////////////////////
$("#btnCustomerPendingReservation").click(function () {
    $("#customerReservation").css("display", "block");
    $("#CustomerDenyReservationsDiv").css("display", "none");
    $("#CustomerAcceptReservationsDiv").css("display", "none");
    $("#CustomerPendingReservationsDiv").css("display", "block");
    loadAllPendingReservation();
});

function loadAllPendingReservation() {
    $("#tbl_customerPendingReservation").empty();

    $.ajax({
        // http://localhost:8080/Car_Rental_System_war/api/v1/reservation/pendingReservation?nic=0001&pending_status=Pending
        url: reservationBaseUrl + "/pendingReservation?nic="+correctCustomer.nic+"&pending_status=Pending",
        method: 'GET',
        success: function (res) {
            if (res.code == 200) {
                for (const a of res.data) {
                    console.log(a);
                    let row = `<tr><td>${a.reservation_id}</td><td>${a.reservation_date}</td><td>${a.pick_up_date}</td><td>${a.return_date}</td><td>${a.reservation_status}</td><td>${a.reason}</td><td>${a.customer.customer_name}</td><td>${a.car.brand}</td><td>${a.driver.driver_name}</td><td>${a.driver.con_number}</td></tr>`;
                    $("#tbl_customerPendingReservation").append(row);
                }
            }
        },
        error: function (err) {
            alert(" Pending reservation loading Error.....");
        }
    });
}

//////////////////////////////////////////////////////////////////////////
$("#btnCustomerDenyReservation").click(function () {
    $("#customerReservation").css("display", "block");
    $("#CustomerDenyReservationsDiv").css("display", "block");
    $("#CustomerAcceptReservationsDiv").css("display", "none");
    $("#CustomerPendingReservationsDiv").css("display", "none");
    loadAllDenyReservation();
});

function loadAllDenyReservation() {
    $("#tbl_customerDenyReservation").empty();

    $.ajax({
        // http://localhost:8080/Car_Rental_System_war/api/v1/reservation/denyReservation?nic=0001&deny_status=Deny
        url: reservationBaseUrl + "/denyReservation?nic="+correctCustomer.nic+"&deny_status=Deny",
        method: 'GET',
        success: function (res) {
            if (res.code == 200) {
                for (const a of res.data) {
                    console.log(a);
                    let row = `<tr><td>${a.reservation_id}</td><td>${a.reservation_date}</td><td>${a.pick_up_date}</td><td>${a.return_date}</td><td>${a.reservation_status}</td><td>${a.reason}</td><td>${a.customer.customer_name}</td><td>${a.car.brand}</td><td>${a.driver.driver_name}</td><td>${a.driver.con_number}</td></tr>`;
                    $("#tbl_customerDenyReservation").append(row);
                }
            }
        },
        error: function (err) {
            alert(" Deny reservation loading Error.....");
        }
    });
}