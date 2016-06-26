'use strict';


$(document).ready(()=>{

    rendersrcs();
    new Ticket ();  
});

function Ticket () {
    this.src = Ticket.getSrc();
}

 Ticket.getSrc = function () {
    $('#bsrc').on('change', function(e) {
        console.log(this.value) 
    });
}

function rendersrcs () {
    $('#bsrc').val(getSrcs());
}


function getSrcs () {
    let flights = Flight.query();  
    
    var strHTML = flights.map(flight => {
    return `<option value="${flight.src}"> ${flight.src} </option>`     
    }).join(' ');    
    
    console.log(strHTML);   
    $('#bsrc').html(strHTML);
}



