const express = require('express');

const router = express.Router();
const db = require('../../models');
const checkAuth = require('../middleware/auth');

const modelName = 'expense';

router.post('/', checkAuth, async (req, res) => {
  const transaction = await db.sequelize.transaction();

  try {
    const data = await db[modelName].create(req.body, { transaction });
    await db.audit.create({
      area: modelName,
      action: 'Create',
      description: `Created item in ${data.dataValues.id}`,
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
    const data = await db[modelName].findAll();
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
      description: `Update item in ${id}`,
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

router.post('/report', checkAuth, async (req, res) => {
  try {
    const {
      from, to, orderBy,
    } = req.body;

    const query = `SELECT * FROM expenses WHERE
    DATE(createdAt) BETWEEN DATE(:from) AND DATE(:to) ORDER BY ${orderBy};`;

    const data = await db.sequelize.query(query,
      {
        replacements: { from, to },
        logging: true,
        type: db.sequelize.QueryTypes.SELECT,
      });

    res.status(200).json(data);
  } catch (error) {
    res.sendStatus(500);
  }
});

module.exports = router;
