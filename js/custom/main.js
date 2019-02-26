'use strict';

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
    $("#form").validate({
        rules: {
            firstName: {
                required: true,
                minlength: 2
            },
            lastName: {
                required: true,
                minlength: 3
            },
            password: {
                required: true,
                minlength:8
            },
            checkbox: {
                required: true,
            },
            email:{
                required: true,
            },
            gender:{
                required: true,
            }
        },
        messages:{
            firstName: {
                required: 'Please enter your first name',
                minlength: 'At least one character'
            },
            lastName: {
                required: 'Please enter your last name',
                minlength: 'At least two character'
            },
            password: {
                required: 'Please enter a password',
                minlength: 'Password can not be less than 8 characters'
            }

        }
    });
});
