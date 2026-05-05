import swaggerAutogen from "swagger-autogen";

const outputFile = "./swagger_output.json";
const endpointsFiles = ['./index.js'];

const doc = {
    info: {
        title: "PoleBid API",
        description: "API for PoleBid, an online auction platform"
    },
    host: process.env.SWAGGER_HOST || "localhost:3000",
    schemes: ["http"],
    definitions: {
        ErrorResponse: {
            status: "fail",
            message: "Check morgan logs to see the details of the error" 
        }
    }
};

const generateSwagger = async() => {
    return await swaggerAutogen()(outputFile, endPointsFiles, doc);
}

//generateSwagger(); AGREGAR CADA VEZ QUE QUIERA REGENERAR EL SWAGGER (Con npm run swagger)

export default generateSwagger;