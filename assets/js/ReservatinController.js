var reservationBaseUrl = "http://localhost:8080/Car_Rental_System_war/api/v1/reservation";

let pickUpdate;
let returnDate;
let todayDate;
let pickUpTime;
let carType;
let transmission;

let username;
let password;

let customerOB;
let carOB;
let driverOB;

let driverStatus;

let reservationId;


let waiverPayment=$('#dropdown_carKM option:selected').text();
// let driverStatus=$('#dropdown_carFuel option:selected').text();

// let freeDaily=$("#car_freeKmDaily").val();
// let freeMonthly=$("#car_freeKmMonthly").val();
// let priceExtraKm=$("#car_priceExtraKm").val();
// let status=$('#dropdown_carStatus option:selected').text();

//check available cars for customer
$("#btnCheckAvailableCars").click(function () {

    $("#tbl_availableCarsForCustomers").empty();

     pickUpdate =$("#pickUpdate").val();
     returnDate=$("#returnDate").val();
     todayDate=$("#todayDate").val();
     pickUpTime=$("#time").val();
     carType=$('#type option:selected').text();
     transmission=$('#transmission option:selected').text();

    //  console.log(pickUpdate);
    // console.log(returnDate);
    // console.log(todayDate);
    // console.log(pickUpTime);
    // console.log(carType);
    // console.log(transmission);

    $.ajax({
        url: carBaseUrl+"/getAvailableCarsForCustomers?pick_up_date="+pickUpdate+"&return_date="+returnDate+"&type="+carType+"&transmission="+transmission,
        method: 'GET',
        success: function (res) {
            if (res.code == 200) {
                for (const car of res.data) {
                    let row = `<tr><td>${car.registration_no}</td><td>${car.brand}</td><td>${car.type}</td><td>${car.transmission}</td></tr>`;
                    $("#tbl_availableCarsForCustomers").append(row);
                }
                getCarRegistrationId();
            }
        },
        error: function (err) {
            console.log(err);
        }
    });
});

function getCarRegistrationId() {
    $("#tbl_availableCarsForCustomers>tr").off();

    $("#tbl_availableCarsForCustomers>tr").click(function () {
        let registrationNumber = $(this).children(":eq(0)").text(); // select first td and get text
        getCar(registrationNumber);
    });

}


function getCar(registrationNumber){
    $.ajax({
        //http://localhost:8080/Car_Rental_System_war/api/v1/car/getCar?registration_no=055
        url: carBaseUrl+"/getCar?registration_no="+registrationNumber,
        method: 'GET',
        success: function (res) {
            if (res.code == 200) {
               carOB = res.data;//reservation car js object
            }
        },
        error: function (err) {
            console.log(err);
        }
    });
}





function checkDriverStatus(){
    if(document.getElementById('YES').checked) {
        driverStatus= document.getElementById("YES").value;
    }else if(document.getElementById('NO').checked) {
        driverStatus= document.getElementById("NO").value;
    }
}

function getDriver(driverStatus){
    if(driverStatus == "NO"){
        driverOB = null;
    }else {
        $.ajax({
            // http://localhost:8080/Car_Rental_System_war/api/v1/driver/getRandomDriver?start_date=2022-10-12&end_date=2022-10-30
            url: driverBaseUrl+"/getRandomDriver?start_date="+pickUpdate+"&end_date="+returnDate,
            method: 'GET',
            success: function (res) {
                if (res.code == 200) {
                    driverOB = res.data; //reservation random driver js object
                }
            },
            error: function (err) {
                console.log(err);
            }
        });
    }
}
$("#btnSaveReservation").click(function () {
    getUserNameAndPassword();
});


function getUserNameAndPassword() {
     username=$("#cust_userName").val();
     password=$("#cust_pasWord").val();

    $.ajax({
        // http://localhost:8080/Car_Rental_System_war/api/v1/checkLogin/login?user_name=sumith&pass_word=gfgf
        url:" http://localhost:8080/Car_Rental_System_war/api/v1/checkLogin/login?user_name="+username+"&pass_word="+password,
        method: 'GET',
        success: function (res) {
            if (res.code == 200) {
                customerOB=res.data; //reservation relevant customer js object
                checkDriverStatus();
                getDriver(driverStatus);
                generateReservationId();
                saveReservation();
            }
        },
        error: function (err) {
            alert("Incorrect username or password, Enter correct username and password");
        }
    });
}

function generateReservationId() {
    $.ajax({
        // http://localhost:8080/Car_Rental_System_war/api/v1/reservation/generateReservationId
        url: reservationBaseUrl+"/generateReservationId",
        method: 'GET',
        success: function (res) {
            if (res.code == 200) {
               reservationId = res.data;
               //  reservationId = "RE-013";
            }
        },
        error: function (err) {
            console.log(err);
        }
    });
}

function saveReservation() {
    var data = new FormData();
    let bank_slip_img = $("#slip")[0].files[0];
    let  bank_slip_img_fileName = $("#slip")[0].files[0].name;

    console.log(bank_slip_img);
    console.log(bank_slip_img_fileName);

    data.append("file", bank_slip_img, bank_slip_img_fileName);

    let waiverPayment=$("#waiverPayment").val();
    let reservationStatus = "Pending";
    let reason = "new reservation";

    const  reservationOB = {
        reservation_id : reservationId,
        reservation_date : todayDate,
        pick_up_date :  pickUpdate,
        return_date :  returnDate,
        pick_up_time :  pickUpTime,
        waiver_payment :  waiverPayment,
        bank_slip_img :  null,
        reservation_status :  reservationStatus,
        driver_status : "Available",
        reason :  reason,

        customer :customerOB,

        car :carOB,

        driver :driverOB
    };

    console.log(reservationOB);

    data.append("reservation", new Blob([JSON.stringify(reservationOB)], {type : "application/json"}));
    $.ajax({
        url: reservationBaseUrl,
        method: 'post',
        async: true,
        contentType: false,
        processData: false,
        data: data,
        success: function (res) {
            if (res.code == 200) {
                alert(res.message);
                updateCarStatus();
            }
        },
        error: function (err) {
            console.log(err);
        }
    });
}

function updateCarStatus() {
    $.ajax({
        //http://localhost:8080/Car_Rental_System_war/api/v1/car/updateStatusForCar?registration_no=0001&status=unAvailable
        url: carBaseUrl+"/updateStatusForCar?registration_no="+carOB.registration_no+"&status=unAvailable",
        method: "PUT",
        // dataType:"json", // please convert the response into JSON
        success: function (res) {
            if (res.code == 200) {
                console.log(res.message);
            }
        }
    });
}





