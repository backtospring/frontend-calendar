var text_date = '';
var name_month = {
    0: 'January',
    1: 'February',
    2: 'March',
    3: 'April',
    4: 'May',
    5: 'June',
    6: 'July',
    7: 'August',
    8: 'September',
    9: 'October',
    10: 'November',
    11: 'December',
};

function saveDataToLocalStorage(datetime_event, title_event, date_for_user_event, members_event = '', description_event = '') {
    if (datetime_event && (title_event !== '' || members_event !== '' || description_event !== '')) {
        data = {
            event: title_event,
            date: datetime_event,
            date_for_user: date_for_user_event,
            members: members_event,
            description: description_event
        };
        serial_data = JSON.stringify(data); //сериализуем его
        localStorage.setItem(datetime_event, serial_data); //запишем его в хранилище по ключу "myKey"
        return_data = getDataFromLocalStorage(datetime_event);
        $('td[data-date="' + datetime_event + '"]').addClass(return_data.exist_note_class);
        $('td[data-date="' + datetime_event + '"]>h4').remove();
        $('td[data-date="' + datetime_event + '"]>p').remove();
        $('td[data-date="' + datetime_event + '"]').append(return_data.note);
    } else {
        //removeDataFromLocalStorage(datetime_event);
    }
}

function getDataFromLocalStorage(date_key, type_month = 'current') {
    var note = "";
    var exist_note_class = '';
    var local_storage_data = JSON.parse(localStorage.getItem(date_key));
    if (local_storage_data) {
        exist_note_class = (type_month === 'current') ? 'month_note ' : 'not_current_month_note ';
        note = '<h4>' + local_storage_data.event +
            '</h4><p>' + local_storage_data.members + '</p><p>' +
            local_storage_data.description + '</p>';
    } else {
        exist_note_class = '';
        note = "";
    }
    return {
        note: note,
        exist_note_class: exist_note_class
    }
}

function removeDataFromLocalStorage(date_key) {
    var return_data = getDataFromLocalStorage(date_key);
    if (return_data) {
        localStorage.removeItem(date_key);
        $('td[data-date="' + date_key + '"]').removeClass(return_data.exist_note_class);
        $('td[data-date="' + date_key + '"]>h4').remove();
        $('td[data-date="' + date_key + '"]>p').remove();
        $('.calendar-popup-add-event').addClass('display-none');
        return true;
    }
    return false;
}

function isInt(value) {
    return !isNaN(value) && (function (x) {
        return (x | 0) === x;
    })(parseFloat(value))
}

function addZeroBefore(item) {
    return (item <= 9) ? '0' + item : item;
}

function getActiveReadableDate() { //examle: 18 November
    var get_active_date = $('.active').attr('data-date');
    var split_active_date = get_active_date.split('-');
    var num_mon = split_active_date[1] - 1;
    return parseInt(split_active_date[2]) + ' ' + name_month[num_mon];
}

function getNumberMonthThroughName(month) {
    keys = Object.keys(name_month);
    for (var i = 0, l = keys.length; i < l; i++) {
        if (month === name_month[keys[i]]) {
            mon_num = addZeroBefore(keys[i]);
            return mon_num;
        }
    }
}

function getArrDaysOfMonth(obj_date, month) {
    var days = [];
    while (obj_date.getMonth() == month) {
        days.push(obj_date.getDate());
        obj_date.setDate(obj_date.getDate() + 1);
    }
    return days;
}

