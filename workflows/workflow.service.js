const db = require('../_helpers/db');
const Workflow = db.Workflow;
const Employee = db.Employee;

const validStatuses = ['Pending', 'Approved', 'Rejected'];

async function create(params) {
    const workflow = new Workflow(params);
    await workflow.save();
    return workflow;
}

async function createOnboarding(params) {
    const workflow = new Workflow({
        ...params,
        type: 'Onboarding',
        status: 'Pending'
    });
    await workflow.save();
    return workflow;
}

async function getAll() {
    return await Workflow.findAll({
        include: [{
            model: Employee,
            attributes: ['id', 'firstName', 'lastName', 'email']
        }]
    });
}

async function getByEmployeeId(employeeId) {
    return await Workflow.findAll({
        where: { employeeId },
        include: [{
            model: Employee,
            attributes: ['id', 'firstName', 'lastName', 'email']
        }]
    });
}

async function getById(id) {
    return await Workflow.findByPk(id, {
        include: [{
            model: Employee,
            attributes: ['id', 'firstName', 'lastName', 'email']
        }]
    });
}

async function update(id, params) {
    const workflow = await getById(id);
    if (!workflow) throw new Error('Workflow not found');

    // Optionally update endDate if status is changing
    if (params.status && validStatuses.includes(params.status)) {
        workflow.endDate = params.status !== 'Pending' ? new Date() : null;
    }

    Object.assign(workflow, params);
    await workflow.save();
    return workflow;
}

async function updateStatus(id, status, actionBy = null) {
    if (!validStatuses.includes(status)) {
        throw new Error(`Invalid status. Allowed: ${validStatuses.join(', ')}`);
    }

    const workflow = await getById(id);
    if (!workflow) throw new Error('Workflow not found');

    await workflow.update({
        status,
        endDate: status !== 'Pending' ? new Date() : null,
        actionBy,
        actionDate: new Date()
    });

    return workflow;
}

async function _delete(id) {
    const workflow = await getById(id);
    if (!workflow) throw new Error('Workflow not found');

    await workflow.destroy();
}

module.exports = {
    create,
    createOnboarding,
    getAll,
    getByEmployeeId,
    getById,
    update,
    updateStatus,
    delete: _delete
};