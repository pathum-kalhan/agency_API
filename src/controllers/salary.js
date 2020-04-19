const express = require('express');

const router = express.Router();
const db = require('../../models');
const checkAuth = require('../middleware/auth');

const modelName = 'salary';

router.post('/', checkAuth, async (req, res) => {
  const transaction = await db.sequelize.transaction();

  try {
    const user = await db.user.findOne({ where: { id: req.body.userId }, raw: true });


    // check is he has nopays
    const workingDays = Number(req.body.workingDays);
    const allowance = Number(req.body.allowance);
    const year = req.body.salaryMonth.split('-')[0];
    const month = Number(req.body.salaryMonth.split('-')[1]);


    const from = new Date();
    from.setFullYear(year);
    from.setMonth(month - 2);
    from.setDate(25);

    const to = new Date();
    to.setFullYear(year);
    to.setMonth(month - 1);
    to.setDate(24);


    const query = `SELECT SUM(daysCount) AS c FROM agency.leaves WHERE userId = :id
      AND DATE(leaveDate) BETWEEN DATE(:from) AND DATE(:to) AND leaveType='Nopay'`;

    const days = await db.sequelize.query(query,
      {
        replacements: { id: req.body.userId, from, to },

        type: db.sequelize.QueryTypes.SELECT,

      });

    let nopayLeaves = 0;

    if (days[0].c > 0) {
      nopayLeaves = days[0].c;
    }


    // first check is he have record for this month
    const isExists = await db[modelName].findOne({
      where: {
        userId: req.body.userId,
        salaryMonth: req.body.salaryMonth,
      },
      raw: true,
    });


    if (isExists) {
      return res.sendStatus(422);
    }

    const basicSalary = user.basicSal;
    let salary = Number(basicSalary) - Number(basicSalary * (8 / 100));

    if (nopayLeaves) {
      salary = (basicSalary / workingDays) * (workingDays - nopayLeaves);
      salary -= (basicSalary * (8 / 100));
    }

    if (allowance) {
      salary += allowance;
    }
    req.body.sal = salary;
    req.body.basicSal = basicSalary;


    const data = await db[modelName].create(req.body, { transaction });
    await db.audit.create({
      area: modelName,
      action: 'Create',
      description: `Created salary ${data.dataValues.id}`,
      userId: req.user.id,
      refId: data.dataValues.id,
    }, { transaction });
    await transaction.commit();

    return res.sendStatus(200);
  } catch (error) {
    await transaction.rollback();

    return res.sendStatus(500);
  }
});

router.get('/', checkAuth, async (req, res) => {
  try {
    const data = await db[modelName].findAll({
      include: [{
        model: db.user,
        attributes: ['title', 'firstName', 'lastName', 'fullName'],
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

router.delete('/:id', checkAuth, async (req, res) => {
  const transaction = await db.sequelize.transaction();

  try {
    const { id } = req.params;

    await db[modelName].destroy({
      where: {
        id,
      },
      transaction,
    });

    // ADD AUDIT
    await db.audit.create({
      action: 'Delete',
      area: modelName,
      description: `Deleted record in ${id}`,
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

module.exports = router;
