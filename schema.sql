USE process.env.MYSQL_HOST

CREATE TABLE employee_tracker (
    id INTEGER(3),
    first_name VARCHAR(15) NOT NULL,
    last_name VARCHAR(35) NOT NULL,
    title VARCHAR(25)NOT NULL,
    department VARCHAR(20) NOT NULL,
    salary INTEGER(6),
    manager VARCHAR(75),
    PRIMARY KEY (id),
)