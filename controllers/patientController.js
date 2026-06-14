const db = require("../config/db");

// Get All Patients
exports.getPatients = (req, res) => {
  db.query(
    "SELECT * FROM patients ORDER BY id DESC",
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json(result);
    }
  );
};

// Add Patient
exports.addPatient = (req, res) => {
  const { fullname, gender, age, phone, address, bloodgroup } = req.body;

  const sql =
    "INSERT INTO patients(fullname, gender, age, phone, address, bloodgroup) VALUES(?,?,?,?,?,?)";

  db.query(
    sql,
    [fullname, gender, age, phone, address, bloodgroup],
    (err) => {
      if (err) return res.status(500).json(err);

      res.json({ message: "Patient Added" });
    }
  );
};

// Delete Patient
exports.deletePatient = (req, res) => {
  db.query(
    "DELETE FROM patients WHERE id=?",
    [req.params.id],
    (err) => {
      if (err) return res.status(500).json(err);

      res.json({
        message: "Patient Deleted"
      });
    }
  );
};

// Get One Patient
exports.getPatient = (req, res) => {
  db.query(
    "SELECT * FROM patients WHERE id=?",
    [req.params.id],
    (err, result) => {
      if (err) return res.status(500).json(err);

      res.json(result[0]);
    }
  );
};

// Update Patient
exports.updatePatient = (req, res) => {
  const { fullname, gender, age, phone, address } = req.body;

  db.query(
    `UPDATE patients
     SET fullname=?,
         gender=?,
         age=?,
         phone=?,
         address=?
     WHERE id=?`,
    [
      fullname,
      gender,
      age,
      phone,
      address,
      req.params.id
    ],
    (err) => {
      if (err) return res.status(500).json(err);

      res.json({
        message: "Patient Updated"
      });
    }
  );
};
