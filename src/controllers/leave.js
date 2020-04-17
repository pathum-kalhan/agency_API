const express = require('express');

const router = express.Router();
const db = require('../../models');
const checkAuth = require('../middleware/auth');

const modelName = 'leave';

router.post('/', checkAuth, async (req, res) => {
  const transaction = await db.sequelize.transaction();

  try {
    const { leaveType, leaveDate } = req.body;
    let response = '';
    const user = await db.user.findOne({ where: { id: req.body.userId }, raw: true });
    let data = null;

    const d = new Date(leaveDate);
    const n = d.getDate();
    const m = d.getMonth();
    const y = d.getFullYear();
    const joined = new Date(user.joinedDate);
    const joinedMonth = joined.getMonth() + 1;


    /**
       * IF USER IS NOT A PERMANENT EMPLOYEE HE HAS ONLY
       * CASUAL 1/2 FOR THE MONTH
       */
    if ((user.isPermanent === 0) && (leaveType !== 'nopay')) {
      const from = new Date(d);
      const to = new Date(d);


      if (n < 25) {
        from.setDate(24);
        from.setMonth(m - 1);


        to.setDate(24);
      } else {
        from.setDate(25);
        to.setMonth(m + 1);
        to.setDate(24);
      }

      const query = `SELECT SUM(daysCount) AS c FROM agency.leaves WHERE userId = :id
      AND DATE(leaveDate) BETWEEN DATE(:from) AND DATE(:to)`;

      const days = await db.sequelize.query(query,
        {
          replacements: { id: req.body.userId, from, to },

          type: db.sequelize.QueryTypes.SELECT,

        });
      if (days[0].c < 0.5) {
        data = await db[modelName].create(req.body);
      } else {
        response = 'user already got his 1/2 leave for the month';
      }
    }


    const query2 = `SELECT DATEDIFF(CURDATE(), joinedDate) AS days FROM
    agency.users WHERE id = :id;`;

    const days = await db.sequelize.query(query2,
      {
        replacements: { id: req.body.userId },

        type: db.sequelize.QueryTypes.SELECT,

      });

    const daysOfService = days[0].days;


    // For casual and med leaves

    if ((user.isPermanent === 1) && ['Casual', 'Medical'].includes(leaveType)) {
      // check is he able to get the leave
      const query3 = `SELECT SUM(daysCount) AS c FROM agency.leaves WHERE
      leaveType = :type AND YEAR(leaveDate) = YEAR(:y)
      AND userId = :id`;

      const daysCount = await db.sequelize.query(query3,
        {
          replacements: { id: req.body.userId, type: leaveType, y },

          type: db.sequelize.QueryTypes.SELECT,

        });

      if (daysCount[0].c < 7) {
        data = await db[modelName].create(req.body);
      } else {
        response = `user already got his ${leaveType} leaves for the year.`;
      }
    }

    const query4 = `SELECT SUM(daysCount) AS c FROM agency.leaves WHERE
      leaveType = :type AND YEAR(leaveDate) = YEAR(:y)
      AND userId = :id`;

    const annualLeaves = await db.sequelize.query(query4,
      {
        replacements: { id: req.body.userId, type: leaveType, y },

        type: db.sequelize.QueryTypes.SELECT,

      });

    if (leaveType === 'Annual' && (daysOfService >= 365)) {
      if (annualLeaves[0].c < 14) {
        data = await db[modelName].create(req.body);
      } else {
        response = `user already got his ${leaveType} leaves for the year.`;
      }
    }

    if (leaveType === 'Annual' && !(daysOfService >= 365)) {
      let availableDates = null;
      if (joinedMonth <= 3) {
        availableDates = 14;
      } else if (joinedMonth <= 6) {
        availableDates = 10;
      } else if (joinedMonth <= 9) {
        availableDates = 7;
      } else {
        availableDates = 4;
      }

      if (annualLeaves[0].c < availableDates) {
        data = await db[modelName].create(req.body);
      } else {
        response = `user already got his ${leaveType} leaves for the year.`;
      }
    }

    if (leaveType === 'nopay') {
      data = await db[modelName].create(req.body);
    }


    await db.audit.create({
      area: modelName,
      action: 'Create',
      description: 'Created a leave.',
      userId: req.user.id,
      refId: `${data.dataValues ? data.dataValues.id : null}`,
    }, { transaction });
    await transaction.commit();

    res.sendStatus(200);
  } catch (error) {
    console.log(error);
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

module.exports = router;
