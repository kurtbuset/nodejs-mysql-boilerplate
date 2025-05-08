const db = require('../_helpers/db');
const Request = db.Request;

async function getAll() {
    return await Request.findAll({
        include: [{
            model: db.RequestItem,
            as: 'items'
        }]
    });
}

async function getById(id) {
    return await Request.findByPk(id, {
        include: [{
            model: db.RequestItem,
            as: 'items'
        }]
    });
}

async function create(params) {
    const request = new Request(params);
    await request.save();
    return request;
}

async function update(id, params) {
    const request = await getById(id);
    if (!request) throw 'Request not found';
    
    Object.assign(request, params);
    await request.save();
    return request;
}

async function _delete(id) {
    const request = await getById(id);
    if (!request) throw 'Request not found';
    
    await request.destroy();
}

async function addItems(requestId, items) {
    const request = await getById(requestId);
    if (!request) throw 'Request not found';
    
    const requestItems = items.map(item => ({
        ...item,
        requestId
    }));
    
    await db.RequestItem.bulkCreate(requestItems);
    return await getById(requestId);
}

async function updateStatus(id, status) {
    const request = await getById(id);
    if (!request) throw 'Request not found';
    
    request.status = status;
    await request.save();
    return request;
}

module.exports = {
    getAll,
    getById,
    create,
    update,
    delete: _delete,
    addItems,
    updateStatus
};