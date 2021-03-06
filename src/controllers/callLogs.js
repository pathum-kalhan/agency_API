const express = require('express');

const router = express.Router();
const db = require('../../models');
const checkAuth = require('../middleware/auth');

const modelName = 'callLog';

router.post('/', checkAuth, async (req, res) => {
  const transaction = await db.sequelize.transaction();

  try {
    const data = await db[modelName].create(req.body, { transaction });
    await db.audit.create({
      area: modelName,
      action: 'Create',
      description: `Created call log in ${data.dataValues.id}`,
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

router.put('/:id', checkAuth, async (req, res) => {
  const transaction = await db.sequelize.transaction();

  try {
    const { id } = req.params;


    await db[modelName].update(req.body, {
      transaction,
      where: {
        id,
      },
    });

    await db.audit.create({
      area: modelName,
      action: 'Update',
      description: `Update call log in ${id}`,
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

router.post('/report', async (req, res) => {
  try {
    const {
      orderBy, ids, from, to,
    } = req.body;
    const query = `SELECT calllogs.*,CONCAT(users.title,' ',users.firstName,' ',
    users.lastName) AS fullName FROM calllogs
    INNER JOIN users ON calllogs.userId = users.id
    WHERE DATE(calllogs.createdAt) BETWEEN DATE(:from) AND DATE(:to)
    AND calllogs.userId IN (:ids) ORDER BY ${orderBy}`;

    const data = await db.sequelize.query(query,
      {
        replacements: { ids, from, to },

        type: db.sequelize.QueryTypes.SELECT,
      });


    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

module.exports = router;
