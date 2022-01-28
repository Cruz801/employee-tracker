INSERT INTO department(name)
VALUES
('Sales'),
('Finance'),
('Accounting'),
('Engineering'),
('Warehouse');

INSERT INTO role (title, salary, department_id)
VALUES
('Accountant', 80000, 3),
('Sales lead', 90000, 1),
('Developer', 95000, 4),
('Tax advisor', 100000, 2),
('Forklift op', 70000, 5);

INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUES
('Steven', 'cruz', 3, null),
('alicia', 'barrera', 1, 1),
('David', 'cruz', 5, 1);