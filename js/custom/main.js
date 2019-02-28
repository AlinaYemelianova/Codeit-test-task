
$(document).ready(function () {
    // Init iCheck plugin.
    $('.i-checks').iCheck({
        checkboxClass: 'icheckbox_square-green',
        radioClass: 'iradio_square-green',
    });
    //Init Select2 plugin.
    $('.gender').select2({
        minimumResultsForSearch: Infinity,
        placeholder: 'Gender'
    });
    //Init Jquery Validate plugin
    let validator = $("#form").validate({
        rules: {
            name: {
                required: true,
                minlength: 2
            },
            secondname: {
                required: true,
                rangelength: [3, 60]
            },
            pass: {
                required: true,
                minlength:7
            },
            checkbox: {
                required: true,
            },
           email:{
                required: true,
                email: true
            },
        },
        messages:{
            name: {
                required: 'Please enter your first name',
                minlength: 'At least one character'
            },
            secondname: {
                required: 'Please enter your last name',
                minlength: 'At least two character'
            },
            pass: {
                required: 'Please enter a password',
                minlength: 'Password can not be less than 7 characters'
            }

        }
    });
    //Send post data
    $('.formContent').on('click', '#submit-signup', function() {
        if (validator.form()) {
            const test = {
                name: $('#name').val(),
                secondname: $('#secondname').val(),
                email: $('#email').val(),
                gender: $('#gender :selected').val(),
                pass: $('#pass').val()
            };
            $.ajax({
                type: 'POST',
                url: 'http://codeit.pro/codeitCandidates/serverFrontendTest/user/registration',
                data: test,
                success: function(msg) {
                    if (msg.status == 'Form Error') {
                        $('#form').validate().showErrors({
                            [msg.field]:[msg.message]
                        });
                    } else if (msg.status == 'Error') {
                        $('#serverError').html(msg.message)
                    }else{window.location = 'companies.html'}

                }
            });
        }
        return false;
    });
    //Companies Page
    const companies = [];
    $.ajax({
        url: 'http://codeit.pro/codeitCandidates/serverFrontendTest/company/getList',
        success: function(data) {
            $('#totalCompanies_sum').html(data.list.length);
            for (let i = 0; i < data.list.length; i++){
                companies.push(data.list[i]);
                $('#listOfCompanies__table tbody').append('<tr><td></td></tr>');
                let tr = $("tr:eq(" + i + ")");
                let td = tr.find('td');
                td.html(data.list[i].name);
                td.attr('data-name',`${data.list[i].name}${i}`);
            }
            console.log(data.list);
        }
    });
    //Show companies partners

    function showPartners(i, arr){
        $('.companyPartners__content').append('<div class="partnerInformation"><div class="partnerValue"></div><div class="arrow"></div><div class="partnerName"></div></div>');
        const partnerValue = $("div.partnerValue:eq(" + i + ")");
        const partnerName = $("div.partnerName:eq(" + i + ")");
        partnerValue.html(`${arr[i].value}%`);
        partnerName.html(arr[i].name);
    }
    function sorting(arr, val){
        $('.companyPartners__content').html('');
        /*
        To sort by val, create an array containing the values to be sorted.
         */
        let items = arr.map(function(elem, index){
            return elem[val]
        });
        /*
        Sort values.
         */
        items.sort(function (a, b) {
            if(a > b){
                return 1
            }
            if(a < b){
                return -1
            }
        });
        /*
        Compare the sorted array with the source in the loop.
        If it matches, save the object from the original array to the new one.
        Thus, all objects are in the sort order.
         */
        let sorted = items.map(function (elem) {
            for(let i = 0; i < items.length; i++){
                if(arr[i][val] == elem){
                    return arr[i]
                }
            }

        });
        for (let i = 0; i < sorted.length; i++){
            showPartners(i, sorted);
        }
    };
    $('.listOfCompanies').on('click', 'td', function (){
        let sort;
        $('.companyPartners').addClass('visible');
        $('.companyPartners__content').html('');
        const dataName = $(this).attr('data-name');
        for(let i = 0; i < companies.length; i++){
            let partnersArr;
            if (`${companies[i].name}${i}` == dataName){
                $('.title').html(companies[i].name);
                partnersArr = (companies[i].partners);
                for (let i = 0; i < partnersArr.length; i++){
                    showPartners(i, partnersArr);
                    sort = partnersArr
                }
            }

        }
       $('.btn__sortValue').on('click', function (){
            sorting(sort, 'value');
       });
       $('.btn__sortName').on('click', function (){
            sorting(sort, 'name');
       });
       $('.btn__hideButton').on('click', function () {
           $('.companyPartners').removeClass('visible')
       })



    });
    //Loader
    $preloader = $('.loaderArea');
    $loader = $preloader.find('.loader');
    $preloader.delay().fadeOut('slow');
});





