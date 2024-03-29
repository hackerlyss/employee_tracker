USE process.env.MYSQL_HOST

CREATE TABLE employee_tracker (
    id INT(3) NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(15) NOT NULL,
    last_name VARCHAR(35) NOT NULL,
    title VARCHAR(25)NOT NULL,
    title_id INT,
    FOREIGN KEY (role_id) REFERENCES role(id),
    department VARCHAR(20) NOT NULL,
    salary INT(6),
    manager VARCHAR(75),
    manager_id INT,
    FOREIGN KEY (manager_id) REFERENCES employee(id),
    PRIMARY KEY (id),
)

CREATE TABLE dept (
    id INT NOT NULL,
    dept_name VARCHAR(20),
    PRIMARY KEY (id)
)

CREATE TABLE roles (
    id INT NOT NULL,
    title VARCHAR(25)NOT NULL,
    department VARCHAR(20) NOT NULL,
    dept_id INT,
    FOREIGN KEY (dept_id) REFERENCES dept(id),
    salary INT(6),
    PRIMARY KEY (id)
)


