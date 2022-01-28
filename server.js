const inquirer = require('inquirer');
const Choices = require('inquirer/lib/objects/choices');
const mySQL = require('mysql2');


const connection = mySQL.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'Toyotasupra94',
    database: 'employee'
});

connection.connect((err) => {
    if (err) throw err;
    console.log('Connected');
    employeeQuestions()
});


//const empQuestions = [];
function employeeQuestions() {
    inquirer.prompt([
        {
            type: 'list',
            name: 'title',
            messasge: 'what would you like to do?',
            choices: ['view all departments', 'view all roles', 'view all employees', 'add a department', 'add a role',
                'add an employee', 'update an employee role']
        },
    ])
        .then((answers) => {
            switch (answers.title) {
                case 'view all departments':
                    viewAllDepartments()
                    break
                case 'view all roles':
                    viewRoles()
                    break
                case 'view all employees':
                    viewEmployee()
                    break
                case 'add a department':
                    addDepartment()
                    break
                case 'add a role':
                    addRole()
                    break
                case 'add an employee':
                    viewRoles()
                    break
                case 'update an employee role':
                    viewRoles()
                    break
                default: 
                return;
            }



        })
};

function viewAllDepartments() {
    connection.query('SELECT * FROM department;', (err, rows) => {
        if (err) throw err;
        console.table(rows)
        employeeQuestions();
    })
}

function viewRoles() {
    const queryString = ('SELECT role.id, role.title, role.salary, department.name as department FROM role INNER JOIN department ON role.department_id = department.id;')
    connection.query(queryString, (err, rows) => {
        if (err) throw err;
        console.table(rows)
        employeeQuestions();
    })
}

function viewEmployee() {
    const queryString = (`SELECT  employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name AS department, employee.manager_id AS manager
    FROM employee 
    INNER JOIN role 
    ON employee.role_id = role.id
    INNER JOIN department
    ON role.department_id = department.id;`)
    connection.query(queryString, (err, rows) => {
        if (err) throw err;
        console.table(rows)
        employeeQuestions();
    })
}


function addDepartment() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'departmentname',
            message: 'Name of the department?',
        }
    ])
    .then(answers => {
        const queryString = (`INSERT INTO department (name) VALUES ('${answers.departmentname}');`)
        connection.query(queryString, (err, rows) => {
            if (err) throw err;
            console.table('Department added!')
            employeeQuestions();
        })
    })
}

function addRole() {
    let departmentChoices = []
    connection.query('SELECT * FROM department;', (err, rows) => {
        if (err) throw err;
        // console.log(rows)
        for( let i = 0; i < rows.length; i++) {
            let row = rows[i]
            // console.log('row',row)
            // console.log('========== end of loop')
            let choice = `${row.id} - ${row.name}`
            // console.log("choice",choice)
            departmentChoices.push(choice)
        }
        // console.log(departmentChoices)
        inquirer.prompt([
            {
                type: 'input',
                name: 'rolename',
                message: 'Name of Role?',
                
            },
            {
                type: 'input',
                name: 'salary',
                message: 'Salary amount?',
                
            },
            {
                type: 'list',
                name: 'dept',
                message: 'department?',
                choices: departmentChoices
            }
        ])
        .then(answers => {
            const deptId = Number(answers.dept[0])
            console.log(answers)
            console.log('deptId', deptId)
            const queryString = (`INSERT INTO role (title, salary, department_id) VALUES ('${answers.rolename}', ${Number(answers.salary)}, ${deptId});`)
            connection.query(queryString, (err, rows) => {
                if (err) throw err;
                console.table('ROle added!')
                employeeQuestions();
            })
         })
    })


  
}







