import { config } from "../../config/config.js";

export let DAO;

async function configureDAO() {
    try {
        switch (config.general.PERSISTENCE) {
            case "MONGO":
                await import("./connDB.js");
                DAO = (await import("./CartMongoDAO.js")).CartMongoDAO;
                break;
            case "FS":
                DAO = (await import("./user.filesystem.js")).CartFs;
                break;
            default:
                console.log("Persistencia mal configurada...!!!");
                process.exit();
                break;
        }
    } catch (error) {
        console.error("Error al configurar la persistencia:", error);
        process.exit(1);
    }
}

await configureDAO();