function createCalendar(today, year, mon) {
    var day_week = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    var elem = $('#calendar-table');
    var add_today_class = "";
    var data_date_attr = '';
    var return_data = {};
    var year_now = year;
    var month_now = mon;
    var today_now = today;
    var next_mon = mon;
    var next_year = year;
    var previous_mon = mon;
    var previous_year = year;
    var previous_date = {}
    var arr_prev_days = [];
    var data_prev_date = '';
    var data_next_date = '';
    var d = new Date(year_now, month_now);
    var table = '<tr>';
    var next_day = 0;
    var last_prev_days = 0;
    var num_dd_week = 0;
    var day_now = '';

    // ячейки календаря с датами предыдущего месяца
    previous_mon = (previous_mon > 0) ? previous_mon -= 1 : 11;
    previous_year = (previous_mon > 0) ? previous_year : previous_year -= 1;
    previous_date = new Date(previous_year, previous_mon);
    arr_prev_days = getArrDaysOfMonth(previous_date, previous_mon);
    last_prev_days = arr_prev_days.length - 1;
    for (var i = getDay(d); i > 0; i--) {
        data_prev_date = previous_year + '-' + addZeroBefore(previous_mon + 1) + '-' + addZeroBefore(arr_prev_days[last_prev_days - i]);
        return_data = getDataFromLocalStorage(data_prev_date, 'prev');
        table += '<td class="click_prev_month ' + return_data.exist_note_class + '">' + day_week[num_dd_week] + ', ' + arr_prev_days[last_prev_days - i] + return_data.note + '</td>';
        num_dd_week += 1;
    }
    // ячейки календаря с датами текущего месяца
    while (d.getMonth() == month_now) {
        add_today_class = (d.getDate() == today_now) ? 'today ' : '';
        day_now = addZeroBefore(d.getDate());
        data_date_attr = year_now + '-' + addZeroBefore(month_now + 1) + '-' + day_now;

        return_data = getDataFromLocalStorage(data_date_attr);

        if (num_dd_week < day_week.length) {
            table += '<td' + ' class="' + add_today_class + return_data.exist_note_class + '" data-date=' + data_date_attr + '>' + day_week[num_dd_week] + ', ' + d.getDate() + return_data.note + '</td>';
        } else {
            table += '<td' + ' class="' + add_today_class + return_data.exist_note_class + '" data-date=' + data_date_attr + '>' + d.getDate() + return_data.note + '</td>';
        }
        num_dd_week += 1;
        table += (getDay(d) % 7 == 6) ? '</tr><tr>' : '';
        d.setDate(d.getDate() + 1);
    }
    // ячейки календаря с датами следующего месяца
    next_year = (next_mon >= 11) ? next_year += 1 : next_year;
    next_mon = (next_mon >= 11) ? 0 : next_mon += 1;
    if (getDay(d) != 0) {
        for (var i = getDay(d); i < 7; i++) {
            next_day += 1;
            data_next_date = next_year + '-' + addZeroBefore(next_mon + 1) + '-' + addZeroBefore(next_day);
            return_data = getDataFromLocalStorage(data_next_date, 'prev');
            table += '<td class="click_next_month ' + return_data.exist_note_class + '">' + next_day + return_data.note + '</td>';
        }
    }
    table += '</tr>';
    elem.append(table);
}

function getDay(date) { // получить номер дня недели, от 0(пн) до 6(вс)
    var day = date.getDay();
    if (day == 0) day = 7;
    return day - 1;
}

function showPrevMonth(year, month, today) {
    month = month - 1;
    if (month < 0) {
        month = 11;
        year--;
    }
    text_date = name_month[month] + ', ' + year;
    $("tr").remove();
    $(".calendar-current-date").text(text_date);
    createCalendar(today, year, month);
    return {
        'month': month,
        'year': year
    };
}

function showNextMonth(year, month, today) {
    month = month + 1;
    if (month > 11) {
        month = 0;
        year++;
    }
    text_date = name_month[month] + ', ' + year;
    $("tr").remove();
    $(".calendar-current-date").text(text_date);
    createCalendar(today, year, month);
    return {
        'month': month,
        'year': year
    };
}

function showCurrentMonth(date, today) {
    year = date.getFullYear();
    month = date.getMonth();
    text_date = name_month[month] + ', ' + year;
    $("tr").remove();
    $(".calendar-current-date").text(text_date);
    createCalendar(today, year, month);
    return {
        'month': month,
        'year': year
    };
}

function showPopup(selector) {
    var window_width = $(window).width();
    var popup_width = $('.calendar-popup-add-event').outerWidth(true);
    var left_td = $(selector).position().left;
    var left_with_width_td = left_td + 15 + $(selector).outerWidth(true);
    var top_popup = $(selector).position().top;
    var difference = window_width - (left_with_width_td + popup_width);
    var get_active_date = $('.active').attr('data-date');
    $('#datetime-event').val(get_active_date);
    $('.calendar-popup-add-event').removeClass('display-none');
    var local_storage_data = JSON.parse(localStorage.getItem($('.active').attr('data-date')));
    if (local_storage_data) {
        $("#title-event").replaceWith('<h3 id="title-event">' + local_storage_data.event + '</h3>');
        $("#date-for-user-event").replaceWith('<p id="date-for-user-event" class="event">' + local_storage_data.date_for_user + '</p>');
        $("#members-event").replaceWith('<div id="members-event" class="event"><p class="label-members">Members:</p><p>' + local_storage_data.members + '</p></div>');
        $('#description-event').val(local_storage_data.description);
        $('form').find('input#datetime-event').prop({
            type: 'hidden'
        });
    } else {
        $("#title-event").replaceWith(' <input type="text" id="title-event" placeholder="Event" class="input-form">');
        $("#date-for-user-event").replaceWith('<input type="hidden" id="date-for-user-event" placeholder="Day, month, year" class="input-form">');
        $("#date-for-user-event").val(getActiveReadableDate());
        $('form').find('input#datetime-event').prop({
            type: 'date'
        });
        $("#members-event").replaceWith('<input type="text" id="members-event" placeholder="Members" class="input-form">');
        $('#description-event').val('');
    }
    if (difference < 0) {
        $('.calendar-popup-add-event').addClass('left');
        $('.position-popup').offset({
            left: left_td - popup_width - 15,
            top: top_popup
        });
    } else {
        $('.calendar-popup-add-event').removeClass('left');
        $('.position-popup').offset({
            left: left_with_width_td,
            top: top_popup
        });
    }
}

