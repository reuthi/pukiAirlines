'use strict';


$(document).ready(()=>{

    renderFrom();

});

function renderFrom () {
    $('#bsrc').val(getFrom());
    let src = $('#bsrc').val
}


function getFrom () {
    let flights = Flight.query();  
    
    var strHTML = flights.map(flight => {
    return `<option value="${flight.country}"> ${flight.country} </option>`     
    }).join(' ');    
    
    $('#bsrc').html(strHTML);
}

