"use strict";
import { SecretClient } from "@azure/keyvault-secrets";
import { ClientSecretCredential } from "@azure/identity";
import {} from 'dotenv/config'
//require('dotenv').config()

class EnvSingleton {

    constructor() { 
        this.objSecretKV = null;
    }
    
    static getInstance() {
        if (!EnvSingleton.instance) {
            EnvSingleton.instance = new EnvSingleton();
            console.log("INFO: Creación de instancia singleton")
        }
        return EnvSingleton.instance;
    }

    async getObjSecretKV() {
        if(!this.objSecretKV) {

            /* secrets key vault */
            let objSecretKV  = {
                "SECRET1": "",
                "SECRET2": ""
            };
            return await this.getSecretsKeyVault(objSecretKV, this.getValueBySecretName);
        }

        return Promise.resolve(this.objSecretKV);
    }

    async getSecretsKeyVault(envObj, callback) {
        await Promise.all(Object.entries(envObj).map(async ([key, value]) => {
            envObj[key] = await callback(key);
            return Promise.resolve(`${key}=${envObj[key]}`);
        }))
        .catch(err => console.log("ERROR getSecretsKeyVault(): ", err));
        return envObj
    }

    getValueBySecretName(secretName) {
        let secretValue = null;
        
        // Your Azure Key Vault name and secret name
        const keyVaultUri = process.env.KEY_VAULT_NAME;

        // Authenticate to Azure
        const credential = new ClientSecretCredential(
            process.env.AZURE_TENANT_ID,
            process.env.AZURE_CLIENT_ID,
            process.env.AZURE_CLIENT_SECRET
        );
        const client = new SecretClient(keyVaultUri, credential);

        // Get Secret with Azure SDK for JS
        const getSecret = async (secretName) => {
            return (await client.getSecret(secretName)).value;
        }

        secretValue = getSecret(secretName).then((value) => {
            return value;
        }).catch(err => {
            console.log("ERROR getValueBySecretName(): ", err);
        })
        return secretValue
    }
}

let instance = EnvSingleton.getInstance();
export default await instance.getObjSecretKV(); 