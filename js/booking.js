'use strict';

const KEY_TICKETS = 'tickets';


$(document).ready(()=>{
    
    Ticket.renderSrcs();     

});


function Ticket (src, dest, id) {
    this.src = src;
    this.dest = dest;
    this.id = id;
    this.date = '';
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

Ticket.BookIt = function () {
    var formObj = $('form').serializeJSON();
    console.log(formObj)
    let tickets = Ticket.query();
    let ticket = new Ticket (formObj.bsrc, formObj.bdest);
    // console.log('form')
    tickets.push(ticket);
    Ticket.tickets = tickets;
    saveToStorage(KEY_TICKETS, tickets);
    Ticket.getFlight(formObj.bsrc, formObj.bdest);
    // return false;
}

Ticket.getFlight = function (src, dest) {
    
    let flights = Flight.query();  
    // let tickets = Ticket.query();
    console.log(flights)
    
    let flightSrc = flights.filter(flight => flight.src === src);
    // console.log(flightSrc[0])
    
    let flight = flightSrc.filter(flight => flight.dest === dest);
    
    console.log(flight)
}

// TODO: anonymos func:
$('#bsrc').on('change', function() {
    let src = this.value;
    Ticket.renderDests(src);
    Ticket.findFlightById
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
    
    // console.log(flights)
    
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
