
var adminBaseUrl = "http://localhost:8080/Car_Rental_System_war/api/v1/admin";

// Admin Change Reservation status
$("#dropdown_reservationStatus").append('<option>' + 'Select Reservation Status' + '</option>');
$("#dropdown_reservationStatus").append('<option>' + 'Accept' + '</option>');
$("#dropdown_reservationStatus").append('<option>' + 'Deny' + '</option>');
$("#dropdown_reservationStatus").append('<option>' + 'Pending' + '</option>');

$("#dropdown_statusReason").append('<option>' + 'Select Status Reason' + '</option>');
$("#dropdown_statusReason").append('<option>' + 'Admin accept your request' + '</option>');
$("#dropdown_statusReason").append('<option>' + 'All drivers are unavailable on your pickup date' + '</option>');
$("#dropdown_statusReason").append('<option>' + 'Admin still dose not check request'  + '</option>');


/////////////////////////////////////////////
let reservation_Id;
let reservationStatus;
let statusReason;

let updateReservationID;
let updateDriverNIC;

let checkPockUpdate;
let checkReturndate;

$("#btnUpdateReservationStatus").click(function () {
    setPendingAllReservationToTable();
});

function setPendingAllReservationToTable() {
    $("#tbl_updateReservationStatus>tr").empty();

    $.ajax({
        // http://localhost:8080/Car_Rental_System_war/api/v1/reservation/getAllPendingReservation
        url: reservationBaseUrl+"/getAllPendingReservation",
        method: 'GET',
        success: function (res) {
            if (res.code == 200) {
                for (const r of res.data) {
                    let row = `<tr><td>${r.reservation_id}</td><td>${r.pick_up_date}</td><td>${r.return_date}</td><td>${r.reservation_status}</td><td>${r.reason}</td><td>${r.car.registration_no}</td><td>${r.customer.nic}</td><td>${r.driver.nic}</td></tr>`;
                    $("#tbl_updateReservationStatus").append(row);
                }
                getReservationRowData();
            }
        },
        error: function (err) {
            alert("No such pending reservation");
        }
    });
}

function getReservationRowData() {
    $("#tbl_updateReservationStatus>tr").off();

    $("#tbl_updateReservationStatus>tr").click(function () {
         reservation_Id = $(this).children(":eq(0)").text(); // select row abd get txt
        $("#reservation_Id").val(reservation_Id);
    });

}

$("#btnChangeReservationStatus").click(function () {
    updateReservationStatus();
});

function updateReservationStatus() {
    reservationStatus = $('#dropdown_reservationStatus option:selected').text();
    statusReason = $('#dropdown_statusReason option:selected').text();

    $.ajax({
        // http://localhost:8080/Car_Rental_System_war/api/v1/reservation/updateReservationStatus?reservation_id=re007&reservation_status=deny&status_reason=no such a availble drivers
        url: reservationBaseUrl+"/updateReservationStatus?reservation_id="+reservation_Id+"&reservation_status="+reservationStatus+"&status_reason="+statusReason,
        method: 'PUT',
        success: function (res) {
            alert(res.message);
            setPendingAllReservationToTable();
        },
        error: function (err) {
            alert(err.message);
        }
    });
}


//change driver
$("#btnUpdateDriver").click(function () {
    getAllAcceptReservation();
});

function getAllAcceptReservation() {
    $("#tbl_changeDriver>tr").empty();

    $.ajax({
        // http://localhost:8080/Car_Rental_System_war/api/v1/reservation/getAllAcceptReservation
        url: reservationBaseUrl+"/getAllAcceptReservation",
        method: 'GET',
        success: function (res) {
            if (res.code == 200) {
                for (const a of res.data) {
                    let row = `<tr><td>${a.reservation_id}</td><td>${a.pick_up_date}</td><td>${a.return_date}</td><td>${a.reservation_status}</td><td>${a.driver.nic}</td></tr>`;
                    $("#tbl_changeDriver").append(row);
                }
            }
        },
        error: function (err) {
            alert("No such Accept reservation");
        }
    });
}

$("#btnCheckAvailableDrivers").click(function () {
    getAvailableDrivers();
});

