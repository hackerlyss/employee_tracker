const mysql = require('mysql');
const inquirer = require('inquirer');
const cTable = require('console.table');
const express = require('express')

const connection = mysql.createConnection({
    user: "qpj6tx8j1fzxnxqk",
    database: "h0mbkelewzqlq1o4",
    host: "tvcpw8tpu4jvgnnq.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
    password: "h6ql372tye1oc4tc",
    port: 3306
});

const app = express();
const PORT = process.env.PORT || 3306;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const start = () => {
    inquirer
      .prompt({
        name: 'starterQ',
        type: 'list',
        message: 'Would you like to do?',
        choices: ['Add departments, roles, employees', 
        'View departments, roles, employees', 
        'Update departments, roles, employees',
        'Nothing'],
      })
      .then((answer) => {
        // based on their answer, either call the bid or the post functions
        if (answer.starterQ === 'Add departments, roles, employees') {
          addOption();
        } else if (answer.starterQ === 'View departments, roles, employees') {
          viewOption();
        } else if (answer.starterQ === 'Update departments, roles, employees') {
          updateOption();
        }
        else {
          connection.end();
        }
      });
  };

  const addOption = () => {
    inquirer
      .prompt([
        {
          name: "addWhat",
          type: "list",
          message: "What would you like to add?",
          choices:['Add a department',
          'Add a role',
          'Add an employee']
        },
      ])
    .then((answer) => {
      if (answer.addWhat === 'Add a department') {
        addDept();
      } else if (answer.starterQ === 'Add a role') {
        addRole();
      } else {
        addEmployee();
      }
    });
  };

const addDept = () => {
    inquirer
    .prompt([
        {
            name: 'deptName',
            type: 'input',
            message: 'What is the name of the department?'
        },
        {
            name: 'managerFirst',
            type: 'input',
            message: 'Please enter the first name of the department manager.'
        },
        {
            name: 'managerLast',
            type: 'input',
            message: 'Please enter the last name of the department manager.'
        },
        {
            name: 'employeeCheck',
            type: 'checkbox',
            message: 'Would you like to add an employee as well?',
            choices: [
                'Yes',
                'No'
            ]
        }
    ]).then((answer) =>  {
        connection.query('INSERT INTO employee_tracker SET ?',
        {
            first_name: answer.managerFirst,
            last_name: answer.managerLast,
            title: "Manager",
            department: answer.deptName,
        },
        (err) => {
            if(err) throw err;
            console.log('Employee was tracked successfully.')
        })
    })
}

const addEmployee= () => {
    inquirer
    .prompt([
        {
            name: 'id',
            type: 'number',
            message: "Please enter the employee's ID number.",
            validate(value) {
                if (isNaN(value) === false) {
                  return true;
                }
                return 'You must enter a valid number';
              }
        },
        {
            name: 'firstName',
            type: 'input',
            message: "Please enter the employee's first name."
        },
        {
            name: 'lastName',
            type: 'input',
            message: "Please enter the employee's last name."
        },
        {
            name: 'title',
            type: 'input',
            message: "Please enter the employee's job title."
        },
        {
            name: 'department',
            type: 'input',
            message: "Please enter the employee's department."
        },
        {
            name: 'salary',
            type: 'number',
            message: "Please enter the employee's salary.",
            validate(value) {
                if (isNaN(value) === false) {
                  return true;
                }
                return 'You must enter a valid number';
              }
        },
        {
            name: 'manager',
            type: 'input',
            message: "Please enter the employee's manager."
        },
    ]).then((answer) => {
        connection.query('INSERT INTO employee_tracker SET ?',
        {
            id: answer.id,
            first_name: answer.firstName,
            last_name: answer.lastName,
            title: answer.title,
            department: answer.department,
            salary: answer.salary || 0,
            manager: answer.manager,
        },
        (err) => {
            if(err) throw err;
            console.log('Employee was tracked successfully.');
            start();
        })
    })
}


// const viewOption = () => {
//    // query the database for all employees
//    connection.query('SELECT * FROM employee_tracker', (err, results) => {
//      if (err) throw err;
//      inquirer
//        .prompt([
//          {
//            name: 'choice',
//            type: 'rawlist',
//           choices() {
//           const choiceArray = [];
//             results.forEach(({ item_name }) => {
//             choiceArray.push(item_name);
//             });
//              return choiceArray;
//            },
//            message: 'What auction would you like to place a bid in?',
//          },
//          {
//             name: 'bid',
//             type: 'input',
//             message: 'How much would you like to bid?',
//           },
//         ])
//         .then((answer) => {
//           // get the information of the chosen item
//           let chosenItem;
//           results.forEach((item) => {
//             if (item.item_name === answer.choice) {
//               chosenItem = item;
//             }
//           });
  
//           // determine if bid was high enough
//           if (chosenItem.highest_bid < parseInt(answer.bid)) {
//             // bid was high enough, so update db, let the user know, and start over
//             connection.query(
//               'UPDATE auctions SET ? WHERE ?',
//               [
//                 {
//                   highest_bid: answer.bid,
//                 },
//                 {
//                   id: chosenItem.id,
//                 },
//               ],
//               (error) => {
//                 if (error) throw err;
//                 console.log('Bid placed successfully!');
//                 start();
//               }
//             );
//           } else {
//             // bid wasn't high enough, so apologize and start over
//             console.log('Your bid was too low. Try again...');
//             start();
//           }
//         });
//     });
//   };



  connection.connect((err) => {
    if (err) throw err;
    // run the start function after the connection is made to prompt the user
    start();
  });