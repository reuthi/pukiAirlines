'use strict';

const PHOTO_SRC = 'img/passengers/';
const KEY_PASSENGERS = 'passengers';

// This is a constructor function
function Passenger(name, birthdate, phone, id) {
    this.name = name;
    this.birthdate = new Date(birthdate);
    this.phone = phone;
    this.pin = randomPin();
    this.id = (id) ? id : Passenger.nextId();
}

// static methods:

Passenger.nextId = function () {
    let result = 1;
    let jsonPassengers = Passenger.loadJSONFromStorage();
    if (jsonPassengers.length) result = jsonPassengers[jsonPassengers.length - 1].id + 1;
    return result;
}

Passenger.findById = function (pId) {
    let result = null;
    let passengers = Passenger.query()
        .filter(p => p.id === pId);
    if (passengers.length) result = passengers[0];
    return result;
}

Passenger.loadJSONFromStorage = function () {
    let passengers = getFromStorage(KEY_PASSENGERS);
    if (!passengers) passengers = [];
    return passengers;
}



Passenger.query = function () {

    if (Passenger.passengers) return Passenger.passengers;
    let jsonPassengers = Passenger.loadJSONFromStorage();

    Passenger.passengers = jsonPassengers.map(jsonPassenger => {
        return new Passenger(jsonPassenger.name, jsonPassenger.birthdate,jsonPassenger.phone, jsonPassenger.id);
    })

    return Passenger.passengers;
}

Passenger.save = function (formObj) {
    let passengers = Passenger.query();
    let passenger;
    if (formObj.pid) {
        passenger = Passenger.findById(+formObj.pid);
        passenger.name = formObj.pname;
        passenger.birthdate = new Date(formObj.pdate);
        passenger.phone = formObj.pphone;
    } else {
        passenger = new Passenger(formObj.pname, formObj.pdate, formObj.pphone);
        passengers.push(passenger);
    }
    Passenger.passengers = passengers;
    saveToStorage(KEY_PASSENGERS, passengers);
}

Passenger.remove = function (pId, event) {
    event.stopPropagation();
    let passengers = Passenger.query();
    passengers = passengers.filter(p => p.id !== pId)
    saveToStorage(KEY_PASSENGERS, passengers);
    console.log(' Passenger.passengers before: ',  Passenger.passengers);
    Passenger.passengers = passengers;
    console.log(' Passenger.passengers after: ',  Passenger.passengers);

    Passenger.render();
}

Passenger.render = function () {

    let passengers = Passenger.query();
    var strHtml = passengers.map(p => {
        return `<tr onclick="Passenger.select(${p.id}, this)">
            <td>${p.id}</td>
            <td>${p.name}</td>
            <td>
                ${moment(p.birthdate).format('DD-MM-YYYY')}
                ${(p.isBirthday()) ? '<i class="glyphicon glyphicon-gift"></i>' : ''}
            </td>
            <td>${p.phone}</td>
            <td>
                <button class="btn btn-danger" onclick="Passenger.remove(${p.id}, event)">
                    <i class="glyphicon glyphicon-trash"></i>
                </button>
                 <button class="btn btn-info" onclick="Passenger.editPassenger(${p.id}, event)">
                    <i class="glyphicon glyphicon-edit"></i>
                </button>
            </td>
        </tr>`

    }).join(' ');
    $('.tblPassengers').html(strHtml);
}

Passenger.select = function (pId, elRow) {
    $('.active').removeClass('active success');
    $(elRow).addClass('active success');
    $('.details').show();
    let p = Passenger.findById(pId);
    $('.pDetailsName').html(p.name);
    $('.passPic').attr('src',PHOTO_SRC + pId + '.jpg');
    let jsonTickets = getFromStorage('tickets');
    let tickets = jsonTickets.filter(t => t.passName === p.name )
    console.log('tickets',tickets);
    let jsonFlights = getFromStorage('flights');
    let flights = jsonFlights.filter(f => f.id === tickets[0].flightId )
    
    console.log('flights',flights);
    // console.log('ticket[0]',tickets[0].flightId);
    let str ='';
    str += flights[0].airline +'<br>'+ flights[0].date +'<br>'+  flights[0].src +'<span class="glyphicon glyphicon-arrow-right"></span>'+ flights[0].dest +'<br>'+ flights[0].plane ;
    $('.passDetails').html(str);
    
}


Passenger.savePassenger = function () {
    var formObj = $('form').serializeJSON();
    console.log('formObj', formObj);
    Passenger.save(formObj);
    Passenger.render();
    $('#modalPassenger').modal('hide');
}
Passenger.editPassenger = function (pId, event) {
    if (event) event.stopPropagation();
    if (pId) {
        let passenger = Passenger.findById(pId);
        $('#pid').val(passenger.id);
        $('#pname').val(passenger.name);
        $('#pdate').val(moment(passenger.birthdate).format('YYYY-MM-DD'));
        $('#pphone').val(passenger.phone);
        
    } else {
        $('#pid').val('');
        $('#pname').val('');
        $('#pdate').val('');
        $('#pphone').val('');
        
    }


    $('#modalPassenger').modal('show');

}

// instance methods:
Passenger.prototype.isBirthday = function () {
    let now = new Date();
    return (this.birthdate.getMonth() === now.getMonth() &&
        this.birthdate.getDate() === now.getDate());
}

Passenger.prototype.checkPin = function (pin) {
    return pin === this.pin;
}

Passenger.prototype.getFlights = function () {
    return this.flights;
}