function getAvailableDrivers() {
    $("#tbl_changeDriverReservation>tr").empty();

    checkPockUpdate = $("#availableDriverPickUpdate").val();
    checkReturndate = $("#availableDriverReturnDate").val();

    $.ajax({
        // http://localhost:8080/Car_Rental_System_war/api/v1/driver/AvailableDrivers?start_date=2022-08-10&end_date=2022-08-17
        url: driverBaseUrl + "/AvailableDrivers?start_date=" + checkPockUpdate + "&end_date=" + checkReturndate,
        method: 'GET',
        success: function (res) {
            if (res.code == 200) {
                for (const a of res.data) {
                    let row = `<tr><td>${a.nic}</td><td>${a.driver_name}</td></tr>`;
                    $("#tbl_changeDriverReservation").append(row);
                }
                getReservationID();
                getDriverINIC();
            }
        },
        error: function (err) {
            alert("No such a available drivers");
        }
    });

}

function getReservationID() {
    $("#tbl_changeDriver>tr").off();

    $("#tbl_changeDriver>tr").click(function () {
        updateReservationID = $(this).children(":eq(0)").text(); // select row abd get txt
        $("#updateDriverReservation_Id").val(updateReservationID);
    });
}

function getDriverINIC() {
    $("#tbl_changeDriverReservation>tr").off();

    $("#tbl_changeDriverReservation>tr").click(function () {
        updateDriverNIC = $(this).children(":eq(0)").text(); // select row abd get txt
        $("#updateDriver_driverNIC").val(updateDriverNIC);
    });
}

$("#btnUpdateAvailableDriver").click(function () {
    updateDriver();
});

function updateDriver() {
    $.ajax({
        // http://localhost:8080/Car_Rental_System_war/api/v1/driver/changeDriverInReservation?reservation_id=re011&driver_nic=D-001
        url: driverBaseUrl+"/changeDriverInReservation?reservation_id="+updateReservationID+"&driver_nic="+updateDriverNIC,
        method: 'PUT',
        success: function (res) {
            if (res.code == 200) {
                alert(res.message);
                getAllAcceptReservation();
                getAvailableDrivers();
            }
        },
        error: function (err) {
            alert("No such a available drivers");
        }
    });
}

///////////////////////////////////////////////////////////////
//update status car
//update km car
//update reservation status

// Admin Panel

let checkAdminUsername;
let checkAdminPassword;

let correctAdmin;

//check customer
$("#bthCheckLoginAdmin").click(function () {
    // let nic =$("#nic").val();
    checkAdminUsername=$("#loginCheckAdminUserName").val();
    checkAdminPassword=$("#loginCheckAdminPassword").val();

    checkDataIsItVaildAdmin();
});

function checkDataIsItVaildAdmin() {

    $.ajax({
        // http://localhost:8080/Car_Rental_System_war/api/v1/admin/getAdmin?userName=yashodara&password=yasho1234
        url: adminBaseUrl + "/getAdmin?userName="+checkAdminUsername+"&password="+checkAdminPassword,
        method: 'GET',
        success: function (res) {
            if (res.code == 200) {
                alert(res.message);
                correctAdmin=res.data;
                console.log(correctAdmin);
                showAdminPanel();
            }
        },
        error: function (err) {
            alert("No such a valid Admin, Enter correct username and password");
        }
    });
}

function showAdminPanel() {
    $("#loginAdminHeader").css("display", "block");
    // $("#customerReservation").css("display", "block");
    $("#loginCheckAdmin").css("display", "none");
}

///////////////////////////////////////////////////////////////
$("#btnAddCars").click(function () {
    $("#AddCar").css("display", "block");
    $("#update").css("display", "none");
    $("#loginCheckAdmin").css("display", "none");
});

$("#btnUpdateReservationStatus").click(function () {
    $("#AdminUpdateReservationStatus").css("display", "block");
    $("#update").css("display", "block");
    $("#AddCar").css("display", "none");
    $("#AdminUpdateDriver").css("display", "none");
    $("#AdminUpdateOtherUpdates").css("display", "none");
    $("#loginCheckAdmin").css("display", "none");
});

$("#btnUpdateDriver").click(function () {
    $("#AdminUpdateDriver").css("display", "block");
    $("#update").css("display", "block");
    $("#AddCar").css("display", "none");
    $("#AdminUpdateReservationStatus").css("display", "none");
    $("#AdminUpdateOtherUpdates").css("display", "none");
    $("#loginCheckAdmin").css("display", "none");
});

$("#btnOtherUpdates").click(function () {
    $("#AdminUpdateOtherUpdates").css("display", "block");
    $("#update").css("display", "block");
    $("#AddCar").css("display", "none");
    $("#AdminUpdateDriver").css("display", "none");
    $("#AdminUpdateReservationStatus").css("display", "none");
    $("#loginCheckAdmin").css("display", "none");
});
