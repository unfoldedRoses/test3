var mysql = require('mysql2');
var config = require('./config.json');


var pool = mysql.createPool({
  host: config.dbhost,
  user: config.dbuser,
  password: config.dbpassword,
  database: config.dbname,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});


pool.getConnection((err, connection) => {
  if (err) throw err;

  /* Create the data table */
  connection.query(
    `CREATE TABLE IF NOT EXISTS data (
      id INT AUTO_INCREMENT PRIMARY KEY,
      email TEXT,
      name TEXT,
      phone TEXT,
      land_details TEXT
    )`,
    (error) => {
      if (error) throw error;

     /* Create the details table*/
      connection.query(
        `CREATE TABLE IF NOT EXISTS details (
          id INT AUTO_INCREMENT PRIMARY KEY,
          id_first_table INT,
          address TEXT,
          date TEXT,
          FOREIGN KEY (id_first_table) REFERENCES data (id)
        )`,
        (err) => {
          connection.release();
          if (err) throw err;

          console.log('Database tables created or already exist.');
        }
      );
    }
  );
});

/* Add record handler for lambda functions */
exports.handler = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  /*from the event*/
  const httpMethod = event.httpMethod;

 /*  HTTP method and perform the corresponding event */
  switch (httpMethod) {
    case 'POST':
      addRecord(event, callback);
      break;
    case 'PUT':
      editRecord(event, callback);
      break;
    case 'GET':
      viewRecord(event, callback);
      break;
    default:
      callback(null, { statusCode: 400, body: 'Invalid HTTP method.' });
  }
};

/* Add */
function addRecord(event, callback) {
  // Extract data from the request body
  const { email, name, phone, land_details, address, date } = JSON.parse(event.body);

 /* Insert */
  pool.getConnection((err, connection) => {
    if (err) callback(err);

    connection.query(
      'INSERT INTO data (email, name, phone, land_details) VALUES (?, ?, ?, ?)',
      [email, name, phone, land_details],
      (error, results) => {
        if (error) {
          connection.release();
          callback(error);
        } else {
          /* Get the auto-generated ID of the inserted record */
          const id_first_table = results.insertId;

          // Insert data into the details table
          connection.query(
            'INSERT INTO details (id_first_table, address, date) VALUES (?, ?, ?)',
            [id_first_table, address, date],
            (err, res) => {
              connection.release();
              if (err) callback(err);
              else callback(null, { statusCode: 200, body: JSON.stringify({ message: 'Record added successfully.' }) });
            }
          );
        }
      }
    );
  });
}

/* Edit record */
function editRecord(event, callback) {
  // Extract data from the request body
  const { id, email, name, phone, land_details, address, date } = JSON.parse(event.body);

  // Update data in the data table
  pool.getConnection((err, connection) => {
    if (err) callback(err);

    connection.query(
      'UPDATE data SET email=?, name=?, phone=?, land_details=? WHERE id=?',
      [email, name, phone, land_details, id],
      (error, results) => {
        if (error) {
          connection.release();
          callback(error);
        } else {
          // Update data in the details table
          connection.query(
            'UPDATE details SET address=?, date=? WHERE id_first_table=?',
            [address, date, id],
            (err, res) => {
              connection.release();
              if (err) callback(err);
              else callback(null, { statusCode: 200, body: JSON.stringify({ message: 'Record updated successfully.' }) });
            }
          );
        }
      }
    );
  });
}

/*  View record */
function viewRecord(event, callback) {
  // Extract the ID from the request parameters
  const id = event.pathParameters.id;

  // Retrieve data from the data and details tables
  pool.getConnection((err, connection) => {
    if (err) callback(err);

    connection.query(
      'SELECT * FROM data INNER JOIN details ON data.id = details.id_first_table WHERE data.id = ?',
      [id],
      (error, results) => {
        connection.release();
        if (error) callback(error);
        else callback(null, { statusCode: 200, body: JSON.stringify(results) });
      }
    );
  });
}

/*  Define the input data */
const inputData = {
  email: 'satish@example.com',
  name: 'John Doe',
  phone: '1234567890',
  land_details: 'Sample land details',
  address: '123 Main St',
  date: '2023-06-13'
};

/* Invoke the addRecord function with the predefined input data */
addRecord({ body: JSON.stringify(inputData) }, (err, result) => {
  if (err) {
    console.error(err);
  } else {
    console.log(result);
  }
});

/* Invoke the editRecord function with the predefined input data */
const editData = {
  id: 1,
  email: 'newemail@example.com',
  name: 'Updated Name',
  phone: '9876543210',
  land_details: 'Updated land details',
  address: '456 Elm St',
  date: '2023-06-14'
};

editRecord({ body: JSON.stringify(editData) }, (err, result) => {
  if (err) {
    console.error(err);
  } else {
    console.log(result);
  }
});

/* Invoke the viewRecord function with the predefined ID */
const recordId = 1;

viewRecord({ pathParameters: { id: recordId } }, (err, result) => {
  if (err) {
    console.error(err);
  } else {
    console.log(result);
  }
});
