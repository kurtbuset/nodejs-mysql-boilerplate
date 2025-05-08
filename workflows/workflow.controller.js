const express = require('express');
const router = express.Router();
const workflowService = require('./workflow.service');
const authorize = require('../_middleware/authorize');
const Role = require('../_helpers/role');

// routes
router.get('/', authorize(), getAll);
router.get('/employee/:employeeId', authorize(), getByEmployeeId);
router.get('/:id', authorize(), getById);
router.post('/', authorize(Role.Admin), create);
router.put('/:id', authorize(Role.Admin), update);
router.delete('/:id', authorize(Role.Admin), _delete);
router.put('/:id/status', authorize(Role.Admin), updateStatus);
router.post('/onboarding', authorize(Role.Admin), onboarding);

module.exports = router;

// route functions

async function getAll(req, res, next) {
    try {
        const workflows = await workflowService.getAll();
        res.json(workflows);
    } catch (err) {
        next(err);
    }
}

async function getByEmployeeId(req, res, next) {
    try {
        const workflows = await workflowService.getByEmployeeId(req.params.employeeId);
        res.json(workflows);
    } catch (err) {
        next(err);
    }
}

async function getById(req, res, next) {
    try {
        const workflow = await workflowService.getById(req.params.id);
        if (!workflow) return res.status(404).json({ message: 'Workflow not found' });
        res.json(workflow);
    } catch (err) {
        next(err);
    }
}

async function create(req, res, next) {
    try {
        const workflow = await workflowService.create(req.body);
        res.status(201).json(workflow);
    } catch (err) {
        next(err);
    }
}

async function update(req, res, next) {
    try {
        const workflow = await workflowService.update(req.params.id, req.body);
        res.json(workflow);
    } catch (err) {
        next(err);
    }
}

async function _delete(req, res, next) {
    try {
        await workflowService.delete(req.params.id);
        res.json({ message: 'Workflow deleted successfully' });
    } catch (err) {
        next(err);
    }
}

async function updateStatus(req, res, next) {
    try {
        const status = req.body.status;
        const actionBy = req.user?.email || null;
        const workflow = await workflowService.updateStatus(req.params.id, status, actionBy);
        res.json(workflow);
    } catch (err) {
        next(err);
    }
}

async function onboarding(req, res, next) {
    try {
        const workflow = await workflowService.createOnboarding(req.body);
        res.status(201).json(workflow);
    } catch (err) {
        next(err);
    }
}