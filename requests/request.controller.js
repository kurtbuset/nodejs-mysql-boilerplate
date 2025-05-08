const express = require('express');
const router = express.Router();
const requestService = require('./request.service');
const authorize = require('../_middleware/authorize');
const Role = require('../_helpers/role');

// routes
router.get('/', authorize(), getAll);
router.get('/:id', authorize(), getById);
router.post('/', authorize(), create);
router.put('/:id', authorize(), update);
router.delete('/:id', authorize(Role.Admin), _delete);
router.post('/:id/items', authorize(), addItems);
router.put('/:id/status', authorize(Role.Admin), updateStatus);
router.get('/employee/:employeeId', authorize(), getByEmployeeId);

async function getAll(req, res, next) {
    try {
        const requests = await requestService.getAll();
        res.json(requests);
    } catch (err) {
        next(err);
    }
}

async function getById(req, res, next) {
    try {
        const request = await requestService.getById(req.params.id);
        if (!request) return res.status(404).json({ message: 'Request not found' });
        res.json(request);
    } catch (err) {
        next(err);
    }
}

async function create(req, res, next) {
    try {
        const request = await requestService.create(req.body);
        res.status(201).json(request);
    } catch (err) {
        next(err);
    }
}

async function update(req, res, next) {
    try {
        const request = await requestService.update(req.params.id, req.body);
        res.json(request);
    } catch (err) {
        next(err);
    }
}

async function _delete(req, res, next) {
    try {
        await requestService.delete(req.params.id);
        res.json({ message: 'Request deleted successfully' });
    } catch (err) {
        next(err);
    }
}

async function addItems(req, res, next) {
    try {
        const request = await requestService.addItems(req.params.id, req.body.items);
        res.json(request);
    } catch (err) {
        next(err);
    }
}

async function updateStatus(req, res, next) {
    try {
        const request = await requestService.updateStatus(req.params.id, req.body.status);
        res.json(request);
    } catch (err) {
        next(err);
    }
}

async function getByEmployeeId(req, res, next) {
    try {
        const requests = await requestService.getByEmployeeId(req.params.employeeId);
        res.json(requests);
    } catch (err) {
        next(err);
    }
}

module.exports = router;