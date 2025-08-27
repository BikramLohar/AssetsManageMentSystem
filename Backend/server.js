require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const { error } = require('console');
const { Parser } = require('json2csv');

const multer = require('multer');
const path = require('path');




const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());



//database connection

// const uploadDir = path.join(__dirname, 'uploads');

// if (!fs.existsSync(uploadDir)) {
//     fs.mkdirSync(uploadDir);
// }

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, uploadDir);

//     },
//     filename: (req, file, cb) => {
//         cb(null, Date.now() + '_' + file.originalname);
//     }
// })
// const upload = multer({ storage });



const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed', err.stack)
    } else {
        console.error('Connected to the Mysql database');
    }
});

const formatDate = (value) => value === "" ? null : value;

//sending file and data from frontend to backend 
app.post('/submit', (req, res) => {
    // console.log('file recevied', req.file);
    // console.log('data recevied', req.body);


    const fromdata = req.body;
    // const fileName = req.file ? req.file.filename : null;

    const sql = `INSERT INTO assest (
  \`slNo\`, \`employee_id\`, \`current_user_name\`, site, \`previous_user\`,
  \`employee_status\`, department, system_name, \`os_name\`, make,
  \`system_model\`, \`system_manufacturer\`, \`serial_no\`, \`processor_config\`,
  \`monitor_model_no\`, \`monitor_serial_number\`,upgradation_items, \`upgradation_date\`,
  \`upgradation_price\`, \`purchase_date\`,\`warrenty_date\`,\`vendor_name\`, \`big_mind_install\`, remarks,
   \`asset_code\`, \`windows_activation\`,
  \`o_install\`, \`host_rename\`,\`file\`,\`ram\`,\`monitor\`
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?)`;


    const values = [
        fromdata.slNo, fromdata.employee_id, fromdata.current_user_name, fromdata.site, fromdata.previous_user,
        fromdata.employee_status, fromdata.department, fromdata.system_name, fromdata.os_name, fromdata.make,
        fromdata.system_model, fromdata.system_manufacturer, fromdata.serial_no, fromdata.processor_config,
        fromdata.monitor_model_no, fromdata.monitor_serial_number, fromdata.upgradation_items, formatDate(fromdata.upgradation_date),
        fromdata.upgradation_price, formatDate(fromdata.purchase_date), formatDate(fromdata.warrenty_date), fromdata.vendor_name,
        fromdata.big_mind_install, fromdata.remarks, fromdata.asset_code, fromdata.windows_activation,
        fromdata.o_install, fromdata.host_rename, null, fromdata.ram || '', fromdata.monitor || ''
    ];
    // console.log('RAM:', fromdata.ram);       // should show ""
    // console.log('Monitor:', fromdata.monitor);

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Insert Failed', err);
            return res.status(500).json({
                message: "Error inserting data",
                error: err
            });
        } else {
            res.status(200).json({
                message: "Data  Inserted Successfully"
                // fileName: fileName
            });
        }
    });

});

app.post('/search', (req, res) => {
    const { assetCode } = req.body;
    const sql = 'SELECT * FROM assest WHERE asset_code = ?';
    db.query(sql, [assetCode], (err, result) => {
        if (err) {
            console.error('Search Failed', err);
            res.status(500).json({
                message: "Error searching asset",
                error: err
            });
        } else {
            if (result.length === 0) {
                return res.status(404).json({ message: "Asset not Found" });
            }

        }
        res.status(200).json(result[0]);
    });
});

//update AssetData
app.put('/update', (req, res) => {
    const {
        assetCode,
        employee_id,
        asset_code,
        current_user_name,
        site,
        previous_user,
        employee_status,
        system_name,
        system_model,
        os_name,
        make,
        system_manufacturer,
        serial_no,
        processor_config,
        department,
        ram,
        monitor,
        upgradation_items,
        upgradation_date,
        upgradation_price,
        vendor_name,
        big_mind_install,
        windows_activation,
        o_install,
        host_rename,
        remarks,
    } = req.body;

    const sql = `update assest SET employee_id = ?,
    asset_code = ?,
    current_user_name = ?,
    site = ?,
    previous_user = ?,
    employee_status=?,
    system_name =?, 
    system_model = ?,
    os_name=?,
    make =?,
    system_manufacturer= ?,
    serial_no = ?,
    processor_config = ?,
    department = ?,
    ram= ?,
    monitor= ?,
    upgradation_items =?,
    upgradation_date = ?,
    upgradation_price= ?,
    vendor_name= ?,
    big_mind_install= ?,
    windows_activation= ?,
    o_install= ?,
    host_rename= ?,
    remarks = ?
    where asset_code =?`;

    const values = [employee_id, asset_code, current_user_name, site, previous_user, employee_status,
        system_name, system_model, os_name, make, system_manufacturer,
        serial_no, processor_config, department, ram, monitor, upgradation_items, formatDate(upgradation_date), upgradation_price, vendor_name, big_mind_install,
        windows_activation, o_install, host_rename,
        remarks, assetCode];
    console.log('Received update data:', req.body);

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Update Failed', err);
            return res.status(500).json({
                message: 'Error Update the Asset Data',
                error: err
            });
        }
        res.status(200).json({
            message: 'Insert The Updated Asset Data Sucessfuly',

        });
    });

})


app.get('/download', (req, res) => {
    const sql = 'SELECT * FROM assest  ORDER BY slNo ASC';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Download Failed', err);
            return res.status(500).json({
                message: 'Error Downloading Data',
                error: err
            });

        }
        try {
            const fields = Object.keys(results[0] || {});
            const json2csv = new Parser({ fields });
            const csv = json2csv.parse(results);

            res.header('content-type', 'text/csv');
            res.attachment('assets.csv');
            return res.send(csv);

        }
        catch (error) {
            console.error('CSV generation error', error);
            return res.status(500).json({
                message: "Error Generating CSV",
                error: error
            })
        }
    });
});

//delete asset








app.delete('/delete', (req, res) => {
    const { assetCode } = req.body;

    if (!assetCode) {
        return res.status(400).json({
            message: 'missing asset code'
        })
    }
    const sql = 'DELETE FROM assest where asset_code =?';

    db.query(sql, [assetCode], (err, result) => {
        if (err) {
            console.error('Delete Failed', err);
            res.status(500).json({
                message: 'Error Deleting Asset',
                err: err
            });
        }
        if (result.length === 0) {
            return res.status(404).json({
                message: 'Asset Not Found'
            })
        }
        res.status(200).json({
            message: 'Asset Deleted SuccessFully'
        });
    });
});



app.listen(port, () => {
    console.log('server is running at  http://localhost:3000 ')
})




