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