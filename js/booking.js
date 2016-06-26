'use strict';

const KEY_TICKETS = 'tickets';


$(document).ready(()=>{
    
    Ticket.renderSrcs();     

});


function Ticket (src, dest) {
    this.src = src;
    this.dest = dest;
    this.date = '';
}

// Ticket.save = function (fromObj) {
//     // let src = 
//     // let dest = ;
// }

Ticket.query = function () {

    if (Ticket.tickets) return Ticket.tickets;
    let jsonTickets = Ticket.loadJSONFromStorage();

    Ticket.tickets = jsonTickets.map(jsonTickets => {
        return new Passenger(jsonTickets.src, jsonTickets.dest);
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
    tickets.push(ticket);
    Ticket.tickets = tickets;
    saveToStorage(KEY_TICKETS, tickets);
}


$('#bsrc').on('change', function() {
    let src = this.value;
    let dest = Ticket.renderDests(src);
    
    // Ticket.save (src, dest);

});

Ticket.renderSrcs = function  () {
    let flights = Flight.query();  
    let strHTML = `<option value=""></option>`
    strHTML += flights.map(flight => {
    return `<option value="${flight.src}"> ${flight.src} </option>`     
    }).join(' ');  
    
    $('#bsrc').html(strHTML);
}

Ticket.renderDests = function (src) {

    let flights = Flight.query();  

    flights = flights.filter(flight => flight.src !== src);

    let strHTML = `<option value=""></option>`

    strHTML += flights.map(flight => {
    return `<option value="${flight.destination}"> ${flight.destination} </option>`     
    }).join(' ');  
    
    
    $('#bdest').html(strHTML);
}


