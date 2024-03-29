const mysql = require('mysql');
const inquirer = require('inquirer');
const cTable = require('console.table');
const express = require('express');
const { response } = require('express');
const Choice = require('inquirer/lib/objects/choice');

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
      .prompt([
        {
        name: 'starterQ',
        type: 'list',
        message: 'Would you like to do?',
        choices: ['Add departments', 
        'Add roles',
        'Add employees',
        'View departments',
        'View roles',
        'View employees',
        'Update employee roles',
        'Exit'],
      }])
      .then((answer) => {
        // based on their answer, either call the bid or the post functions
        if (answer.starterQ === 'Add departments') {
          addDept();
        } else if (answer.starterQ === 'Add roles') {
          addRole();
        } else if (answer.starterQ === 'Add employees') {
          addEmployee();
        }else if (answer.starterQ === 'View departments') {
          viewOption('dept');
        }else if (answer.starterQ === 'View roles') {
          viewOption('roles');
        }else if (answer.starterQ === 'View employees') {
          viewOption('employee_tracker');
        }else if (answer.starterQ === 'Update employee roles') {
          updateEmp();
        }
        else if (answer.starterQ === 'Exit') {
          console.log('Have a nice day')
          connection.end();
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
        }
    ]).then((answer) =>  {
            connection.query('INSERT INTO dept SET ?',
            {
                dept_name: answer.deptName,
            },
            (err) => {
                if(err) throw err;
                console.log('Department was tracked successfully.')
                start();
            })
        }
        
    )
}

const addRole = () => {
    connection.query('SELECT * from dept', (err,results) => {
      if (err) throw err;
      inquirer
        .prompt([
            {
                name: 'role_title',
                type: 'input',
                message: 'What is the name of the role?'
            },
            {
                name: 'role_dept',
                type: 'list',
                message: 'Which department does this role belong to?',
                choices() {
                  const choiceArr = [];
                  results.forEach(({dept_name}) => {
                    choiceArr.push(dept_name);
                  });
                  return choiceArr;
                }
             },
             {
               name: 'salary',
               type: 'number',
               message: 'What is the salary for this role?'
             }
        ]).then((answer) =>  {
            var department_id;
            results.forEach((dept)=> {
              if (dept.name === answer.role_dept){
                department_id = dept.id
              }
            })
            const role = {
              title: answer.role_title,
              salary: answer.role_salary,
              department_id: department_id
            }
            connection.query('INSERT INTO roles SET ?', role, (err,res)=> {
              if (err) throw err;
              console.log('Role successfully added');
              start();
            })
                })
            }
            
        )
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


const viewOption = (option) => {
  const query = 'SELECT * from ??';
  let table = option
   connection.query(query,table,
     (err,res)=> {
       if (err) throw err;
       console.log('--------------------------------');
       console.table(res);
       console.log('--------------------------------');
       start();
            })
          }
            
        
const updateEmp = () => {
  connection.query('SELECT * FROM employee_tracker', (err,empRes) => {
    if(err) throw err;
    var roleNames = empRes.map(({title}) => title)
    inquirer.prompt([
      {  
        name: 'employeeUpdate',
        type: 'list',
        message: 'Which employee\'s role do you want to update?',
        choices() {
          const choiceArray = [];
          empRes.forEach(({ first_name, last_name }) => {
            choiceArray.push(`${first_name} ${last_name}`);
          });
          return choiceArray;
        }
      },
      {
        name: 'newRole',
        type: 'list',
        message: 'Choose a new role for the employee',
        choices() {
          const choiceArray = [];
          empRes.forEach(({title})=> {
            choiceArray.push(`${title}`);
          });
          return choiceArray;
        }
      },
    ]).then(response => {
      const newRole = response.newRole;
      const role_id = empRes.find(role => role.title === newRole).id
      connection.query('UPDATE employee_tracker SET title_id = ? WHERE first_name = ?', 
      { role_id, first_name: response.name}, (err, data) => {
        console.log('Updated employee');
        start();
      })
    })
  }
  )}


  connection.connect((err) => {
    if (err) throw err;
    // run the start function after the connection is made to prompt the user
    start();
  });