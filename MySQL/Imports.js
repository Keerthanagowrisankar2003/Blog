// Returns: Object containing essential dependencies for a Node.js application.
const importDependencies = () => {
    const express = require('express');   // Web framework
    const bodyParser = require('body-parser');//Middleware for parsing JSON in incoming requests
    const cors = require('cors');//Middleware for handling cross-origin resource sharing
    const mysql = require('mysql2'); //Database connector
    const jwt = require('jsonwebtoken');  //JSON Web Token for authentication
    return { express, bodyParser, cors, mysql, jwt };
     // Returning an object with the necessary dependencies
};

// Exporting the importDependencies function
module.exports = importDependencies;
