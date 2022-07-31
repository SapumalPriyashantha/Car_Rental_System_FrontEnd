
//Add Cars brand inside dropdown
$("#dropdown_carBrand").append('<option>' + 'Select Car Brand' + '</option>');
$("#dropdown_carBrand").append('<option>' + 'Suzuki Alto' + '</option>');
$("#dropdown_carBrand").append('<option>' + 'Suzuki Alto K10' + '</option>');
$("#dropdown_carBrand").append('<option>' + 'Suzuki Celerio' + '</option>');
$("#dropdown_carBrand").append('<option>' + 'Perodua (Daihatsu) Axia' + '</option>');
$("#dropdown_carBrand").append('<option>' + 'Toyota Prius C/ Aqua' + '</option>');
$("#dropdown_carBrand").append('<option>' + 'Toyota Corolla Axio/ NZE141' + '</option>');
$("#dropdown_carBrand").append('<option>' + 'Perodua Bezza Prime Sedan' + '</option>');
$("#dropdown_carBrand").append('<option>' + 'Toyota Allion NZT 260' + '</option>');
$("#dropdown_carBrand").append('<option>' + 'Toyota Axio NKR 165' + '</option>');
$("#dropdown_carBrand").append('<option>' + 'Toyota Premio' + '</option>');
$("#dropdown_carBrand").append('<option>' + 'Mercedes' + '</option>');
$("#dropdown_carBrand").append('<option>' + 'BMW i8' + '</option>');

//Add Car types inside dropdown
$("#dropdown_carType").append('<option>' + 'Select Car Type' + '</option>');
$("#dropdown_carType").append('<option>' + 'General' + '</option>');
$("#dropdown_carType").append('<option>' + 'Premium' + '</option>');
$("#dropdown_carType").append('<option>' + 'Luxury' + '</option>');

//Add Car transmission inside dropdown
$("#dropdown_carTransmission").append('<option>' + 'Select Car Transmission' + '</option>');
$("#dropdown_carTransmission").append('<option>' + 'Manual' + '</option>');
$("#dropdown_carTransmission").append('<option>' + 'Auto' + '</option>');

//Add Car KM inside dropdown
$("#dropdown_carKM").append('<option>' + 'Select Car KM' + '</option>');
$("#dropdown_carKM").append('<option>' + '0' + '</option>');

//Add Car Fuel Type inside dropdown
$("#dropdown_carFuel").append('<option>' + 'Select Car Fuel Type' + '</option>');
$("#dropdown_carFuel").append('<option>' + 'Petrol' + '</option>');
$("#dropdown_carFuel").append('<option>' + 'Diesel' + '</option>');

//Add Car Status inside dropdown
$("#dropdown_carStatus").append('<option>' + 'Select Car Status' + '</option>');
$("#dropdown_carStatus").append('<option>' + 'Available' + '</option>');
$("#dropdown_carStatus").append('<option>' + 'UnAvailable' + '</option>');

///////////////////////////////////////////////////////////////////////////////////

var carBaseUrl = "http://localhost:8080/Car_Rental_System_war/api/v1/car";

$("#btnSaveCar").click(function () {
    saveCar();
});

function saveCar() {
    var data = new FormData();
    let front_file = $("#Front_image")[0].files[0];
    let front_fileName = $("#Front_image")[0].files[0].name;

    let back_file = $("#Back_image")[0].files[0];
    let back_fileName = $("#Back_image")[0].files[0].name;

    let right_file = $("#Right_image")[0].files[0];
    let right_fileName = $("#Right_image")[0].files[0].name;

    let left_file = $("#Left_image")[0].files[0];
    let left_fileName = $("#Left_image")[0].files[0].name;

    data.append("file", front_file, front_fileName);
    data.append("file", back_file, back_fileName);
    data.append("file", right_file, right_fileName);
    data.append("file", left_file, left_fileName);

    let num =$("#CarRegiNum").val();
    let brand=$('#dropdown_carBrand option:selected').text();
    let type=$('#dropdown_carType option:selected').text();
    let transmission=$('#dropdown_carTransmission option:selected').text();
    let color=$("#CarColour").val();
    let numOfPaa=$("#NumOfPass").val();
    let km=$('#dropdown_carKM option:selected').text();
    let fuel=$('#dropdown_carFuel option:selected').text();
    let dailyRate=$("#car_dailyRate").val();
    let monthlyRate=$("#car_monthlyRate").val();
    let freeDaily=$("#car_freeKmDaily").val();
    let freeMonthly=$("#car_freeKmMonthly").val();
    let priceExtraKm=$("#car_priceExtraKm").val();
    let status=$('#dropdown_carStatus option:selected').text();

    // console.log(num);
    // console.log(brand);
    // console.log(type);
    // console.log(transmission);
    // console.log(color);
    // console.log(numOfPaa);
    // console.log(km);
    // console.log(fuel);
    // console.log(dailyRate);
    // console.log(monthlyRate);
    // console.log(freeDaily);
    // console.log(freeMonthly);
    // console.log(priceExtraKm);
    // console.log(status);
    // console.log(front_fileName);
    // console.log(back_fileName);
    // console.log(right_fileName);
    // console.log(left_fileName);

    const  carOB = {
        registration_no : num,
        brand : brand,
        type :  type,
        transmission :  transmission,
        color :  color,
        no_of_passengers :  numOfPaa,
        km :  km,
        fuel_type :  fuel,
        daily_rate : dailyRate,
        monthly_rate :  monthlyRate,
        free_km_for_day :  freeDaily,
        free_km_for_month :  freeMonthly,
        price_for_extra_km :  priceExtraKm,
        status :  status,

        carImgDetail :{
            front:null,
            back:null,
            side_01:null,
            side_02:null
        }
    };

        data.append("car", new Blob([JSON.stringify(carOB)], {type : "application/json"}));
        $.ajax({
            url: carBaseUrl,
            method: 'post',
            async: true,
            contentType: false,
            processData: false,
            data: data,
            success: function (res) {
                if (res.code == 200) {
                    alert(res.message);
                    // clearInputFields();
                }
            },
            error: function (err) {
                console.log(err);
            }
        });

}