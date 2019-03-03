$(document).ready(function () {
    // Init iCheck plugin.
    $('.i-checks').iCheck({
        checkboxClass: 'icheckbox_square-green',
        radioClass: 'iradio_square-green',
    });
    //Init Select2 plugin.
    $('.gender').select2({
        minimumResultsForSearch: Infinity,
        placeholder: 'Select a gender',
    });
    //Init Jquery Validate plugin
    let validator = $("#form").validate({
        ignore: 'input[type=hidden]',
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
                minlength: 7
            },
            checkbox: {
                required: true,
            },
            gender: {
                required: true,
            },
            email: {
                required: true,
                email: true
            },
        },
        errorPlacement: function(error, element) {
            if (element.hasClass('tac-checkbox')) {
                $('.tac-checkbox-row').append(error);
            } else if (element.hasClass('gender')) {
                element.parent().find('.select2-container').after(error);
            }
            else {
                element.after(error);
            }
        },
        messages: {
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
    $('.formContent').on('click', '#submit-signup', function () {
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
                success: function (msg) {
                    if (msg.status == 'Form Error') {
                        $('#form').validate().showErrors({
                            [msg.field]: [msg.message]
                        });
                    } else if (msg.status == 'Error') {
                        $('#serverError').html(msg.message)
                    } else {
                        window.location = 'companies.html'
                    }

                }
            });
        }
        return false;
    });
});





