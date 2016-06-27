'use strict';

const KEY_TICKETS = 'tickets';

$(document).ready(()=>{
    
    Ticket.renderSrcs();     

});


function Ticket (flightId, passName) {
    // this.src = src;
    // this.dest = dest;
    // this.date = date;
    // this.avilableSits = avilableSits;
    this.passName = passName;
    this.flightId = flightId;

}


Ticket.query = function () {
    if (Ticket.tickets) return Ticket.tickets;
    let jsonTickets = Ticket.loadJSONFromStorage();
    
    Ticket.tickets = jsonTickets.map(jsonTickets => {
        // return new Ticket (jsonTickets.src, jsonTickets.dest);
        return new Ticket (0,$('#bpass').val());
        
    })
    
    return Ticket.tickets;
}

Ticket.loadJSONFromStorage = function () {
    let tickets = getFromStorage(KEY_TICKETS);
    if (!tickets) tickets = [];
    return tickets;
}


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
    
    let strHTML = `<option value=""></option>`
    strHTML += flights.map(flight => {
    return `<option value="${flight.dest}"> ${flight.dest} </option>`     
    }).join(' ');  
    
    $('#bdest').html(strHTML);
}

Ticket.Search = function () {
    var formObj = $('form').serializeJSON();
    let flight = Ticket.getFlight(formObj.bsrc, formObj.bdest);
    let flightAvilableSits = Ticket.getAvilableSits(flight)
    Ticket.renderFlight(flight.date, flightAvilableSits)
    
    
    
}

Ticket.renderFlight = function (date, avilableSits) {
    $('.flightContainer').css('display', 'block')
    $('.dateContaineText').html(date);
    $('.planeContainerText').html('sits count: ' + avilableSits)  
}

Ticket.getFlight = function (src, dest) {
    let flights = Flight.query();  
    let flight = flights.filter(flight => flight.src === src && flight.dest === dest); 
    return flight[0];
}

Ticket.getAvilableSits = function (flight) {   
    let planes = Plane.query(); 
    let plane = planes.filter(plane => plane.model === flight.plane);
    return plane[0].sitsCount;
}


// TODO: anonymos func:
$('#bsrc').on('change', function() {
    let src = this.value;
    Ticket.renderDests(src);
    Ticket.findFlightById
});

$('#bpass').on('change', function() {
    let passengerName = this.value;
    let passengers = Passenger.query();
    passengers = passengers.filter(p => p.name === passengerName);
     $('.imgPass').attr('src',PHOTO_SRC + passengers[0].id + '.jpg');
});


Ticket.BookIt = function () {
     $('#modalPass').modal('show');
     Ticket.renderPass();
}

Ticket.renderPass = function () {
    let passengers = Passenger.query();    
    
    let strHTML = `<option value=""></option>`
        strHTML += passengers.map(p => {
    return `<option value="${p.name}"> ${p.name} </option>`     
    }).join(' ');  
    
    $('#bpass').html(strHTML);

};

Ticket.savePass = function () {
    var formObj = $('form').serializeJSON();
    let flight = Ticket.getFlight(formObj.bsrc, formObj.bdest);
    // $('#bpass').val;
    // console.log('ticket: ', $('#bpass').val());
    
    let tickets = Ticket.query();
    let ticket = new Ticket (flight.id,$('#bpass').val());
    // console.log('ticket: ',ticket);
        
    // var a= $('#bpass').val();
    //     console.log('ticket: ',a);
    
    console.log('ticket', ticket);
    
    
    
    tickets.push(ticket);
    Ticket.tickets = tickets;
    saveToStorage(KEY_TICKETS, tickets);
    $('#modalPass').modal('hide');
    Plane.updateSitscount(flight.id)
    
    
    // let jsonTickets = Ticket.loadJSONFromStorage();
    // console.log('jsonTickets',jsonTickets);
    
}



Ticket.loadJSONFromStorage = function () {
    let Tickets = getFromStorage(KEY_TICKETS);
    if (!Tickets) Tickets = [];
    return Tickets;
}

Ticket.nextId = function(){
    let result = 1;
    let jsonTickets = Ticket.loadJSONFromStorage();
    if (jsonTickets.length) result = jsonTickets[jsonTickets.length - 1].id + 1;
    return result;
}