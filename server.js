const inquirer = require('inquirer');
const Choices = require('inquirer/lib/objects/choices');
const mySQL = require('mysql2');
const db = require('./db/connection')



db.connect((err) => {
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
                    addEmployee()
                    break
                case 'update an employee role':
                    updateEmployee()
                    break
                default:
                    return;
            }



        })
};

function viewAllDepartments() {
    db.query('SELECT * FROM department;', (err, rows) => {
        if (err) throw err;
        console.table(rows)
        employeeQuestions();
    })
}

function viewRoles() {
    const queryString = ('SELECT role.id, role.title, role.salary, department.name as department FROM role INNER JOIN department ON role.department_id = department.id;')
    db.query(queryString, (err, rows) => {
        if (err) throw err;
        console.table(rows)
        employeeQuestions();
    })
}

async function getEmployees() {
    const queryString = ('SELECT * FROM employee')
    return db.query(queryString)
}

async function viewEmployee() {
    try {
        const rows = await getEmployees()
        console.table(rows)
        employeeQuestions();
    }
    catch (error) {
        if (error) throw error;
    }
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
            db.query(queryString, (err, rows) => {
                if (err) throw err;
                console.table('Department added!')
                employeeQuestions();
            })
        })
}

function addRole() {
    let departmentChoices = []
    db.query('SELECT * FROM department;', (err, rows) => {
        if (err) throw err;
        for (let i = 0; i < rows.length; i++) {
            let row = rows[i]
            let choice = `${row.id} - ${row.name}`
            departmentChoices.push(choice)
        }
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
                const queryString = (`INSERT INTO role (title, salary, department_id) VALUES ('${answers.rolename}', ${Number(answers.salary)}, ${deptId});`)
                db.query(queryString, (err, rows) => {
                    if (err) throw err;
                    console.table('====ROLE ADDED!====')
                    employeeQuestions();
                })
            })
    })



}


function addEmployee() {

    db.query('SELECT * FROM role;', (err, rows) => {
        if (err) throw err;
        let roleChoices = [];
        rows.forEach(({ id, title }) => {
            roleChoices.push({ value: id, name: title })
        })

        db.query('SELECT * FROM employee', (err, res) => {
            if (err) throw err;
            let employeeChoice = [
                {
                    name: 'None',
                    value: 0,
                },
            ];
            res.forEach(({ first_name, last_name, id }) => {
                employeeChoice.push({
                    name: first_name + "" + last_name,
                    value: id,
                })
            })

            inquirer.prompt([
                {
                    type: 'input',
                    name: 'fname',
                    message: "Employee's first name?",

                },
                {
                    type: 'input',
                    name: 'lname',
                    message: "Employee's last name?",

                },
                {
                    type: 'list',
                    name: 'role_id',
                    message: "Employee's role?",
                    choices: roleChoices,
                },
                {
                    type: 'list',
                    name: 'managername',
                    message: "Employee's Manager?",
                    choices: employeeChoice,
                }
            ])
                .then(answers => {
                    const queryString = (`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('${answers.fname}', '${answers.lname}', '${answers.role_id}', '${answers.managername}')`)
                    db.query(queryString, (err, rows) => {
                        if (err) throw err;
                        console.table('====EMPLOYEE ADDED!====')
                        employeeQuestions();
                    })
                })
        })
    })
}

function updateEmployee() {
    db.query('SELECT * FROM role;', (err, rows) => {
        if (err) throw err;
        const roleChoices = rows.map(({ id, title }) => {
            return { value: id, name: title }
        })


        db.query('SELECT * FROM employee', (err, res) => {
            if (err) throw err;
            let employeeChoice = [
                {
                    name: 'None',
                    value: 0,
                },
            ];
            res.forEach(({ first_name, last_name, id }) => {
                employeeChoice.push({
                    name: first_name + "" + last_name,
                    value: id,
                })
            })


            inquirer.prompt([
                {
                    type: 'list',
                    name: 'update',
                    message: "What employee would like to update?",
                    choices: employeeChoice
                },
                {
                    type: 'list',
                    name: 'updateRole',
                    message: "What is employee's new role?",
                    choices: roleChoices
                }
            ])
                .then(answers => {
                    console.log('dddd', answers.role_id)
                    const queryString = `UPDATE employee SET role_id  = ${answers.updateRole} WHERE id = ${answers.update};`
                    db.query(queryString, (err, rows) => {
                        if (err) throw err;
                        console.table('====EMPLOYEE UPDATED!====')
                        employeeQuestions();
                    })
                })
        })
    })
}








