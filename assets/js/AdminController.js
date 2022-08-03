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