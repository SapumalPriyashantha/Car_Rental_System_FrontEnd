var driverBaseUrl = "http://localhost:8080/Car_Rental_System_war/api/v1/driver";


$("#btnSaveDriver").click(function () {
    saveDriver();
});

function saveDriver() {
    var serialize = $("#driverForm").serialize();

    $.ajax({
        url: driverBaseUrl,
        method: "POST",
        data: serialize,
        success: function (res) {
            if (res.code == 200) {
                alert(res.message);
                // loadAllCustomer();
                // loadAllCustomerIds();
                // getCustomerCount();
            }
        },
        error: function (ob) {
            console.log(ob.responseJSON.message);
        }
    })
}

/////////////////////////////////////////////////////////////////////
// driver panel

let checkDriverUsername;
let checkDriverPassword;

let correctDriver;

let checkScheduleStartDate;
let checkScheduleEndDate;

//check customer
$("#bthCheckLoginDriver").click(function () {
    checkDriverUsername=$("#loginCheckDriverUserName").val();
    checkDriverPassword=$("#loginCheckDriverPassword").val();

    checkDataIsItVaildDriver();
});

function checkDataIsItVaildDriver() {

    $.ajax({
        // http://localhost:8080/Car_Rental_System_war/api/v1/driver/getDriver?userName=kaml perera&password=0001
        url: driverBaseUrl + "/getDriver?userName="+checkDriverUsername+"&password="+checkDriverPassword,
        method: 'GET',
        success: function (res) {
            if (res.code == 200) {
                alert(res.message);
                correctDriver=res.data.nic;
                showDriverPanel();
            }
        },
        error: function (err) {
            alert("No such a valid Driver, Enter correct username and password");
        }
    });
}

function showDriverPanel() {
    $("#loginDriverHeader").css("display", "block");
    // $("#customerReservation").css("display", "block");
    $("#loginCheckDriver").css("display", "none");
}

///////////////////////////////////////////////////////////
$("#btnCheckSchedule").click(function () {
    // let nic =$("#nic").val();
    // checkCustomerUsername=$("#loginCheckCustomerUserName").val();
    // checkCustomerPassword=$("#loginCheckCustomerPassword").val();
    //
    // checkDataIsItVaildCustomer();
    $("#DriverSchedule").css("display", "block");
    // $("#CustomerDenyReservationsDiv").css("display", "none");
    // loadDriverSchedule();
});

$("#btnCheckDriverSchedule").click(function () {
    checkScheduleStartDate=$("#driverScheduleStartDate").val();
    checkScheduleEndDate=$("#driverScheduleEndDate").val();

    $("#tbl_driverSchedule").empty();

    $.ajax({
        // http://localhost:8080/Car_Rental_System_war/api/v1/reservation/DriverSchedule?driver_nic=0002&start_date=2022-08-10&end_date=2022-08-17
        // reservationBaseUrl + "/DriverSchedule?driver_nic="+correctDriver+"&start_date="+checkScheduleStartDate+"&end_date="+checkScheduleEndDate
        url: reservationBaseUrl + "/DriverSchedule?driver_nic="+correctDriver+"&start_date="+checkScheduleStartDate+"&end_date="+checkScheduleEndDate,
        method: 'GET',
        success: function (res) {
            if (res.code == 200) {
                for (const s of res.data) {
                    let row = `<tr><td>${s.reservation_id}</td><td>${s.pick_up_date}</td><td>${s.return_date}</td><td>${s.pick_up_time}</td><td>${s.reservation_status}</td><td>${s.customer.customer_name}</td><td>${s.customer.con_number}</td><td>${s.car.registration_no}</td><td>${s.car.brand}</td><td>${s.driver.driver_name}</td></tr>`;
                    $("#tbl_driverSchedule").append(row);
                }
            }
        },
        error: function (err) {
            alert(" Driver Schedule  loading Error.....");
        }
    });
});
