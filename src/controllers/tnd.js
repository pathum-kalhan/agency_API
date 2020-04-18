const express = require('express');

const router = express.Router();
const moment = require('moment');
const { QueryTypes } = require('sequelize');
const db = require('../../models');
const checkAuth = require('../middleware/auth');

const modelName = 'tnd';

router.post('/', checkAuth, async (req, res) => {
  const transaction = await db.sequelize.transaction();

  try {
    const d = moment().add(req.body.timePeriod, 'M').format('YYYY-MM-DD');
    req.body.deadline = d;

    const data = await db[modelName].create(req.body, { transaction });
    const mileStones = [];
    req.body.mileStones.forEach((e) => {
      mileStones.push({
        tndId: data.dataValues.id,
        name: e,
      });
    });
    await db.milestone.bulkCreate(mileStones, { transaction });
    await db.audit.create({
      area: modelName,
      action: 'Create',
      description: `Created tnd plan in ${data.dataValues.id}`,
      userId: req.user.id,
      refId: data.dataValues.id,
    }, { transaction });
    await transaction.commit();

    res.sendStatus(200);
  } catch (error) {
    await transaction.rollback();

    res.sendStatus(500);
  }
});

router.get('/', checkAuth, async (req, res) => {
  try {
    const data = await db[modelName].findAll({
      include: [{
        model: db.user,
        attributes: ['fullName', 'title', 'firstName', 'lastName'],
      }],
    });
    res.status(200).json(data);
  } catch (error) {
    res.sendStatus(500);
  }
});

router.put('/:id/:tndId', checkAuth, async (req, res) => {
  const transaction = await db.sequelize.transaction();

  try {
    const { id } = req.params;

    await db.milestone.update({
      completedDate: db.Sequelize.literal('curdate()'),
    }, {
      transaction,
      where: {
        id,
      },
    });

    const query = `SELECT 
    ROUND(IFNULL(  (SELECT 
                            COUNT(*)
                        FROM
                            agency.milestones
                        WHERE
                            tndId = :tndId AND completedDate IS NOT NULL)/(SELECT 
                            COUNT(*)
                        FROM
                            agency.milestones
                        WHERE
                            tndId = :tndId),
                    0) * 100,
            2) AS p`;
    const completedPercentage = await db.sequelize.query(query, {
      type: QueryTypes.SELECT,
      transaction,
      replacements: { tndId: req.params.tndId },
    });

    await db[modelName].update({
      completedPercentage: completedPercentage[0].p,
    }, {
      transaction,
      where: {
        id,
      },
    });

    await db.audit.create({
      area: modelName,
      action: 'Update',
      description: `Update milestone in ${id}`,
      userId: req.user.id,
      refId: id,
    }, { transaction });
    await transaction.commit();

    res.sendStatus(200);
  } catch (error) {
    await transaction.rollback();

    res.sendStatus(500);
  }
});


router.put('/status', checkAuth, async (req, res) => {
  const transaction = await db.sequelize.transaction();

  try {
    const { id, status } = req.body;

    await db[modelName].update({
      status,
    }, {
      where: {
        id,
      },
      transaction,
    });

    // ADD AUDIT
    await db.audit.create({
      action: 'Update',
      area: modelName,
      description: `Updated status to ${status} in ${id}`,
      userId: req.user.id,
      reference: id,
    }, { transaction });
    await transaction.commit();
    res.sendStatus(200);
  } catch (error) {
    await transaction.rollback();

    res.sendStatus(500);
  }
});

router.get('/milestones/:id', checkAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const data = await db.milestone.findAll({
      where: {
        tndId: id,
      },
    });
    res.status(200).json(data);
  } catch (error) {
    res.sendStatus(500);
  }
});

router.get('/:id', checkAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const data = await db[modelName].findOne({
      where: {
        id,
      },
    });
    res.status(200).json(data);
  } catch (error) {
    res.sendStatus(500);
  }
});

module.exports = router;
