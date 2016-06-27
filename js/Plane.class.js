 $(document).ready(()=>{

    Plane.render();

});

const KEY_PLANES = 'planes'

// constructor function:

function Plane (model, sitsCount, id) {
    this.model = model;
    this.sitsCount = sitsCount;
    this.id = (id) ? id : Plane.nextId();    
}


Plane.nextId = function () {
    let result = 1;
    let jsonPlanes = Plane.loadJSONFromStorage();
    if (jsonPlanes.length) result = jsonPlanes[jsonPlanes.length - 1].id + 1;
    return result;
}

Plane.findById = function (pId) {
    let result = null;
    let planes = Plane.query()
        .filter(p => p.id === pId);
    if (planes.length) result = planes[0];
    return result;
}

Plane.loadJSONFromStorage = function () {
    let planes = getFromStorage(KEY_PLANES);
    if (!planes) planes = [];
    return planes;
}

Plane.query = function () {
    if (Plane.planes) return Plane.planes;
    let jsonPlanes = Plane.loadJSONFromStorage();
    Plane.planes = jsonPlanes.map (jsonPlanes => {
        return new Plane (jsonPlanes.model, jsonPlanes.sitsCount, jsonPlanes
        .id)
    })
    return Plane.planes;
}


Plane.render = function () {

    let plane = Plane.query();
    var strHtml = plane.map(p => {
        return `<tr onclick="Plane.select(${p.id}, this)">
            <td>${p.id}</td>
            <td>${p.model}</td>
            <td>${p.sitsCount}</td>
            <td>
                <button class="btn btn-danger" onclick="Plane.remove(${p.id}, event)">
                    <i class="glyphicon glyphicon-trash"></i>
                </button>
                 <button class="btn btn-info" onclick="Plane.editPlane(${p.id}, event)">
                    <i class="glyphicon glyphicon-edit"></i>
                </button>
            </td>
        </tr>`

    }).join(' ');
    $('.tblPlanes').html(strHtml);
}

Plane.select = function (pId, elRow) {
    $('.active').removeClass('active success');
    $(elRow).addClass('active success');
    $('.details').show();
    let p = Plane.findById(pId);
    $('.pDetailsModel').html(p.model);
    
}

Plane.editPlane = function (pId, event) {
    if (event) event.stopPropagation();        
    if (pId) {
        $('#myModalLabel').html('Edit plane')
        let plane = Plane.findById(pId);
        $('#pid').val(plane.id);
        $('#pmodel').val(plane.model);
        $('#psits').val(plane.sitsCount);

    } else {
        $('#myModalLabel').html('Add plane')        
        $('#pid').val('');
        $('#pmodel').val('');
        $('#psits').val('');
    }

    $('#modalPlane').modal('show');
}

Plane.savePlane  = function () {
    var formObj = $('form').serializeJSON();
    Plane.save(formObj);
    Plane.render();
    $('#modalPlane').modal('hide')
}

Plane.save = function (formObj) {
    let planes = Plane.query();
    let plane;
    if (formObj.pid) {
        plane = Plane.findById (+formObj.pid);
        plane.model = formObj.pmodel;
        plane.sitsCount = formObj.psits
    } else {
        plane = new Plane (formObj.pmodel, formObj.psits)
        planes.push(plane)
    }
    Plane.planes = planes;
    saveToStorage(KEY_PLANES, planes);
}

Plane.remove = function (pId, event) {
    event.stopPropagation();
    let planes = Plane.query();
    planes = planes.filter(p => p.id !== pId);
    saveToStorage(KEY_PLANES, planes);
    Plane.planes = planes;
    Plane.render();
}

Plane.updateSitscount = function (id) {
    let flights = Flight.query();
    let flight = Flight.findById(id);
    
    let planes = Plane.query();
    let plane;
    planes = planes.filter(p => {
        return p.model === flight.plane
    });
    console.log(planes);    
    planes[0].sitsCount = (+planes[0].sitsCount) - 1;
     $('.planeContainerText').html('sits count: ' + planes[0].sitsCount);
    // Plane.remove(plane);
    console.log(planes[0]);
    plane = Plane.findById (planes[0].id);
    plane.model = planes[0].model;
    plane.sitsCount = planes[0].sitsCount;
    
    // plane = new Plane (plane.model, plane.sitsCount, plane.id)
    // planes.push(plane)
    Plane.planes = planes;
    saveToStorage(KEY_PLANES, planes);

    
    
}