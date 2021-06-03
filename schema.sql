USE process.env.MYSQL_HOST

CREATE TABLE employee_tracker (
    id INT(3) NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(15) NOT NULL,
    last_name VARCHAR(35) NOT NULL,
    title VARCHAR(25)NOT NULL,
    department VARCHAR(20) NOT NULL,
    salary INT(6),
    manager VARCHAR(75),
    PRIMARY KEY (id),
)

CREATE TABLE dept (
    dept_name VARCHAR(20),
    PRIMARY KEY (dept_name)
)

CREATE TABLE roles (
    title VARCHAR(25)NOT NULL,
    department VARCHAR(20) NOT NULL,
    salary INT(6),
    PRIMARY KEY (title)
)


