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