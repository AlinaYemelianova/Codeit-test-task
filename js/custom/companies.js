$(document).ready(function () {
    const companies = [];
    $.ajax({
        url: 'http://codeit.pro/codeitCandidates/serverFrontendTest/company/getList',
        success: function (data) {
            for (let i = 0; i < data.list.length; i++) {
                companies.push(data.list[i]);
                $('#listOfCompanies__table tbody').append('<tr><td></td></tr>');
                let tr = $('tr:eq(' + i + ')');
                let td = tr.find('td');
                td.html(data.list[i].name);
                td.attr('data-name', `${data.list[i].name}${i}`);
            }
        },
        //Shows a chart by country.
        complete: function () {
            $('#totalCompanies_sum').html(companies.length);
            let countries = companies.map(function (elem) {
                return elem.location.name;
            });
            let amountOfEachCountry = [];
            let percentage = [];
            let objForSort = {};

            //Collect unique values.
            for (let i = 0; i < countries.length; i++) {
                objForSort[countries[i]] = i;
            }
            let countriesName = Object.keys(objForSort);
            //Find the number of repetitions of each country in the array
            for (let i = 0; i < countriesName.length; i++) {
                let count = 0;
                for (let a = 0; a < countries.length; a++) {
                    if (countriesName[i] == countries[a]) {
                        ++count
                    }
                }
                amountOfEachCountry.push(count)
            }
            for (let i = 0; i < countriesName.length; i++) {
                percentage[i] = Math.floor(amountOfEachCountry[i] * 100 / countries.length);
            }
            countriesChart = new Chart($('#countriesChart'), {
                type: 'doughnut',
                data: {
                    labels: countriesName,
                    datasets: [{
                        data: percentage,
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.6)',
                            'rgba(54, 162, 235, 0.6)',
                            'rgba(255, 206, 86, 0.6)',
                            'rgba(75, 192, 192, 0.6)',
                            'rgba(153, 102, 255, 0.6)',
                            'rgba(255, 159, 64, 0.6)',
                            'rgba(255, 159, 64, 0.6)'
                        ]
                    }]
                },
                options: {
                    legend: {
                        display: false
                    }
                }
            });
        }
    });

    //Displays a list of companies in a particular country.
    let countriesChart;
    $('.table__wrapper').on('click', '#countriesChart', function (evt) {
        let activePoints = countriesChart.getElementAtEvent(evt);
        let firstPoint = activePoints[0];
        let label = countriesChart.data.labels[firstPoint._index];
        $('canvas').hide();
        $('.back__btn, .location__content table').show();
        $('.location__content .countryTitle .countryName').html(label);
        let showCampByCountry = [];
        for (let i = 0; i < companies.length; i++) {
            if (companies[i].location.name === label) {
                showCampByCountry.push(companies[i].name);
            }
        }
        for (let i = 0; i < showCampByCountry.length; i++) {
            $('.location__content tbody').append('<tr><td></td></tr>');
            let tr = $('.table__wrapper tr:eq(' + i + ')');
            let td = tr.find('td');
            td.html(showCampByCountry[i]);
        }

    });

    //Hides list CampByCountry.
    $('.location__content').on('click', '.back__btn', function () {
        $('.location__content tbody').html('');
        $('canvas').show();
        $('.back__btn, .location__content table').hide();
        $('.location__content .countryTitle .countryName').html('')
    });

    //News
    const news = [];
    $.ajax({
        url: 'http://codeit.pro/codeitCandidates/serverFrontendTest/news/getList',
        success: function (data) {
            for (let i = 0; i < data.list.length; i++) {
                news.push(data.list[i]);
            }
        },
        complete: function () {
            for (let i = 0; i < news.length; i++) {
                let article = news[i];
                $('#slideWrapper').append('<li class="newsSlide"><div class="mainContent row"><div class="col-sm-12 col-md-6 image"><img></div><div class="col-sm-12 col-md-6 article"><div class="newsTitle"><a> Title </a></div><div class="mainText"></div></div></div><div class="sign"><div class="autor"><span>Autor: </span><span class="autorName"></span></div><div class="date"><span>Date: </span><span class="fullDate"></span></div></div></li>');
                $('.nav-btns').append('<li class="slide-nav-btn"></li>');

                //Add article.
                let paste = cutArticleDescription(article.description, 250);
                $('.article .mainText:eq(' + i + ')').html(paste);
                //Added link to article`s Title.
                let link = article.link;
                $('.newsTitle a:eq(' + i + ')').attr('href', `https://${link}`);
                //Add images.
                let img = article.img;
                $('.image img:eq(' + i + ')').attr({
                    alt: 'Article Image',
                    src: img
                });
                //Add author.
                $('.autorName:eq(' + i + ')').html(article.author);
                //Add date.
                let timestamp = parseInt(article.date) * 1000;
                let date = new Date(timestamp);
                let year = date.getFullYear();
                let month = twoDigitDate((date.getMonth() + 1));
                let day = twoDigitDate(date.getDate());
                let fullDate = `${day}.${month}.${year}`;
                $('.fullDate:eq(' + i + ')').html(fullDate);
            }


            $('#slideWrapper').css({width: 'calc(100% * ' + news.length + ')'});
            $('#slideWrapper li').css({width: 'calc(100% / ' + news.length + ')'});
        }
    });

    //To create two-digit Date.
    function twoDigitDate(value) {
        if (value.toString().length < 2) {
            value = '0' + value.toString();
            return value
        }
        return value
    }

    //To cut the text.
    function cutArticleDescription(text, num) {
        if (num < text.length) {
            return text.slice(0, num) + '...';
        } else {
            return text;
        }
    }

    //Show companies partners.
    function showPartners(i, arr) {
        $('.companyPartners__content').append('<div class="partnerInformation"><div class="partnerValue"></div><div class="arrow"></div><div class="partnerName"></div></div>');
        const partnerValue = $('div.partnerValue:eq(' + i + ')');
        const partnerName = $('div.partnerName:eq(' + i + ')');
        partnerValue.html(`${arr[i].value}%`);
        partnerName.html(arr[i].name);
    }

    //Sorting.
    function sorting(arr, val, condition) {
        $('.companyPartners__content').html('');
        /*
        To sort by val, create an array containing the values to be sorted.
         */
        let items = arr.map(function (elem) {
            return elem[val];
        });
        /*
       Sort values.
        */
        if (typeof items[0] === 'string') {
            if (condition == true) {
                items.sort();
            } else {
                (items.sort()).reverse();
            }
        } else {
            items.sort(function (a, b) {
                if (condition == true) {
                    return a - b;
                } else {
                    return b - a;
                }

            })
        }

        /*
       Compare the sorted array with the source in the loop.
       If it matches, save the object from the original array to the new one.
       Thus, all objects are in the sort order.
        */
        let sorted = items.map(function (elem) {
            for (let i = 0; i < items.length; i++) {
                if (arr[i][val] == elem) {
                    return arr[i]
                }
            }
        });
        for (let i = 0; i < sorted.length; i++) {
            showPartners(i, sorted);
        }
    }

    let sortByPercentage = false;
    let sortByName = true;
    let sortBy = 'value';
    let sortType;
    let sort;
    $('.listOfCompanies').on('click', 'td', function () {
        let partnersArr;
        $('.companyPartners').show('swing');
        $('.companyPartners__content').html('');
        const dataName = $(this).attr('data-name');
        for (let i = 0; i < companies.length; i++) {
            if (`${companies[i].name}${i}` == dataName) {
                $('.title').html(companies[i].name);
                partnersArr = (companies[i].partners);
                sort = partnersArr;
                sorting(partnersArr, sortBy, sortType);

            }
        }
    });

    //Button to sort by percentage.
    $('.buttons').on('click', '.btn__sortValue', function () {
        sortBy = 'value';
        sortByPercentage = !sortByPercentage;
        sortType = sortByPercentage;
        sorting(sort, 'value', sortByPercentage);
        if (sortByPercentage) {
            $('.btn__sortValue i').removeClass('fa-sort-numeric-asc').addClass('fa-sort-numeric-desc');
        } else {
            $('.btn__sortValue i').removeClass('fa-sort-numeric-desc').addClass('fa-sort-numeric-asc');
        }
    });

    //Button to sort by name of company.
    $('.btn__sortName').on('click', function () {
        sortBy = 'name';
        sortByName = !sortByName;
        sortType = sortByName;
        sorting(sort, 'name', sortByName);
        if (sortByName) {
            $('.btn__sortName i').removeClass('fa-sort-alpha-asc').addClass('fa-sort-alpha-desc');
        } else {
            $('.btn__sortName i').removeClass('fa-sort-alpha-desc').addClass('fa-sort-alpha-asc');
        }
    });
    $('.btn__hideButton').on('click', function () {
        $('.companyPartners').hide();
    });

    //Loader
    let $preloader = $('.loaderArea');
    $preloader.delay().fadeOut('slow');

    //NEWS
    let translateWidth = 0;
    let slideNow = 1;
    let slideCount;

    function nextSlide() {
        if (slideNow == slideCount || slideNow <= 0 || slideNow > slideCount) {
            $('#slideWrapper').css('transform', 'translate(0,0)');
            slideNow = 1;
            $('.slide-nav-btn').removeClass('color');
            $('.slide-nav-btn:eq(0)').addClass('color');
        } else {
            translateWidth = -$('#viewport').width() * (slideNow);
            $('#slideWrapper').css({
                'transform': 'translate(' + translateWidth + 'px, 0)',
                '-webkit-transform': 'translate(' + translateWidth + 'px, 0)',
                '-ms-transform': 'translate(' + translateWidth + 'px, 0)',
            });
            $('.slide-nav-btn').removeClass('color');
            $('.slide-nav-btn:eq(' + slideNow + ')').addClass('color');
            slideNow++;
        }
    }

    function prevSlide() {
        if (slideNow == 1 || slideNow <= 0 || slideNow > slideCount) {
            translateWidth = -$('#viewport').width() * (slideCount - 1);
            $('.slide-nav-btn').removeClass('color');
            $('.slide-nav-btn:eq(' + (slideCount - 1) + ')').addClass('color');
            $('#slideWrapper').css({
                'transform': 'translate(' + translateWidth + 'px, 0)',
                '-webkit-transform': 'translate(' + translateWidth + 'px, 0)',
                '-ms-transform': 'translate(' + translateWidth + 'px, 0)',
            });
            slideNow = slideCount;
        } else {
            translateWidth = -$('#viewport').width() * (slideNow - 2);
            $('#slideWrapper').css({
                'transform': 'translate(' + translateWidth + 'px, 0)',
                '-webkit-transform': 'translate(' + translateWidth + 'px, 0)',
                '-ms-transform': 'translate(' + translateWidth + 'px, 0)',
            });
            slideNow--;
            $('.slide-nav-btn').removeClass('color');
            $('.slide-nav-btn:eq(' + (slideNow - 1) + ')').addClass('color');

        }
    }

    $('.prev-next-btns').on('click', '.next-btn', function () {
        slideCount = $('#slideWrapper').children().length;
        nextSlide();
    });

    $('.prev-next-btns').on('click', '.prev-btn', function () {
        slideCount = $('#slideWrapper').children().length;
        prevSlide();
    });
    let navBtnId = 0;
    $('.nav-btns').on('click', '.slide-nav-btn', function () {
        $('.slide-nav-btn').removeClass('color');
        $(this).addClass('color');
        navBtnId = $(this).index();
        if (navBtnId + 1 != slideNow) {
            translateWidth = -$('#viewport').width() * (navBtnId);
            $('#slideWrapper').css({
                'transform': 'translate(' + translateWidth + 'px, 0)',
                '-webkit-transform': 'translate(' + translateWidth + 'px, 0)',
                '-ms-transform': 'translate(' + translateWidth + 'px, 0)',
            });
            slideNow = navBtnId + 1;
        }
    });

});