'use strict';

const KEY_TICKETS = 'tickets';
// const PHOTO_SRC = 'img/passengers/';


$(document).ready(()=>{
    
    Ticket.renderSrcs();     

});


function Ticket (src, dest, date, avilableSits) {
    this.src = src;
    this.dest = dest;
    // this.id = id;
    this.date = date;
    this.avilableSits = avilableSits;
}


Ticket.query = function () {
    if (Ticket.tickets) return Ticket.tickets;
    let jsonTickets = Ticket.loadJSONFromStorage();

    Ticket.tickets = jsonTickets.map(jsonTickets => {
        return new Ticket (jsonTickets.src, jsonTickets.dest);
    })
    
    return Ticket.tickets;
}

Ticket.loadJSONFromStorage = function () {
    let tickets = getFromStorage(KEY_TICKETS);
    if (!tickets) tickets = [];
    return tickets;
}

Ticket.Search = function () {
    var formObj = $('form').serializeJSON();
    let flight = Ticket.getFlight(formObj.bsrc, formObj.bdest);
    let flightAvilableSits = Ticket.getAvilableSits(flight)
    console.log(flightAvilableSits)
    
    let tickets = Ticket.query();
    let ticket = new Ticket (formObj.bsrc, formObj.bdest, flight.date, flightAvilableSits);
    tickets.push(ticket);
    Ticket.tickets = tickets;
    saveToStorage(KEY_TICKETS, tickets);
    Ticket.renderFlight(flight.date, flightAvilableSits)
}

Ticket.getFlight = function (src, dest) {
    let flights = Flight.query();  
    let flight = flights.filter(flight => flight.src === src && flight.dest === dest); 
    return flight[0];
}

Ticket.getAvilableSits = function (flight) {
        console.log(flight)
    console.log(flight.plane)    
    let planes = Plane.query();
    console.log(planes);    
    let plane = planes.filter(plane => plane.model === flight.plane);
    console.log(plane[0])
    return plane[0].sitsCount;
}

Ticket.renderFlight = function (date, avilableSits) {
    console.log(date, avilableSits);
    $('.flightContainer').css('display', 'block')
   $('.dateContaineText').html(date);
    $('.planeContainerText').html('sits count: ' + avilableSits)  
}


// TODO: anonymos func:
$('#bsrc').on('change', function() {
    let src = this.value;
    Ticket.renderDests(src);
    Ticket.findFlightById
});

$('#bpass').on('change', function() {
    console.log(this.value)
    let passengerName = this.value;
    let passengers = Passenger.query();
    // console.log(passengers)
    passengers = passengers.filter(p => p.name === passengerName);
    // console.log(passengers)
    // console.log
    (passengers[0].id).append('');
    
     $('.imgPassCont').attr('src',PHOTO_SRC + passengers[0].id + '.jpg');

    // passengers[0].id
    
});

Ticket.renderSrcs = function  () {
    let flights = Flight.query();  
    let strHTML = `<option value=""></option>`
    // TODO: filter to duplicate src
    strHTML += flights.map(flight => {
    return `<option value="${flight.src}"> ${flight.src} </option>`     
    }).join(' ');  
    
    $('#bsrc').html(strHTML);
}

Ticket.renderDests = function (src) {
    let flights = Flight.query();  

    flights = flights.filter(flight => flight.src === src);
    
    console.log(flights)
    
    // let id = Ticket.findFlightById(flights)

    let strHTML = `<option value=""></option>`
    strHTML += flights.map(flight => {
    return `<option value="${flight.dest}"> ${flight.dest} </option>`     
    }).join(' ');  
    
    $('#bdest').html(strHTML);
}

// Ticket.findFlightById = function (flight) {
//     let flights = Flight.query();  
//     flights = flights.filter(flight => flight.src === src);
//     return id = flight[0].id;
// }


Ticket.BookIt = function () {
     $('#modalPass').modal('show');
     Ticket.renderPass();
}

Ticket.renderPass = function () {
    let passengers = Passenger.query();    
    // let passengersNames = passengers.map(p => {
    //    return p.name
    // })
    
    let strHTML = `<option value=""></option>`
        strHTML += passengers.map(p => {
    return `<option value="${p.name}"> ${p.name} </option>`     
    }).join(' ');  
    
    $('#bpass').html(strHTML);

};
