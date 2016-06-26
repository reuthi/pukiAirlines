const KEY_FLIGHTS = 'flights';

//constructor

function Flight (src, destination, plane ,airline, date, id){
    this.src = src;
    this.destination = destination;
    this.airline = airline;
    this.plane = plane;
    this.date = date;
    this.id = (id) ? id : Flight.nextId();

}


Flight.nextId = function(){
    let result = 1;
    let jsonFlights = Flight.loadJSONFromStorage();
    if (jsonFlights.length) result = jsonFlights[jsonFlights.length - 1].id + 1;
    return result;
}

Flight.loadJSONFromStorage = function () {
    let Flights = getFromStorage(KEY_FLIGHTS);
    if (!Flights) Flights = [];
    return Flights;
}

Flight.query = function () {
    // console.log('Flight.flights',Flight.flights)
    if (Flight.flights) return Flight.flights;
    let jsonFlights = Flight.loadJSONFromStorage();

    Flight.Flights = jsonFlights.map(jsonFlight => {
        return new Flight(jsonFlight.src, jsonFlight.destination, jsonFlight.plane, jsonFlight.airline,jsonFlight.date, jsonFlight.id);
    })

    return Flight.Flights;
}

Flight.save = function (formObj) {
    let flights = Flight.query();
    let flight;
    // console.log('formObj.fId',formObj.fId);
    if (formObj.fId) {
        flight = Flight.findById(+formObj.fId);
        // console.log('flight os:',flight);
        flight.src = formObj.src;
        flight.destination = formObj.fdestination;
        flight.airline = formObj.fairline;
        flight.plane = formObj.fplane;
        flight.date = formObj.fdate;
    } else {
        flight = new Flight(formObj.src, formObj.fdestination,formObj.fplane, formObj.fairline, formObj.fdate);
        flights.push(flight);
    }
    // console.log('flights',flights);

    Flight.flights = flights;
    saveToStorage(KEY_FLIGHTS, flights);
}

Flight.saveFlight = function () {
    var formObj = $('form').serializeJSON();
    // console.log('formObj', formObj);
    Flight.save(formObj);
    Flight.render();
    $('#modalFlight').modal('hide');
}

Flight.render = function(){
    let flights = Flight.query();
    console.log('flights :',flights);
    var strHtml = flights.map( f => {
        return `<tr onclick="Flight.select(${f.id}, this)">
            <td>${f.id}</td>
            <td>${f.src}</td>
            <td>${f.destination}</td>
            <td>${f.plane}</td>
            <td>${f.airline}</td>
            <td>
                ${moment(f.date).format('DD-MM-YYYY')}
            </td>
            <td>
                <button class="btn btn-danger" onclick="Flight.remove(${f.id}, event)">
                    <i class="glyphicon glyphicon-trash"></i>
                </button>
                 <button class="btn btn-info" onclick="Flight.editFlight(${f.id}, event)">
                    <i class="glyphicon glyphicon-edit"></i>
                </button>
            </td>           
         
            
         </tr>`

    }).join(' ');
    $('.tblFlights').html(strHtml);
}

Flight.select = function (fId, elRow) {
    $('.active').removeClass('active success');
    $(elRow).addClass('active success');
    $('.details').show();
    let f = Flight.findById(fId);
    $('.fDetailsName').html(f.id);
}

Flight.editFlight = function(fId, event) {
    if (event) event.stopPropagation();
    if (fId) {
        let flight = Flight.findById(fId);
        $('#fId').val(flight.id);
        $('#src').val(flight.src);
        $('#fdestination').val(flight.destination);
        $('#fplane').val(flight.plane);
        $('#fairline').val(flight.airline);
        $('#fdate').val(moment(flight.date).format('YYYY-MM-DD'));
    } else {
        $('#fId').val('');
        $('#src').val('');
        $('#fdate').val('');
        $('#fdestination').val('');
        $('#fplane').val('');
        $('#fairline').val('');
        $('#fdate').val('');

    }
    // console.log(event);
    $('#modalFlight').modal('show');
    // console.log($('#fid').val(''));
}

Flight.findById = function (fId) {
    let result = null;
    let flights = Flight.query()
        .filter(f => f.id === fId);
    if (flights.length) result = flights[0];
    return result;
}

Flight.remove = function (fId, event){
    event.stopPropagation();
    let flights = Flight.query();
    // console.log('fid',fId);
    flights = flights.filter(f => f.id !== fId)
    // console.log('flightssss',flights);
    // console.log(' Flight.flights before: ',  Flight.flights);
    Flight.flights = flights;
    saveToStorage(KEY_FLIGHTS, flights);
    // console.log(' Flight.flights after: ',  Flight.flights);
    // console.log('Flight',Flight);
    Flight.render();

}

function renderPlanes(){
    let planes = Plane.query();
    let strHtml =`<label for="fplane">Plane</label><select name="fplane" id="fplane">`
    strHtml += planes.map(p => {
        return `<option value="${p.model}">${p.model}</option>`
        
    }).join(' ');
    strHtml +='</select>';
    $('.planes').html(strHtml);
}

function renderCountriesFrom(){
    let countries = [' ' ,'TLV','NYC','ROM','PAR','LON'];
    let strHtml = '<label for="src">From</label><select name="src">'
    strHtml += countries.map(country => {
        return '<option value="' + country + '" id="src">'+ country + '</option>'
        
    }).join(' ');
    strHtml +='</select>';
    $('.fromCountry').html(strHtml);
    // $('.fdestination').html(strHtml);
    
}

function renderCountriesDest(){
    let countries = [' ','TLV','NYC','ROM','PAR','LON'];
    let strHtml = '<label for="fdestination">To</label><select name="fdestination">'
    strHtml += countries.map(country => {
        return '<option value="' + country + '" id="fdestination">'+ country + '</option>'
        
    }).join(' ');
    strHtml +='</select>';
    // $('.fromCountry').html(strHtml);
    $('.toCountry').html(strHtml);
    
}





// let newFlight = new Flight('TA','amsterdam','11/11/17','Boing');
// console.log('newFlight',newFlight);