function showQuickPopup() {
    var left = $('.add-btn').position().left;
    var top = $('.add-btn').position().top + 2 * $('.add-btn').width();
    $('.popup-quick-add-event').removeClass('display-none');
    $('.position-quick-popup').offset({
        left: left,
        top: top
    });
}

function saveDataPopup() {
    var return_data = {};
    var data = {};
    var serial_data = {};

    title_event = $('#title-event').val() || $('#title-event').text();
    datetime_event = $('#datetime-event').val();
    date_for_user_event = $('#date-for-user-event').val() || $('#date-for-user-event').text();
    members_event = $('#members-event').val() || $('#members-event').text().replace('Members:', '');
    description_event = $('#description-event').val();
    saveDataToLocalStorage(datetime_event, title_event, date_for_user_event, members_event, description_event);
    $('.calendar-popup-add-event').addClass('display-none');
    $('#title-event').val('');
    $('#datetime-event').val('');
    $('#members-event').val('');
    $('#description-event').val('');
}

function saveDataQuickPopup() {
    var string_event = $('#quick-event').val();
    var arr_data = [];
    var len_user_date = 2;
    var mon_num = -1;
    var date_read = '';
    var number = 0;
    var mon_read = '';
    var date = {};
    var arr_days_of_mon = [];
    var datetime_event = '';
    if (string_event.indexOf(',') > 0) {
        arr_data = string_event.split(',');
        console.log(arr_data)
        arr_data = arr_data.filter(function (e) {
            return e.replace(' ', '');
        });
        if (arr_data.length > 1) {
            date_read = arr_data[0].trim().split(' ').filter(function (e) {
                return e.replace(' ', '')
            });
            if (date_read.length === len_user_date) {
                number = date_read[0];
                mon_read = date_read[1];
                mon_num = getNumberMonthThroughName(mon_read);
                if (mon_num >= 0 && isInt(number)) {
                    date = new Date(year, mon_num);
                    arr_days_of_mon = getArrDaysOfMonth(date, parseInt(mon_num));
                    if (jQuery.inArray(number, arr_days_of_mon)) {
                        datetime_event = year + '-' + addZeroBefore(parseInt(mon_num) +
                            1) + '-' + addZeroBefore(number);
                        saveDataToLocalStorage(datetime_event, arr_data[1], date_read.join(
                            " "));
                        $('.popup-quick-add-event').addClass('display-none');
                    } else {
                        alert('invalid number of month')
                    }
                } else {
                    alert('invalid number or month');
                }
            } else {
                alert(
                    'invalid user date: 2 params must to be (number of month and name month)'
                )
            }
        } else {
            alert('должно быть как минимум 2 элемента: дата и событие');
        }
    } else {
        alert('missing " , "'); //write today event
    }
}

function editPopup() {
    var local_storage_data = JSON.parse(localStorage.getItem($('.active').attr('data-date')));
    if (local_storage_data) {
        $("#title-event").replaceWith(' <input type="text" id="title-event" placeholder="Event" class="input-form" value="' + local_storage_data.event + '">');
        $("#date-for-user-event").replaceWith('<input type="hidden" id="date-for-user-event" placeholder="Day, month, year" class="input-form">');
        $("#date-for-user-event").val(getActiveReadableDate());
        $('form').find('input#datetime-event').prop({
            type: 'date'
        });
        $("#members-event").replaceWith('<input type="text" id="members-event" placeholder="Members" class="input-form" value="' + local_storage_data.members + '">');
        $('#description-event').val(local_storage_data.description);
    }
}

function showSearchPopup(selector) {
    var left = $(selector).position().left;
    var top = $(selector).position().top + 2 * $(selector).outerHeight();
    $('.popup-show-search-event').removeClass('display-none');
    $('.position-show-search-popup').offset({
        left: left,
        top: top
    });
}

function searchDataFromLocalStorage(selector) {
    var search_text = $(selector).val().trim().toLowerCase();
    var item = [];
    var result = '';
    for (var i in localStorage) {
        item = JSON.parse(localStorage[i]);
        if (item['event'].toLowerCase().indexOf(search_text) + 1 || item['date_for_user'].toLowerCase().indexOf(search_text) + 1 || item['members'].toLowerCase().indexOf(search_text) + 1) {
            result += '<div class="popup-show-event"><h5 class="title-event-show">' + item['event'] + '</h5><p>' + item['date_for_user'] + '</p></div>';
        }
    }
    if (!result) {
        $('.popup-show-search-event').addClass('display-none');
    }
    $('.filling-popup').html(result);
}